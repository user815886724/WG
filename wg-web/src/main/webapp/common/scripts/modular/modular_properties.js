layui.extend({
    base : "scripts/base"
}).use(['base', 'request','utils','element','laytpl','form','dsTable'],function () {
    var $ = layui.jquery;
    var request = layui.request;
    var element = layui.element;
    var utils = layui.utils;
    var laytpl = layui.laytpl;
    var form = layui.form;
    var table = layui.dsTable;


    var code = utils.getUrlParams().code;
    var application = utils.getUrlParams().application;




    var active = {
        init : function () {
            var self = this;
            Promise.all([
                self.initTable(),
                self.initSelect()
            ]).then(function () {
                initOperator();
            });
        },
        initTable : function () {
            table.render({
                elem: '#test',
                id: 'tableReload',
                url: '/modular/getModularPropertiesList',
                autoSort: false,
                where : {
                    application : application
                },
                done: function() {
                },
                cols: [[
                    {type:'checkbox'},
                    {field:'key', title:'配置的key'},
                    {field:'value', title:'配置的value'},
                    {field:'application',title:'服务标识'},
                    {field:'label', title:'服务标题'},
                    {fixed: 'right', title:'操作', toolbar: '#barDemo', width:200}
                ]],
                page: true
            });
        },
        initSelect : function () {
            return request.post('/modular/getPropertiesLabelList',{application:application}).then(function (res) {
                $("#labelSelect").html("<option value=''>标题：全部</option>");
                $.each(res,function (index,item) {
                    $("#labelSelect").append("<option value='"+item.label+"'>"+ item.label +"</option>");
                });
                form.render("select");
            });
        },
        createProperties : function () {
            layer.open({
                type: 2,
                title: '新增配置',
                content: "./create_properties.html?application="+application,
                area: ["60%", "85%"],
                btn: ["确定","关闭"],
                yes:function (index, layero) {
                    var verify = layero.find("iframe").contents().find("#LAY-app-workorder-submit");
                    verify.click();
                }
            });
        }
    };

    function initOperator() {
        form.on("select(labelSelect)",function (data) {
            table.reload('tableReload',{
                page: { curr: 1 },
                where : {
                    application : application,
                    label : data.value
                }
            });
        });
    }

    $(".layui-pro-page-hd-tit").html(code + " 模块"+$(".layui-pro-page-hd-tit").text());


    active.init();

    $("#propertiesBack").on('click',function () {
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    });
    $("a[name='operation']").on('click',function () {
        var type = $(this).attr('layer-event');
        if(type){
            active[type] ? active[type].call(this) : '';
        }
    });

});