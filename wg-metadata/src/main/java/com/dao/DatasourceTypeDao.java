package com.dao;

import com.model.DatasourceTypeEntity;
import com.response.GetDatasourceTypeResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * @author huangwh
 * @date 2019/6/25
 * @time 23:17
 */
public interface DatasourceTypeDao extends JpaRepository<DatasourceTypeEntity,String> {

    @Query(value = "SELECT COUNT(1) FROM metadata_datasource_type",nativeQuery = true)
    Integer getTypeCount();

    @Query(value = "SELECT mdt.*,(SELECT COUNT(1) FROM metadata_datasource md WHERE md.TYPE_CODE = mdt.DATASOURCE_TYPE) as datasource_count  FROM metadata_datasource_type mdt",nativeQuery = true)
    List<GetDatasourceTypeResponse> getDatasourceTypes();
}
