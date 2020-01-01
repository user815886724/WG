package com.controller;


import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.common.CommonParameter;
import com.model.SysModularParameterEntity;
import com.service.CommonService;
import com.service.ModularService;
import common.CallbackResult;
import common.HttpUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * @author huangwh
 * @date 2019/5/28
 * @time 0:26
 */

@Controller
public class CommonController {

    @Autowired
    private CommonService service;

    @Autowired
    private ModularService modularService;

    private static Logger logger = LoggerFactory.getLogger(CommonService.class);

    private String url = "http://%s:%s/%s/%s/%s";

    @RequestMapping("/api/{handleAction}/{modular}/{func}")
    @ResponseBody
    public Object forwardApi(@PathVariable("handleAction") String handleAction,@PathVariable("modular") String modular,
           @PathVariable("func") String func, @RequestBody(required = false) Map<String,Object> map, HttpServletRequest request)throws Exception{

        // 查询模块，查完之后将值缓存到内存，避免多次请求重复查询数据库，如修改，开放一个清空缓存的接口即可
        SysModularParameterEntity paramEntity;
        if(CommonParameter.parameterEntityMap.containsKey(handleAction)){
            paramEntity = CommonParameter.parameterEntityMap.get(handleAction);
        }else{
            paramEntity= service.getParamEntity(handleAction);
            if(paramEntity != null){
                CommonParameter.parameterEntityMap.put(handleAction,paramEntity);
            }else{
                logger.info("找不到"+handleAction+"模块");
                throw new Exception("找不到"+handleAction+"模块");
            }
        }

        //查询网关配置，将查询结果缓存
        if(CommonParameter.modularHostEntity == null){
            CommonParameter.modularHostEntity = modularService.getHostEntity("API_GETWAY");
            if(CommonParameter.modularHostEntity == null){
                logger.info("项目尚未配置路由地址");
                throw new Exception("项目尚未配置路由地址");
            }
        }

        if(StringUtils.isNotEmpty(CommonParameter.modularHostEntity.getIp()) &&
                StringUtils.isNotEmpty(CommonParameter.modularHostEntity.getPort())){
            String redirectUrl = String.format(url,CommonParameter.modularHostEntity.getIp(),CommonParameter.modularHostEntity.getPort(),
                    paramEntity.getGetway(),modular,func);
            String result = HttpUtils.doPost(redirectUrl,map);
            Object resultJson = this.parseJson(result);
            if(resultJson != null){
                return resultJson;
            }
            return result;
        }else {
            logger.info("网关的IP或端口不能为空");
            throw new Exception("网关的IP或端口不能为空");
        }
    }


    private Object parseJson(String str){
        try {
            Object jsonStr= JSONObject.parseObject(str);
            return  jsonStr;
        } catch (Exception e) {
            try{
                Object jsonStr= JSONArray.parseArray(str);
                return jsonStr;
            }catch (Exception e1){
                return null;
            }
        }
    }

    @RequestMapping("/refresh")
    @ResponseBody
    public CallbackResult refresh(){
       return service.refresh();
    }

}
