package com.requests;

import common.PageParam;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

/**
 * @author huangwh
 * @date 2019/6/16
 * @time 15:43
 */

@JsonIgnoreProperties(ignoreUnknown = true)
public class GetModularPropertiesListRequest {

    private String application;

    private PageParam pageParam;

    private String label;

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getApplication() {
        return application;
    }

    public void setApplication(String application) {
        this.application = application;
    }

    public PageParam getPageParam() {
        return pageParam;
    }

    public void setPageParam(PageParam pageParam) {
        this.pageParam = pageParam;
    }
}
