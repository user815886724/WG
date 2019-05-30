
;(function() {
  // 判断环境，方便前端调试
  var isDev = _isDev();
  // 访问路径
  var publicPath = isDev ? '' : '/wg';
  // API 根路径
  var apiBasePath =  "/wg/api";
  
  // #####################################

  layui.config({
    version: isDev ? true : (new Date().getTime()+'').substring(0,8),
    dev: isDev,
    // 全局公共路径
    paths: {
      // contextPath: '', // 目前没用
      // publicPath: publicPath,
      assetsPath: publicPath + "/common", // 静态资源路径
      extendPath: publicPath + "/common/lib/extend",
      apiBaseUrl: apiBasePath,
    },
  }).extend({
    ES6Promise: layui.cache.paths.assetsPath +'/lib/extend/es6-promise',
    moment: layui.cache.paths.assetsPath +'/lib/extend/moment',
    echarts: layui.cache.paths.assetsPath +'/lib/extend/echarts.min',
    axios: layui.cache.paths.assetsPath +'/lib/extend/axios',
    eleTree: layui.cache.paths.assetsPath + "/lib/extend/eleTree",
    multiSelect: layui.cache.paths.assetsPath + "/lib/extend/multiSelect",
    // ----
    utils: layui.cache.paths.assetsPath + "/utils/utils",
    request: layui.cache.paths.assetsPath + "/utils/request",
    dsTable: layui.cache.paths.assetsPath +'/lib/extend/ds-table',
    dsTableFilter: layui.cache.paths.assetsPath +'/lib/extend/ds-table-filter',
    dsSteps: layui.cache.paths.assetsPath + "/lib/extend/ds-steps",
    dsBaseFilter: layui.cache.paths.assetsPath + "/lib/extend/ds-base-filter/index",
    dsKeyValue: layui.cache.paths.assetsPath + "/lib/extend/ds-keyvalue",
  }).define(['ES6Promise', 'layer'], function(exports){
    var $ = layui.jquery;

    // 全局 Promise
    layui.ES6Promise.polyfill();

    // IE 下 console 问题
    var console = console || {log: function(){ return false; }};

    // css
    layui.link(layui.cache.paths.extendPath + '/dsicon-font/iconfont.css');
    
    // 初始化layer
    layer.config({
      // shadeClose: true, //是否点击遮罩关闭
      resize: false, //是否允许拉伸
      maxmin: true, //最大最小化
    });

    var tooltip = {
      render: function() {
        //tooltip
        $('*[lay-tooltip]').unbind();
        $('*[lay-tooltip]').on('mouseenter', function(){
          var content = $(this).attr('lay-tooltip');
          var style =  'font-size: 14px;min-width: 30px;padding: 3px 4px;color: #fff;text-align: left;text-decoration: none;word-wrap: break-word;';
          this.index = layer.tips('<div style="'+style+'">'+ content + '</div>', this, {
            time: -1
            ,maxWidth: 380
            ,tips: [3, '#4c4c4c']
          });
        }).on('mouseleave', function(){
          layer.close(this.index);
        });
      }
    };

    var dropdown = {
      render: function(opt) {
        var options = $.extend({
          trigger: 'hover',
          elem: '.layui-pro-dropdown',
        }, opt);
        $(options.elem).each(function (i, elem) {
          var jqelem = $(elem);
          var ulBox = jqelem.children('ul');
          var triggerEle = jqelem.find('.layui-pro-dropdown-trigger');
          var timer = '';
          ulBox.addClass('layui-anim layui-anim-upbit');
          // var event = jqelem.hasClass('dropdown-click') ? 'click' : 'mouseenter';
          var event = (options.trigger === 'hover') ? 'mouseenter' : options.trigger;
         
          jqelem.unbind(); // 注销事件
          if(options.trigger === 'click') {
            jqelem.addClass('dropdown-click');
          }
      
          if(triggerEle.find('.dsicon-down').length === 0) {
            triggerEle.append('<i class="dsicon dsicon-down" style="font-size: 12px;vertical-align: middle;margin-left: 4px;"></i>');
          }
      
          jqelem.on(event, function(e) {
            var disabled = jqelem.hasClass('dropdown-disabled') || $(this).find('.layui-pro-dropdown-trigger').hasClass('layui-disabled') || $(this).find('.layui-pro-dropdown-trigger').hasClass('layui-btn-disabled');
            if(disabled){return false}
            clearTimeout(timer);
            //FIX 定位
            var overHeight = (jqelem.offset().top + jqelem.height() + ulBox.outerHeight() - $(window).scrollTop()) > $(window).height();
            if(jqelem.parents('.layui-table-view').length > 0) {
              if(overHeight){
                ulBox.css({"left":"auto","top": jqelem.offset().top - jqelem.height() - ulBox.height() - $(window).scrollTop(),"bottom":"auto","position": 'fixed'});
              }else{
                ulBox.css({"left":"auto","top": jqelem.offset().top + jqelem.height() - $(window).scrollTop(),"bottom":"auto","position": 'fixed'});
              }
            } else {
              if(overHeight){
                ulBox.css({"top":"auto","bottom":"100%"});
              }else{
                ulBox.css({"top":"100%","bottom":"auto"});
              }
            }
            ulBox.show();
          });
          if(event == 'mouseenter'){
            jqelem.on("mouseleave", function(e) {
              timer = setTimeout(function(){
                ulBox.hide();
              }, 300);
            })
          }else{
            $(document).on("mouseup", function(e) {
              var userSet_con = jqelem;
              if(!userSet_con.is(e.target) && userSet_con.has(e.target).length === 0){
                ulBox.hide()
              }
            });
          }
        });
      }
    };

    tooltip.render(); // 文字提示
    dropdown.render(); // 下拉框渲染

    delete layui.ES6Promise;

    exports('base', {
      paths: layui.cache.paths,
      // 获取当前文件的绝对路径
      getDirPath: function(win) {
        win = win || window;
        var str = win.location.href;
        var arr = str.split("/");
        delete arr[arr.length-1];
        var dir = arr.join("/");
        return dir;
      },
      tooltip: tooltip,
      dropdown: dropdown
    });
  });

  function _isDev() {
    return location.href.indexOf(":3000/") > 0;
  }
}());
