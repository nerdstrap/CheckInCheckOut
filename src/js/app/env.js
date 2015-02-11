define(function (require) {
    'use strict';

    var module = require('module'),
        globals = require('globals'),
        masterConfig = module.config(),
        apiUrl = masterConfig.apiUrl || '',
        siteRoot = masterConfig.siteRoot || '',
        distanceThreshold = masterConfig.distanceThreshold || 50,
        searchResultsThreshold = masterConfig.searchResultsThreshold || 20,
        expirationThreshold = masterConfig.expirationThreshold || 1800000;


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
    return env;
});
