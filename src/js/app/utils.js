'use strict';

var $ = require('jquery');
var _ = require('underscore');
var resources = require('resources');

var s4 = function () {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
};

var toRadians = function (degrees) {
    return degrees * Math.PI / 180;
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
        var cleanedPhone = phone.replace(/[^0-9]/g, '');
        if (cleanedPhone.length > 10) {
            cleanedPhone = cleanedPhone.substring(cleanedPhone.length - 10);
        }
        return cleanedPhone;
    }
    return phone;
};

utils.formatPhone = function (phone) {
    if (phone) {
        var cleanedPhone = utils.cleanPhone(phone);
        var formattedPhone = cleanedPhone;
        if (cleanedPhone.length === 10) {
            formattedPhone = '(' + cleanedPhone.substr(0, 3) + ') ' + cleanedPhone.substr(3, 3) + '-' + cleanedPhone.substr(6, 4);
        }
        if (cleanedPhone.length === 7) {
            formattedPhone = cleanedPhone.substr(0, 3) + '-' + cleanedPhone.substr(3, 4);
        }
        return formattedPhone;
    }
    return phone;
};

utils.formatDate = function (date) {
    var formattedDate;
    if (date) {
        var day = date.getDate();
        var month = date.getMonth();
        var fullYear = date.getFullYear();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        formattedDate = month + '/' + day + '/' + fullYear + ' ' + hours + ':' + minutes;
    }
    return formattedDate;
};

utils.formatString = function (formatString, args) {
    return formatString.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] !== 'undefined' ? args[number] : match;
    });
};

utils.addMinutes = function (date, minutes) {
    var minutesToAdd = minutes * 60000;
    return new Date(date.getTime() + minutesToAdd);
};

utils.addDays = function (date, days) {
    var daysToAdd = days * 86400000;
    return new Date(date + daysToAdd);
};

utils.distanceComparator = function (a, b) {
    if (a.distance === b.distance) {
        return 0;
    }
    if (!a.distance) {
        return -1;
    }
    if (!b.distance) {
        return 1;
    }
    return (a < b) ? -1 : 1;
};

utils.computeDistanceBetween = function (start, end) {
    var distance;

    if (start.latitude && start.longitude && end.latitude && end.longitude) {
        var R = 3956.0883313286096695299;

        var startingLatitude = parseFloat(start.latitude);
        var startingLongitude = parseFloat(start.longitude);
        var endingLatitude = parseFloat(end.latitude);
        var endingLongitude = parseFloat(end.longitude);

        var dLat = toRadians(endingLatitude - startingLatitude);
        var dLon = toRadians(endingLongitude - startingLongitude);
        startingLatitude = toRadians(startingLatitude);
        endingLatitude = toRadians(endingLatitude);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(startingLatitude) * Math.cos(endingLatitude) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        distance = (R * c).toFixed(2);
    }

    return distance;
};

utils.computeDistances = function (start, locusArray) {
    _.each(locusArray, function (locus) {
        var distance = utils.computeDistanceBetween(start, locus);
        if (distance) {
            locus.distance = distance;
        }
    });
};

module.exports = utils;