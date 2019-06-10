package com.controller;

import com.model.SysMenuEntity;
import com.requests.GetMenuDetailRequest;
import com.requests.UpdateMenuDetailRequest;
import com.service.CommonService;
import common.CallbackResult;
import enums.StatusEnum;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author huangwh
 * @date 2019/6/1
 * @time 19:23
 */
@Controller
public class MenuController {

    @Autowired
    private CommonService service;

    private static Logger logger = LoggerFactory.getLogger(MenuController.class);

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


    @RequestMapping("/api/menu/getMenuTree")
    @ResponseBody
    public CallbackResult getMenuTree(){
        CallbackResult callbackResult = new CallbackResult(false);
        try {
            List<Map<String, Object>> menus = service.getMenuList();
            String html = "<span class='layui-pro-tree-node' id='%s' title='%s'>%s</span>";
            Map<String,Object> result = new HashMap<>();
            result.put("id","root");
            result.put("label",String.format(html,"root","菜单管理","菜单管理"));
            result.put("parentId","rootId");
            result.put("parentName","1");
            for(Map<String,Object> menu : menus){
                menu.put("label",String.format(html,menu.get("id"),menu.get("menuName"),menu.get("menuName")));
                if(menu.get("children") != null){
                    List<Map<String, Object>> children = ( List<Map<String, Object>>)menu.get("children");
                    for(Map<String,Object> child : children){
                        child.put("label",String.format(html,child.get("id"),child.get("menuName"),child.get("menuName")));
                    }
                }
            }
            callbackResult.setSuccess(true);
            result.put("children",menus);
            List<Map<String,Object>> resultList = new ArrayList<>();
            resultList.add(result);
            callbackResult.setDetails(resultList);
        }catch (Exception e){
            callbackResult.setMessage(e.getMessage());
        }
        return callbackResult;
    }


    @RequestMapping(value = "/api/menu/GetMenuDetail",method = RequestMethod.POST)
    @ResponseBody
    public CallbackResult getMenuDetail(@RequestBody GetMenuDetailRequest request){
        CallbackResult callbackResult = new CallbackResult(false);
        if(StringUtils.isNotEmpty(request.getId())){
            try{
                callbackResult.setDetails(service.getMenuDetail(request.getId()));
                callbackResult.setSuccess(true);
            }catch (Exception e){
                callbackResult.setMessage(e.getMessage());
            }
        }
        return callbackResult;
    }


    @RequestMapping(value = "/api/menu/UpdateMenuDetail")
    @ResponseBody
    @Transactional
    public CallbackResult updateMenuDetail(@RequestBody UpdateMenuDetailRequest request){
        SysMenuEntity menuEntity = new SysMenuEntity();
        BeanUtils.copyProperties(request,menuEntity);
        if(StringUtils.isEmpty(menuEntity.getDataUrl())){
            menuEntity.setDataUrl(null);
        }
        menuEntity.setStatus(StatusEnum.LIVE.getCode());
        return service.updateSysMenu(menuEntity);
    }

}
