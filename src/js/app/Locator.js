define(function (require) {
    'use strict';

    var module = require('module'),
        $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        env = require('env'),
        globals = require('globals'),
        masterConfig = module.config(),
        timeout = masterConfig.timeout || 30000,
        enableHighAccuracy = masterConfig.enableHighAccuracy || false,
        maximumAge = masterConfig.maximumAge || 60000;

    var Locator = function (options) {
        console.trace('new Locator()');
        options || (options = {});
        this.positionOptions = {
            'timeout': timeout,
            'enableHighAccuracy': enableHighAccuracy,
            'maximumAge': maximumAge
        };
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
                globals.window.navigator.geolocation.getCurrentPosition(
                    function () {
                        deferred.resolveWith(currentContext, arguments);
                    },
                    function () {
                        deferred.rejectWith(currentContext, arguments);
                    },
                    currentContext.positionOptions
                );
            } else {
                var errorCode = 404;
                var errorMessage = 'geolocation is not supported';
                deferred.rejectWith(currentContext, [errorCode, errorMessage]);
            }

            return deferred.promise();

        }
    });

    return Locator;
});