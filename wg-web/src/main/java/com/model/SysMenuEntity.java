package com.model;

import javax.persistence.*;
import java.io.Serializable;

/**
 * @author huangwh
 * @date 2019/6/1
 * @time 10:15
 */

@Entity
@Table(name = "sys_menu")
public class SysMenuEntity implements Serializable {

    @Id
    private String id;

    @Column(name = "menu_name")
    private String menuName;

    @Column(name="parent_id")
    private String parentId;

    @Column(name="status")
    private int status;

    @Column(name = "data_url")
    private String dataUrl;

    @Column(name="icon")
    private String icon;

    @Column(name = "sort")
    private Integer sort;

    @Column(name = "is_open")
    private Integer isOpen;

    public Integer getIsOpen() {
        return isOpen;
    }

    public void setIsOpen(Integer isOpen) {
        this.isOpen = isOpen;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMenuName() {
        return menuName;
    }

    public void setMenuName(String menuName) {
        this.menuName = menuName;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getDataUrl() {
        return dataUrl;
    }

    public void setDataUrl(String dataUrl) {
        this.dataUrl = dataUrl;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}
