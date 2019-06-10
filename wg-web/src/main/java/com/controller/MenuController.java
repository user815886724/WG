package com.controller;

import com.model.SysMenuEntity;
import com.requests.*;
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

import java.util.*;

/**
 * @author huangwh
 * @date 2019/6/1
 * @time 19:23
 */
@Controller
@RequestMapping("/api/menu")
public class MenuController {

    @Autowired
    private CommonService service;

    private static Logger logger = LoggerFactory.getLogger(MenuController.class);

    @RequestMapping("/getMenuList")
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


    @RequestMapping("/getMenuTree")
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
                    menu.put("hasChild","1");
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


    @RequestMapping(value = "/getMenuDetail",method = RequestMethod.POST)
    @ResponseBody
    public CallbackResult getMenuDetail(@RequestBody GetMenuDetailRequest request){
        CallbackResult callbackResult = new CallbackResult(false);
        if(StringUtils.isNotEmpty(request.getId())){
            try{
                callbackResult.setDetails(service.getMenuDetailMap(request.getId()));
                callbackResult.setSuccess(true);
            }catch (Exception e){
                callbackResult.setMessage(e.getMessage());
            }
        }
        return callbackResult;
    }


    @RequestMapping(value = "/updateMenuDetail")
    @ResponseBody
    @Transactional
    public CallbackResult updateMenuDetail(@RequestBody UpdateMenuDetailRequest request){
        SysMenuEntity menuEntity = service.getMenuDetail(request.getId());
        BeanUtils.copyProperties(request,menuEntity);
        if(StringUtils.isEmpty(menuEntity.getDataUrl())){
            menuEntity.setDataUrl(null);
        }
        menuEntity.setStatus(StatusEnum.YES.getCode());
        return service.updateSysMenu(menuEntity);
    }


    @RequestMapping("/createMenu")
    @ResponseBody
    public CallbackResult createMenu(@RequestBody CreateMenusRequest menusRequest){
        SysMenuEntity menuEntity = new SysMenuEntity();
        BeanUtils.copyProperties(menusRequest,menuEntity);
        menuEntity.setId(UUID.randomUUID().toString());
        menuEntity.setStatus(StatusEnum.YES.getCode());
        if(StringUtils.isEmpty(menusRequest.getParentId())){
            menuEntity.setSort(service.getMaxParentSort());
            menuEntity.setIsOpen(StatusEnum.NO.getCode());
        }else{
            menuEntity.setSort(service.getMaxChildrenSort(menusRequest.getParentId()));
        }
        return service.saveSysMenu(menuEntity);
    }


    @RequestMapping("/deleteMenu")
    @ResponseBody
    public CallbackResult deleteMenu(@RequestBody DeleteMenuRequest request){
        return service.deleteSysMenu(request.getId());
    }


    @RequestMapping("/updateMenuSort")
    @ResponseBody
    public CallbackResult updateMenuSort(@RequestBody UpdateMenuSortRequest request){
        CallbackResult callbackResult = new CallbackResult(false);
        String ids = request.getMenuIds();
        if(StringUtils.isNotEmpty(ids)){
            String[] idArray = ids.split(",");
            for(int i = 0; i < idArray.length; i++){
                String id = idArray[i];
                SysMenuEntity sysMenuEntity = service.getMenuDetail(id);
                sysMenuEntity.setSort(i);
                service.updateSysMenu(sysMenuEntity);
                callbackResult.setSuccess(true);
                callbackResult.setMessage("顺序修改成功");
            }
        }else{
            callbackResult.setMessage("传入的参数为空");
        }
        return callbackResult;
    }


    @RequestMapping("/listChildMenu")
    @ResponseBody
    public CallbackResult listChildMenu(@RequestBody ListChildMenuRequest request){
        CallbackResult callbackResult = new CallbackResult(false);
        try{
            List<SysMenuEntity> childMenu = service.getChildMenuList(request.getId());
            callbackResult.setDetails(childMenu);
            callbackResult.setSuccess(true);
        }catch (Exception e){
            callbackResult.setMessage(e.getMessage());
        }
        return callbackResult;
    }
}
