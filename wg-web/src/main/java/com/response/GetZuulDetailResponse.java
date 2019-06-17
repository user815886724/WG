package com.response;

import com.model.SysModularParameterEntity;

import javax.persistence.Entity;
import javax.persistence.Id;

/**
 * @author huangwh
 * @date 2019/6/14
 * @time 0:53
 */
@Entity
public class GetZuulDetailResponse {

    @Id
    private String modularCode;

    private String ip;

    private Integer port;

    public String getModularCode() {
        return modularCode;
    }

    public void setModularCode(String modularCode) {
        this.modularCode = modularCode;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public Integer getPort() {
        return port;
    }

    public void setPort(Integer port) {
        this.port = port;
    }
}
