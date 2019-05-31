package com.controller;


import com.model.SysModularParameterEntity;
import com.service.CommonService;
import common.CallbackResult;
import common.HttpUtils;
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

    @RequestMapping("/api/{handleAction}/{module}/{func}")
    @ResponseBody
    public String forwardApi(@PathVariable("handleAction") String handleAction, @PathVariable("module")String module,
                                     @PathVariable("func") String func, HttpServletRequest request)throws Exception{
        Map<String,Object> param = request.getParameterMap();
        SysModularParameterEntity paramEntity= service.getParamEntity(handleAction);
        //先去验证
        try{
            String result = HttpUtils.doPost(paramEntity.getUrl(),param);
            return result;
        }catch (Exception e){
            logger.info(e.getMessage());
            throw new  Exception("请求\""+ handleAction + "\"模块异常");
        }
    }
}
