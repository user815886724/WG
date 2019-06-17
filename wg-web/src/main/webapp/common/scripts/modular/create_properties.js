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

    active.init();

});