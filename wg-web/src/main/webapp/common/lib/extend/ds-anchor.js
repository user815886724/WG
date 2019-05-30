;layui.define(['jquery'], function (exports) {
  var $ = layui.jquery;

  var NAV_ITEM = '[lay-anchor-name]';
  var defaultOpts = {
    layId: '',
    scrollTime: 200,
    scrollSpy: false,
    navFixedClassName: '',
    win: window
  };

  exports('dsAnchor', {
    render: function (options) {
      this.options = $.extend({}, defaultOpts, options);
      
      var layId = this.options.layId;
      var anchorElement = $('[lay-anchor=' + layId + ']');
      var navElement = $(anchorElement).find('[lay-anchor-nav]').length ? $(anchorElement).find('[lay-anchor-nav]') : $(anchorElement);
      this._anchorNavTop = $(navElement).offset().top;
      this._anchorNavH = $(navElement).height();
      this.element = anchorElement;
      this.navElement = navElement;
      this.init();
    },
    init: function (options) {
      var self, options, element, navElement, $anchorItem, anchorNavH, scrollTime;
      self = this;
      options = self.options;
      element = self.element;
      navElement = self.navElement;
      scrollTime = options.scrollTime;

      $anchorItem = navElement.find(NAV_ITEM);
      anchorNavH = self._anchorNavH;
      $("html,body").animate({ scrollTop: 0 }); //初始化滚动条置顶

      $anchorItem.on('click', function (e) {
        var target, targetOffset, targetTop;

        target = $(this).attr('lay-anchor-name');
        
        if (target !== undefined) {
          e.preventDefault();
          $(this).addClass('active').siblings().removeClass('active');
          // 定义将要去的描点位置
          targetOffset = $(element).find('[lay-anchor-id=' + target + ']').offset();
          targetTop = targetOffset.top;
        }
        $('html, body').stop().animate({
          scrollTop: targetTop - anchorNavH
        }, scrollTime);
      });

      if (options.scrollSpy) {
        var scrollItems;
        scrollItems = [];

        $anchorItem.each(function () {
          var scrollItemId = $(this).attr('lay-anchor-name');
          scrollItems.push($(element).find('[lay-anchor-id=' + scrollItemId + ']'));
        });

        $(options.win).on('scroll', function () {
          // self.scrollspy($anchorItem, scrollItems);
          self.fixedNav($anchorItem, scrollItems);
        });
      }
    },

    scrollspy: function (navItem, scrollItems) {
      var scrollPos, anchorNavH, i, l;
      scrollPos = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
      anchorNavH = this._anchorNavH;
      l = navItem.length;

      for (i = 0; l > i; i++) {
        var item = scrollItems[i];
        var itemTop = item.offset().top - anchorNavH;
        if (scrollPos > itemTop) {
          // console.log('i=', i)
          // navItem.removeClass('active');
          // $(navItem).eq(i).addClass('active');
        }
      }
    },

    fixedNav: function (navItem, scrollItems) {
      var self, options, win, navElement, targetTop, scrollPos;
      self = this;
      options = self.options;
      win = options.win;
      navElement = self.navElement;
      targetTop = self._anchorNavTop;
      scrollPos = $(win).scrollTop() || (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
      if (targetTop <= scrollPos) {
        $(navElement).addClass(options.navFixedClassName);
      } else {
        $(navElement).removeClass(options.navFixedClassName);
      }
    },
  });
});  