package com.controller;

import com.model.DatasourceEntity;
import com.model.DatasourceTypeEntity;
import com.request.*;
import com.response.GetDatasourceCountResponse;
import com.response.GetDatasourceTypeResponse;
import com.service.DatasourceService;
import com.service.DatasourceTypeService;
import common.CallbackResult;
import common.CommonPageInfo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

/**
 * @author huangwh
 * @date 2019/6/25
 * @time 23:07
 */
@RestController
@RequestMapping("/datasource")
public class DatasourceController {

    @Autowired
    private DatasourceTypeService typeService;

    @Autowired
    private DatasourceService datasourceService;



    @RequestMapping("/getDatasourceCount")
    @ResponseBody
    public GetDatasourceCountResponse getDatasourceCount(){
        GetDatasourceCountResponse response = new GetDatasourceCountResponse();
        response.setDatasourceTypeCount(typeService.getDatasourceTypeCount());
        response.setDatasourceCount(datasourceService.getDatasourceCount());
        return response;
    }


    @RequestMapping("/getDatasourceTypeList")
    @ResponseBody
    public List<GetDatasourceTypeResponse> getDatasourceTypeList(){

        return typeService.getDatasourceTypeList();
    }


    @RequestMapping("/getDatasourceListPage")
    @ResponseBody
    public CommonPageInfo getDatasourceListPage(@RequestBody GetDatasourceListPageRequest request){
        Map<String,Object> param = new HashMap<>();
        param.put("type",request.getType());
        param.put("name",request.getName());
        return datasourceService.getDatasourceList(request.getPageParam(),param);
    }



    @RequestMapping("/deleteDatasource")
    @ResponseBody
    public CallbackResult deleteDatasource(@RequestBody DeleteDatasourceRequest request){

        return datasourceService.deleteDatasource(request.getDatasourceId());
    }


    @RequestMapping("/deleteDatasources")
    @ResponseBody
    public CallbackResult deleteDatasources(@RequestBody DeleteDatasourcesRequest request){
        return datasourceService.deleteDatasources(request.getIds());
    }

    @RequestMapping("/createDatasource")
    @ResponseBody
    public CallbackResult createDatasource(@RequestBody(required = false) CreateDatasourceRequest request){
        DatasourceEntity entity = new DatasourceEntity();
        BeanUtils.copyProperties(request,entity);
        entity.setDatasourceId(UUID.randomUUID().toString());
        entity.setCreateTime(new Date());
        entity.setUpdateTime(new Date());
        return datasourceService.createDatasource(entity);
    }


    @RequestMapping("/getDatasource")
    @ResponseBody
    public CallbackResult getDatasource(@RequestBody GetDatasourceRequest request){
        CallbackResult callbackResult = datasourceService.getDatasource(request.getDatasourceId());
        return callbackResult;
    }
}
