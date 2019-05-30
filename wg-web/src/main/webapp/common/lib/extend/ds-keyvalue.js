/**
  接口基础配置
**/

layui.define(["jquery", "form", "element"], function(exports) { //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
  var $ = layui.jquery,
    element = layui.element,
    form = layui.form;

  var KeyValue = function(options) {
    this.options = options || {};

    this.ele = this.options.ele || "ds_key_value";
    // 键的标示ID
    this.keyID = this.options.keyID || "key";
    // 值标示ID
    this.valID = this.options.valID || "value";
  };

  // 渲染键值对Form元素
  KeyValue.prototype.renderDsKeyValue = function() {
    var _this = this;
    $("#" + _this.ele).html('<div class="layui-form-item form-key-value" style="clear:none" lay-filter="dsKeyValue"></div>');
    $("#" + _this.ele).find(".layui-form-item").append('<div class="layui-block"><div class="layui-inline"><a href="javascript:;" class="layui-btn" data-type="addKey">添加行</a></div></div>');
    // $("#" + _this.ele).find(".layui-form-item").append(_this.returnKeyValueItem());
    // $("#" + _this.ele).append(_this.returnKeyValueItem());
  }

  KeyValue.prototype.returnKeyValueItem = function(item) {
    var _this = this,
      keyValue = item || {};

    var key_value_item = '<div class="layui-block"><div class="layui-inline" style="width: calc(50% - 51px);">' +
      '<input type="text" class="layui-input" placeholder="键" autocomplete="off" name="' + _this.keyID + '" required lay-verify="required" value="' + (keyValue[_this.keyID] || "") + '" />' +
      '</div>' +
      '<div class="layui-inline" style="width: calc(50% - 51px);">' +
      '<input type="text" class="layui-input" placeholder="值" autocomplete="off" name="' + _this.valID + '" required lay-verify="required" value="' + (keyValue[_this.valID] || "") + '" />' +
      '</div>' +
      '<div class="layui-inline" style="margin-right: 0;">';

    key_value_item += '<a href="javascript:;" class="layui-btn" style="padding: 0 10px;" data-type="addKeyline"><i class="dsicon dsicon-plus"></i></a>';
    key_value_item += '<a href="javascript:;" class="layui-btn layui-btn-danger" style="padding: 0 10px;" data-type="delKey"><i class="dsicon dsicon-minus"></i></a>';
    key_value_item += '</div></div>';

    return key_value_item;
  }

  KeyValue.prototype.getKeyValueItem = function() {
    var _this = this;

    var key_val = [];

    $("#" + _this.ele).find(".layui-block").each(function() {
      var _key = $(this).find("input[name='" + _this.keyID + "']").val(),
        _val = $(this).find("input[name='" + _this.valID + "']").val();

      if (typeof _key == "string" && _key != "" && typeof _val == "string" && _val != "") {
        var obj = {};
        obj[_this.keyID] = _key;
        obj[_this.valID] = _val;
        key_val.push(obj);
      }
    })

    return key_val;
  }

  KeyValue.prototype.setKeyValueItem = function(array) {
    var _this = this;
    $.each(array, function(index, item) {
      $("#" + _this.ele).find(".form-key-value").append(_this.returnKeyValueItem(item));
    })
  }

  KeyValue.prototype.init = function() {
    var _this = this;
    _this.renderDsKeyValue();
  }

  KeyValue.prototype.bindEvent = function() {
    var _this = this;

    $("#" + _this.ele).on("click", "a[data-type='addKey']", function() {
      $(this).parents(".form-key-value").append(_this.returnKeyValueItem());
    })

    $("#" + _this.ele).on("click", "a[data-type='addKeyline']", function() {
      $(this).parent().parent().after(_this.returnKeyValueItem());
    })

    $("#" + _this.ele).on("click", "a[data-type='delKey']", function() {
      $(this).parent().parent().remove();
    })
  }

  var dsKeyValue = {
    render: function(options) {
      var keyValItem = new KeyValue(options);
      keyValItem.init();
      keyValItem.bindEvent();
      return keyValItem;
    },
    getKeyValue: function(keyValItem) {
      if (typeof keyValItem === "undefined") {
        keyValItem = new KeyValue();
      }
      return keyValItem.getKeyValueItem();
    },
    setKeyValue: function(keyValItem, array) {
      if (typeof keyValItem != "undefined") {
        keyValItem.setKeyValueItem(array);
      }
    }
  }

  exports('dsKeyValue', dsKeyValue);
});