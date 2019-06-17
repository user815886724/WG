package com.response;

import com.model.SysModularParameterEntity;

import javax.persistence.Entity;
import javax.persistence.Id;

/**
 * @author huangwh
 * @date 2019/6/14
 * @time 0:08
 */
@Entity
public class GetModularListResponse {

    @Id
    private String code;

    private String application;

    private String type;

    private String desp;

    private String getway;

    private String typeName;

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getApplication() {
        return application;
    }

    public void setApplication(String application) {
        this.application = application;
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

    public String getGetway() {
        return getway;
    }

    public void setGetway(String getway) {
        this.getway = getway;
    }
}
