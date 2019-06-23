package com.service;

import com.model.SysMenuEntity;
import com.model.SysModularParameterEntity;
import common.CallbackResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * @author huangwh
 * @date 2019/5/29
 * @time 23:55
 */
public interface CommonService {

    SysModularParameterEntity getParamEntity(String code);

    List<Map<String,Object>> getMenuList() throws Exception;

    List<SysMenuEntity> getChildMenuList(String id) throws Exception;

    SysMenuEntity getMenuDetail(String id);

    Map<String,Object> getMenuDetailMap(String id);

    CallbackResult updateEntity(Object entity);

    Integer getMaxParentSort();

    Integer getMaxChildrenSort(String parentId);

    CallbackResult saveEntity(Object entity);

    CallbackResult deleteSysMenu(String id);

    CallbackResult deleteEntity(Object entity);

    CallbackResult refresh();
}
