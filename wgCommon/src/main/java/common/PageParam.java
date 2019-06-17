package common;

import enums.SortType;

/**
 * @author huangwh
 * @date 2019/6/12
 * @time 18:08
 */
public class PageParam {

    private Integer limit = 10;

    private Integer pageIndex = 1;

    private Integer pageTotal = 0;

    private Integer recordTotal = 0;

    private String sortField = null;

    private String sortType =  SortType.asc.toString();


    public Integer getLimit() {
        return limit;
    }

    public void setLimit(Integer limit) {
        this.limit = limit;
    }

    public Integer getPageIndex() {
        return pageIndex;
    }

    public void setPageIndex(Integer pageIndex) {
        this.pageIndex = pageIndex;
    }

    public Integer getPageTotal() {
        return pageTotal;
    }

    public void setPageTotal(Integer pageTotal) {
        this.pageTotal = pageTotal;
    }

    public Integer getRecordTotal() {
        return recordTotal;
    }

    public void setRecordTotal(Integer recordTotal) {
        this.recordTotal = recordTotal;
    }

    public String getSortField() {
        return sortField;
    }

    public void setSortField(String sortField) {
        this.sortField = sortField;
    }

    public String getSortType() {
        return sortType;
    }

    public void setSortType(String sortType) {
        this.sortType = sortType;
    }
}
