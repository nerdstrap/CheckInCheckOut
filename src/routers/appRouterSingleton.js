'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var AppRouter = require('routers/AppRouter');

var appRouterSingleton = function () {
    if (_instance === undefined) {
        _instance = new AppRouter();
    }
    return _instance;
};

module.exports = appRouterSingleton;