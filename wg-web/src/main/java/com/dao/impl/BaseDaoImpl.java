package com.dao.impl;

import com.dao.BaseDao;
import common.CommonPageInfo;
import common.PageParam;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.io.Serializable;
import java.util.*;

/**
 * @author huangwh
 * @date 2019/5/30
 * @time 0:11
 */

@Repository
public class BaseDaoImpl<T,ID extends Serializable> implements BaseDao<T,ID> {

    @PersistenceContext
    private EntityManager entityManager;
    @Transactional
    @Override
    public boolean save(T entity){
        boolean flag=false;
        try {
            entityManager.persist(entity);
            flag=true;
        }catch (Exception e){
            System.out.println("---------------保存出错---------------");
            throw e;
        }
        return flag;
    }
    @Transactional
    @Override
    public Object findById(Object o,Long id) {
        return entityManager.find(o.getClass(),id);
    }
    @Transactional
    @Override
    public List<T> findBySql(String tableName, String filed, Object o ) {
        String sql="from "+tableName+" u WHERE u."+filed+"=?";
        System.out.println(sql+"--------sql语句-------------");
        Query query=entityManager.createQuery(sql);
        query.setParameter(1,o);
        List<T> list= query.getResultList();
        entityManager.close();
        return list;
    }

    @Override
    public Object findObjectBySql(String tableName, String filed, Object o) {
        String sql="from "+tableName+" u WHERE u."+filed+"= ?";
        System.out.println(sql+"--------sql语句-------------");
        Query query=entityManager.createQuery(sql);
        query.setParameter(0,o);

        entityManager.close();
        try{
            Object result = query.getSingleResult();
            return result;
        }catch (NoResultException e){
            return null;
        }
    }
    @Transactional
    @Override
    public List<T> findByMoreFiled(String tableName,LinkedHashMap<String,Object> map) {
        String sql="from "+tableName+" u WHERE ";
        Set<String> set=null;
        set=map.keySet();
        List<String> list=new ArrayList<>(set);
        List<Object> filedList=new ArrayList<>();
        for (String filed:list){
            sql+="u."+filed+"=? and ";
            filedList.add(filed);
        }
        sql=sql.substring(0,sql.length()-4);
        System.out.println(sql+"--------sql语句-------------");
        Query query=entityManager.createQuery(sql);
        for (int i=0;i<filedList.size();i++){
            query.setParameter(i+1,map.get(filedList.get(i)));
        }
        List<T> listRe= query.getResultList();
        entityManager.close();
        return listRe;
    }
    @Transactional
    @Override
    public List<T> findByMoreFiledPages(String tableName,LinkedHashMap<String,Object> map,int start,int pageNumber) {
        String sql="from "+tableName+" u WHERE ";
        Set<String> set=null;
        set=map.keySet();
        List<String> list=new ArrayList<>(set);
        List<Object> filedList=new ArrayList<>();
        for (String filed:list){
            sql+="u."+filed+"=? and ";
            filedList.add(filed);
        }
        sql=sql.substring(0,sql.length()-4);
        System.out.println(sql+"--------sql语句-------------");
        Query query=entityManager.createQuery(sql);
        for (int i=0;i<filedList.size();i++){
            query.setParameter(i+1,map.get(filedList.get(i)));
        }
        query.setFirstResult((start-1)*pageNumber);
        query.setMaxResults(pageNumber);
        List<T> listRe= query.getResultList();
        entityManager.close();
        return listRe;
    }
    @Transactional
    @Override
    public List<T> findPages(String tableName, String filed, Object o, int start, int pageNumber) {
        String sql="from "+tableName+" u WHERE u."+filed+"=?";
        System.out.println(sql+"--------page--sql语句-------------");
        List<T> list=new ArrayList<>();
        try {
            Query query=entityManager.createQuery(sql);
            query.setParameter(1,o);
            query.setFirstResult((start-1)*pageNumber);
            query.setMaxResults(pageNumber);
            list= query.getResultList();
            entityManager.close();
        }catch (Exception e){
            System.out.println("------------分页错误---------------");
        }

        return list;
    }



