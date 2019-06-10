layui.define(['base', 'request', 'eleTree','layer'], function(exports) {
    var $ = layui.jquery;
    var request = layui.request;
    var eleTree = layui.eleTree;
    var layer = layui.layer;


    // 定义一个对象，树结构渲染完成后用来存储树对象，方便做其他操作
    var $treeEle = null,
        treeEle = '';
    var DEFAULT_ALL_KEY = '';
    var TREE_OPTIONS = {};


    // 渲染树结构
    var render = {
        treeData: [],
        init: function (options) {
            //禁用浏览器鼠标右键
            $('.layui-pro-tree').bind("contextmenu",function (){
                return false;
            });
            var self = this;
            TREE_OPTIONS = options;
            if (!TREE_OPTIONS || !TREE_OPTIONS.ele) {
                return;
            }
            self.fetchTree().then(function () {
                treeEle = TREE_OPTIONS.ele;
                self.renderTree(TREE_OPTIONS.ele);
                $(document).on("click", '#tree-menu li.add',function(e) {
                    $(this).hide();
                    e.stopPropagation();
                });
                self.treeEvent();
                $(treeEle).find('.eleTree-node[eletree-floor=0]').children('.eleTree-node-content').click();
            });
        },
        reload:function () {
            //禁用浏览器鼠标右键
            $('.layui-pro-layout-basic-left').bind("contextmenu",function (){
                return false;
            });
            var self = this;
            if (!TREE_OPTIONS || !TREE_OPTIONS.ele) {
                return;
            }
            self.fetchTree().then(function () {
                treeEle = TREE_OPTIONS.ele;
                self.reloadTree(TREE_OPTIONS.ele);
                self.treeEvent();
                $(treeEle).find('.eleTree-node[eletree-floor=0]').children('.eleTree-node-content').click();
            });
        },
        renderTree: function(ele) {
            var treeData = this.treeData || [];
            $treeEle = eleTree.render({
                elem: ele,
                data: treeData,
                highlightCurrent: true,
                autoExpandParent: true,
                // 搜索树的方法
                searchNodeMethod: function(value, data) {
                    if (!value) return true;
                    return data.label.toLowerCase().indexOf(value.toLowerCase()) !== -1;
                }
            });
        },
        reloadTree:function (ele) {
            var treeData = this.treeData || [];
            $treeEle.reload({
                elem: ele,
                data: treeData,
                highlightCurrent: true,
                autoExpandParent: true,
                // 搜索树的方法
                searchNodeMethod: function(value, data) {
                    if (!value) return true;
                    return data.label.toLowerCase().indexOf(value.toLowerCase()) !== -1;
                }
            });
        },
        fetchTree: function() {
            var self = this;
            return new Promise(function(resolve, reject){
                request.post('/menu/getMenuTree', {}).then(function(res) {
                    if (res.success) {
                        self.treeData = res.details;
                        resolve();
                    } else {
                        reject(res.details);
                    }
                });
            });
        },
        treeEvent: function () {
            var OPTIONS = TREE_OPTIONS;
            // 搜索节点
            $('.eleTree-search').on('change', function() {
                $treeEle.search('');
                $treeEle.search($(this).val());
            });
            // 展开所有
            $('#expandAllTreeBtn').on('click', function() {
                // $treeEle.expandAll();
                var $icon = $(this).find('i');
                if ($icon.hasClass('dsicon-up')) {
                    // 展开所有
                    $treeEle.expandAll();
                    $icon.addClass('dsicon-down').removeClass('dsicon-up');
                } else {
                    // 合并所有
                    $treeEle.unExpandAll();
                    $(treeEle).find('.eleTree-node[eletree-floor=0]').children('.eleTree-node-content').click();
                    $icon.addClass('dsicon-up').removeClass('dsicon-down');
                }
            });

            // 节点点击事件
            if (OPTIONS.layId && OPTIONS.clickNode) {
                var callback = OPTIONS.clickNode;
                eleTree.on('nodeClick(' + OPTIONS.layId + ')', function (d) {
                    callback && callback(d);
                });
            }


            // 鼠标右键事件
            eleTree.on("nodeContextmenu("+ OPTIONS.layId + ")",function(d) {
                var data = d.data.currentData;
                //  console.log(data);
                var menuStr = '';
                if(data.id == 'root'){
                    menuStr='<ul id="tree-menu">' +
                        '<li class="register"><a href="javascript:;">注册平台</a></li>' +
                        '</ul>';
                }else{
                    menuStr='<ul id="tree-menu">' +
                        '<li class="addNode"><a href="javascript:;">添加子节点</a></li>' +
                        '<li class="remove"><a href="javascript:;">删除</a></li>' +
                        '</ul>';
                }
                $(document).on("click",function() {
                    $("#tree-menu").hide().remove();
                });
                var that=this;
                $("#tree-menu").hide().remove();
                $(document.body).after($(menuStr));
                $("#tree-menu").css({
                    left: d.event.pageX,
                    top: d.event.pageY
                }).show();
                $("#tree-menu li.addNode").off().on("click",function(e) {
                    var index = layer.open({
                        title: "创建子菜单",
                        type: 2,
                        content: './create_child_memu.html?parentId='+data.id+"&portalCode="+data.portalCode,
                        maxmin: true,
                        btn: ['保存', '取消'],
                        area: ['460px', "320px"],
                        yes: function(index, layero) {
                            var verify = layero.find("iframe").contents().find("#LAY-app-workorder-submit");
                            verify.click();
                        }
                    });
                });
                $("#tree-menu li.remove").off().on("click",function(e) {
                    if (data.id) {
                        layer.confirm('确定删除该菜单吗？', function(index) {
                            var deleteParams = { id: data.id };
                            request.post('/daasIam/DeleteSiteMap', deleteParams).then(function(res) {
                                if (res.success) {
                                    layer.close(index);
                                    layer.msg('删除成功！', { time: 1000 });
                                    render.reload();
                                }else{
                                    layer.alert(res.message);
                                }
                            });
                        });
                    } else {
                        // 提示
                    }
                })
                $("#tree-menu li.register").off().on("click",function(e) {
                    var index = layer.open({
                        title: "注册平台",
                        type: 2,
                        content: './register_platform.html',
                        maxmin: true,
                        btn: ['保存', '取消'],
                        area: ['560px', "320px"],
                        yes: function(index, layero) {
                            var verify = layero.find("iframe").contents().find("#LAY-app-workorder-submit");
                            verify.click();
                        }
                    });
                });
            });
        }
    }
    exports('indexTree', {
        init: function (options) {
            render.init(options);
        },
        reload:function () {
            render.reload();
        },
        resizeTree: function(layid, laytreeid) {
            render.resizeTree(layid, laytreeid);
        },
        getTopNodeKey: function() {
            return DEFAULT_ALL_KEY;
        }
    });
});