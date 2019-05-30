;layui.define(["jquery", 'layer'], function(exports) {
  var $ = layui.jquery;
  var layer = layui.layer;

  exports("dsBaseFilter", {
    render: function(options) {
      var required = (options.required || typeof options.required === 'undefined')  ? true : false;

      var modalOptions = $.extend({
        title: '选择',
        area: ["1000px", "670px"],
        yes: function() {},
        getContainer: function() {
          return window;
        }
      }, options.modal);

      var win = modalOptions.getContainer();
      win.dsBaseFilterOptions = options; 
      
      win.layer.open({
        type: 2,
        title: modalOptions.title,
        content: layui.cache.paths.extendPath + "/ds-base-filter/modal.html",
        area: modalOptions.area,
        btn: ["确定", "取消"],
        yes: function(index, layero) {
          var verify = layero.find("iframe").contents().find('#dsBaseFilterResult');
          var data = JSON.parse(verify.val());

          if(required && data.length <= 0) {
            win.layer.msg('请选择');
          } else {
            modalOptions.yes(data);
            win.layer.close(index);
          }
        }
      });
    },
  });
});