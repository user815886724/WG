
layui.extend({
  base: '../../../base',
}).use(['base', 'form', 'utils', 'request', 'dsTable', 'eleTree'], function () {
  var $ = layui.jquery;
  var form = layui.form;
  var utils = layui.utils;
  var request = layui.request;
  var dsTable = layui.dsTable;
  var eleTree = layui.eleTree;

  // 配置参数
  var dsBaseFilterOptions = parent.dsBaseFilterOptions;
  var tableOptions = $.extend({
    url: '',
    params: {},
    cols: [],
  }, dsBaseFilterOptions.table);
  var isShowTree = dsBaseFilterOptions.tree && true;
  var treeOptions = $.extend({
    title: '选择:',
    placeholder: '请选择',
    url: '',
    params: {},
    tableKey: 'id',
  }, dsBaseFilterOptions.tree);
  // END.配置参数

  var controller = {
    init: function () {
      var self = this;
      if (isShowTree) {
        $('#filterNameWrap').removeClass('layui-hide');

        Promise.all([
          self.renderTree()
        ]).then(self.renderTable.bind(this));
      } else {
        this.renderTable();
      }

      if (tableOptions.searchKey || false) {
        $('#searchWrap').removeClass('layui-hide');

        $('[data-type="reload"]').on("click", function () {
          var params = {};
          if (isShowTree) {
            params[treeOptions.tableKey] = $('#filterCode').val() || treeOptions.params[treeOptions.tableKey];
          }
          params[tableOptions.searchKey] = $("#searchTxt").val();
          dsTable.reload('dsBaseFilterTable', {
            page: { curr: 1 },
            where: params
          });
        })

        $(document).on("keyup", function (e) {
          if (e.keyCode == 13) {
            $('[data-type="reload"]').click();
          }
        });
      }
    },
    renderTable: function () {
      var self = this;
      var checkedData = tableOptions.defaultCheckedData || [];
      var dataSource = [];

      // 是否开启选择状态记忆功能
      var isMemorySelectStatus = false;
      if (tableOptions.cols.length > 0 && tableOptions.cols[0].length > 0) {
        isMemorySelectStatus = (tableOptions.cols[0][0].type === 'radio' || tableOptions.cols[0][0].type === 'checkbox') && function () {
          return {
            field: tableOptions.key.id,
            data: checkedData,
          }
        };
      }

      if (tableOptions.data && tableOptions.data.length) {
        dsTable.render({
          elem: '#dsBaseFilterTable',
          data: JSON.parse(JSON.stringify(tableOptions.data)),
          // url: tableOptions.url,
          // where: tableOptions.params,
          checkedData: isMemorySelectStatus,
          done: function (par) {
            // dsTable.resize('dsBaseFilterTable');
            dataSource = par.data;
          },
          cols: tableOptions.cols,
          page: {
            limit: 8
          },
        });
      } else {
        dsTable.render($.extend({
          elem: '#dsBaseFilterTable',
          url: tableOptions.url,
          where: tableOptions.params,
          checkedData: isMemorySelectStatus,
          done: function (par) {
            dsTable.resize('dsBaseFilterTable');
            dataSource = par.data;
          },
          cols: tableOptions.cols,
          page: {
            limit: 8
          },
        }));
      }

      if (isMemorySelectStatus) {
        dsTable.on('radio(dsBaseFilter)', function (obj) {
          var checkStatus = dsTable.checkStatus('dsBaseFilterTable');
          var idArr = [], obj = {};
          // $.each(checkStatus.data, function(i,e) {
          //   obj = {};
          //   obj[tableOptions.key.id] = e[tableOptions.key.id];
          //   obj[tableOptions.key.name] = e[tableOptions.key.name];
          //   idArr.push(obj);
          // });
          // checkedData = idArr;
          checkedData = checkStatus.data;
          self.renderResultText(checkedData);
          $('#dsBaseFilterResult').val(JSON.stringify(checkedData));
        });
        dsTable.on('checkbox(dsBaseFilter)', function (obj) {
          if (obj.type === 'all') {
            if (obj.checked) {
              var idArr = [], obj = {};
              var uniqData = utils.unionBy($.merge(checkedData, dataSource), tableOptions.key.id);
              // $.each(uniqData, function(i,e) {
              //   obj = {};
              //   obj[tableOptions.key.id] = e[tableOptions.key.id];
              //   obj[tableOptions.key.name] = e[tableOptions.key.name];
              //   idArr.push(obj);
              // });
              checkedData = uniqData;
              // checkedData = idArr;
            } else {
              var idArr = [], obj = {};
              $.each(checkedData, function (i, e) {
                $.each(dataSource, function (i2, e2) {
                  if (e[tableOptions.key.id] == e2[tableOptions.key.id]) {
                    delete checkedData[i];
                  }
                });
              });
              for (i in checkedData) {
                idArr.push(checkedData[i]);
              }
              checkedData = idArr;
            }
          } else {
            var currentData = obj.data;
            if (obj.checked) {
              // var obj = {};
              // obj[tableOptions.key.id] = currentData[tableOptions.key.id];
              // obj[tableOptions.key.name] = currentData[tableOptions.key.name];
              // checkedData.push(obj);
              checkedData.push(currentData);
            } else {
              var idArr = [], obj = {};
              $.each(checkedData, function (i, e) {
                if (e[tableOptions.key.id] == currentData[tableOptions.key.id]) {
                  delete checkedData[i];
                }
              });
              for (i in checkedData) {
                idArr.push(checkedData[i]);
              }
              checkedData = idArr;
            }
          }
          self.renderResultText(checkedData);
          $('#dsBaseFilterResult').val(JSON.stringify(checkedData));
        });
        self.renderResultText(checkedData);
        $('#dsBaseFilterResult').val(JSON.stringify(checkedData));
      }
    },
    renderTree: function () {
      var self = this;
      var $filterVal = $('#filterVal');
      var $filterName = $('#filterName');
      var $filterCode = $('#filterCode');

      $filterName.text(treeOptions.title + ':');
      $filterVal.attr('placeholder', treeOptions.placeholder);

      if (treeOptions.area) {
        $('.eleTrees').css({
          width: treeOptions.area[0] || 'auto',
          height: treeOptions.area[1] || '200px',
        });
      }

      return request.post(treeOptions.url, treeOptions.params).then(function (result) {
        var typeData = result.data;

        $.each(typeData, function (i, e) {
          this.label = e[treeOptions.key.name];
        });

        // isShowTopAll 参数已删除
        // if (treeOptions.isShowTopAll) {
        //   typeData = [{
        //     id: 'ALL',
        //     label: '全部',
        //     LAY_LABEL_TYPE: 'ALL',
        //     children: typeData
        //   }];
        // }

        var el5;
        $filterVal.on("click", function (e) {
          e.stopPropagation();
          if (!el5) {
            el5 = eleTree.render({
              elem: '.eleTrees',
              indent: 0,
              data: typeData,
              defaultExpandAll: true,
              expandOnClickNode: false,
              highlightCurrent: true,
              searchNodeMethod: function (value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
              }
            });
          }
          $(".eleTrees").toggle();
        });
        $filterVal.on("change", function () {
          el5.search($(this).val());
        });
        eleTree.on("nodeClick(treeFilter)", function (d) {
          var code = d.data.currentData.LAY_LABEL_TYPE === 'ALL' ? '' : d.data.currentData[treeOptions.key.id];

          $filterVal.val(d.data.currentData.label);
          $filterCode.val(code)
          $(".eleTrees").hide();
          // console.log(d.data.currentData);

          var params = {};
          params[treeOptions.tableKey] = code;

          dsTable.reload('dsBaseFilterTable', {
            page: { curr: 1 },
            where: params
          });
        });
        $(document).on("click", function () {
          $(".eleTrees").hide();
        });

      });
    },
    renderResultText: function (data) {
      var arr = [];
      $.each(data, function (i, e) {
        arr.push(e[tableOptions.key.name]);
      });
      $('#dsBaseFilterResultTxt').html(arr.join(" , ") || "暂无选择");
    }
  };

  controller.init();
});
