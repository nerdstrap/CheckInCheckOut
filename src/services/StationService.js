define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        globals = require('globals'),
        env = require('env');

    var inMemoryStations = [
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

    var inMemoryUserRole = 'Admin';

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
        getSearchOptions: function (options) {

            var deferred = $.Deferred();
            var results = {
                userRole: inMemoryUserRole
            };
            globals.window.setTimeout(function () {
                deferred.resolve(results, 'success', null);
            }, 3000);
            return deferred.promise();
        },
        getStations: function (options) {
            options || (options = {});

            var stations;
            if (options.stationId) {
                stations = _.where(inMemoryStations, function (station) {
                    return station.stationId === options.stationId;
                });
            } else if (options.areaName) {
                stations = _.where(inMemoryStations, function (station) {
                    return station.areaName === options.areaName;
                });
            } else if (options.regionName) {
                stations = _.where(inMemoryStations, function (station) {
                    return station.regionName === options.regionName;
                });
            } else if (options.coords) {
                console.log('getByGps was invoked');
                stations = inMemoryStations;
            } else {
                stations = inMemoryStations;
            }

            var deferred = $.Deferred();
            var results = {
                stations: stations,
                userRole: inMemoryUserRole
            };
            globals.window.setTimeout(function () {
                deferred.resolve(results, 'success', null);
            }, 3000);
            return deferred.promise();
        }
    });

    return StationService;
});