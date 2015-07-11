'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');

/**
 *
 * @param options
 * @constructor
 */
var EventDispatcher = function (options) {
    options || (options = {});
    this.initialize.apply(this, arguments);
};

_.extend(EventDispatcher.prototype, Backbone.Events, {
    /**
     *
     * @param options
     */
    initialize: function (options) {
        console.trace('EventDispatcher.initialize');
        options || (options = {});
    }
});

module.exports = EventDispatcher;