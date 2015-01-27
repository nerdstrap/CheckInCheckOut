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

    var LocatorService = function (options) {
        console.trace('new LocatorService()');
        options || (options = {});
        this.positionOptions = {
            'timeout': timeout,
            'enableHighAccuracy': enableHighAccuracy,
            'maximumAge': maximumAge
        };
    };

    _.extend(LocatorService.prototype, {
        initialize: function (options) {
            console.trace('LocatorService.initialize');
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

    return LocatorService;
});