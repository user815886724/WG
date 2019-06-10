package com.requests;

/**
 * @author huangwh
 * @date 2019/6/10
 * @time 15:29
 */
public class CreateMenusRequest {

    private String parentId;

    private String menuName;

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public String getMenuName() {
        return menuName;
    }

    public void setMenuName(String menuName) {
        this.menuName = menuName;
    }
}
