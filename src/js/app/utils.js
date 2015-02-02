define(function (require) {
    'use strict';

    var resources = require('resources');

    var s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };

    var toRad = function (degrees) {
        return degrees * Math.PI / 180;
    }

    var utils = {};

    utils.getNewGuid = function () {
        return s4() + s4() + s4() + s4();
    };

    utils.getResource = function (key) {
        return resources.getResource(key);
    };

    utils.cleanPhone = function (phone) {
        if (phone) {
            var originalPhone = phone;
            var cleanedPhone = originalPhone.replace(/[^0-9]/g, '');
            if (cleanedPhone.length > 10) {
                cleanedPhone = cleanedPhone.substring(cleanedPhone.length - 10);
            }
            return cleanedPhone;
        }
        return phone;
    };

    utils.addMinutes = function (date, minutes) {
        var minutesToAdd = minutes * 60000;
        return new Date(date.getTime() + minutesToAdd);
    };

    utils.addDays = function (date, days) {
        var daysToAdd = days * 86400000;
        return new Date(date + daysToAdd);
    };

    utils.simpleComparator = function (a, b, sortDirection) {
        if (sortDirection !== 1) {
            if (a === b) {
                return 0;
            }
            if (!a) {
                return 1;
            }
            if (!b) {
                return -1;
            }
            return (a < b) ? 1 : -1;
        } else {
            if (a === b) {
                return 0;
            }
            if (!a) {
                return -1;
            }
            if (!b) {
                return 1;
            }
            return (a < b) ? -1 : 1;
        }
    };

    utils.computeDistanceBetween = function (start, end) {
        var distance = 0.0;
        try {
            var R = 3956.0883313286096695299;

            var dLat = toRad(end.latitude - start.latitude)
            var dLon = toRad(end.longitude - start.longitude)
            var lat1 = toRad(start.latitude)
            var lat2 = toRad(end.latitude)

            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1) * Math.cos(lat2) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            distance = (R * c).toFixed(2);
        } catch (ex) {
            console.trace('compute distance failed');
        }

        return distance;
    };

    utils.computeDistances = function(start, locations) {
        var currentContext = this;
        _.each(locations, function(location) {
            var distance = utils.computeDistanceBetween(start, location);
            location.distance = distance;
        });
    }

    return utils;
});
