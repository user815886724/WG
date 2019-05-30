package com.service.impl;

import com.dao.BaseDao;
import com.model.SysModularParameterEntity;
import com.service.CommonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

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
}
