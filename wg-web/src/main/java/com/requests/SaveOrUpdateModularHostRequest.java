package com.requests;

/**
 * @author huangwh
 * @date 2019/6/15
 * @time 15:14
 */
public class SaveOrUpdateModularHostRequest {

    private String modularCode;

    private String ip;

    private String port;

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

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }
}
