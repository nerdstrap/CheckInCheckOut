define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        globals = require('globals'),
        env = require('env'),
        utils = require('utils');

    var _entryLogList = [
        {
            "entryLogId": "380",
            "locusId": "840",
            "personnelId": "S251201",
            "personnelName": "baltic, michael",
            "purpose": "milkawhat",
            "additionalInfo": "ermahgerd",
            "inTime": "1416959468287",
            "contactNumber": "6145551212",
            "email": "mebaltic@aep.com",
            "duration": "60",
            "locusName": "Locus One",
            "latitude": "40.45",
            "longitude": "-75.50",
            "hasCrew": "true"
        },
        {
            "entryLogId": "381",
            "locusId": "840",
            "personnelId": "S251202",
            "personnelName": "walden, heather",
            "purpose": "what a milk",
            "additionalInfo": "ermahgerd",
            "inTime": "1416959468487",
            "contactNumber": "6145551212",
            "email": "hmwalden@aep.com",
            "duration": "60",
            "locusName": "Locus One",
            "latitude": "40.45",
            "longitude": "-75.50",
            "hasCrew": "true"
        },
        {
            "entryLogId": "382",
            "locusId": "840",
            "personnelId": "S251203",
            "personnelName": "shu, shujing",
            "purpose": "burgers",
            "additionalInfo": "ermahgerd",
            "inTime": "1416959498287",
            "contactNumber": "6145551212",
            "email": "sshu@aep.com",
            "duration": "60",
            "locusName": "Locus One",
            "latitude": "40.45",
            "longitude": "-75.50",
            "hasCrew": "true"
        },
        {
            "entryLogId": "383",
            "locusId": "840",
            "personnelId": "S251204",
            "personnelName": "veit, alex",
            "purpose": "cake",
            "additionalInfo": "ermahgerd",
            "inTime": "1419959468287",
            "contactNumber": "6145551212",
            "email": "aaveit@aep.com",
            "duration": "60",
            "locusName": "Locus One",
            "latitude": "40.45",
            "longitude": "-75.50",
            "hasCrew": "true"
        }
    ];

    var _userId = 'S251201';
    var _userRole = 'Admin';

    var _getById = function (entryLogId) {
        return _.where(_entryLogList, function (entryLog) {
            return entryLog.entryLogId === entryLogId;
        });
    };

    var _getByLocusId = function (locusId) {
        return _.where(_entryLogList, function (entryLog) {
            return entryLog.locusId === locusId;
        });
    };

    var _getByPersonnelId = function (personnelId) {
        return _.where(_entryLogList, function (entryLog) {
            return entryLog.personnelId === personnelId;
        });
    };

    var _getByStatus = function (entryLogList, status) {
        return _.where(entryLogList, function (entryLog) {
            return entryLog.hasOwnProperty('outTime') === status;
        });
    };

    var _postCheckIn = function (entryLog) {
        entryLog.id = utils.getNewGuid();
        entryLog.inTime = new Date().getTime();
        _entryLogList.push(entryLog);
        return entryLog;
    };

    var _postEditCheckIn = function (entryLogId, duration, additionalInfo) {
        var match = _.find(_entryLogList, function (entryLog) {
            return entryLog.entryLogId === entryLogId;
        })

        if (match) {
            match.duration = duration;
            match.additionalInfo = additionalInfo;
        }

        return match;
    };

    var _postCheckOut = function (entryLogId) {
        var match = _.find(_entryLogList, function (entryLog) {
            return entryLog.entryLogId === entryLogId;
        })

        if (match) {
            match.outTime = new Date().getTime();
        }

        return match;
    };

    var _getByCoords = function (coords, distanceThreshold, searchResultsThreshold) {
        utils.computeDistances(coords, _entryLogList);
        var nearbyEntryLogs = _.filter(_entryLogList, function (entryLog) {
            return entryLog.distance <= distanceThreshold
        });
        if (nearbyEntryLogs.length > searchResultsThreshold) {
            nearbyEntryLogs = nearbyEntryLogs.slice(0, searchResultsThreshold);
        }
        var sortedNearbyEntryLogs = _.sortBy(nearbyEntryLogs, function (nearbyEntryLog) {
            return parseFloat(nearbyEntryLog.distance);
        });

        return sortedNearbyEntryLogs;
    };

    var EntryLogService = function (options) {
        console.trace('new EntryLogService()');
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(EntryLogService.prototype, {
        initialize: function (options) {
            console.trace('EntryLogService.initialize');
            options || (options = {});
        },
        getEntryLogOptions: function (options) {
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
        getEntryLogList: function (options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var entryLogList;
            if (options.entryLogId) {
                entryLogList = _getById(options.entryLogId);
            } else if (options.locusId) {
                entryLogList = _getByLocusId(options.locusId);
            } else if (options.personnelId) {
                entryLogList = _getByPersonnelId(options.personnelId);
            } else if (options.coords) {
                entryLogList = _getByCoords(options.coords, env.getDistanceThreshold(), env.getSearchResultsThreshold());
            } else {
                entryLogList = _entryLogList;
            }

            var userId = _userId;
            var userRole = _userRole;

            var results = _.extend(options, {
                entryLogList: entryLogList,
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

            var entryLog = _postCheckIn(options);
            var userId = _userId;
            var userRole = _userRole;

            var results = {
                entryLog: entryLog,
                userId: userId,
                userRole: userRole
            };

            globals.window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 50);

            return deferred.promise();
        }
    });

    return EntryLogService;
});