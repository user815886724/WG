package com.dao;

import com.model.DatasourceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * @author huangwh
 * @date 2019/6/26
 * @time 9:51
 */
public interface DatasourceDao  extends JpaRepository<DatasourceEntity,String> {

    @Query(value = "SELECT COUNT(1) FROM metadata_datasource",nativeQuery = true)
    Integer getDatasourceCount();


    @Query(value = "SELECT * FROM metadata_datasource",nativeQuery = true)
    List<DatasourceEntity> getDatasourceEntities();

    @Query(value = "SELECT * FROM metadata_datasource WHERE metadata_datasource.DATASOURCE_ID = :id",nativeQuery = true)
    DatasourceEntity getDatasourceEntity(@Param(value = "id")String id);
}
