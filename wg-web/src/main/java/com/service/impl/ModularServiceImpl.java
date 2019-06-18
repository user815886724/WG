package com.service.impl;

import com.dao.BaseDao;
import com.model.*;
import com.response.GetModularListResponse;
import com.response.GetZuulDetailResponse;
import com.service.ModularService;
import common.CallbackResult;
import common.CommonPageInfo;
import common.PageParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * @author huangwh
 * @date 2019/6/12
 * @time 17:59
 */
@Repository
public class ModularServiceImpl implements ModularService {

    @Autowired
    private BaseDao baseDao;


    @Override
    public CommonPageInfo getModularList(PageParam pageParam) {
        String sql = "SELECT sp.*,st.NAME as typeName FROM sys_modular_parameter sp,sys_modular_type st WHERE sp.type = st.CODE";
        return baseDao.getPageData(sql,pageParam ,null,GetModularListResponse.class);
    }


    @Override
    public GetZuulDetailResponse getApiGetway() {
        String sql = "SELECT mh.MODULAR_CODE as modularCode, mh.ip,mh.port FROM modular_host mh WHERE mh.MODULAR_CODE = 'API_GETWAY' LIMIT 1";
        return (GetZuulDetailResponse)baseDao.executeSqlSingle(sql, GetZuulDetailResponse.class);
    }

    @Override
    public Boolean checkModularHostExits(String modularCode) {
        String sql = "SELECT COUNT(1) FROM modular_host WHERE MODULAR_CODE = '" + modularCode + "'";
        Integer count = Integer.valueOf(baseDao.executeSql(sql).toString());
        if(count > 0){
            return true;
        }
        return false;
    }

    @Override
    public ModularHostEntity getHostEntity(String modularCode) {
        String sql = "SELECT * FROM modular_host WHERE MODULAR_CODE = '" + modularCode + "'";
        return (ModularHostEntity)baseDao.executeSqlSingle(sql, ModularHostEntity.class);
    }


    @Override
    public List<SysModularTypeEntity> getModularTypeList() {
        String sql = "SELECT * FROM sys_modular_type";
        return baseDao.executeSql(sql,SysModularTypeEntity.class);
    }


    @Override
    public SysModularParameterEntity getModularParameter(String code) {
        String sql = "SELECT * FROM sys_modular_parameter WHERE code = '"+ code + "'";
        return (SysModularParameterEntity)baseDao.executeSqlSingle(sql,SysModularParameterEntity.class);
    }

    @Override
    public List<PropertiesEntity> getPropertiesList(String application) {
        String sql = "SELECT * FROM properties WHERE application = '" + application + "'";
        return baseDao.executeSql(sql,PropertiesEntity.class);
    }

    @Override
    public CommonPageInfo getPropertiesList(Map<String,Object> param, PageParam pageParam) {
        String sql = "SELECT * FROM properties WHERE 1=1";
        if(param != null){
            for(String key : param.keySet()){
                sql += " AND " + key + " = " + "'" + param.get(key) + "'";
            }
        }
        return baseDao.getPageData(sql,pageParam ,null,PropertiesEntity.class);
    }


    @Override
    public List<PropertiesLabelEntity> getPropertiesLabelList(String application) {
        String sql = "SELECT * FROM properties_label WHERE application = '"+ application +"'";
        return baseDao.executeSql(sql,PropertiesLabelEntity.class);
    }


    @Override
    public CommonPageInfo getLabelList(Map<String, Object> param, PageParam pageParam) {
        String sql = "SELECT * FROM properties_label WHERE 1=1";
        if(param != null){
            for(String key : param.keySet()){
                sql += " AND " + key + " = " + "'" + param.get(key) + "'";
            }
        }
        return baseDao.getPageData(sql,pageParam ,null,PropertiesLabelEntity.class);
    }

    @Override
    public PropertiesEntity getProperties(String id) {
        String sql = "SELECT * FROM properties WHERE id = '"+ id + "'";
        return (PropertiesEntity)baseDao.executeSqlSingle(sql,PropertiesEntity.class);
    }
    
}
