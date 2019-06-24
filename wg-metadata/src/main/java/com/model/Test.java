package com.model;


import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

/**
 * @author huangwh
 * @date 2019/6/23
 * @time 16:24
 */
@Entity
@Data
public class Test {

    @Id
    private String id;

    @Column
    private String key;

    @Column
    private String value;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
