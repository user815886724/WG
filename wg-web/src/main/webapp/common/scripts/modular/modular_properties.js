var active;
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




    active = {
        init : function () {
            var self = this;
            Promise.all([
                self.initTable(),
                self.initSelect(),
                self.initActive()
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
                    {fixed: 'right', title:'操作', toolbar: '#barDemo', width:130}
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
        },
        deletes : function () {
           var checkStatus = table.checkStatus('tableReload');
            var ids = [];
            $(checkStatus.data).each(function (i, o) {//o即为表格中一行的数据
                ids.push(o.id);
            });
            ids = ids.join(",");
            layer.confirm("确定删除该" + checkStatus.data.length + "个配置项吗?",{icon : 3,title : '提示'},function (index) {
                request.post("/modular/deleteLotProperties",{ids : ids}).then(function (res) {
                    layer.msg(res.message)
                    if(res.success){
                        active.init();
                    }
                });
            });

        },
        initActive : function(){
            table.on('tool(testFilter)', function(obj){
                var data = obj.data;
                if(obj.event === 'ediProperties'){
                    layer.open({
                        type: 2,
                        title: '新增配置',
                        content: "./create_properties.html?application="+application + "&id=" + data.id,
                        area: ["60%", "85%"],
                        btn: ["确定","关闭"],
                        yes:function (index, layero) {
                            var verify = layero.find("iframe").contents().find("#LAY-app-workorder-submit");
                            verify.click();
                        }
                    });
                }else if(obj.event === "deleteProperties"){
                    layer.confirm("确定删除 " + data.key + " 吗?",{icon : 3,title : '提示'},function (index) {
                        request.post("/modular/deleteProperties",{id:data.id}).then(function (res) {
                            layer.close(index);
                            if(res.success){
                                layer.msg('删除成功！', { time: 1000 });
                                active.init();
                            }else{
                                layer.alert(res.message, {title: '删除失败'});
                            }
                        });
                    });
                }
            });
        },
        labelList : function () {
            layer.open({
                type: 2,
                title: '标题管理',
                content: "./properties_label.html?application="+application,
                area: ["60%", "85%"],
                btn: ["关闭"]
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