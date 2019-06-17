layui.extend({
    base: 'scripts/base',
}).use(['base','jquery','request','element'],function () {
    var $ = layui.jquery;
    var request = layui.request;
    var element = layui.element;

    // 跳转配置
    element.on('nav(menu)',function (e) {
        if($(e).attr("data_url")){
            $("iframe").attr("src",$(e).attr("data_url"));
            removeSm();
        }
    });

    request.post('/menu/getMenuList').then(function (result) {
        if(result.success){
            if(result.details){
                var menus = result.details;
                var html = "";
                for(var i in menus){
                    var openItem = "";
                    if(menus[i].isOpen == 1){
                        openItem = "layui-nav-itemed";
                    }else{
                        openItem = "";
                    }
                    var menuHtml = parentMenuHtml.replace("${open}",openItem).replace("${icon}",menus[i].icon).replace("${menuName}",menus[i].menuName);
                    var childrenHtml = "";
                    if(menus[i].children){
                        for(var ci in menus[i].children){
                            childrenHtml += childrenItemHtml.replace("${dataUrl}",menus[i].children[ci].dataUrl).replace("${menuName}",menus[i].children[ci].menuName);
                        }
                    }
                    menuHtml = menuHtml.replace("${childrenItem}",childrenHtml);
                    html += menuHtml;
                }
                $("#menuMain").html(html);
                $("li[name='menuParentItem']").on('click', function(){
                    var type = $(this).attr('layadmin-event');
                    if(type){
                        active[type] ? active[type].call(this) : '';
                    }
                });
                element.render();
            }
        }else{
            layer.alert(result.message, {icon: 5});
        }
    });


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
        about : function () {
            $(".layui-this").removeClass("layui-this");
            $("iframe").attr("src","console_main.html");
        },
        refresh : function () {
            var url = $("iframe").attr("src");
            $("iframe").attr("src",url);
        },
        fullscreen:function () {
            if($("#fullscreen").hasClass("layui-icon layui-icon-screen-restore")){
                $("#fullscreen").removeClass("layui-icon layui-icon-screen-restore")
                $("#fullscreen").addClass("layui-icon layui-icon-screen-full")
                exitFullscreen()
            }else{
                $("#fullscreen").removeClass("layui-icon layui-icon-screen-full")
                $("#fullscreen").addClass("layui-icon layui-icon-screen-restore")
                launchFullScreen(document.documentElement)
            }
        }
    };


    $('.layui-nav-item,.layui-nav-item a,.layadmin-body-shade').on('click', function(){
        var type = $(this).attr('layadmin-event');
        if(type){
            active[type] ? active[type].call(this) : '';
        }
    });


    var parentMenuHtml = "<li class='layui-nav-item ${open}' layadmin-event='open' name='menuParentItem'>" +
        "<a href='javascript:;'><i class='layui-icon ${icon}'></i><cite>${menuName}</cite></a>" +
        "<dl class='layui-nav-child'>${childrenItem}</dl></li>";

    var childrenItemHtml = "<dd><a href='javascript:;' data_url='${dataUrl}'>${menuName}</a></dd>";
});
// 全屏方法
function launchFullScreen(element) {
    if(element.requestFullscreen) {
        element.requestFullscreen();
    } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if(element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if(element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}
// 退出全屏
function exitFullscreen() {
    var elem=document;
    if(elem.webkitCancelFullScreen){
        elem.webkitCancelFullScreen();
    }else if(elem.mozCancelFullScreen){
        elem.mozCancelFullScreen();
    }else if(elem.cancelFullScreen){
        elem.cancelFullScreen();
    }else if(elem.exitFullscreen){
        elem.exitFullscreen();
    }
}