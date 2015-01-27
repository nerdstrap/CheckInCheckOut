define(function (require) {
    'use strict';

    var resources = require('resources');

    var s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };

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

    return utils;
});
