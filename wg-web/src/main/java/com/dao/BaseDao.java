package com.dao;

import common.CommonPageInfo;
import common.PageParam;

import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * @author huangwh
 * @date 2019/5/30
 * @time 0:10
 */
public interface BaseDao<T,ID extends Serializable> {
    /**
     * 保存数据对象
     * @param entity
     * @return
     */
    boolean save(T entity);
    /**
     * 根据id查询
     * @param id
     * @param t
     * @return
     */
    T findById(T t,Long id);
    /**
     * 根据表名，字段，参数查询，拼接sql语句
     * @param  tableName 表名
     * @param filed 字段名
     * @param o 字段参数
     * @return
     */
    List<T> findBySql(String tableName, String filed, Object o);

    Object findObjectBySql(String tableName,String filed,Object o);

    /**
     * 多个字段的查询
     * @param tableName 表名
     * @param map 将你的字段传入map中
     * @return
     */
    List<T> findByMoreFiled(String tableName,LinkedHashMap<String,Object> map);

    /**
     * 多字段查询分页
     * @param tableName 表名
     * @param map 以map存储key,value
     * @param start 第几页
     * @param pageNumber 一个页面的条数
     * @return
     */
    List<T> findByMoreFiledPages(String tableName, LinkedHashMap<String,Object> map, int start, int pageNumber);
    /**
     * 一个字段的分页
     * @param  tableName 表名
     * @param filed 字段名
     * @param o 字段参数
     * @param start 第几页
     * @param pageNumber 一个页面多少条数据
     * @return
     */
    List<T> findPages(String tableName,String filed,Object o,int start,int pageNumber);
    /**
     * 根据表的id删除数据
     * @param  entity
     */
    boolean delete(T entity);
    /**
     * 更新对象
     * @param e
     * @return
     */

    boolean update(T e);
    /**
     * 根据传入的map遍历key,value拼接字符串，以id为条件更新
     * @param tableName 表名
     * @param map 传入参数放入map中
     * @return
     */
    Integer updateMoreFiled(String tableName,LinkedHashMap<String,Object> map);


    /**
     * 根据条件查询总条数返回object类型
     * @param tableName  表名
     * @param map 传入参数放入map中
     * @return
     */
    Object findCount(String tableName, LinkedHashMap<String,Object> map);


    /**
     * 单个对象sql执行语句
     * @param sql
     * @return
     */
    <T> T executeSqlSingle(String sql,Class<T> o);

    /**
     * 执行SQL语句
     * @param sql
     * @return
     */
    Object executeSql(String sql);


    /**
     *
     * @param sql
     */
    void deleteSql(String sql);

    /**
     * 多个实体返回对象
     * @param sql
     * @return
     */
    <T> List executeSql(String sql,Class<T> o);


    /**
     *
     * @param sql SQL语句条件语句用{参数}注入参数值
     * @param pageParam 分页条件
     * @param param 额外的查询条件
     * @param resultType 返回的结果实体
     * @param <T> 结果类型
     * @return 返回分页结果
     */
    <T> CommonPageInfo getPageData(String sql, PageParam pageParam, Map<String,Object> param, Class<T> resultType);
}