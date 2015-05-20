'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var EventBus = require('EventBus');

var eventBusSingleton = function () {
    if (this._instance === undefined) {
        this._instance = new EventBus();
    }
    return this._instance;
};

module.exports = eventBusSingleton;