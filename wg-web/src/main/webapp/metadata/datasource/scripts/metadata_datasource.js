var active;
layui.extend({
    base: '../../common/scripts/base'
}).use(['base','jquery','request','element','dsTable','utils'],function () {
    var $ = layui.jquery;
    var element = layui.element;
    var request = layui.request;
    var table = layui.dsTable;
    var utils = layui.utils;

    var type = utils.getUrlParams().type;
    var typeName = utils.getUrlParams().typeName;


    active = {
        init : function () {
            var self = this;
            self.initTable();
            self.initDetail();
            self.initActive();
        },
        initDetail : function () {
            $("#desc").html(typeName + " ");
        },
        initTable : function () {
            table.render({
                elem: '#test',
                id: 'tableReload',
                url: '/WG_METADATA/datasource/getDatasourceListPage',
                autoSort: false,
                where : {
                    type : type
                },
                done: function() {
                },
                cols: [[
                    {type:'checkbox'},
                    {field:'datasourceName', title:'数据源名称'},
                    {field:'typeCode', title:'数据源类型'},
                    {field:'description',title:'描述'},
                    {field:'createTime', title:'创建时间',templet : function (data) {
                        return renderTime(data.createTime);
                    }},
                    {fixed: 'right', title:'操作', toolbar: '#barDemo', width:130}
                ]],
                page: true
            });
        },
        create : function () {
            layer.open({
                type: 2,
                title: '创建'+ type +'数据源',
                content: "./create_datasource.html?type=" + type,
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
                ids.push(o.datasourceId);
            });
            ids = ids.join(",");
            layer.confirm("确定删除该" + checkStatus.data.length + "个数据源吗?",{icon : 3,title : '提示'},function (index) {
                request.post("/WG_METADATA/datasource/deleteDatasources",{ids : ids}).then(function (res) {
                    layer.msg(res.message)
                    if(res.success){
                        active.init();
                    }
                });
            });
        },
        initActive : function () {
            table.on('tool(testFilter)', function(obj){
                var data = obj.data;
                if(obj.event === 'deleteDatasource'){
                    layer.confirm("确定删除 " + data.datasourceName + " 吗?",{icon : 3,title : '提示'},function (index) {
                        request.post("/WG_METADATA/datasource/deleteDatasource",{datasourceId:data.datasourceId}).then(function (res) {
                            layer.close(index);
                            if(res.success){
                                layer.msg('删除成功！', { time: 1000 });
                                active.init();
                            }else{
                                layer.alert(res.message, {title: '删除失败'});
                            }
                        });
                    });
                }else if(obj.event == 'editDatasource'){
                    layer.open({
                        type: 2,
                        title: '创建'+ type +'数据源',
                        content: "./create_datasource.html?type=" + type,
                        area: ["60%", "85%"],
                        btn: ["确定","关闭"],
                        yes:function (index, layero) {
                            var verify = layero.find("iframe").contents().find("#LAY-app-workorder-submit");
                            verify.click();
                        }
                    });
                }

            });
        },
        reload :function () {
            table.reload('tableReload',{
                page : {
                    curr : 1
                },
                where : {
                    name : $("#searchTxt").val()
                }
            })
        }
    };

    $("a[name='operation']").on('click',function () {
        var type = $(this).attr('layer-event');
        if(type){
            active[type] ? active[type].call(this) : '';
        }
    });

    function renderTime (date) {
        if(date){
            var dateee = new Date(date).toJSON();
            return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        }else{
            return "";
        }
    }


    $("#datasourceBack").on('click',function () {
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    });


    $('.layui-pro-list-toolbar .layui-btn').on('click', function(){
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });


    active.init();

});