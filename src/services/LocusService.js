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
            "longitude": "-82.61269444",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusId": "DELAW",
            "locusName": "Delaware POP",
            "latitude": "40.28777777",
            "longitude": "-83.80555550",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusType": "TD",
            "locusId": "840",
            "internalLocusId": "840",
            "locusName": "Vine",
            "latitude": "39.97109",
            "longitude": "-83.00647",
            "hasHazard": "true",
            "hasOpenCheckIns": "true"
        },
        {
            "locusType": "TD",
            "locusId": "4444",
            "internalLocusId": "4444",
            "locusName": "Italian Village",
            "latitude": "39.98035",
            "longitude": "-82.99404",
            "hasHazard": "true",
            "hasOpenCheckIns": "false",
            "linkedLocusId": "AEPHS",
            "linkedLocusName": "AEP Headquarters POP"
        },
        {
            "locusType": "TC",
            "locusId": "AEPHS",
            "internalLocusId": "AEPHS",
            "locusName": "AEP Headquarters POP",
            "latitude": "39.96505555",
            "longitude": "-83.00544444",
            "hasHazard": "false",
            "hasOpenCheckIns": "true",
            "linkedLocusId": "4444",
            "linkedLocusName": "Italian Village"
        },
        {
            "locusType": "TC",
            "locusId": "COLUS",
            "internalLocusId": "COLUS",
            "locusName": "Columbus POP",
            "latitude": "39.96500000",
            "longitude": "-83.00555555",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusType": "TD",
            "locusId": "4247",
            "internalLocusId": "4247",
            "locusName": "City Of Columbus",
            "latitude": "39.966363",
            "longitude": "-83.017552",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusType": "TD",
            "locusId": "1311",
            "internalLocusId": "1311",
            "locusName": "Gay Street",
            "latitude": "39.96426",
            "longitude": "-82.99761",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusType": "TC",
            "locusId": "BORDN",
            "internalLocusId": "BORDN",
            "locusName": "Borden Building POP",
            "latitude": "39.96277777",
            "longitude": "-82.99583333",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusType": "TD",
            "locusId": "744",
            "internalLocusId": "744",
            "locusName": "OSU",
            "latitude": "39.99649",
            "longitude": "-83.02306",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusType": "TD",
            "locusId": "807",
            "internalLocusId": "807",
            "locusName": "Saint Clair Avenue (CSP)",
            "latitude": "39.98482",
            "longitude": "-82.97821",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusType": "TD",
            "locusId": "1294",
            "internalLocusId": "1294",
            "locusName": "Hess Street",
            "latitude": "39.98988",
            "longitude": "-83.03281",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusType": "TD",
            "locusId": "1310",
            "internalLocusId": "1310",
            "locusName": "Canal Street",
            "latitude": "39.95386",
            "longitude": "-83.0037",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusType": "TD",
            "locusId": "4526",
            "internalLocusId": "4526",
            "locusName": "Sullivant Terminal",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusType": "TD",
            "locusId": "638",
            "internalLocusId": "638",
            "locusName": "Mound Street",
            "latitude": "39.95647",
            "longitude": "-82.97812",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusType": "TD",
            "locusId": "5109",
            "internalLocusId": "5109",
            "locusName": "West Campus",
            "latitude": "40.00042",
            "longitude": "-83.03558",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusType": "TD",
            "locusId": "494",
            "internalLocusId": "494",
            "locusName": "Fifth Avenue",
            "latitude": "39.99077",
            "longitude": "-83.06662",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusType": "TD",
            "locusId": "1312",
            "internalLocusId": "1312",
            "locusName": "Clinton",
            "latitude": "40.03006",
            "longitude": "-82.99598",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusType": "TD",
            "locusId": "1309",
            "internalLocusId": "1309",
            "locusName": "Kenny",
            "latitude": "40.02507",
            "longitude": "-83.04613",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusType": "TD",
            "locusId": "430",
            "internalLocusId": "430",
            "locusName": "Buckeye Steel",
            "latitude": "39.92042",
            "longitude": "-82.98804",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusType": "TD",
            "locusId": "691",
            "internalLocusId": "691",
            "locusName": "Marion Road",
            "latitude": "39.92222",
            "longitude": "-82.97128",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusType": "TD",
            "locusId": "4553",
            "internalLocusId": "4553",
            "locusName": "Wilson Road",
            "latitude": "39.96291",
            "longitude": "-83.0938",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusType": "TD",
            "locusId": "4649",
            "internalLocusId": "4649",
            "locusName": "Briggsdale",
            "latitude": "39.9205",
            "longitude": "-83.05603",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusType": "TD",
            "locusId": "984",
            "internalLocusId": "984",
            "locusName": "Bexley",
            "latitude": "39.98174",
            "longitude": "-82.91254",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusType": "TD",
            "locusId": "1314",
            "internalLocusId": "1314",
            "locusName": "Livingston Avenue",
            "latitude": "39.94724",
            "longitude": "-82.9152",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusType": "TC",
            "locusId": "GROPT",
            "internalLocusId": "GROPT",
            "locusName": "Groveport TS",
            "latitude": "39.87916667",
            "longitude": "-82.88222222",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusType": "TC",
            "locusId": "BEATT",
            "internalLocusId": "BEATT",
            "locusName": "Beatty TS",
            "latitude": "39.86277777",
            "longitude": "-83.12072222",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusId": "HAYEN",
            "locusName": "Hayden TS",
            "latitude": "40.06005555",
            "longitude": "-83.19350000",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusId": "CORDR",
            "locusName": "Corridor TS",
            "latitude": "40.12283333",
            "longitude": "-82.84627777",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusId": "DCONT",
            "locusName": "DCON IT Telecom Training Center",
            "latitude": "39.99596345",
            "longitude": "-82.72873539",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusId": "ETN",
            "locusName": "Etna TS",
            "latitude": "39.94325000",
            "longitude": "-82.70519444",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusId": "MTSTG",
            "locusName": "Mt Sterling TS",
            "latitude": "39.72883333",
            "longitude": "-83.21436111",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        },
        {
            "locusId": "DELWR",
            "locusName": "Delaware TS",
            "latitude": "40.27000000",
            "longitude": "-83.08194444",
            "hasHazard": "false",
            "hasOpenCheckIns": "false"
        }
    ];

    var _userId = 'S251201';
    var _userRole = 'Admin';

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

    var _getByRegionName = function (regionName) {
        return _.where(_locusList, function (locus) {
            return locus.regionName === regionName;
        });
    };

    var _getByAreaName = function (areaName) {
        return _.where(_locusList, function (locus) {
            return locus.areaName === areaName;
        });
    };

    var _getByCoords = function (coords, distanceThreshold, searchResultsThreshold) {
        utils.computeDistances(coords, _locusList);
        var nearbylocusList = _.filter(_locusList, function (locus) {
            return locus.distance <= distanceThreshold
        });
        if (nearbylocusList.length > searchResultsThreshold) {
            nearbylocusList = nearbylocusList.slice(0, searchResultsThreshold);
        }
        var sortedNearbylocusList = _.sortBy(nearbylocusList, function (nearbyLocus) {
            return parseFloat(nearbyLocus.distance);
        });

        return sortedNearbylocusList;
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


            var userId = _userId;
            var userRole = _userRole;

            var results = {
                userId: userId,
                userRole: userRole
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

            var userId = _userId;
            var userRole = _userRole;

            var results = {
                locusList: locusList,
                userId: userId,
                userRole: userRole
            };

            globals.window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 50);

            return deferred.promise();
        }
    });

    return LocusService;
});