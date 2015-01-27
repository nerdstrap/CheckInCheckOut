define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        globals = require('globals'),
        env = require('env');

    var _stations = [
        {
            'stationId': '1',
            'stationName': 'Station 1',
            'latitude': '34.00',
            'longitude': '-95.46',
            'regionName': 'region 1',
            'areaName': 'area 1'
        },
        {
            'stationId': '2',
            'stationName': 'Second Station',
            'latitude': '34.00',
            'longitude': '-95.46',
            'regionName': 'region 1',
            'areaName': 'area 1'
        },
        {
            'stationId': '3',
            'stationName': '3rd Station',
            'latitude': '34.00',
            'longitude': '-95.46',
            'regionName': 'region 1',
            'areaName': 'area 2'
        },
        {
            'stationId': '4',
            'stationName': 'Station Four',
            'latitude': '34.00',
            'longitude': '-95.46',
            'regionName': 'region 1',
            'areaName': 'area 2'
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
            return station.stationName === stationName;
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
                var errorCode = options.errorCode;
                var errorMessage = options.errorMessage;

                globals.window.setTimeout(function () {
                    deferred.rejectWith(currentContext, [errorCode, errorMessage]);
                }, 1000);
            } else {
                var results = {
                    userRole: userRole
                };

                globals.window.setTimeout(function () {
                    deferred.resolveWith(currentContext, [results]);
                }, 1000);
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
                console.trace('coords');
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
                var errorCode = options.errorCode;
                var errorMessage = options.errorMessage;

                globals.window.setTimeout(function () {
                    deferred.rejectWith(currentContext, [errorCode, errorMessage]);
                }, 1000);
            } else {
                var results = {
                    stations: stations,
                    userRole: userRole
                };

                globals.window.setTimeout(function () {
                    deferred.resolveWith(currentContext, [results]);
                }, 1000);
            }

            return deferred.promise();
        }
    });

    return StationService;
});