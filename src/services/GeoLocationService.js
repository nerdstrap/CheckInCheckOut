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

    var GeoLocationService = function (options) {
        console.trace('new GeoLocationService()');
        options || (options = {});
        this.positionOptions = {
            'timeout': timeout,
            'enableHighAccuracy': enableHighAccuracy,
            'maximumAge': maximumAge
        };
        this.initialize.apply(this, arguments);
    };

    _.extend(GeoLocationService.prototype, {
        initialize: function (options) {
            console.trace('GeoLocationService.initialize');
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
                var capabilityError = new Error('geolocation capability not found');
                deferred.rejectWith(currentContext, [capabilityError]);
            }

            return deferred.promise();
        }
    });

    return GeoLocationService;
});