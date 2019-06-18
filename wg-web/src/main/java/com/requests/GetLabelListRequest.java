package com.requests;

import common.PageParam;

/**
 * @author huangwh
 * @date 2019/6/18
 * @time 21:36
 */
public class GetLabelListRequest {

    private PageParam pageParam;

    private String application;

    public PageParam getPageParam() {
        return pageParam;
    }

    public void setPageParam(PageParam pageParam) {
        this.pageParam = pageParam;
    }

    public String getApplication() {
        return application;
    }

    public void setApplication(String application) {
        this.application = application;
    }
}
