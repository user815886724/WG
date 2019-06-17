package common;

import java.util.List;

/**
 * @author huangwh
 * @date 2019/6/12
 * @time 18:07
 */
public class CommonPageInfo<T> {

    private List<T> data;

    private PageParam pageParam;

    public List<T> getData() {
        return data;
    }

    public void setData(List<T> data) {
        this.data = data;
    }

    public PageParam getPageParam() {
        return pageParam;
    }

    public void setPageParam(PageParam pageParam) {
        this.pageParam = pageParam;
    }
}
