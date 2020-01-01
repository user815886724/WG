/**
 * This file created at 2017年3月6日.
 * <p>
 * Copyright (c) 2002-2017 Bingosoft, Inc. All rights reserved.
 */
package common;

import com.alibaba.fastjson.JSONObject;
import exception.HippoException;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.*;
import org.apache.commons.io.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpEntity;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * <code>{@link HttpUtils}</code>
 *
 * TODO : document me
 *
 * @author 陈超明
 */
public class HttpUtils {
    private static Log logger = LogFactory.getLog(HttpUtils.class);
    public static final String STATUS_CODE = "statusCode";
    public static final String RESPONSE = "response";

    public static String doGet(String url, Map<String, String> params,
                               Map<String, String> headers) throws Exception {
        String response = null;
        HttpClient client = new HttpClient();
        HttpMethod method = new GetMethod(url);

        if (headers != null && headers.size() > 0) {
            for (Map.Entry<String, String> entry : headers.entrySet()) {
                method.setRequestHeader(entry.getKey(),
                        entry.getValue());
            }
        }
        try {
            String queryString = "";
            if (params != null && !params.isEmpty()) {
                for (Map.Entry<String, String> entry : params.entrySet()) {
                    queryString += (entry.getKey() + "=" + entry.getValue() + "&");
                }
            }
            client.executeMethod(method);
            if (method.getStatusCode() == HttpStatus.SC_OK) {
                InputStream in = method.getResponseBodyAsStream();
                response = IOUtils.toString(in, "UTF-8");
                in.close();
            } else {

                InputStream in = method.getResponseBodyAsStream();
                logger.error(IOUtils.toString(in, "UTF-8"));
                in.close();
                throw new Exception("执行HTTP GET请求" + url + "时，发生异常！CODE:"
                        + method.getStatusCode());

            }
        } catch (Exception e) {
            logger.error("执行HTTP Get请求时”发生异常！" + e.getMessage(), e);
            throw e;
        } finally {
            method.releaseConnection();
            client.getHttpConnectionManager().closeIdleConnections(0);
        }
        return response;
    }

    public static int doDelete(String url) throws Exception {
        HttpClient client = new HttpClient();
        DeleteMethod method = new DeleteMethod(url);
        method.setRequestHeader("Connection", "close");
        try {
            client.executeMethod(method);
            return method.getStatusCode();
        } finally {
            method.releaseConnection();
            client.getHttpConnectionManager().closeIdleConnections(0);
        }
    }

    public static int doPut(String url) throws Exception {
        HttpClient client = new HttpClient();
        PutMethod method = new PutMethod(url);
        method.setRequestHeader("Connection", "close");
        try {
            client.executeMethod(method);
            return method.getStatusCode();
        } finally {
            method.releaseConnection();
            client.getHttpConnectionManager().closeIdleConnections(0);
        }
    }

    /**
     * 返回状态码和请求的内容
     * @param url
     * @return
     * @throws Exception
     */
    public static Map<String, Object> doGet(String url) throws Exception {
        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpGet httpGet = new HttpGet(url);
        httpGet.addHeader("Connection", "close");
        Map<String, Object> ret = new HashMap<>();
        CloseableHttpResponse httpResponse=null;
        try {
            httpResponse = httpClient.execute(httpGet);
            int statusCode = httpResponse.getStatusLine().getStatusCode();
            HttpEntity httpEntity = httpResponse.getEntity();
            String response;
            if (httpEntity == null) {
                response = "";
            } else {
                response = EntityUtils.toString(httpEntity);
            }
            httpGet.abort();
            ret.put(STATUS_CODE, statusCode);
            ret.put(RESPONSE, response);
            return ret;
        } finally {
            try {
                if(httpResponse!=null){
                    httpResponse.close();
                }
                httpClient.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static Map<String, Object> doJsonPost(String url, String json) throws Exception {
        HttpClient client = new HttpClient();
        PostMethod method = new PostMethod(url);
        method.setRequestHeader("Connection", "close");
        Map<String, Object> ret = new HashMap<String, Object>();
        try {
            if (json != null && !json.trim().equals("")) {
                RequestEntity requestEntity = new StringRequestEntity(json, "application/json", "UTF-8");
                method.setRequestEntity(requestEntity);
            }
            client.executeMethod(method);
            InputStream in = method.getResponseBodyAsStream();
            ret.put(STATUS_CODE, method.getStatusCode());
            ret.put(RESPONSE, IOUtils.toString(in, "UTF-8"));
        } finally {
            method.releaseConnection();
            client.getHttpConnectionManager().closeIdleConnections(0);
        }
        return ret;
    }

    public static String doPost(String url, Map<String, Object> params) throws Exception {
        HttpClient client = new HttpClient();
        PostMethod method = new PostMethod(url);
        method.setRequestHeader("Connection", "close");
        method.setRequestHeader("Content-Type","application/json;charset=UTF-8");
        String response = null;
        try {
            method.setRequestBody(JSONObject.toJSONString(params));
            client.executeMethod(method);
            InputStream in = method.getResponseBodyAsStream();
            response = IOUtils.toString(in, "UTF-8");
        } finally {
            method.releaseConnection();
        }
        return response;
    }

    /**
     * get 请求
     * @param url
     * @param header
     * @return
     */
    public static HttpEntity httpGet(String url, Map<String, String> header) {
        HttpGet httpGet = new HttpGet(url);
        if (header != null) {
            for (Map.Entry<String, String> entry : header.entrySet()) {
                httpGet.setHeader(entry.getKey(), entry.getValue());
            }
        }

        RequestConfig config = RequestConfig.custom().setSocketTimeout(2000).setConnectTimeout(3000).build(); // 握手超时、连接超时配置
        httpGet.setConfig(config);
        return sendMessage(httpGet);
    }

    public static HttpEntity httpGet(String url, Map<String, String> header, int socketTimeOut, int connectTimeout) {
        HttpGet httpGet = new HttpGet(url);
        if (header != null) {
            for (Map.Entry<String, String> entry : header.entrySet()) {
                httpGet.setHeader(entry.getKey(), entry.getValue());
            }
        }

        RequestConfig config = RequestConfig.custom().setSocketTimeout(socketTimeOut).setConnectTimeout(connectTimeout).build();
        httpGet.setConfig(config);
        return sendMessage(httpGet);
    }

    /**
     * get 方式请求（get 、delete ...）
     * @param request
     * @return
     */
    public static HttpEntity sendMessage(HttpUriRequest request) {
        try {
            CloseableHttpClient client = HttpClients.createDefault();
            CloseableHttpResponse response = client.execute(request);
            int statusCode = response.getStatusLine().getStatusCode();
            String statusLine = "StatusCode:" + statusCode + ";ReasonPhrase:" + response.getStatusLine().getReasonPhrase();
            if (statusCode > 199 && statusCode < 300) {
                return response.getEntity();
            } else {
                logger.error(statusLine);
                throw new HippoException(EntityUtils.toString(response.getEntity()));
            }

        } catch (IOException e) {
            logger.error("请求接口异常...", e);
            throw new HippoException(e.getMessage());
        }
    }
}
