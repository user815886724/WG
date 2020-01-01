package com.service;

import com.dao.DatasourceDao;
import com.model.DatasourceEntity;
import common.CallbackResult;
import common.CommonPageInfo;
import common.PageParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import util.PageTranslatorUtil;

import java.util.List;
import java.util.Map;

/**
 * @author huangwh
 * @date 2019/6/26
 * @time 9:51
 */
@Service
public class DatasourceService {

    @Autowired
    private DatasourceDao dao;


    public List<DatasourceEntity> getDatasourceList(){
        return dao.getDatasourceEntities();
    }

    public CommonPageInfo getDatasourceList(PageParam pageParam, Map<String,Object> param){
        DatasourceEntity datasourceQuery = new DatasourceEntity();
        if(param.get("name") != null){
            datasourceQuery.setDatasourceName(param.get("name").toString());
        }
        if(param.get("type") != null){
            datasourceQuery.setTypeCode(param.get("type").toString());
        }
        //创建匹配器，即如何使用查询条件,模糊匹配
        ExampleMatcher matcher = ExampleMatcher.matching().withMatcher("datasourceName", ExampleMatcher.GenericPropertyMatchers.contains())
                .withIgnorePaths("focus"); //忽略属性：是否关注。因为是基本类型，需要忽略掉
        Example<DatasourceEntity> example = Example.of(datasourceQuery, matcher);
        Page<DatasourceEntity> page = dao.findAll(example, PageTranslatorUtil.translatorPageParam(pageParam));
        ;
        return PageTranslatorUtil.translatorPage(page);
    }


    public Integer getDatasourceCount(){
        return dao.getDatasourceCount();
    }

    public CallbackResult deleteDatasource(String datasourceId){
        CallbackResult callbackResult = new CallbackResult(false);
        try{
            DatasourceEntity datasourceEntity = new DatasourceEntity();
            datasourceEntity.setDatasourceId(datasourceId);
            dao.delete(datasourceEntity);
            callbackResult.setSuccess(true);
            callbackResult.setMessage("删除成功");
        }catch (Exception e){
            callbackResult.setMessage(e.getMessage());
        }
        return callbackResult;
    }


    public CallbackResult deleteDatasources(String ids){
        CallbackResult callbackResult = new CallbackResult(false);
        try{
            for(String id : ids.split(",")){
                callbackResult = this.deleteDatasource(id);
                if(! callbackResult.isSuccess()){
                    return callbackResult;
                }
            }
        }catch (Exception e){
            callbackResult.setMessage(e.getMessage());
        }
        return callbackResult;
    }


    public CallbackResult createDatasource(DatasourceEntity entity){
        CallbackResult callbackResult = new CallbackResult(false);
        try{
            dao.save(entity);
            callbackResult.setSuccess(true);
            callbackResult.setMessage("保存成功");
        }catch (Exception e){
            callbackResult.setMessage(e.getMessage());
        }
        return callbackResult;
    }
}
