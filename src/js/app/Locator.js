define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        env = require('env'),
        globals = require('globals');

    var Locator = function (options) {
        console.trace('new Locator()');
        options || (options = {});
        this._options = {};
    };

    _.extend(Locator.prototype, {
        initialize: function (options) {
            console.trace('Locator.initialize');
            options || (options = {});
        },
        getCurrentPosition: function () {
            var currentContext = this;
            var deferred = $.Deferred();

            if (globals.window.navigator.geolocation) {
                globals.window.navigator.geolocation.getCurrentPosition(deferred.resolve, deferred.reject, currentContext._options);
            } else {
                deferred.reject(new Error('geolocation not supported.'));
            }

            return deferred.promise();

        }
    });

    return Locator;
});