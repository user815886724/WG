package com.controller;


import com.model.SysModularParameterEntity;
import com.service.CommonService;
import common.CallbackResult;
import common.HttpUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
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

    private static Logger logger = LoggerFactory.getLogger(CommonService.class);

    @RequestMapping("/api/{handleAction}/{modular}/{func}")
    @ResponseBody
    public String forwardApi(@PathVariable("handleAction") String handleAction,@PathVariable("modular") String modular, @PathVariable("func") String func,
                             HttpServletRequest request)throws Exception{
        Map<String,Object> param = request.getParameterMap();
        SysModularParameterEntity paramEntity= service.getParamEntity(handleAction);
        //TODO 先去验证
        //查询地址访问
        if(paramEntity != null && StringUtils.isNotEmpty(paramEntity.getUrl())){
            String result = HttpUtils.doPost(paramEntity.getUrl() + "/" + modular + "/" + func,param);
            return result;
        }else{
            logger.info(handleAction + " 在数据库中未配置");
            throw new Exception(handleAction + " 在数据库中未配置");
        }
    }

    @RequestMapping("/api/menu/getMenuList")
    @ResponseBody
    public CallbackResult getMenuList(){
        CallbackResult callbackResult = new CallbackResult(false);
        try{
            callbackResult.setDetails(service.getMenuList());
            callbackResult.setSuccess(true);
        }catch (Exception e){
            callbackResult.setMessage(e.getMessage());
        }
        return callbackResult;
    }

}
