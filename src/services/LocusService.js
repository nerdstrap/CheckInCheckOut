define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        globals = require('globals'),
        env = require('env'),
        utils = require('utils');

    var _locusList = [
        {
            "locusId": "FRDIA",
            "locusName": "Fredonia TS",
            "latitude": "40.16352778",
            "longitude": "-82.61269444"
        },
        {
            "locusId": "DELAW",
            "locusName": "Delaware POP",
            "latitude": "40.28777777",
            "longitude": "-83.80555550",
            "hasHazard": "true"
        },
        {
            "locusId": "840",
            "locusName": "Vine",
            "latitude": "39.97109",
            "longitude": "-83.00647",
            "hasOpenCheckIns": "true"
        }
    ];

    var _userIdentity = {
        "identityId": "S251201",
        "identityName": "Baltic, Michael",
        "firstName": "Michael",
        "lastName": "Baltic",
        "middleInitial": "E",
        "contactNumber": "6143239560",
        "email": "mebaltic@aep.com",
        "role": "Admin"
    };

    var _getById = function (locusId) {
        return _.where(_locusList, function (locus) {
            return locus.locusId === locusId;
        });
    };

    var _getByLocusName = function (locusName) {
        return _.where(_locusList, function (locus) {
            return locus.locusName.toLowerCase().indexOf(locusName || "".toLowerCase()) > -1;
        });
    };

    var _getByCoords = function (coords, distanceThreshold, searchResultsThreshold) {
        utils.computeDistances(coords, _locusList);
        var nearbyLocusList = _.filter(_locusList, function (locus) {
            return locus.distance <= distanceThreshold
        });
        if (nearbyLocusList.length > searchResultsThreshold) {
            nearbyLocusList = nearbyLocusList.slice(0, searchResultsThreshold);
        }
        return _.sortBy(nearbyLocusList, function (nearbyLocus) {
            return parseFloat(nearbyLocus.distance);
        });
    };

    var LocusService = function (options) {
        console.trace('new LocusService()');
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(LocusService.prototype, {
        initialize: function (options) {
            console.trace('LocusService.initialize');
            options || (options = {});
        },
        getLocusSearchOptions: function (options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var results = {
                identity: _userIdentity
            };

            globals.window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 50);

            return deferred.promise();
        },
        getLocusList: function (options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var locusList;
            if (options.locusId) {
                locusList = _getById(options.locusId);
            } else if (options.locusName) {
                locusList = _getByLocusName(options.locusName);
            } else if (options.coords) {
                locusList = _getByCoords(options.coords, env.getDistanceThreshold(), env.getSearchResultsThreshold());
            } else {
                locusList = _locusList;
            }

            var results = {
                locusList: locusList,
                identity: _userIdentity
            };

            globals.window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 50);

            return deferred.promise();
        }
    });

    return LocusService;
});