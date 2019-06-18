package com.controller;

import com.model.*;
import com.requests.*;
import com.service.CommonService;
import com.service.ModularService;
import common.CallbackResult;
import common.CommonPageInfo;
import common.PageParam;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * @author huangwh
 * @date 2019/6/12
 * @time 17:58
 */

@Controller
@RequestMapping("/api/modular")
public class ModularController {

    @Autowired
    private ModularService modularService;

    @Autowired
    private CommonService commonService;

    @RequestMapping("/getModularList")
    @ResponseBody
    public CommonPageInfo getModularList(@RequestBody(required = false) GetModularListRequest request){
        if(request != null && request.getPageParam() != null){
            return modularService.getModularList(request.getPageParam());
        }else{
            return modularService.getModularList(new PageParam());
        }
    }


    @RequestMapping("/getModularTypeList")
    @ResponseBody
    public List<SysModularTypeEntity> getModularTypeList(){
        return modularService.getModularTypeList();
    }


    @RequestMapping("/getApiGetwayDetail")
    @ResponseBody
    public CallbackResult getApiGetwayDetail(){
        CallbackResult callbackResult = new CallbackResult(true);
        callbackResult.setDetails(modularService.getApiGetway());
        return callbackResult;
    }

    @RequestMapping("/saveOrUpdateModularHost")
    @ResponseBody
    public CallbackResult saveOrUpdateModularHost(@RequestBody(required = false) SaveOrUpdateModularHostRequest request){
        CallbackResult callbackResult = new CallbackResult(false);
        if(request != null){
            if(StringUtils.isEmpty(request.getModularCode())){
                request.setModularCode("API_GETWAY");
            }
            ModularHostEntity modularHostEntity = modularService.getHostEntity(request.getModularCode());
            if(modularHostEntity == null){
                modularHostEntity = new ModularHostEntity();
                modularHostEntity.setModularCode(request.getModularCode());
                callbackResult = commonService.saveEntity(modularHostEntity);
                if(!callbackResult.isSuccess()){
                    return callbackResult;
                }
            }
            if(StringUtils.isNotEmpty(request.getIp())){
                modularHostEntity.setIp(request.getIp());

            }
            if(StringUtils.isNotEmpty(request.getPort())){
                modularHostEntity.setPort(request.getPort());
            }
            callbackResult = commonService.updateEntity(modularHostEntity);
        }else{
            callbackResult.setMessage("参数为空");
        }
        return callbackResult;
    }


    @RequestMapping(value = "/saveOrUpdateModular")
    @ResponseBody
    public CallbackResult saveOrUpdateModular(@RequestBody(required = false)SaveOrUpdateModularRequest request){
        CallbackResult callbackResult = new CallbackResult(false);
        if(request != null && StringUtils.isNotEmpty(request.getCode())){
            SysModularParameterEntity modularParameterEntity = modularService.getModularParameter(request.getCode());
            if(modularParameterEntity == null){
                modularParameterEntity = new SysModularParameterEntity();
                BeanUtils.copyProperties(request,modularParameterEntity);
                callbackResult = commonService.saveEntity(modularParameterEntity);
            }else{
                BeanUtils.copyProperties(request,modularParameterEntity);
                callbackResult = commonService.updateEntity(modularParameterEntity);
            }
        }else {
            callbackResult.setMessage("参数值为空");
        }
        return callbackResult;
    }


    @RequestMapping("/deleteModular")
    @ResponseBody
    public CallbackResult deleteModular(@RequestBody DeleteModularRequest request){
        SysModularParameterEntity modularParameterEntity = new SysModularParameterEntity();
        BeanUtils.copyProperties(request,modularParameterEntity);
        return commonService.deleteEntity(modularParameterEntity);
    }

    @RequestMapping("/getModularDetail")
    @ResponseBody
    public SysModularParameterEntity getModular(@RequestBody GetModularRequest request){
        return modularService.getModularParameter(request.getCode());
    }

    @RequestMapping("/getModularPropertiesList")
    @ResponseBody
    public CommonPageInfo getModularPropertiesList(@RequestBody(required = false) GetModularPropertiesListRequest request){
        Map<String,Object> param = new HashMap<>();
        if(StringUtils.isNotEmpty(request.getLabel())){
            param.put("label",request.getLabel());
        }
        if(StringUtils.isNotEmpty(request.getApplication())){
            param.put("application",request.getApplication());
        }
        return modularService.getPropertiesList(param,request.getPageParam());
    }


    @RequestMapping("/getPropertiesLabelList")
    @ResponseBody
    private List<PropertiesLabelEntity> getPropertiesLabelList(@RequestBody GetPropertiesLabelListRequest request){
        return modularService.getPropertiesLabelList(request.getApplication());
    }

    @RequestMapping("/saveOrUpdateProperties")
    @ResponseBody
    public CallbackResult saveOrUpdateModularProperties(@RequestBody(required = false) SaveOrUpdateModularPropertiesRequest request){
        CallbackResult callbackResult = new CallbackResult(false);
        if(request != null){
            PropertiesEntity entity = new PropertiesEntity();
            BeanUtils.copyProperties(request,entity);
            if(StringUtils.isNotEmpty(request.getId())){
                callbackResult = commonService.updateEntity(entity);
            }else{
                entity.setId(UUID.randomUUID().toString());
                callbackResult = commonService.saveEntity(entity);
            }
        }else{
            callbackResult.setMessage("参数不能为空");
        }
        return callbackResult;
    }


    @RequestMapping("/getProperties")
    @ResponseBody
    public PropertiesEntity getProperties(@RequestBody GetPropertiesRequest request){
        return modularService.getProperties(request.getId());
    }


    @RequestMapping("/getLabelList")
    @ResponseBody
    public CommonPageInfo getLabelList(@RequestBody GetLabelListRequest request){
        Map<String,Object> param = new HashMap<>();
        if(StringUtils.isNotEmpty(request.getApplication())){
            param.put("application",request.getApplication());
        }
        return modularService.getLabelList(param,request.getPageParam());
    }


    @RequestMapping("/saveOrUpdateLabel")
    @ResponseBody
    public CallbackResult saveOrUpdateLabel(@RequestBody SaveOrUpdateLabelRequest request){
        CallbackResult callbackResult = new CallbackResult(false);
        PropertiesLabelEntity entity = new PropertiesLabelEntity();
        BeanUtils.copyProperties(request,entity);
        callbackResult = commonService.saveEntity(entity);
        return callbackResult;
    }

}
