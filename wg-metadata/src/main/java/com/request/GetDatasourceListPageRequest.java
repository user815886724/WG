package com.request;

import common.CommonPageInfo;
import common.PageParam;

/**
 * @author huangwh
 * @date 2019/6/27
 * @time 17:24
 */
public class GetDatasourceListPageRequest {

    private String name;

    private String type;

    private PageParam pageParam;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public PageParam getPageParam() {
        return pageParam;
    }

    public void setPageParam(PageParam pageParam) {
        this.pageParam = pageParam;
    }
}
