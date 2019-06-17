var controller;
layui.extend({
    base: 'scripts/base'
}).use(['base','jquery','request','element','dsTable'],function () {
    var $ = layui.jquery;
    var request = layui.request;
    var element = layui.element;
    var table = layui.dsTable;

    var modularCode;


    var TEST_FILTER = "test";



    controller = {
        init : function () {
            var self = this;
            self.initTable();
            self.initActive();
            self.initGetWayDetail();
        },
        initTable : function () {
            table.render({
                elem: '#test',
                id: 'tableReload',
                url: '/modular/getModularList',
                autoSort: false,
                done: function() {
                },
                cols: [[
                    {type:'checkbox'},
                    {field:'code', title:'模块标识'},
                    {field:'typeName', title:'服务类型'},
                    {field:'getway',title:'网关代码'},
                    {field:'application', title:'服务名称'},
                    {field:'desp',title:'服务描述'},
                    {fixed: 'right', title:'操作', toolbar: '#barDemo', width:200}
                ]],
                page: true
            });
        },
        initGetWayDetail : function () {
            active.portCancel();
            active.ipCancel();
            request.post("/modular/getApiGetwayDetail").then(function (result) {
                if(result.success){
                    var details = result.details;
                    if(details){
                        modularCode = details.modularCode;
                        if(details.ip){
                            $("#api-ip").html(details.ip);
                            $("#ipInput").val(details.ip);
                        }
                        if(details.port){
                            $("#api-port").html(details.port);
                            $("#portInput").val(details.port);
                        }
                    }
                }else{
                    layer.msg(result.message)
                }
            });
        },
        initActive : function () {
            table.on('tool(testFilter)', function(obj){
                var data = obj.data;
                if(obj.event === 'deleteModular'){
                    layer.confirm("确定删除 " + data.code + " 吗?（同时会删除该模块下的配置）",{icon : 3,title : '提示'},function (index) {
                        request.post("/modular/deleteModular",{code : data.code}).then(function (res) {
                            layer.close(index);
                            if(res.success){
                                layer.msg('删除成功！', { time: 1000 });
                                controller.initTable();
                            }else{
                                layer.alert(res.message, {title: '删除失败'});
                            }
                        });
                    });
                }else if(obj.event === 'editModular'){
                    layer.open({
                        type: 2,
                        title: '修改模块',
                        content: "./create_modular.html?code=" + data.code,
                        area: ["60%", "85%"],
                        btn: ["确定","关闭"],
                        yes:function (index, layero) {
                            var verify = layero.find("iframe").contents().find("#LAY-app-workorder-submit");
                            verify.click();
                        }
                    });
                }else if(obj.event === 'getModular'){
                    layer.open({
                        type: 2,
                        title: false,
                        area: ['100%', '100%'],
                        anim: 5,
                        shade: false,
                        isOutAnim: false,
                        skin: 'layui-pro-layer-fixed',
                        content: "./modular_properties.html?code="+data.code+"&application="+data.application
                    });
                }
            });
        }
    };

    var active = {
        ipEdit : function () {
            $("#ipInput").css("display","inline");
            $("#api-ip").hide();
            $("#ipOperation").show();
            $("#ipEdit").hide();
        },
        portEdit : function () {
            $("#portInput").css("display","inline");
            $("#api-port").hide();
            $("#portOperation").show();
            $("#portEdit").hide();
        },
        ipCancel :function () {
            $("#ipInput").hide();
            $("#api-ip").show();
            $("#ipOperation").hide();
            $("#ipEdit").show();
        },
        portCancel : function () {
            $("#portInput").hide();
            $("#api-port").show();
            $("#portOperation").hide();
            $("#portEdit").show();
        },
        ipSave : function () {
            if(! modularCode){
                modularCode = "API_GETWAY";
            }
            var param = {};
            param["modularCode"] = modularCode;
            param["ip"] = $("#ipInput").val();
            request.post('/modular/saveOrUpdateModularHost',param).then(function (res) {
                if(res.success){
                    controller.initGetWayDetail()
                }else{
                    layer.msg(res.message);
                }
            });
        },
        portSave : function () {
            if(! modularCode){
                modularCode = "API_GETWAY";
            }
            var param = {};
            param["modularCode"] = modularCode;
            param["port"] = $("#portInput").val();
            request.post('/modular/saveOrUpdateModularHost',param).then(function (res) {
                if(res.success){
                    controller.initGetWayDetail()
                }else{
                    layer.msg(res.message);
                }
            });
        },
        createModular : function () {
            layer.open({
                type: 2,
                title: '新增模块',
                content: "./create_modular.html",
                area: ["60%", "85%"],
                btn: ["确定","关闭"],
                yes:function (index, layero) {
                    var verify = layero.find("iframe").contents().find("#LAY-app-workorder-submit");
                    verify.click();
                }
            });
        }
    };



    $("a[name='api-operation']").on('click',function () {
        var type = $(this).attr('layer-event');
        if(type){
            active[type] ? active[type].call(this) : '';
        }
    });

    $("#modularBack").on('click',function () {
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    });
    
    controller.init();
});