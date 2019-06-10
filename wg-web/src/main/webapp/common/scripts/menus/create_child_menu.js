layui.define(['form', 'jquery', 'request', 'utils'], function (exports) {
    var $ = layui.jquery;
    var form = layui.form;
    var request = layui.request;
    var layer = layui.layer;
    var utils = layui.utils;

    var parentId = utils.getUrlParams().parentId;
    var render = {
        control: function () {
            render.bindEvent();
            form.render();
        },
        bindEvent: function () {
            var self = this;
            //监听提交
            form.on('submit(LAY-app-workorder-submit)', function (data) {
                var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                var field = data.field; //获取提交的字段
                var url = '';
                if (parentId) {
                    field.parentId = parentId;
                }
                url = '/menu/createMenu';
                request(url, {
                    method: 'POST',
                    data: field
                }).then(function (result) {
                    if (result.success) {
                        parent.layer.msg('保存成功', {
                            icon: 1,
                            shade: 0.4,
                            time: 1000
                        }, function () {
                            parent.reloadTree();
                            parent.layer.close(index); //再执行关闭
                        });
                    } else {
                        layer.alert(result.message);
                    }
                });
            });
        }
    };

    exports('childMenuAdd', {
        control: function () {
            render.control();
        }
    });
});