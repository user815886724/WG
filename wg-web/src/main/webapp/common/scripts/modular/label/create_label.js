layui.extend({
    base: 'scripts/base'
}).use(['base','jquery','request','element','utils','form'],function () {
    var $ = layui.jquery;
    var request = layui.request;
    var element = layui.element;
    var utils = layui.utils;
    var form = layui.form;


    var application = utils.getUrlParams().application;

    var active = {
        initForm :function () {
            $("#application").val(application);
        }
    };


    form.on('submit(LAY-app-workorder-submit)', function(data) {
        var field = data.field; //获取提交的字段
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        request.post("/modular/saveOrUpdateLabel",field).then(function (res) {
            if(res.success){
                parent.layer.msg(res.message,{shift: -1,time: 1000});
                parent.active.init();
                parent.layer.close(index);
            }else{
                parent.layer.alert(res.message, {title: '创建失败'});
            }
        });
    });

    active.initForm();
});