package com.response;

/**
 * @author huangwh
 * @date 2019/6/25
 * @time 23:35
 */
public class GetDatasourceCountResponse {

    private Integer datasourceTypeCount;

    private Integer datasourceCount;

    public Integer getDatasourceTypeCount() {
        return datasourceTypeCount;
    }

    public void setDatasourceTypeCount(Integer datasourceTypeCount) {
        this.datasourceTypeCount = datasourceTypeCount;
    }

    public Integer getDatasourceCount() {
        return datasourceCount;
    }

    public void setDatasourceCount(Integer datasourceCount) {
        this.datasourceCount = datasourceCount;
    }
}
