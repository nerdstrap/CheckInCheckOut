'use strict';

var module = require('module');
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var env = require('env');
var masterConfig = module.config();
var timeout = masterConfig.timeout || 30000;
var enableHighAccuracy = masterConfig.enableHighAccuracy || false;
var maximumAge = masterConfig.maximumAge || 60000;

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

        if (window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition(
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

module.exports = GeoLocationService;