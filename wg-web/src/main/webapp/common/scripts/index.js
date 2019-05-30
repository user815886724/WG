layui.extend({
    base: 'scripts/base',
}).use(['base','jquery','request'],function () {
    var $ = layui.jquery;
    var request = layui.request;

    request.post('/daasMetadata/server/function',{data:123}).then(function (result) {

    });
});