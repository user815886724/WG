package com.service;


import com.model.*;
import com.response.GetZuulDetailResponse;
import common.CallbackResult;
import common.CommonPageInfo;
import common.PageParam;

import java.util.List;
import java.util.Map;

/**
 * @author huangwh
 * @date 2019/6/12
 * @time 17:59
 */
public interface ModularService {

    CommonPageInfo getModularList(PageParam pageParam);

    GetZuulDetailResponse getApiGetway();

    Boolean checkModularHostExits(String modularCode);

    ModularHostEntity getHostEntity(String modularCode);

    List<SysModularTypeEntity> getModularTypeList();

    SysModularParameterEntity getModularParameter(String code);

    List<PropertiesEntity> getPropertiesList(String application);

    CommonPageInfo getPropertiesList(Map<String,Object> param, PageParam pageParam);

    List<PropertiesLabelEntity> getPropertiesLabelList(String application);

    CommonPageInfo getLabelList(Map<String,Object> param,PageParam pageParam);

    PropertiesEntity getProperties(String id);

    CallbackResult deletePropertiesChild(String code);

}
