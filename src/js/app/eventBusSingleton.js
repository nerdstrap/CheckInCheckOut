define(function(require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        EventBus = require('EventBus');

    var eventBusSingleton = new EventBus();
    return eventBusSingleton;
});