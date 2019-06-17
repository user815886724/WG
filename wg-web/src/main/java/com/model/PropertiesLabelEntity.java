package com.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

/**
 * @author huangwh
 * @date 2019/6/16
 * @time 21:02
 */
@Entity
@Table(name="properties_label")
public class PropertiesLabelEntity implements Serializable{

    @Id
    @Column
    private String application;

    @Id
    @Column
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
