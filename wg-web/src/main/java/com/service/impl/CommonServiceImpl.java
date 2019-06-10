package com.service.impl;

import com.dao.BaseDao;
import com.model.SysMenuEntity;
import com.model.SysModularParameterEntity;
import com.service.CommonService;
import common.CallbackResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import utils.JavaBeanUtil;

import java.util.ArrayList;
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
        return (SysModularParameterEntity) baseDao.findObjectBySql("sys_modular_parameter","code",code);
    }


    @Override
    public List<Map<String,Object>> getMenuList() throws Exception{
        List<SysMenuEntity> entities = baseDao.executeSql("SELECT * FROM sys_menu WHERE STATUS = 1 AND PARENT_ID IS NULL ORDER BY SORT ASC",new SysMenuEntity());
        String getChildrenSql = "SELECT * FROM sys_menu WHERE STATUS = 1 AND PARENT_ID = '%s' ORDER BY SORT ASC";
        List<Map<String,Object>> list = new ArrayList<>();
        //只负责二级菜单设计
        for(SysMenuEntity menuEntity : entities){
            List<SysMenuEntity> childrenMenu = baseDao.executeSql(String.format(getChildrenSql,menuEntity.getId()),new SysMenuEntity());
            Map<String,Object> parent = JavaBeanUtil.convertBeanToMap(menuEntity);
            if(childrenMenu != null && childrenMenu.size() > 0){
                parent.put("children",JavaBeanUtil.convertBeanToMapList(childrenMenu));
            }
            list.add(parent);
        }
        return list;
    }


    @Override
    public SysMenuEntity getMenuDetail(String id) {
        String getMenuSql = "SELECT * FROM sys_menu WHERE ID = '%s'";
        SysMenuEntity sysMenuEntity = (SysMenuEntity)baseDao.executeSqlSingle(String.format(getMenuSql,id),SysMenuEntity.class);
        return sysMenuEntity;
    }


    @Transactional
    @Override
    public CallbackResult updateSysMenu(SysMenuEntity sysMenuEntity) {
        CallbackResult callbackResult = new CallbackResult();
        Boolean tag = baseDao.update(sysMenuEntity);
        if(tag){
            callbackResult.setSuccess(true);
            callbackResult.setMessage("更新成功");
        }else{
            callbackResult.setMessage("更新失败");
        }
        return callbackResult;
    }
}
