package com.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @author huangwh
 * @date 2019/6/15
 * @time 17:27
 */
@Entity
@Table(name = "modular_host")
public class ModularHostEntity {

    @Id
    @Column(name = "modular_code")
    private String modularCode;

    @Column
    private String ip;

    @Column
    private String port;

    @Column(name = "ssh_port")
    private String sshPort;

    @Column(name = "ssh_user_name")
    private String sshUserName;

    @Column(name="ssh_user_password")
    private String sshUserPassword;


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

    public String getSshPort() {
        return sshPort;
    }

    public void setSshPort(String sshPort) {
        this.sshPort = sshPort;
    }

    public String getSshUserName() {
        return sshUserName;
    }

    public void setSshUserName(String sshUserName) {
        this.sshUserName = sshUserName;
    }

    public String getSshUserPassword() {
        return sshUserPassword;
    }

    public void setSshUserPassword(String sshUserPassword) {
        this.sshUserPassword = sshUserPassword;
    }
}
