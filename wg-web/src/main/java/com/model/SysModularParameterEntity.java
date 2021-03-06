package com.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

/**
 * @author huangwh
 * @date 2019/5/29
 * @time 23:54
 */

@Entity
@Table(name = "sys_modular_parameter")
public class SysModularParameterEntity implements Serializable {

    @Id
    private String code;

    @Column
    private String application;

    @Column
    private String type;

    @Column
    private String desp;

    @Column
    private String getway;

    public String getGetway() {
        return getway;
    }

    public void setGetway(String getway) {
        this.getway = getway;
    }

    public String getApplication() {
        return application;
    }

    public void setApplication(String application) {
        this.application = application;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDesp() {
        return desp;
    }

    public void setDesp(String desp) {
        this.desp = desp;
    }
}
