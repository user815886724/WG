layui.extend({
  base : "scripts/base"
}).use(['base', 'request'],function () {
    var $ = layui.jquery;
    var request = layui.request;


    window.toManagePage = function (url) {
        layer.open({
            type: 2,
            title: false,
            area: ['100%', '100%'],
            anim: 5,
            shade: false,
            isOutAnim: false,
            skin: 'layui-pro-layer-fixed',
            content: url
        });
    }
});