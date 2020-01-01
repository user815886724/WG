layui.extend({
    base: '../../common/scripts/base'
}).use(['base','jquery','request','element','dsTable','utils'],function () {
    var $ = layui.jquery;
    var form = layui.form;
    var request = layui.request;
    var layer = layui.layer;
    var utils = layui.utils;

    var type = utils.getUrlParams().type;

    var FORM_LAY_FILTER = "datasourceForm";

    var controller = {

    };


    form.on('submit(LAY-app-workorder-submit)', function(data) {
        var field = data.field; //获取提交的字段
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        field.typeCode = type;
        request.post("/WG_METADATA/datasource/createDatasource",field).then(function (res) {
            if(res.success){
                parent.layer.msg(res.message,{shift: -1,time: 1000});
                parent.active.init();
                parent.layer.close(index);
            }else{
                parent.layer.alert(res.message, {title: '创建失败'});
            }
        });
    });
});