package com.service;

import com.model.SysModularParameterEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author huangwh
 * @date 2019/5/29
 * @time 23:55
 */
public interface CommonService {

    SysModularParameterEntity getParamEntity(String code);
}
