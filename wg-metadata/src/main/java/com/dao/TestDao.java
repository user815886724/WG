package com.dao;

import com.model.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * @author huangwh
 * @date 2019/6/23
 * @time 17:15
 */
public interface TestDao extends JpaRepository<Test,String> {

    @Query(value = "SELECT * FROM test",nativeQuery = true)
    List<Test> findAllTest();
}
