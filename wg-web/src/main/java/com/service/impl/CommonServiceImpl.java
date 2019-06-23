package com.service.impl;

import com.common.CommonParameter;
import com.dao.BaseDao;
import com.model.SysMenuEntity;
import com.model.SysModularParameterEntity;
import com.service.CommonService;
import common.CallbackResult;
import enums.StatusEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import utils.JavaBeanUtil;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author huangwh
 * @date 2019/5/29
 * @time 23:56
 */
@Repository
public class CommonServiceImpl implements CommonService {

    @Autowired
    private BaseDao baseDao;

    @Override
    public SysModularParameterEntity getParamEntity(String code) {
        return (SysModularParameterEntity) baseDao.findObjectBySql("SysModularParameterEntity","code",code);
    }


    @Override
    public List<Map<String,Object>> getMenuList() throws Exception{
        List<SysMenuEntity> entities = baseDao.executeSql("SELECT * FROM sys_menu WHERE STATUS = 1 AND PARENT_ID IS NULL ORDER BY SORT ASC",SysMenuEntity.class);
        String getChildrenSql = "SELECT * FROM sys_menu WHERE STATUS = 1 AND PARENT_ID = '%s' ORDER BY SORT ASC";
        List<Map<String,Object>> list = new ArrayList<>();
        //只负责二级菜单设计
        for(SysMenuEntity menuEntity : entities){
            List<SysMenuEntity> childrenMenu = baseDao.executeSql(String.format(getChildrenSql,menuEntity.getId()),SysMenuEntity.class);
            Map<String,Object> parent = JavaBeanUtil.convertBeanToMap(menuEntity);
            if(childrenMenu != null && childrenMenu.size() > 0){
                parent.put("children",JavaBeanUtil.convertBeanToMapList(childrenMenu));
            }
            list.add(parent);
        }
        return list;
    }


    @Override
    public List<SysMenuEntity> getChildMenuList(String id) throws Exception {
        String getChildrenSql = "SELECT * FROM sys_menu WHERE STATUS = 1 AND PARENT_ID = '%s' ORDER BY SORT ASC";
        List<SysMenuEntity> childrenMenu = baseDao.executeSql(String.format(getChildrenSql,id),SysMenuEntity.class);
        return childrenMenu;
    }

    @Override
    public SysMenuEntity getMenuDetail(String id) {
        String getMenuSql = "SELECT * FROM sys_menu WHERE ID = '%s'";
        SysMenuEntity sysMenuEntity = (SysMenuEntity)baseDao.executeSqlSingle(String.format(getMenuSql,id),SysMenuEntity.class);
        return sysMenuEntity;
    }


    @Override
    public Map<String,Object> getMenuDetailMap(String id) {
        String getMenuSql = "SELECT * FROM sys_menu WHERE ID = '%s'";
        SysMenuEntity sysMenuEntity = (SysMenuEntity)baseDao.executeSqlSingle(String.format(getMenuSql,id),SysMenuEntity.class);
        String countSql = "SELECT COUNT(1) FROM sys_menu WHERE PARENT_ID = '%s'";
        Integer count = Integer.valueOf(baseDao.executeSql(String.format(countSql,id)).toString());
        try{
            Map<String,Object> result = JavaBeanUtil.convertBeanToMap(sysMenuEntity);
            if(count != null && count > 0){
                result.put("hasChild","1");
            }
            return result;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @Transactional
    @Override
    public CallbackResult updateEntity(Object entity) {
        CallbackResult callbackResult = new CallbackResult();
        Boolean tag = baseDao.update(entity);
        if(tag){
            callbackResult.setSuccess(true);
            callbackResult.setMessage("更新成功");
        }else{
            callbackResult.setMessage("更新失败");
        }
        return callbackResult;
    }


    @Override
    public Integer getMaxParentSort() {
        String getMaxParentSql = "SELECT MAX(SORT) FROM sys_menu WHERE PARENT_ID IS NULL";
        Integer sort = (Integer) baseDao.executeSql(getMaxParentSql);
        if(sort != null){
            return sort + 1;
        }
        return 0;
    }


    @Override
    public Integer getMaxChildrenSort(String parentId) {
        String getMaxChildrenSql = "SELECT MAX(SORT) FROM sys_menu WHERE PARENT_ID = '%s'";
        Integer sort = (Integer) baseDao.executeSql(String.format(getMaxChildrenSql,parentId));
        if(sort != null){
            return sort + 1;
        }
        return 0;
    }


    @Override
    public CallbackResult saveEntity(Object entity) {
        CallbackResult callbackResult = new CallbackResult(false);
        if(entity != null){
            Boolean tag = baseDao.save(entity);
            if(tag){
                callbackResult.setSuccess(true);
                callbackResult.setMessage("创建成功");
            }else{
                callbackResult.setMessage("创建失败");
            }
        }else {
            callbackResult.setMessage("保存对象为空");
        }
        return callbackResult;
    }


    @Override
    public CallbackResult deleteSysMenu(String id) {
        CallbackResult callbackResult = new CallbackResult(false);
        SysMenuEntity sysMenuEntity = this.getMenuDetail(id);
        sysMenuEntity.setStatus(StatusEnum.NO.getCode());
        Boolean tag = baseDao.update(sysMenuEntity);
        if(tag){
            callbackResult.setSuccess(true);
            callbackResult.setMessage("删除成功");
        }else{
            callbackResult.setMessage("删除失败");
        }
        return callbackResult;
    }


    @Override
    public CallbackResult deleteEntity(Object entity) {
        CallbackResult callbackResult = new CallbackResult(false);
        try{
            if(baseDao.delete(entity)){
                callbackResult.setSuccess(true);
                callbackResult.setMessage("删除成功");
            }else{
                callbackResult.setMessage("出现未知异常");
            }
        }catch (Exception e){
            callbackResult.setMessage(e.getMessage());
        }
        return callbackResult;
    }

    @Override
    public CallbackResult refresh() {
        CommonParameter.parameterEntityMap = new HashMap<>();
        CommonParameter.modularHostEntity = null;
        CallbackResult callbackResult = new CallbackResult(true);
        callbackResult.setMessage("刷新缓存成功");
        return callbackResult;
    }
}
