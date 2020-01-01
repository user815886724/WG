package com.service;

import com.dao.DatasourceTypeDao;
import com.model.DatasourceTypeEntity;
import com.response.GetDatasourceTypeResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author huangwh
 * @date 2019/6/25
 * @time 23:20
 */
@Service
public class DatasourceTypeService {

    @Autowired
    private DatasourceTypeDao dao;

    public Integer getDatasourceTypeCount(){
        return dao.getTypeCount();
    }


    public List<GetDatasourceTypeResponse> getDatasourceTypeList(){
        return dao.getDatasourceTypes();
    }
}
