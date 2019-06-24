package com.controller;

import com.dao.TestDao;
import com.model.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * @author huangwh
 * @date 2019/6/23
 * @time 17:17
 */
@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    private TestDao dao;

//    @RequestMapping(value ="/getAll", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @RequestMapping(value ="/getAll")
    @ResponseBody
    private List<Test> getAll(@RequestBody(required = false)Map<String,Object> map){
        return dao.findAll();
    }
}
