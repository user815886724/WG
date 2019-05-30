package com.controller;


import com.model.SysModularParameterEntity;
import com.service.CommonService;
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

    @RequestMapping("/api/{handleAction}/{module}/{func}")
    @ResponseBody
    public String forwardApi(@PathVariable("handleAction") String handleAction,@PathVariable("module")String module,
                             @PathVariable("func") String func, HttpServletRequest request){
        Map<String,Object> param = request.getParameterMap();
        SysModularParameterEntity paramEntity= service.getParamEntity("test");
        return null;
    }
}
