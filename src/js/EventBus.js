'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

var EventBus = function (options) {
    console.trace('new EventBus()');
    options || (options = {});
    this.initialize.apply(this, arguments);
};

_.extend(EventBus.prototype, Backbone.Events, {
    initialize: function (options) {
        console.trace('EventBus.initialize');
        options || (options = {});
    }
});

module.exports = EventBus;