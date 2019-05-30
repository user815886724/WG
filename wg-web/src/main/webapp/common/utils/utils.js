layui.define(function(exports) {
  exports('utils', {
    // 数组对象去重
    // https://juejin.im/post/5bc897ae6fb9a05cf90865aa
    unionBy: function(arr, u_key) {
      let obj = {}
      return arr.reduce(function(prev, next) {
        obj[next[u_key] + typeof next[u_key]] ? '' :
          obj[next[u_key] + typeof next[u_key]] = true && prev.push(next)
        return prev
      }, []);
    },
    getUrlParameter: function(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
    },
    // 得到查询字符串参数集合
    getUrlParams: function() {
      // var search = location.search;
      // return search.match(/([^?=&]+)(=([^&]*))/g).reduce(function(a, v){
      //   return a[decodeURIComponent(v.slice(0, v.indexOf('=')))] = decodeURIComponent(v.slice(v.indexOf('=') + 1)), a
      // }, {});
      var args = new Object();
      var query = location.search.substring(1); //获取查询串     
      var pairs = query.split("&"); //在逗号处断开     
      for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('='); //查找name=value     
        if (pos == -1) continue; //如果没有找到就跳过     
        var argname = pairs[i].substring(0, pos); //提取name     
        var value = pairs[i].substring(pos + 1); //提取value     
        args[argname] = unescape(value); //存为属性     
      }
      return args;
    },
    isStringNotNull: function(str) {
      if (str !== null && str !== undefined && str !== '' && str !== 'undefined') {
        return true;
      }
      return false;
    },
    // 驼峰转其他连接
    formatHumpString: function(str, symbol) {
      var self = this;
      if (self.isStringNotNull(str)) {
        return str.replace(/([A-Z])/g, symbol + "$1").toLowerCase();
      }
    },
    /*
      秒转换  为  时分秒格式
      参数： 秒
      例子： secondsToHour(3666) -->   1小时1分6秒
    */
    secondsToHour: function(seconds) {
      if (typeof(seconds) != 'number') { return '--'; }
      var h = Math.floor(seconds / 3600) < 10 ? Math.floor(seconds / 3600) : Math.floor(seconds / 3600);
      var m = Math.floor((seconds / 60 % 60)) < 10 ? Math.floor((seconds / 60 % 60)) : Math.floor((seconds / 60 % 60));
      var s = Math.floor((seconds % 60)) < 10 ? Math.floor((seconds % 60)) : Math.floor((seconds % 60));
      var result = '';
      h && (result += h + '小时');
      m && (result += m + '分');
      s && (result += s + '秒');
      return result;
    },
    /* 
      时间戳转换对应格式
      unix: 时间戳
      str: 对应格式 
    */
    formatUnix: function(unix, str) {
      var l = (unix || "").toString().length,
        format = str || "YYYY-MM-DD hh:mm:ss";
      if (l == 10) {
        return moment.unix(unix).format(format);
      } else if (l == 13) {
        return moment.format(format);
      } else {
        return "";
      }
    },
    // 复制选中内容
    copyText: function(text) {
      var textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();

      try {
        var successful = document.execCommand('copy');
        if (successful) {
          layer.msg('复制成功');
        }
      } catch (err) {
        layer.msg('复制失败');
      }

      document.body.removeChild(textArea);
    },
    // 返回 uuid
    uuid:function () {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";
      var uuid = s.join("");
      return uuid;
    }
  });
});