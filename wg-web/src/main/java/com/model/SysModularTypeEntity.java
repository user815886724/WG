package com.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @author huangwh
 * @date 2019/6/16
 * @time 0:44
 */
@Entity
@Table(name = "sys_modular_type")
public class SysModularTypeEntity {

    @Id
    private String code;

    @Column
    private String name;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
