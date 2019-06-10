layui.define(['base', 'dsTable', 'request','indexTree','laytpl','layer','iconPicker'], function(exports) {
    var $ = layui.jquery;
    var form = layui.form;
    var request = layui.request;
    var layer = layui.layer;

    var id = '';
    var functionId = '';
    var hasChild = '';
    var iconPicker = layui.iconPicker;



    iconPicker.render({
        // 选择器，推荐使用input
        elem: '#iconPicker',
        // 数据类型：fontClass/unicode，推荐使用fontClass
        type: 'fontClass',
        // 是否开启搜索：true/false，默认true
        search: true,
        // 是否开启分页：true/false，默认true
        page: true,
        // 每页显示数量，默认12
        limit: 12,
        // 每个图标格子的宽度：'43px'或'20%'
        cellWidth: '43px',
        // 点击回调
        click: function (data) {
            console.log(data);
        },
        // 渲染成功后的回调
        success: function(d) {
            console.log(d);
        }
    });




    // 渲染表格结构
    var render = {
        control:function () {
            if(id){
                render.edit();
            }
            render.bindEvent();
            var list = document.getElementById("template");
            Sortable.create(list,
                {
                    animation: 150, //动画参数
                });
        },
        edit:function () {
            if(hasChild == '1'){
                $("#childOrder").removeAttr('style');
            }else{
                $("#childOrder").css('display','none');
            }
            request.post('/menu/GetMenuDetail',{id:id}).then(function(result) {
                if(result.success){
                    // $("#thismenu").text(result.details.title);
                    var detail = result.details
                    form.val("memuForm",detail);
                    if(detail.isOpen && detail.isOpen == 1){
                        $("input[name='isOpen'][value='1']").attr("checked",true);
                        $("input[name='isOpen'][value='0']").attr("checked",false);
                    }else {
                        $("input[name='isOpen'][value='0']").attr("checked",true);
                        $("input[name='isOpen'][value='1']").attr("checked",false);
                    }
                    if(detail.parentId){
                        $("#icon").hide();
                        $("#menuTip").hide();
                        $("#men_url").show();
                    }else{
                        $("#men_url").hide();
                        $("#icon").show();
                        $("#menuTip").show();
                    }
                    /**
                     * 选中图标 （常用于更新时默认选中图标）
                     * @param filter lay-filter
                     * @param iconName 图标名称，自动识别fontClass/unicode
                     */
                    if(detail.icon){
                        iconPicker.checkIcon('iconPicker',detail.icon);
                    }else{
                        iconPicker.checkIcon('iconPicker', '');
                    }
                    form.render();
                }else {
                    layer.msg(result.message)
                }
            });
            //单独处理子菜单排序
            // if(hasChild == '1'){
            //     request.post('/daasIam/ListChildMenu',{id:id}).then(function(result) {
            //         var li = '';
            //         $.each(result,function (i,temp) {
            //             li += '<li id='+temp.id+' name="childmenus" style="margin-left: 20px">'+temp.title+'</li>';
            //         })
            //         $("#template").empty();
            //         $("#template").append(li);
            //     });
            // }
        },
        bindEvent:function () {
            var self = this;
            //监听选择
            $("#selectUrl").on('click',function () {
                layer.open({
                    title: "链接到业务功能页面",
                    type: 2,
                    content: './function_tree_select.html?functionId='+functionId,
                    btn: ['保存', '取消'],
                    area: ['540px', "740px"],
                    yes: function(index, layero) {
                        var verify = layero.find("iframe").contents().find('#selectTxt');
                        var data = verify.val();
                        if(data!=''){
                            $("#functionName").val(data.split(',')[1]);
                            $("#url").val(data.split(',')[0]);
                            layer.close(index);
                        }
                    }
                });
            });
            //监听提交
            form.on('submit(LAY-app-workorder-submit)', function(data){
                var field = data.field; //获取提交的字段
                field.id = id;
                if(field.pluginCode ==""){
                    delete field.pluginCode;
                }
                new Promise(function(resolve, reject) {
                    request('/menu/UpdateMenuDetail', {
                    method: 'POST',
                        data: field
                }).then(function(result) {
                    if(result){
                        resolve();
                    }
                });
                if(hasChild == '1'){
                    var ids = [];
                    $("li[name='childmenus']").each(function()
                    {
                        var value = $(this).attr('id');
                        ids.push(value);
                    });
                    request('/daasIam/UpdateSiteMapOrder', {
                        method: 'POST',
                        data: {menuIds:ids.join(",")}
                    }).then(function(result) {
                        if(result){
                            resolve();
                        }
                    });
                }

            }).then(function () {
                    layer.msg('保存成功', {
                        icon: 1,
                        shade: 0.4,
                        time: 1000
                    }, function() {
                        render.edit();
                    });
                });
            });
        },
    }


    exports('indexForm', {
        control: function() {
            render.control();
        },
        handleFilterTable: function(node, DEFAULT_ALL_KEY) {
            var data = node.data && node.data.currentData;
            id = data.id;
            if(id == 'root'){
                $("#rootMemu").css('display','');
                $("#memuForm").css('display','none');
                return false;
            }
            $("#rootMemu").css('display','none');
            $("#memuForm").removeAttr('style');
            hasChild = data.hasChild;
            $("#memuForm")[0].reset();
            render.edit();
        }
    });
});