var active;
layui.extend({
    base : "scripts/base"
}).use(['base', 'request','utils','element','form','dsTable'],function () {
    var $ = layui.jquery;
    var request = layui.request;
    var element = layui.element;
    var utils = layui.utils;
    var form = layui.form;
    var table = layui.dsTable;

    var application = utils.getUrlParams().application;

    active = {
        init : function () {
            var self = this;
            self.initTable();
            self.initActive();
        },
        initTable : function () {
            table.render({
                elem: '#test',
                id: 'tableReload',
                url: '/modular/getLabelList',
                autoSort: false,
                where : {
                    application : application
                },
                done: function() {
                },
                cols: [[
                    {type:'checkbox'},
                    {field:'application', title:'服务标识'},
                    {field:'label', title:'标题'},
                    {fixed: 'right', title:'操作', toolbar: '#barDemo', width:65}
                ]],
                page: true
            });
        },
        createLabel : function () {
            layer.open({
                type: 2,
                title: '新增配置',
                content: "./create_label.html?application="+application,
                area: ["60%", "85%"],
                btn: ["确定","关闭"],
                yes:function (index, layero) {
                    var verify = layero.find("iframe").contents().find("#LAY-app-workorder-submit");
                    verify.click();
                }
            });
        },
        initActive : function () {
            table.on('tool(testFilter)', function(obj){
                var data = obj.data;
                if(obj.event === 'deleteLabel'){
                    layer.confirm("确定删除 " + data.label + " 吗?",{icon : 3,title : '提示'},function (index) {
                        request.post("/modular/deletePropertiesLabel",{application : data.application, label : data.label}).then(function (res) {
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
        }
    };


    $("a[name='operation']").on('click',function () {
        var type = $(this).attr('layer-event');
        if(type){
            active[type] ? active[type].call(this) : '';
        }
    });

    active.init();

});