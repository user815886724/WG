package com.response;

import com.model.DatasourceTypeEntity;

import javax.persistence.Entity;

/**
 * @author huangwh
 * @date 2019/6/28
 * @time 16:43
 */
@Entity
public class GetDatasourceTypeResponse extends DatasourceTypeEntity {

    private Integer datasourceCount;


    public Integer getDatasourceCount() {
        return datasourceCount;
    }

    public void setDatasourceCount(Integer datasourceCount) {
        this.datasourceCount = datasourceCount;
    }
}
