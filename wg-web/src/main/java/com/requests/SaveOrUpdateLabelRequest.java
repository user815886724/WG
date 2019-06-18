package com.requests;

/**
 * @author huangwh
 * @date 2019/6/18
 * @time 23:29
 */
public class SaveOrUpdateLabelRequest {

    private String application;

    private String label;

    public String getApplication() {
        return application;
    }

    public void setApplication(String application) {
        this.application = application;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }
}
