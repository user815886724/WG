;layui.define(["axios", "layer"], function(exports) {
  var axios, layer, request, apiBaseUrl;
  axios = layui.axios;
  layer = layui.layer;
  apiBaseUrl = layui.cache.paths.apiBaseUrl;
    
  // 创建一个 axios
  request = axios.create({
    // baseURL: apiBaseUrl,
    timeout: 300000 // 请求超时毫秒时间
  });
  // 请求
  request.interceptors.request.use(
    function(config) {
      if(config.url === '/api.do') {
        config.url = '/wg' + config.url;
      } else {
        config.url = apiBaseUrl + config.url;
      }
      return config;
    },
    function(error) {
      return Promise.reject(error);
    }
  );
  // 响应
  request.interceptors.response.use(checkStatus, function(error) {
    if (error.response) {
      layer.alert(
        "请求错误，请求状态：" +
          error.response.status +
          "，错误信息：" +
          error.response.data
      );
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      // console.log(error);
      // console.log(error.response.data);
      // console.log(error.response.status);
      // console.log(error.response.headers);
    } else if (error.request) {
      layer.alert("请求超时，请刷新后重试！");
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      // console.log(error.request);
    } else {
      layer.alert(error.message);
      // Something happened in setting up the request that triggered an Error
      // console.log('Error', error.message);
    }
    return Promise.reject(error);
  });
  // 用完删掉模块？
  delete layui.axios;

  // 检查状态
  function checkStatus(response) {
    var result = response.data;
    var codeMessage = {
      200: "服务器成功返回请求的数据。",
      201: "新建或修改数据成功。",
      202: "一个请求已经进入后台排队（异步任务）。",
      204: "删除数据成功。",
      400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
      401: "用户没有权限（令牌、用户名、密码错误）。",
      403: "用户得到授权，但是访问是被禁止的。",
      404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
      406: "请求的格式不可得。",
      410: "请求的资源被永久删除，且不会再得到的。",
      422: "当创建一个对象时，发生一个验证错误。",
      500: "服务器发生错误，请检查服务器。",
      502: "网关错误。",
      503: "服务不可用，服务器暂时过载或维护。",
      504: "网关超时。"
    };
    var status = result.resultCode;
    
    if (status === 200 || (status+'').indexOf(6) === 0) {
      return result.details;
    } else if (status === 401 || (status === 500 && result.message === '当前没有登录用户')) {
      // 跳转到登录页
      location.href = loginUrl;
    } else {
      // var errortext = codeMessage[status];
      var errortext = result.message.indexOf('<!DOCTYPE html>') >=0 ? codeMessage[status] : result.message;

      layer.alert(
        "请求错误，请求状态：" + status + "，错误信息：" + errortext
      );
      var error = new Error(errortext);
      error.name = status;
      error.response = response;
      throw error;
    }
  }

  exports("request", request);
});
