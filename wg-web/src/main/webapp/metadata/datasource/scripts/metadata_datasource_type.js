var active;
layui.extend({
    base: '../../common/scripts/base'
}).use(['base','jquery','request','element','laytpl'],function () {
    var $ = layui.jquery;
    var element = layui.element;
    var laytpl = layui.laytpl;
    var request = layui.request;


    active = {
        init : function () {
            var self = this;
            self.initCount();
            self.initTypeList();
        },
        initCount : function () {
            request.post('/WG_METADATA/datasource/getDatasourceCount').then(function (res) {
                if(res){
                    if(res.datasourceTypeCount){
                        $("#classCount").html(res.datasourceTypeCount);
                        $("#listCount").html(res.datasourceCount);
                    }
                }
            });
        },
        initTypeList : function () {
            request.post('/WG_METADATA/datasource/getDatasourceTypeList').then(function (res) {
                laytpl(window["classData"].innerHTML).render({ list: res },function(html) {
                    document.querySelector('[tpl-id="classData"]').innerHTML = html;
                });
            });
        },
        getDatasourceList : function (type,typeName) {
            layer.open({
                type: 2,
                title: false,
                area: ['100%', '100%'],
                anim: 5,
                shade: false,
                isOutAnim: false,
                skin: 'layui-pro-layer-fixed',
                content: "./metadata_datasource.html?type=" + type + "&typeName=" + typeName
            });
        }
    };
    active.init();
});