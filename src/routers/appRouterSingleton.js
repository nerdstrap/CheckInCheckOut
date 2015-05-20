'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var AppRouter = require('routers/AppRouter');

var appRouterSingleton = function () {
    if (this._instance === undefined) {
        this._instance = new AppRouter();
    }
    return this._instance;
};

module.exports = appRouterSingleton;