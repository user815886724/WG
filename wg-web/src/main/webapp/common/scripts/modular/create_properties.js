layui.extend({
    base: 'scripts/base'
}).use(['base','jquery','request','element','utils','form'],function () {
    var $ = layui.jquery;
    var request = layui.request;
    var element = layui.element;
    var utils = layui.utils;
    var form = layui.form;


    var application = utils.getUrlParams().application;

    var id = utils.getUrlParams().id;

    var FORM_LAY_FILTER = "modularForm";

    var active = {
        init : function () {
            var self = this;
            self.initForm();
            self.initSelect();
        },
        initForm : function () {
            if(application){
                $("#application").val(application);
            }
            if(id){
                request.post('/modular/getProperties',{id : id}).then(function (res) {
                    form.val(FORM_LAY_FILTER,res);
                    element.render();
                });
            }

        },
        initSelect : function () {
            request.post("/modular/getPropertiesLabelList",{application:application }).then(function (res) {
                $.each(res,function (index,item) {
                    $("#childrenLabelSelect").append("<option value='"+item.label+"'>"+ item.label +"</option>");
                });
                form.render("select");
            });
        }
    };


    form.on('submit(LAY-app-workorder-submit)', function(data) {
        var field = data.field; //获取提交的字段
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        field["profile"] = "stage";
        if(id){
            field["id"] = id;
        }
        request.post("/modular/saveOrUpdateProperties",field).then(function (res) {
            if(res.success){
                parent.layer.msg(res.message,{shift: -1,time: 1000});
                parent.active.init();
                parent.layer.close(index);
            }else{
                parent.layer.alert(res.message, {title: '创建失败'});
            }
        });
    });

    active.init();

});