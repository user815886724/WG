layui.define(['laytpl', 'jquery'], function (exports) {
  var laytpl = layui.laytpl;
  var $ = layui.jquery;
  var BASE_CLASS_PRE = '.ds-portal-filter';
  var wrapEle = BASE_CLASS_PRE + '-wrap',
    itemWrapEle = BASE_CLASS_PRE + '-item-wrap',
    itemEle = BASE_CLASS_PRE + '-item',
    valueWrapEle = BASE_CLASS_PRE + '-value-wrap',
    commonEle = itemEle + '.common',
    commonFilterWrap = '[lay-filter=value-wrap]',
    commonListWrap = '[lay-filter=value-list]',
    moreBtnEle = '[data-event-type=showMoreWrap]',
    selectedWrap = wrapEle + ' ' + BASE_CLASS_PRE + '-selected',
    filterUl = 'ul.filter-list';

  var defaultCheckedCode = 'checked';   // 表示默认选中的字段
  var defaultOpts = {
    elem: '',                 // 组件选择器
    data: {},                 // 全部筛选项数据
    fields: [[], []],         // 配置项，数组第一项以一整行展示，第二项全部在最后一行展示。例如 [[{checkedCode: 'checked', code: 'dataCode1',field: 'id',label:'label',title:'title'}],[{code: 'dataCode1',field: 'id',label:'label',title:'title'}]]
    commonText: '',           // 最后一行标题
    unexpand: false,          // 是否默认收起
    handleClickNode: null,    // 点击选项事件，返回所有已选项，例如： function(filters) { console.log(filters) }
    defaultChecked: false,    // 默认选中项，例如： { dataCode1: ['fieldId1', 'fieldId2', 'fieldId2'], dataCode2: ['fieldId1'] }
    isDefaultClick: false     // 第一次渲染后是否执行回调
  };
  var options;
  var selectedFilters = {};

  var eventer = {
    // 更多
    showMoreWrap: function () {
      var $wrap = $(this).parents(itemEle);
      if ($wrap.hasClass('more')) {
        $wrap.removeClass('more');
      } else {
        $wrap.addClass('more');
      }
    },
    // 清空筛选项
    emptySelectedFilters: function () {
      var $ele = $(options.elem);
      var data = options.data;
      var callback = options.handleClickNode;
      var $selectedTags = $ele.find(itemEle).find('li.active');
      var $selectedWrap = $(options.elem).find(selectedWrap);
      if ($selectedTags) {
        $selectedTags.removeClass('active');
        $selectedWrap.empty();
      }

      for (var i in data) {
        selectedFilters[i] = '';
      }
      callback && callback(selectedFilters);
    },
    // 展开/收起
    unexpandWrap: function (self) {
      var $wrap = $(options.elem).find(itemWrapEle);
      var type = $(this).data('type');
      var nextType = '';
      if (type == 'unexpand') {
        $wrap.slideUp();
        nextType = 'expand';
      } else {
        $wrap.slideDown();
        nextType = 'unexpand';
      }
      self.renderMoreBtn();
      $(this).data('type', nextType);
      $(this).find('span.' + type).addClass('layui-hide').siblings().removeClass('layui-hide');
    },
  };

  // 相应操作
  var render = {
    // 点击选项
    handleClickNode: function (code, $box) {
      var callback = options.handleClickNode;
      var $wrap = $(options.elem).find(selectedWrap);
      var label = $(this).text();
      var filterId = $(this).data('filter');
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        $wrap.find('a[data-code=' + code + '][data-filter=' + filterId + ']').remove();
      } else {
        $(this).addClass('active');
        var $tag = $('<a href="javascript:;" class="layui-btn layui-btn-primary layui-btn-xs" data-filter="' + filterId + '" data-code="' + code + '">' + label + '<i class="dsicon dsicon-close"></i></a>');
        $tag.on('click', function () {
          $box.find('li.active[data-filter=' + filterId + ']').click();
          $(this).remove();
        });
        $wrap.append($tag);
      }

      var $selectedTags = $box.find('li.active');
      var temp = [];
      if ($selectedTags && $selectedTags.length) {
        $.each($selectedTags, function (i, item) {
          var filter = $(item).data('filter');
          if (filter !== undefined) {
            temp.push(filter);
          }
        });
      }

      selectedFilters[code] = temp.join(',');
      callback && callback(selectedFilters);
    },
    handleSelectedNode: function () {
      var $wrap = $(options.elem).find(selectedWrap);
      var filterId = $(this).data('filter'), code = $(this).parents(filterUl).data('code'), label = $(this).text();
      var $box = $(this).parent(filterUl + '[data-code=' + code + ']');
      var $tag = $('<a href="javascript:;" class="layui-btn layui-btn-primary layui-btn-xs" data-filter="' + filterId + '" data-code="' + code + '">' + label + '<i class="dsicon dsicon-close"></i></a>');

      $(this).addClass('active');
      $tag.on('click', function () {
        $box.find('li.active[data-filter=' + filterId + ']').click();
        $(this).remove();
      });
      if (code) {
        $wrap.append($tag);
      }
      var $selectedTags = $box.find('li.active');
      var temp = [];
      if ($selectedTags && $selectedTags.length) {
        $.each($selectedTags, function (i, item) {
          var filter = $(item).data('filter');
          if (filter !== undefined) {
            temp.push(filter);
          }
        });
      }

      selectedFilters[code] = temp.join(',');
    },
    // 渲染最后一行的选择项
    renderDropdownFilter: function (item) {
      var self = this;
      var $ele = $(options.elem);
      var $wrap = $ele.find(commonListWrap);
      var code = item.code, field = item.field, label = item.label, checkedCode = item.checkedCode || defaultCheckedCode;
      var data = options.data && options.data[code];
      var $list = $wrap.find(filterUl + '[data-code=' + code + ']');

      if (data && data.length && $list.length < 1) {
        var $box = $('<ul class="filter-list" data-code="' + code + '"></ul>');
        $box.empty();
        $.each(data, function (i, item) {
          var $li = $('<li data-filter="' + item[field] + '">' + item[label] + '</li>');
          $li.on('click', function () {
            self.handleClickNode.call(this, code, $box);
          });
          $box.append($li);

          if (checkedCode && item[checkedCode]) {
            // $li.click();
            self.handleSelectedNode.call($li);
          }
        });
        $box.on('mouseenter', function () {
          $ele.find(commonFilterWrap).find('[data-code=' + code + ']').addClass('active');
        }).on('mouseleave', function () {
          $ele.find(commonFilterWrap).find('[data-code=' + code + ']').removeClass('active');
        });
        $wrap.append($box);
      }
    },
    renderFilterItem: function (isCommon, fields) {
      var self = this;
      var datas = options.data;
      var $ele = $(options.elem);
      var $wrap = $ele.find(commonFilterWrap);

      if (!fields || !fields.length) {
        return;
      }

      $wrap.empty();
      fields.forEach(function (item, i) {
        var code = item.code, label = item.label, field = item.field, title = item.title, checkedCode = item.checkedCode || defaultCheckedCode;
        var data = datas && datas[code];
        // 最后一行
        if (isCommon) {
          if ($wrap.length) {
            var $trigger = $('<li data-code="' + code + '">' + title + '<i class="dsicon dsicon-down"></i><i class="dsicon dsicon-up"></i></li>');

            $trigger.on('mouseenter', function () {
              var $wrap = $(this).parents(itemEle);
              var $listWrap = $(options.elem).find(commonListWrap);
              $wrap.addClass('active');
              $(this).addClass('active').siblings().removeClass('active');
              $listWrap.find(filterUl + '[data-code=' + code + ']').show().siblings().hide();
            });
            self.renderDropdownFilter.call(self, item);
            $wrap.append($trigger);
          }
        } else {
          // 其他
          if (data && data.length) {
            var $box = $ele.find(filterUl + '[data-code=' + code + ']');
            $box.empty();
            data.forEach(function (liItem, idx) {
              var $li = $('<li data-filter="' + (field && liItem[field]) + '">' + (label && liItem[label]) + '</li>');
              $li.on('click', function () {
                self.handleClickNode.call(this, code, $box);
              });
              $box.append($li);

              // 默认选中
              if (checkedCode && liItem[checkedCode]) {
                // $li.click();
                self.handleSelectedNode.call($li);
              }
            });
          }
        }

      });
    },
    renderFilters: function () {
      var self = this;
      var fields = options.fields[0];
      var extra = options.fields[1];

      self.renderFilterItem(false, fields);
      self.renderFilterItem(true, extra);
    },
    // 是否显示更多按钮
    renderMoreBtn: function () {
      setTimeout(function () {
        $.each($(options.elem + ' ' + valueWrapEle + ' > ul'), function (i, item) {
          var parentW = $(valueWrapEle).width();
          var itemW = $(item).width();
          if (itemW >= (parentW - 32)) {
            $(this).parents(itemEle).find(moreBtnEle).css('display', 'inline');
          } else {
            $(this).parents(itemEle).find(moreBtnEle).css('display', 'none');
          }
        });
      }, 0);
    },
    setDefaultValue: function () {
      var self = this;
      var $ele = $(options.elem);
      var defaultChecked = options.defaultChecked;
      var isDefaultClick = options.isDefaultClick;
      var callback = options.handleClickNode;

      if (defaultChecked) {
        for (var i in defaultChecked) {
          var data = defaultChecked[i];
          if (data && data.length) {
            var code = i;
            selectedFilters[code] = defaultChecked[i].join(',');
            data.forEach(function (item) {
              var filterId = item;
              var $li = $ele.find(filterUl + '[data-code=' + code + ']').find('li[data-filter=' + filterId + ']');
              if ($li && !$li.hasClass('active')) {
                self.handleSelectedNode.call($li);
              }
            });
          }
        }
        callback && callback(selectedFilters);
      }
    },
    // 绑定事件
    bindEvent: function () {
      var self = this;
      var ele = options.elem;
      $(ele + ' ' + wrapEle).on('click', '.layui-btn', function () {
        var type = $(this).data('event-type');
        eventer[type] && eventer[type].call(this, self);
      });

      $(commonEle).on('mouseleave', function () {
        $(this).removeClass('active');
        $(this).find(commonFilterWrap).find('li').removeClass('active');
      });

      self.renderMoreBtn();
    },
  };

  // css
  layui.link(layui.cache.paths.extendPath + '/ds-portal-filter/index.css');
  exports('dsPortalFilter', {
    render: function (opts) {
      var $elem = $(opts.elem);
      var data = opts.data;
      var fields = opts.fields[0];
      var extra = opts.fields[1];
      var commonText = opts.commonText;

      options = $.extend(defaultOpts, opts);
      if (!data) {
        return;
      }

      selectedFilters = {};
      for (var i in data) {
        selectedFilters[i] = '';
      }

      laytpl(
        '<div class="ds-portal-filter-wrap">' +
        '<div class="ds-portal-filter-tool-bar">' +
        '<div class="ds-portal-filter-selected"></div>' +
        '<a href="javascript:;" class="layui-btn layui-btn-xs" data-event-type="emptySelectedFilters">清空筛选<i class="dsicon dsicon-delete"></i></a>' +
        '<a href="javascript:;" class="layui-btn layui-btn-xs layui-btn-primary" data-event-type="unexpandWrap" data-type="{{d.unexpand ? \'expand\' : \'unexpand\'}}"><span class="expand {{(!d.unexpand ? \'layui-hide\' : \'\')}}">显示筛选<i class="dsicon dsicon-down"></i></span><span class="unexpand {{d.unexpand ? \'layui-hide\' : \'\'}}">收起筛选<i class="dsicon dsicon-up"></i></span></a>' +
        '</div>' +
        '<div class="ds-portal-filter-item-wrap" style="{{d.unexpand ? \'display: none\' : \'\'}}">' +
        '{{#  if(d.fields && d.fields.length > 0){ }}' +
        '{{#  layui.each(d.fields, function(index, item){ }}' +
        '<div class="ds-portal-filter-item">' +
        '<div class="ds-portal-filter-title">{{item.title || \'\'}}</div>' +
        '<div class="ds-portal-filter-value-wrap">' +
        '<ul class="filter-list" data-code="{{item.code}}"></ul>' +
        '</div>' +
        '<div class="ds-portal-filter-item-operate">' +
        '<a href="javascript:;" class="layui-btn layui-btn-xs layui-btn-primary" data-event-type="showMoreWrap">' +
        '<span class="unexpand"><i class="dsicon dsicon-up"></i>收起</span>' +
        '<span class="expand"><i class="dsicon dsicon-down"></i>更多</span>' +
        '</a>' +
        '</div>' +
        '</div>' +
        '{{#  }); }}' +
        '{{#  } }}' +
        '{{#  if(d.extra && d.extra.length > 0){ }}' +
        '<div class="ds-portal-filter-item common">' +
        '<div class="ds-portal-filter-title">{{d.commonText || \'\'}}</div>' +
        '<div class="ds-portal-filter-value-wrap">' +
        '<ul class="filter-list" lay-filter="value-wrap"></ul>' +
        '</div>' +
        '<div class="ds-portal-filter-value-list" lay-filter="value-list"></div>' +
        '</div>' +
        '{{#  } }}' +
        '</div>' +
        '</div>'
      ).render({
        data: data,
        fields: fields,
        extra: extra,
        unexpand: options.unexpand,
        commonText: commonText
      }, function (string) {
        $elem.empty();
        $elem.html(string);
        render.renderFilters();
        render.bindEvent();
        if (options.defaultChecked) {
          render.setDefaultValue();
        } else {
          if (options.isDefaultClick) {
            var callback = options.handleClickNode;
            callback && callback(selectedFilters);
          }
        }
      });
    },
    getSelected: function () {
      return selectedFilters;
    }
  });
});