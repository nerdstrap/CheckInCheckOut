define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        globals = require('globals'),
        env = require('env'),
        utils = require('utils');

    var _stationEntryLogs = [
        {
            "stationEntryLogId": "380",
            "stationId": "840",
            "personnelId": "S251201",
            "personnelName": "baltic, michael",
            "purpose": "milkawhat",
            "additionalInfo": "ermahgerd",
            "inTime": "1416959468287",
            "contactNumber": "6145551212",
            "email": "mebaltic@aep.com",
            "duration": "60",
            "stationName": "Station One",
            "latitude": "40.45",
            "longitude": "-75.50",
            "hasCrew": "true"
        },
        {
            "stationEntryLogId": "381",
            "stationId": "840",
            "personnelId": "S251202",
            "personnelName": "walden, heather",
            "purpose": "what a milk",
            "additionalInfo": "ermahgerd",
            "inTime": "1416959468487",
            "contactNumber": "6145551212",
            "email": "hmwalden@aep.com",
            "duration": "60",
            "stationName": "Station One",
            "latitude": "40.45",
            "longitude": "-75.50",
            "hasCrew": "true"
        },
        {
            "stationEntryLogId": "382",
            "stationId": "840",
            "personnelId": "S251203",
            "personnelName": "shu, shujing",
            "purpose": "burgers",
            "additionalInfo": "ermahgerd",
            "inTime": "1416959498287",
            "contactNumber": "6145551212",
            "email": "sshu@aep.com",
            "duration": "60",
            "stationName": "Station One",
            "latitude": "40.45",
            "longitude": "-75.50",
            "hasCrew": "true"
        },
        {
            "stationEntryLogId": "383",
            "stationId": "840",
            "personnelId": "S251204",
            "personnelName": "veit, alex",
            "purpose": "cake",
            "additionalInfo": "ermahgerd",
            "inTime": "1419959468287",
            "contactNumber": "6145551212",
            "email": "aaveit@aep.com",
            "duration": "60",
            "stationName": "Station One",
            "latitude": "40.45",
            "longitude": "-75.50",
            "hasCrew": "true"
        }
    ];

    var _userId = 'S251201';
    var _userRole = 'Admin';

    var _getById = function (stationEntryLogId) {
        return _.where(_stationEntryLogs, function (stationEntryLog) {
            return stationEntryLog.stationEntryLogId === stationEntryLogId;
        });
    };

    var _getByStationId = function (stationId) {
        return _.where(_stationEntryLogs, function (stationEntryLog) {
            return stationEntryLog.stationId === stationId;
        });
    };

    var _getByPersonnelId = function (personnelId) {
        return _.where(_stationEntryLogs, function (stationEntryLog) {
            return stationEntryLog.personnelId === personnelId;
        });
    };

    var _getByStatus = function (stationEntryLogs, status) {
        return _.where(stationEntryLogs, function (stationEntryLog) {
            return stationEntryLog.hasOwnProperty('outTime') === status;
        });
    };

    var _postCheckIn = function (stationEntryLog) {
        stationEntryLog.id = utils.getNewGuid();
        stationEntryLog.inTime = new Date().getTime();
        _stationEntryLogs.push(stationEntryLog);
        return stationEntryLog;
    };

    var _postEditCheckIn = function (stationEntryLogId, duration, additionalInfo) {
        var match = _.find(_stationEntryLogs, function (stationEntryLog) {
            return stationEntryLog.stationEntryLogId === stationEntryLogId;
        })

        if (match) {
            match.duration = duration;
            match.additionalInfo = additionalInfo;
        }

        return match;
    };

    var _postCheckOut = function (stationEntryLogId) {
        var match = _.find(_stationEntryLogs, function (stationEntryLog) {
            return stationEntryLog.stationEntryLogId === stationEntryLogId;
        })

        if (match) {
            match.outTime = new Date().getTime();
        }

        return match;
    };

    var _getByCoords = function (coords, distanceThreshold, searchResultsThreshold) {
        utils.computeDistances(coords, _stationEntryLogs);
        var nearbyStationEntryLogs = _.filter(_stationEntryLogs, function (stationEntryLog) {
            return stationEntryLog.distance <= distanceThreshold
        });
        if (nearbyStationEntryLogs.length > searchResultsThreshold) {
            nearbyStationEntryLogs = nearbyStationEntryLogs.slice(0, searchResultsThreshold);
        }
        var sortedNearbyStationEntryLogs = _.sortBy(nearbyStationEntryLogs, function (nearbyStationEntryLog) {
            return parseFloat(nearbyStationEntryLog.distance);
        });

        return sortedNearbyStationEntryLogs;
    };

    var StationEntryLogService = function (options) {
        console.trace('new StationEntryLogService()');
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(StationEntryLogService.prototype, {
        initialize: function (options) {
            console.trace('StationEntryLogService.initialize');
            options || (options = {});
        },
        getStationEntryLogSearchOptions: function (options) {
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
        getStationEntryLogs: function (options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var stationEntryLogs;
            if (options.stationEntryLogId) {
                stationEntryLogs = _getById(options.stationEntryLogId);
            } else if (options.stationId) {
                stationEntryLogs = _getByStationId(options.stationId);
            } else if (options.personnelId) {
                stationEntryLogs = _getByPersonnelId(options.stationId);
            } else if (options.coords) {
                stationEntryLogs = _getByCoords(options.coords, env.getDistanceThreshold(), env.getSearchResultsThreshold());
            } else {
                stationEntryLogs = _stationEntryLogs;
            }

            var userId = _userId;
            var userRole = _userRole;

            var results = _.extend(options, {
                stationEntryLogs: stationEntryLogs,
                userId: userId,
                userRole: userRole
            });

            globals.window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 50);

            return deferred.promise();
        },
        postCheckIn: function (options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var stationEntryLog = _postCheckIn(options);
            var userId = _userId;
            var userRole = _userRole;

            var results = {
                stationEntryLog: stationEntryLog,
                userId: userId,
                userRole: userRole
            };

            globals.window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 50);

            return deferred.promise();
        }
    });

    return StationEntryLogService;
});