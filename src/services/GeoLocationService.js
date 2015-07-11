'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var config = require('lib/config');

/**
 *
 * @param options
 * @constructor
 */
var GeoLocationService = function (options) {
    options || (options = {});
    this.positionOptions = {
        timeout: config.positionOptions.timeout,
        enableHighAccuracy: config.positionOptions.enableHighAccuracy,
        maximumAge: config.positionOptions.maximumAge
    };
    this.initialize.apply(this, arguments);
};

/**
 *
 */
_.extend(GeoLocationService.prototype, {
    /**
     *
     * @param options
     */
    initialize: function (options) {
        console.trace('GeoLocationService.initialize');
        options || (options = {});
    },

    /**
     *
     * @returns {promise}
     */
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