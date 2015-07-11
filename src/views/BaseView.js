'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var CompositeView = require('views/CompositeView');

var BaseView = function (options) {
    CompositeView.apply(this, [options]);
};

_.extend(BaseView.prototype, CompositeView.prototype, {
    /**
     *
     * @returns {BaseView}
     */
    completeLoading: function () {
        var currentContext = this;
        currentContext.trigger('loaded');
        return this;
    }
});

BaseView.extend = CompositeView.extend;

module.exports = BaseView;
