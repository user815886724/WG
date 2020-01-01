package com.service;

import com.dao.TestDao;
import com.model.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author huangwh
 * @date 2019/6/24
 * @time 22:18
 */
@Service
public class TestService {

    @Autowired
    private TestDao dao;

    public List<Test> getTestList(){
        return dao.findAllTest();
    }
}
