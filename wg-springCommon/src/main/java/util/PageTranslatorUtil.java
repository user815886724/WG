package util;


import common.CommonPageInfo;
import common.PageParam;
import org.apache.commons.lang.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.ArrayList;
import java.util.List;

/**
 * @author huangwh
 * @date 2019/6/27
 * @time 19:06
 */
public class PageTranslatorUtil {

    public static Pageable translatorPageParam(PageParam pageParam){
        int pageIndex = pageParam.getPageIndex() - 1;
        int pageSize = pageParam.getLimit();
        List<Sort.Order> orders = new ArrayList<>();
        Sort sort = new Sort(orders);
        if(StringUtils.isNotEmpty(pageParam.getSortField())){
            if("desc".equalsIgnoreCase(pageParam.getSortType())){
                sort = new Sort(Sort.Direction.DESC,pageParam.getSortField());
            }else if("asc".equalsIgnoreCase(pageParam.getSortType())){
                sort = new Sort(Sort.Direction.ASC,pageParam.getSortField());
            }
        }
        Pageable pageable = new PageRequest(pageIndex,pageSize,sort);
        return pageable;
    }


    public static CommonPageInfo  translatorPage(Page page){
        PageParam pageParam = new PageParam();
        pageParam.setPageTotal(page.getTotalPages());
        pageParam.setPageIndex(page.getNumber());
        pageParam.setRecordTotal((int)page.getTotalElements());
        pageParam.setLimit(page.getSize());
        CommonPageInfo commonPageInfo = new CommonPageInfo(page.getContent(),pageParam);
        return commonPageInfo;
    }

}
