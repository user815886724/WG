layui.extend({
    base: 'scripts/base',
}).use(['base','jquery','request','element'],function () {
    var $ = layui.jquery;
    var request = layui.request;
    var element = layui.element;

    // 跳转配置
    element.on('nav(menu)',function (e) {
        $("iframe").attr("src",$(e).attr("data_url"));
        removeSm();
    });

    // request.post('/test/server/function',{data:123}).then(function (result) {
    //
    // });


    function initFlexible(){
        if(document.body.clientWidth < 992){
            if(!$("#LAY_app").hasClass("layadmin-side-spread-sm")){
                if($("#LAY_app_flexible").hasClass("layui-icon layui-icon-shrink-right")){
                    $("#LAY_app_flexible").removeClass("layui-icon layui-icon-shrink-right");
                    $("#LAY_app_flexible").addClass("layui-icon layui-icon-spread-left");
                }
            }else{
                if($("#LAY_app_flexible").hasClass("layui-icon layui-icon-spread-left")){
                    $("#LAY_app_flexible").removeClass("layui-icon layui-icon-spread-left");
                    $("#LAY_app_flexible").addClass("layui-icon layui-icon-shrink-right");
                }
            }
        }
    }

    function initShade() {
        if(document.body.clientWidth > 992){
            removeSm()
        }
    }
    function removeSm() {
        if ($("#LAY_app").hasClass("layadmin-side-spread-sm")){
            $("#LAY_app").removeClass("layadmin-side-spread-sm");
            if($("#LAY_app_flexible").hasClass("layui-icon layui-icon-shrink-right")){
                $("#LAY_app_flexible").removeClass("layui-icon layui-icon-shrink-right");
                $("#LAY_app_flexible").addClass("layui-icon layui-icon-spread-left");
            }
        }
    }
    initFlexible();
    $(window).resize(function () {
        initFlexible();
        initShade();
    });



    var active = {
        flexible : function () {
           if(document.body.clientWidth > 992){
               if($("#LAY_app").hasClass("layadmin-side-shrink")){
                   $("#LAY_app").removeClass("layadmin-side-shrink");
                   if($("#LAY_app_flexible").hasClass("layui-icon layui-icon-spread-left")){
                       $("#LAY_app_flexible").removeClass("layui-icon layui-icon-spread-left");
                       $("#LAY_app_flexible").addClass("layui-icon layui-icon-shrink-right");
                   }
               }else{
                   $("#LAY_app").addClass("layadmin-side-shrink");
                   if($("#LAY_app_flexible").hasClass("layui-icon layui-icon-shrink-right")){
                       $("#LAY_app_flexible").removeClass("layui-icon layui-icon-shrink-right");
                       $("#LAY_app_flexible").addClass("layui-icon layui-icon-spread-left");
                   }
               }
           }else{
               if ($("#LAY_app").hasClass("layadmin-side-spread-sm")){
                   $("#LAY_app").removeClass("layadmin-side-spread-sm");
                   if($("#LAY_app_flexible").hasClass("layui-icon layui-icon-shrink-right")){
                       $("#LAY_app_flexible").removeClass("layui-icon layui-icon-shrink-right");
                       $("#LAY_app_flexible").addClass("layui-icon layui-icon-spread-left");
                   }
               }else {
                   $("#LAY_app").addClass("layadmin-side-spread-sm");
                   if($("#LAY_app_flexible").hasClass("layui-icon layui-icon-spread-left")){
                       $("#LAY_app_flexible").removeClass("layui-icon layui-icon-spread-left");
                       $("#LAY_app_flexible").addClass("layui-icon layui-icon-shrink-right");
                   }
               }
           }
        },
        open : function () {
            if($("#LAY_app").hasClass("layadmin-side-shrink")){
                $("#LAY_app").removeClass("layadmin-side-shrink")
                if($("#LAY_app_flexible").hasClass("layui-icon layui-icon-spread-left")){
                    $("#LAY_app_flexible").removeClass("layui-icon layui-icon-spread-left")
                    $("#LAY_app_flexible").addClass("layui-icon layui-icon-shrink-right")
                }
            }
        },
        shade:function () {
            if ($("#LAY_app").hasClass("layadmin-side-spread-sm")){
                $("#LAY_app").removeClass("layadmin-side-spread-sm");
                if($("#LAY_app_flexible").hasClass("layui-icon layui-icon-shrink-right")){
                    $("#LAY_app_flexible").removeClass("layui-icon layui-icon-shrink-right");
                    $("#LAY_app_flexible").addClass("layui-icon layui-icon-spread-left");
                }
            }
        },
        refresh : function () {
            
        }
    };


    $('.layui-nav-item,.layui-nav-item a,.layadmin-body-shade').on('click', function(){
        var type = $(this).attr('layadmin-event');
        if(type){
            active[type] ? active[type].call(this) : '';
        }
    });
});