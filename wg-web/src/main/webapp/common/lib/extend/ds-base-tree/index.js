layui.define(['base', 'laytpl', 'laypage', 'request', 'eleTree'], function (exports) {
  var $ = layui.jquery;
  var laytpl = layui.laytpl;
  var laypage = layui.laypage;
  var request = layui.request;
  var eleTree = layui.eleTree;

  // 定义一个对象，树结构渲染完成后用来存储树对象，方便做其他操作
  var TABLE_LIST_LIST = '.table-attrs-list';
  var $treeEle = null,
    $elem = null,
    treeDatas = [[], []],
    defaultRequestMethod = 'POST',
    defaultGetData = function (res) { return res; },
    defaultPageParam = {
      limit: 10,
      pageIndex: 1,
      sortType: 'asc'
    },
    pageParam = defaultPageParam;

  var defaultOpts = {
    elem: '',                         // [必传]存放组件的dom，id选择器，选择器名称不能带有#符号
    height: '',                       // [必传]中间的列表高度
    search: {                         // [可选]搜索事件，如果为false则表示不渲染搜索组件
      isSearchByApi: false,           // [可选]是否是动态搜索事件，如果为false表示静态搜索，为true则用tree.requestOpts[0]动态搜索
      searchText: '',                 // [可选]搜索框提示文字placeholder
    },
    tree: {                           // [必传]组件树配置
      isCommonEleTree: true,          // [可选]是否是通用树
      eleTreeOpts: null,              // [可选]eleTree树配置, 参考https://layuiextend.hsianglee.cn/eletree/
      requestOpts: [                  // [必传]一二级节点请求的api和参数
        { url: '', getData: function (res) { return res; } },
        { url: '', where: function (params) { return params; }, getData: function (res) { return res; } }
      ],
      idCodes: ['', ''],              // [必传]每个节点的唯一的id字段，如：['tableId', 'id'] 表示一级节点取tableId为唯一id，二级节点取id为唯一id
      labelCodes: ['', ''],           // [必传]每个节点的显示文字字段，如：['name', 'label']，用法如上
      icons: [                        // [可选]一二级节点的图标，由dsicon中选取
        // { icon: 'dsicon-table', style: '' },
        // { icon: 'dsicon-filedone', style: '' },
      ],
      btns: false,                     // [可选]节点右侧操作按钮，需要传入操作图标和事件，每个只展示前两个操作。例如：[{icon: 'dsicon-search', callback: function(node, e) {}},{icon: 'dsicon-search', callback: function(node, e) {}},]
      // btns: [                       // [icon|由dsicon中选取的图标] [style|图标的style样式] [callback|点击图标的回调事件]
      // [                             
      // {
      //   icon: 'dsicon-search',
      //   style: '',
      //   callback: function (node, e, label) {
      //   }
      // },
      // ],
      // [
      // {
      //   icon: 'dsicon-edit',
      //   callback: function (node, e, label) {
      //   }
      // },
      // ]
      // ]
    },
    page: true,                            // [可选]分页配置，传false表示不渲染分页组件，默认为true，默认数量等数据由tree,requestOpts[0]的pageParam取得
    // page: {                             // [可选]分页配置，传false表示不渲染分页组件
    //   page: {},                         // [可选]参考layui.com分页组件，此处删除了回调事件，在组件中已对回调事件进行封装。https://www.layui.com/doc/modules/laypage.html
    //   pageParam: {},                    // [可选]分页请求参数，符合daas接口分页参数规范
    // },
    done: null	                           // [可选]组件渲染完成后的操作，带树对象返回 
  };
  var OPTIONS;

  // 数据处理
  var handleDataForDsTree = function (data, level) {
    var opts, trees, isCommonEleTree, icon, idCode, labelCode, btns, emptText;
    var idx = level || 0;

    trees = data;
    opts = OPTIONS.tree;
    isCommonEleTree = opts && opts.isCommonEleTree;
    emptText = (isCommonEleTree && opts && opts.eleTreeOpts && opts.eleTreeOpts.emptText) || '无数据';

    if (!data || data.length < 1) {
      return [{ id: '', label: '<span class="label none" title="' + emptText + '" data-idx="' + idx + '" data-id="">' + emptText + '</span>' }];
    }
    if (!OPTIONS.tree) {
      return;
    }
    icon = opts.icons && opts.icons[idx];
    idCode = opts.idCodes && opts.idCodes[idx];
    labelCode = opts.labelCodes && opts.labelCodes[idx];
    btns = isCommonEleTree ? [] : opts.btns && opts.btns[idx];

    if (trees && trees.length) {

      trees.forEach(function (t) {
        var label = t[labelCode] || '';
        var tempIcon = icon && icon.icon ? icon.icon : '';
        t.id = t[idCode];
        t.label = '<span class="label" title="' + label + '" data-idx="' + idx + '" data-id="' + t[idCode] + '">';
        if (tempIcon) {
          t.label += '<i class="dsicon ' + tempIcon + '" style="' + (icon && icon.style ? icon.style : '') + '"></i>';
        }
        t.label += label + '</span>';
        if (btns && btns.length) {
          t.label += '<span class="operate" data-idx="' + idx + '">';
          $.each(btns, function (i, btn) {
            if (i < 2) {
              t.label += '<i class="dsicon ' + btn.icon + '" data-event-icon="' + btn.icon + '" style="' + btn.style + '"></i>';
            }
          });
          t.label += '</span>';
        }
      });
    }
    return trees;
  }
  // 数组去重
  var handleUniqueData = function (array) {
    var res = array.filter(function (item, index, array) {
      return array.indexOf(item) === index;
    })
    return res;
  }

  var render = {
    init: function (options) {
      var self = this;
      var page = options.page;
      if (!options || !options.elem) {
        return;
      }
      OPTIONS = $.extend(defaultOpts, options);
      pageParam = page && page.pageParam ? $.extend(defaultPageParam, page.pageParam) : defaultPageParam;
      $elem = $('#' + OPTIONS.elem);

      Promise.all([
        self.renderTreeWrap(),
        self.fetchTree().then(function (trees) {
          self.renderTree(trees);
          self.renderPage();
        })
      ]).then(function () {
        self.bindEvent();

        options.done && options.done($treeEle, eleTree, options.elem);
      });
    },
    render: function () {
      var self = this;
      self.fetchTree().then(function (trees) {
        $treeEle.reload({ data: trees });
        self.renderPage();
        self.bindEvent();
      });
    },
    // 初始化组件整体
    renderTreeWrap: function () {
      return new Promise(function (resolve) {
        if (!OPTIONS.elem) {
          return;
        }

        var layId, search, page, pageLayout, pageId, width, height, searchText, isCommonEleTree;
        search = OPTIONS.search;
        page = OPTIONS.page;
        searchText = search && search.searchText || '';
        pageLayout = page && page.page;
        height = OPTIONS.height;
        layId = OPTIONS.elem;
        pageId = (pageLayout && pageLayout.elem) || layId + '-page';
        isCommonEleTree = OPTIONS.tree && OPTIONS.tree.isCommonEleTree;

        var laytplHtml = '<div style="width:100%;">' +
          '{{# if(d.search) { }}' +
          '<div class="layui-block top" style="position: relative;">' +
          '<div class="layui-input-inline" style="width: 100%;"><input type="text" name="searchTree" placeholder="{{d.searchText}}" autocomplete="off" class="layui-input eleTree-search"></div>' +
          '<div class="layui-btn-group layui-input-inline" style="position: absolute;right: 0;">' +
          '<button class="layui-btn" style="padding: 0 10px;" data-event="searchTree" ><i class="dsicon dsicon-search"></i></button>' +
          '</div>' +
          '</div>' +
          '{{# } }}' +
          '<div class="table-attrs-list {{d.isCommonEleTree ? \'\' : \'special\'}}" lay-filter="{{d.layId}}" style="height: {{d.height}}"></div>' +
          '{{# if(d.page) { }}' +
          '<div id="{{d.pageId}}" style="margin: 0 auto;text-align: center;white-space: nowrap;"></div>' +
          '{{# } }}' +
          '</div>';

        laytpl(laytplHtml).render({ layId, width, height, search, searchText, page, pageId, isCommonEleTree }, function (html) {
          $elem.html(html);
          setTimeout(function () {
            resolve();
          }, 0);
        });
      });
    },
    // 获取数据
    fetchTree: function () {
      var $input = $elem.find('[name=searchTree]');
      var searchKey = $input && $input.val() || '';

      var requestOpts = OPTIONS.tree && OPTIONS.tree.requestOpts;
      var opts = requestOpts && requestOpts[0];
      var method = opts && opts.method ? opts.method : defaultRequestMethod;
      var getWhere = opts && opts.where;
      var params = getWhere ? $.extend(getWhere(searchKey), { pageParam }) : { pageParam };
      return new Promise((resolve, reject) => {

        if (!opts || !opts.url) {
          resolve([]);
        }
        request(opts.url, { method, data: params }).then(function (res) {
          var data = opts.getData ? opts.getData(res) : defaultGetData(res);
          var trees = handleDataForDsTree(data, 0);
          treeDatas[0] = data;
          if (res && res.pageParam) {
            pageParam = res && res.pageParam;
          }

          resolve(trees);
        });
      });
    },
    // 渲染树
    renderTree: function (trees) {
      var self = this;
      var elem = OPTIONS.elem;
      var tree = OPTIONS.tree;
      if (!elem || !tree || !trees) {
        return;
      }

      var isCommonEleTree = tree.isCommonEleTree;
      var eleTreeOpts = tree.eleTreeOpts ? tree.eleTreeOpts : {};
      var tableListEle = isCommonEleTree ? TABLE_LIST_LIST : TABLE_LIST_LIST + '.special';
      var specialTreeOpts = {
        elem: '#' + elem + ' ' + tableListEle,
        data: trees,
        indent: 10,
        lazy: true,
        load: function (data, callback) {
          var label = data && data.label;
          var $label = label && $(label);
          var idx = $label.data('idx');
          if (idx == 0 && !$label.hasClass('none')) {
            self.fetchSonTree(data).then(function (res) {
              callback && callback(res);
            });
          } else {
            callback && callback([]);
          };
        },
        // 搜索树的方法
        searchNodeMethod: function (value, data) {
          if (!value) return true;
          return data.label.toLowerCase().indexOf(value.toLowerCase()) !== -1;
        }
      };
      var opts = isCommonEleTree ? $.extend(specialTreeOpts, eleTreeOpts) : $.extend(eleTreeOpts, specialTreeOpts);
      $treeEle = eleTree.render(opts);

      if (opts && opts.showCheckbox) {
        $elem.addClass('checkbox-wrap');
      }
    },
    // 获取二级节点数据
    fetchSonTree: function (data) {
      var requestOpts = OPTIONS.tree && OPTIONS.tree.requestOpts;
      var opts = requestOpts && requestOpts[1];
      var url = opts && opts.url, getWhere = opts && opts.where;
      var method = opts && opts.method ? opts.method : defaultRequestMethod;
      return new Promise((resolve, reject) => {
        if (!opts || !url) {
          resolve();
        } else {
          var optsParam = getWhere ? getWhere(data) : { data }
          request(url, { method, data: optsParam }).then(function (res) {
            var data = opts.getData ? opts.getData(res) : defaultGetData(res);
            var trees = handleDataForDsTree(data, 1);

            treeDatas[1].push(data);
            treeDatas[1] = handleUniqueData(treeDatas[1]);
            resolve(trees);
          });
        }
      });
    },
    // 渲染分页
    renderPage: function () {
      var self = this;
      var page = OPTIONS.page;
      var pageLayout = page && page.page;
      var elem = (pageLayout && pageLayout.elem) || OPTIONS.elem + '-page';

      if (!page) {
        return;
      }
      var defaults = {
        groups: 2,
        prev: '<',
        next: '>',
        layout: ['count', 'prev', 'page', 'next']
      };
      var opts = $.extend(defaults, pageLayout, {
        elem: elem,
        curr: pageParam.pageIndex || 1,
        count: pageParam.recordTotal || 0,
        jump: function (obj, first) {
          if (!first) {
            pageParam = $.extend(pageParam, { pageIndex: obj.curr || 1 });
            self.render();
          }
        }
      });

      laypage.render(opts);
    },
    searchTree: function () {
      var self = this;
      var search = OPTIONS.search;
      var isSearchByApi = search.isSearchByApi;
      if (!search) {
        return;
      }

      if (!isSearchByApi) {
        $treeEle.search('');
        $treeEle.search(value);
        return;
      }

      pageParam = defaultPageParam;
      self.render();
    },
    // 操作事件
    bindEvent: function () {
      var self = this;
      var tree = OPTIONS.tree;
      var btns = tree && tree.btns;
      var datas = treeDatas;

      // 自定义按钮事件
      if (btns && btns.length) {
        var idCodes = tree && tree.idCodes;
        var labelCodes = tree && tree.labelCodes;
        if (!idCodes || !labelCodes) {
          return;
        }
        $.each(btns, function (i, level) {
          if (level && level.length) {
            var wrap = '[data-idx=' + i + ']', operateWrap = '.operate';
            var idCode = idCodes && idCodes[i];
            $.each(level, function (j, btn) {
              if (j < 2) {
                var icon = btn.icon;
                var callback = btn.callback;
                var btnEle = 'i.' + icon + '[data-event-icon=' + icon + ']';

                $elem.find(TABLE_LIST_LIST).on('click', operateWrap + wrap + ' ' + btnEle, function (e) {
                  e.preventDefault();
                  e.stopPropagation();
                  var $parent = $(this).parents('.eleTree-node-content-label');
                  var id = $(this).parent(operateWrap).data('id');
                  var tempData = i == 0 ? datas[i] && datas[i].filter(function (item, index, array) { return item[idCode] == id }) : datas[i] && datas[i][j] && datas[i][j].filter(function (item, index, array) { return item[idCode] == id });
                  var node = tempData && tempData.length ? tempData[0] : {};
                  callback && callback(node, e, $parent);
                });
              }
            });
          }
        });
      }

      // 搜索事件
      $elem.find('[data-event=searchTree]').off('click').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
      });
      $elem.find('[name=searchTree]').off('change').on('change', function () {
        self.searchTree();
      });
    }
  };

  // css
  layui.link(layui.cache.paths.extendPath + '/ds-base-tree/index.css');
  exports('dsBaseTree', {
    init: function (options) {
      render.init(options);
    },
    getTree: function () {
      return $treeEle;
    }
  });
});