    @Transactional
    @Override
    public boolean update(T entity) {
        boolean flag = false;
        try {
            entityManager.merge(entity);
            flag = true;
        } catch (Exception e) {
            System.out.println("---------------更新出错---------------");
        }
        return flag;
    }


    @Transactional
    @Override
    public Integer updateMoreFiled(String tableName, LinkedHashMap<String, Object> map) {
        String sql="UPDATE "+tableName+" AS u SET ";
        Set<String> set=null;
        set=map.keySet();
        List<String> list=new ArrayList<>(set);
        for (int i=0;i<list.size()-1;i++){
            if (map.get(list.get(i)).getClass().getTypeName()=="java.lang.String"){
                System.out.println("-*****"+map.get(list.get(i))+"------------"+list.get(i));
                sql+="u."+list.get(i)+"='"+map.get(list.get(i))+"' , ";
            }else {
                sql+="u."+list.get(i)+"="+map.get(list.get(i))+" , ";
            }
        }
        sql=sql.substring(0,sql.length()-2);
        sql+="where u.id=? ";
        System.out.println(sql+"--------sql语句-------------");
        int result=0;
        try {
            Query query=entityManager.createQuery(sql);
            query.setParameter(1,map.get("id"));
            result= query.executeUpdate();
        }catch (Exception e){
            System.out.println("更新出错-----------------------");
            e.printStackTrace();

        }
        return result;
    }

    @Transactional
    @Override
    public boolean delete(T entity) {
        boolean flag=false;
        try {
            entityManager.remove(entityManager.merge(entity));
            flag=true;
        }catch (Exception e){
            System.out.println("---------------删除出错---------------");
        }
        return flag;
    }

    @Override
    public Object findCount(String tableName, LinkedHashMap<String, Object> map) {
        String sql="select count(u) from "+tableName+" u WHERE ";
        Set<String> set=null;
        set=map.keySet();
        List<String> list=new ArrayList<>(set);
        List<Object> filedList=new ArrayList<>();
        for (String filed:list){
            sql+="u."+filed+"=? and ";
            filedList.add(filed);
        }
        sql=sql.substring(0,sql.length()-4);
        System.out.println(sql+"--------sql语句-------------");
        Query query=entityManager.createQuery(sql);
        for (int i=0;i<filedList.size();i++){
            query.setParameter(i+1,map.get(filedList.get(i)));
        }
        return query.getSingleResult();
    }

    @Override
    public Object executeSql(String sql) {
        try {
            Query query = entityManager.createNativeQuery(sql);
            Object result = query.getSingleResult();
            entityManager.close();
            return result;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }


    @Override
    public <T1> T1 executeSqlSingle(String sql, Class<T1> o) {
        try {
            Query query = entityManager.createNativeQuery(sql, o);
            T1 result = (T1) query.getSingleResult();
            entityManager.close();
            return result;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public <T1> List executeSql(String sql,Class<T1> o) {
        try{
            Query query=entityManager.createNativeQuery(sql,o);
            List<T1> result = query.getResultList();
            entityManager.close();
            return result;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public <T1> CommonPageInfo getPageData(String sql, PageParam pageParam, Map<String, Object> param, Class<T1> resultType) {
        try{
            if(param != null){
                for(String key : param.keySet()){
                    String tmp = String.format("{%s}",key);
                    sql = sql.replace(tmp,param.get(key).toString());
                }
            }
            String countSql = "SELECT COUNT(1) FROM (" + sql + ") tt";
            Integer count = Integer.valueOf(executeSql(countSql).toString());
            pageParam.setRecordTotal(count);
            pageParam.setPageTotal(count / pageParam.getLimit() + 1);
            if(StringUtils.isNotEmpty(pageParam.getSortField())){
                sql += "SORT BY " + pageParam.getSortField() + " " + pageParam.getSortType();
            }
            Integer startIndex = (pageParam.getPageIndex() - 1) * pageParam.getLimit();
            sql += " " + "LIMIT " + startIndex + "," + pageParam.getLimit();
            List<T1> result = executeSql(sql,resultType);
            CommonPageInfo commonPageInfo = new CommonPageInfo();
            commonPageInfo.setData(result);
            commonPageInfo.setPageParam(pageParam);
            return commonPageInfo;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }
}
