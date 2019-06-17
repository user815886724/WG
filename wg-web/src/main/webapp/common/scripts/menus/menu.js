layui.extend({
    base: 'scripts/base',
    indexTree : 'scripts/menus/menu_tree',
    indexForm : 'scripts/menus/menu_form'
}).use(['base','indexTree','indexForm','jquery'],function () {
    var indexTree = layui.indexTree;
    var indexForm = layui.indexForm;
    var $ = layui.jquery;

    // 传入回调事件
    indexTree.init({
        ele: '.layui-pro-tree',
        layId: 'treeDom',
        clickNode: function (node) {
            indexForm.handleFilterTable(node, indexTree.getTopNodeKey());
        }
    });
    indexForm.control();

    window.reloadTree = function () {
        indexTree.reload();
    }
    window.renderForm = function () {
        indexForm.init();
    }

    $("#menuBack").on('click',function () {
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    });
});