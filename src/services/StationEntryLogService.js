define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        globals = require('globals'),
        env = require('env');

    var _stationEntryLogs = [
    ];

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

    var _getByCoords = function (coords) {
        return _stationEntryLogs;
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
                }, 50);
            } else {
                var results = {
                    userRole: userRole
                };

                globals.window.setTimeout(function () {
                    deferred.resolveWith(currentContext, [results]);
                }, 50);
            }

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
            } else if (options.coords) {
                stationEntryLogs = _getByCoords(options.coords);
            } else {
                stationEntryLogs = _stationEntryLogs;
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
                }, 50);
            } else {
                var results = _.extend(options, {
                    stationEntryLogs: stationEntryLogs,
                    userRole: userRole
                });

                globals.window.setTimeout(function () {
                    deferred.resolveWith(currentContext, [results]);
                }, 50);
            }

            return deferred.promise();
        }
    });

    return StationEntryLogService;
});