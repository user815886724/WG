package com.service;

import com.model.SysMenuEntity;
import com.model.SysModularParameterEntity;
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
}
