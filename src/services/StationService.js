define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        globals = require('globals'),
        env = require('env');

    var _stations = [
        {
            "stationType": "TD",
            "stationId": "840",
            "internalStationId": "840",
            "stationName": "Vine",
            "latitude": "39.97109",
            "longitude": "-83.00647",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Columbus",
            "areaName": "Columbus"
        },
        {
            "stationType": "TD",
            "stationId": "4444",
            "internalStationId": "4444",
            "stationName": "Italian Village",
            "latitude": "39.98035",
            "longitude": "-82.99404",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Columbus",
            "areaName": "Columbus"
        },
        {
            "stationType": "TC",
            "stationId": "AEPHS",
            "internalStationId": "AEPHS",
            "stationName": "AEP Headquarters POP",
            "latitude": "39.96505555",
            "longitude": "-83.00544444",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Ohio",
            "areaName": "Groveport"
        },
        {
            "stationType": "TC",
            "stationId": "COLUS",
            "internalStationId": "COLUS",
            "stationName": "Columbus POP",
            "latitude": "39.96500000",
            "longitude": "-83.00555555",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Ohio",
            "areaName": "Groveport"
        },
        {
            "stationType": "TD",
            "stationId": "4247",
            "internalStationId": "4247",
            "stationName": "City Of Columbus",
            "latitude": "39.966363",
            "longitude": "-83.017552",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Columbus"
        },
        {
            "stationType": "TD",
            "stationId": "1311",
            "internalStationId": "1311",
            "stationName": "Gay Street",
            "latitude": "39.96426",
            "longitude": "-82.99761",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Columbus",
            "areaName": "Columbus"
        },
        {
            "stationType": "TC",
            "stationId": "BORDN",
            "internalStationId": "BORDN",
            "stationName": "Borden Building POP",
            "latitude": "39.96277777",
            "longitude": "-82.99583333",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Ohio",
            "areaName": "Groveport"
        },
        {
            "stationType": "TD",
            "stationId": "744",
            "internalStationId": "744",
            "stationName": "OSU",
            "latitude": "39.99649",
            "longitude": "-83.02306",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Columbus",
            "areaName": "Columbus"
        },
        {
            "stationType": "TD",
            "stationId": "807",
            "internalStationId": "807",
            "stationName": "Saint Clair Avenue (CSP)",
            "latitude": "39.98482",
            "longitude": "-82.97821",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Columbus",
            "areaName": "Columbus"
        },
        {
            "stationType": "TD",
            "stationId": "1294",
            "internalStationId": "1294",
            "stationName": "Hess Street",
            "latitude": "39.98988",
            "longitude": "-83.03281",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Columbus",
            "areaName": "Columbus"
        },
        {
            "stationType": "TD",
            "stationId": "1310",
            "internalStationId": "1310",
            "stationName": "Canal Street",
            "latitude": "39.95386",
            "longitude": "-83.0037",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Columbus",
            "areaName": "Columbus"
        },
        {
            "stationType": "TD",
            "stationId": "4526",
            "internalStationId": "4526",
            "stationName": "Sullivant Terminal",
            "latitude": "39.95421",
            "longitude": "-83.01713",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Columbus",
            "areaName": "Columbus South"
        },
        {
            "stationType": "TD",
            "stationId": "638",
            "internalStationId": "638",
            "stationName": "Mound Street",
            "latitude": "39.95647",
            "longitude": "-82.97812",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Columbus",
            "areaName": "Columbus South"
        },
        {
            "stationType": "TD",
            "stationId": "5109",
            "internalStationId": "5109",
            "stationName": "West Campus",
            "latitude": "40.00042",
            "longitude": "-83.03558",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Columbus",
            "areaName": "Columbus South"
        },
        {
            "stationType": "TD",
            "stationId": "494",
            "internalStationId": "494",
            "stationName": "Fifth Avenue",
            "latitude": "39.99077",
            "longitude": "-83.06662",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Columbus",
            "areaName": "Columbus"
        },
        {
            "stationType": "TD",
            "stationId": "1312",
            "internalStationId": "1312",
            "stationName": "Clinton",
            "latitude": "40.03006",
            "longitude": "-82.99598",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Columbus",
            "areaName": "Columbus"
        },
        {
            "stationType": "TD",
            "stationId": "1309",
            "internalStationId": "1309",
            "stationName": "Kenny",
            "latitude": "40.02507",
            "longitude": "-83.04613",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Columbus",
            "areaName": "Columbus"
        },
        {
            "stationType": "TD",
            "stationId": "430",
            "internalStationId": "430",
            "stationName": "Buckeye Steel",
            "latitude": "39.92042",
            "longitude": "-82.98804",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Columbus",
            "areaName": "Columbus"
        },
        {
            "stationType": "TD",
            "stationId": "691",
            "internalStationId": "691",
            "stationName": "Marion Road",
            "latitude": "39.92222",
            "longitude": "-82.97128",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Columbus",
            "areaName": "Columbus"
        },
        {
            "stationType": "TD",
            "stationId": "4553",
            "internalStationId": "4553",
            "stationName": "Wilson Road",
            "latitude": "39.96291",
            "longitude": "-83.0938",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Columbus",
            "areaName": "Columbus"
        },
        {
            "stationType": "TD",
            "stationId": "4649",
            "internalStationId": "4649",
            "stationName": "Briggsdale",
            "latitude": "39.9205",
            "longitude": "-83.05603",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Columbus",
            "areaName": "Columbus"
        },
        {
            "stationType": "TD",
            "stationId": "984",
            "internalStationId": "984",
            "stationName": "Bexley",
            "latitude": "39.98174",
            "longitude": "-82.91254",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Columbus",
            "areaName": "Columbus"
        },
        {
            "stationType": "TD",
            "stationId": "1314",
            "internalStationId": "1314",
            "stationName": "Livingston Avenue",
            "latitude": "39.94724",
            "longitude": "-82.9152",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Columbus",
            "areaName": "Columbus"
        },
        {
            "stationType": "TC",
            "stationId": "GROPT",
            "internalStationId": "GROPT",
            "stationName": "Groveport TS",
            "latitude": "39.87916667",
            "longitude": "-82.88222222",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Ohio",
            "areaName": "Groveport"
        },
        {
            "stationType": "TC",
            "stationId": "BEATT",
            "internalStationId": "BEATT",
            "stationName": "Beatty TS",
            "latitude": "39.86277777",
            "longitude": "-83.12072222",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Ohio",
            "areaName": "Groveport"
        },
        {
            "stationType": "TC",
            "stationId": "HAYEN",
            "internalStationId": "HAYEN",
            "stationName": "Hayden TS",
            "latitude": "40.06005555",
            "longitude": "-83.19350000",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Ohio",
            "areaName": "Groveport"
        },
        {
            "stationType": "TC",
            "stationId": "CORDR",
            "internalStationId": "CORDR",
            "stationName": "Corridor TS",
            "latitude": "40.12283333",
            "longitude": "-82.84627777",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Ohio",
            "areaName": "Groveport"
        },
        {
            "stationType": "TC",
            "stationId": "DCONT",
            "internalStationId": "DCONT",
            "stationName": "DCON IT Telecom Training Center",
            "latitude": "39.99596345",
            "longitude": "-82.72873539",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Ohio",
            "areaName": "Groveport"
        },
        {
            "stationType": "TC",
            "stationId": "ETN",
            "internalStationId": "ETN",
            "stationName": "Etna TS",
            "latitude": "39.94325000",
            "longitude": "-82.70519444",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Ohio",
            "areaName": "Groveport"
        },
        {
            "stationType": "TC",
            "stationId": "MTSTG",
            "internalStationId": "MTSTG",
            "stationName": "Mt Sterling TS",
            "latitude": "39.72883333",
            "longitude": "-83.21436111",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Ohio",
            "areaName": "Groveport"
        },
        {
            "stationType": "TC",
            "stationId": "DELWR",
            "internalStationId": "DELWR",
            "stationName": "Delaware TS",
            "latitude": "40.27000000",
            "longitude": "-83.08194444",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Ohio",
            "areaName": "Groveport"
        },
        {
            "stationType": "TC",
            "stationId": "FRDIA",
            "internalStationId": "FRDIA",
            "stationName": "Fredonia TS",
            "latitude": "40.16352778",
            "longitude": "-82.61269444",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Ohio",
            "areaName": "Groveport"
        },
        {
            "stationType": "TC",
            "stationId": "DELAW",
            "internalStationId": "DELAW",
            "stationName": "Delaware POP",
            "latitude": "40.28777777",
            "longitude": "-83.80555550",
            "hasHazard": false,
            "hasOpenCheckIns": false,
            "regionName": "Ohio",
            "areaName": "Groveport"
        }
    ];

    var _userRole = 'Admin';

    var _getById = function (stationId) {
        return _.where(_stations, function (station) {
            return station.stationId === stationId;
        });
    };

    var _getByStationName = function (stationName) {
        return _.where(_stations, function (station) {
            return station.stationName.toLowerCase().indexOf(stationName || "".toLowerCase()) > -1;
        });
    };

    var _getByRegionName = function (regionName) {
        return _.where(_stations, function (station) {
            return station.regionName === regionName;
        });
    };

    var _getByAreaName = function (areaName) {
        return _.where(_stations, function (station) {
            return station.areaName === areaName;
        });
    };

    var _getByCoords = function (coords) {
        return _stations;
    };

    var StationService = function (options) {
        console.trace('new StationService()');
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(StationService.prototype, {
        initialize: function (options) {
            console.trace('StationService.initialize');
            options || (options = {});
        },
        getStationSearchOptions: function (options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var userRole;
            if (options.userRole) {
                userRole = options.userRole;
            } else {
                userRole = _userRole;
            }

            if (options.reject) {
                var serverError = new Error({ errorCode: options.errorCode, errorMessage: options.errorMessage });

                globals.window.setTimeout(function () {
                    deferred.rejectWith(currentContext, [serverError]);
                }, 200);
            } else {
                var results = {
                    userRole: userRole
                };

                globals.window.setTimeout(function () {
                    deferred.resolveWith(currentContext, [results]);
                }, 200);
            }

            return deferred.promise();
        },
        getStations: function (options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var stations;
            if (options.stationId) {
                stations = _getById(options.stationId);
            } else if (options.areaName) {
                stations = _getByRegionName(options.areaName);
            } else if (options.regionName) {
                stations = _getByRegionName(options.regionName);
            } else if (options.stationName) {
                stations = _getByStationName(options.stationName);
            } else if (options.coords) {
                stations = _getByCoords(options.coords);
            } else {
                stations = _stations;
            }

            var userRole;
            if (options.userRole) {
                userRole = options.userRole;
            } else {
                userRole = _userRole;
            }

            if (options.reject) {
                var serverError = new Error({errorCode: options.errorCode, errorMessage: options.errorMessage});

                globals.window.setTimeout(function () {
                    deferred.rejectWith(currentContext, [serverError]);
                }, 200);
            } else {
                var results = _.extend(options, {
                    stations: stations,
                    userRole: userRole
                });

                globals.window.setTimeout(function () {
                    deferred.resolveWith(currentContext, [results]);
                }, 200);
            }

            return deferred.promise();
        }
    });

    return StationService;
});