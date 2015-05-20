'use strict';

var module = require('module');
var masterConfig = module.config();
var apiUrl = masterConfig.apiUrl || '';
var siteRoot = masterConfig.siteRoot || '';
var distanceThreshold = masterConfig.distanceThreshold || 50;
var searchResultsThreshold = masterConfig.searchResultsThreshold || 20;
var expirationThreshold = masterConfig.expirationThreshold || 1800000;


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