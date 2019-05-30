layui.define(['jquery'], function (exports) {
  "use strict";

  var $ = layui.jquery;

  var STEPS = '.layui-pro-steps',
    TITLES = STEPS + '-title',
    CONTENTS = STEPS + '-content',
    ITEM = CONTENTS + '-item',
    CURCLASS = 'current';

  var event = {
    handleChangeStep: function (steps, index) {
      // if (index >= 0 && index <= 2) {
      if (index >= 0) {
        var stepEle = steps,
          titElem = stepEle.find(TITLES).find('li'),
          contentEle = stepEle.find(CONTENTS).children();
        titElem.removeClass(CURCLASS).eq(index).addClass(CURCLASS);
        contentEle.removeClass(CURCLASS).eq(index).addClass(CURCLASS);
      }
    },
    bindClickEvent: function (type, options) {
      var self = this;
      var beforeAction = options.beforeAction;
      var afterAction = options.afterAction;

      var dom = $(document);
      var operate = type == 'prev' ? -1 : 1;
      dom.on('click', '[lay-step="' + type + '"]', function (e) {
        e.stopImmediatePropagation();
        if (beforeAction) {
          var isContinue = beforeAction(e);
          if (!isContinue) {
            return false;
          }
        }

        var el = $(this).parents(ITEM),
          parents = el.parent(),
          index = parents.find(ITEM).index(el),
          stepsEle = $(this).parents(STEPS);
        var nextCurrentIndex = parseInt(index) + parseInt(operate);
        self.handleChangeStep(stepsEle, nextCurrentIndex);

        afterAction && afterAction(e);
        return false;
      });
    }
  }
  exports('dsSteps', {
    stepChange: function (filter, layid) {
      var stepsElem = $('.layui-pro-steps[lay-filter=' + filter + ']'),
        titElem = stepsElem.find(TITLES).children('li'),
        layidEle = stepsElem.find(TITLES).children('li[lay-id="' + layid + '"]'),
        layidIndex = titElem.index(layidEle);
      event.handleChangeStep(stepsElem, layidIndex);
    },
    render: function (options) {
      event.bindClickEvent('prev', {
        beforeAction: options.beforePrevAction,
        afterAction: options.afterPrevAction
      });
      event.bindClickEvent('next', {
        beforeAction: options.beforeNextAction,
        afterAction: options.afterNextAction
      });
    }
  });
});  