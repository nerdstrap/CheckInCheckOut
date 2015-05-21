'use strict';

var apiUrl = '';
var siteRoot = '';
var distanceThreshold = 50;
var searchResultsThreshold = 20;
var expirationThreshold = 1800000;
var locatorTimeout = 30000;
var locatorEnableHighAccuracy = false;
var locatorMaximumAge = 60000;

var env = {
    getApiUrl: function () {
        return apiUrl;
    },
    getSiteRoot: function () {
        return siteRoot;
    },
    getDistanceThreshold: function () {
        return distanceThreshold;
    },
    getSearchResultsThreshold: function () {
        return searchResultsThreshold;
    },
    getExpirationThreshold: function () {
        return expirationThreshold;
    }
};

module.exports = env;