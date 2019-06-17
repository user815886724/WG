layui.extend({
    base: 'scripts/base'
}).use(['base','jquery','request','element','utils','form'],function () {
    var $ = layui.jquery;
    var request = layui.request;
    var element = layui.element;
    var utils = layui.utils;
    var form = layui.form;

    //获得模块Code
    var code = utils.getUrlParams().code;

    var FORM_LAY_FILTER = "modularForm";

    var controller = {
        init : function () {
            var self = this;
            self.renderTypeSelect();
            self.renderDetail();
        },
        renderDetail : function () {
            if(code){
                request.post('/modular/getModularDetail',{code : code}).then(function (res) {
                    form.val(FORM_LAY_FILTER,res);
                    element.render();
                });
            }
        },
        renderTypeSelect : function () {
            var $select = $('select[name="type"]');
            request.post('/modular/getModularTypeList').then(function (res) {
                $select.append('<option value="">请选择</option>');
                $.each(res, function (i, e) {
                    $select.append('<option value="' + e.code + '">' + e.name + '</option>');
                });
                form.render('select');
            });
        }
    };

    form.on('submit(LAY-app-workorder-submit)', function(data) {
        var field = data.field; //获取提交的字段
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        request.post("/modular/saveOrUpdateModular",field).then(function (res) {
            if(res.success){
                parent.layer.msg(res.message,{shift: -1,time: 1000});
                parent.controller.initTable();
                parent.layer.close(index);
            }else{
                parent.layer.alert(res.message, {title: '创建失败'});
            }
        });
    });

    controller.init();
});