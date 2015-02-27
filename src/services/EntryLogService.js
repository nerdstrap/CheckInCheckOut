define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        globals = require('globals'),
        env = require('env'),
        utils = require('utils'),
        meService = require('services/meService');

    var _entryLogList = [
        {
            "entryLogId": "380",
            "locusId": "840",
            "identityId": "S251201",
            "identityName": "baltic, michael",
            "purpose": "milkawhat",
            "additionalInfo": "ermahgerd",
            "inTime": "1416959468287",
            "contactNumber": "6145551212",
            "email": "mebaltic@aep.com",
            "duration": "60",
            "locusName": "Vine",
            "latitude": "39.97109",
            "longitude": "-83.00647",
            "hasCrew": "true"
        },
        {
            "entryLogId": "381",
            "locusId": "840",
            "identityId": "S212007",
            "identityName": "Huidobro, Heladio",
            "purpose": "what a milk",
            "additionalInfo": "ermahgerd",
            "inTime": "1416959468487",
            "contactNumber": "6145551212",
            "email": "hmwalden@aep.com",
            "duration": "60",
            "locusName": "Vine",
            "latitude": "39.97109",
            "longitude": "-83.00647",
            "hasCrew": "true"
        },
        {
            "entryLogId": "382",
            "locusId": "840",
            "identityId": "S210749",
            "identityName": "shu, shujing",
            "purpose": "burgers",
            "additionalInfo": "ermahgerd",
            "inTime": "1416959498287",
            "contactNumber": "6145551212",
            "email": "sshu@aep.com",
            "duration": "60",
            "locusName": "Vine",
            "latitude": "39.97109",
            "longitude": "-83.00647",
            "hasCrew": "true"
        },
        {
            "entryLogId": "383",
            "locusId": "840",
            "identityId": "S210938",
            "identityName": "Walton, Carrie",
            "purpose": "cake",
            "additionalInfo": "ermahgerd",
            "inTime": "1419959468287",
            "outTime": "1416959468887",
            "contactNumber": "6145551212",
            "email": "aaveit@aep.com",
            "duration": "60",
            "locusName": "Vine",
            "latitude": "39.97109",
            "longitude": "-83.00647",
            "hasCrew": "true"
        }
    ];

    var _openEntryLogs = [
        {
            "entryLogId": "380",
            "locusId": "840",
            "identityId": "S251201",
            "identityName": "baltic, michael",
            "purpose": "milkawhat",
            "additionalInfo": "ermahgerd",
            "inTime": "1416959468287",
            "contactNumber": "6145551212",
            "email": "mebaltic@aep.com",
            "duration": "60",
            "locusName": "Vine",
            "latitude": "39.97109",
            "longitude": "-83.00647",
            "hasCrew": "true"
        }
    ];

    var _identity = {"identityId": "S251201", "identityName": "Baltic, Michael E", "contactNumber": "6143239560", "email": "mebaltic@aep.com", "role": "Admin", "openEntryLogs": _openEntryLogs};

    var _purposes = [
        {
            "defaultDuration": "60",
            "purpose": "change something"
        },
        {
            "defaultDuration": "120",
            "purpose": "fix it"
        },
        {
            "defaultDuration": "480",
            "purpose": "turn it off"
        },
        {
            "defaultDuration": "",
            "purpose": "Other"
        }
    ];
    var _durations = [
        {
            "minutes": "30",
            "description": "30 minutes"
        },
        {
            "minutes": "60",
            "description": "1 hour"
        },
        {

            "minutes": "120",
            "description": "2 hours"
        },
        {
            "minutes": "360",
            "description": "3 hours"
        },
        {
            "minutes": "480",
            "description": "4 hours"
        }
    ];

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

    var _getByIdentityId = function (identityId) {
        return _.where(_entryLogList, function (entryLog) {
            return entryLog.identityId === identityId;
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
        meService.getIdentity().openEntryLogs.push(entryLog);
        return entryLog;
    };

    var _postEditCheckIn = function (entryLogAttributes) {
        var match = _.find(_entryLogList, function (entryLog) {
            return entryLog.entryLogId === entryLogAttributes.entryLogId;
        });

        if (match) {
            match.duration = entryLogAttributes.duration;
            match.additionalInfo = entryLogAttributes.additionalInfo;
        }

        return match;
    };

    var _postCheckOut = function (entryLogAttributes) {
        var match = _.find(_entryLogList, function (entryLog) {
            return entryLog.entryLogId === entryLogAttributes.entryLogId;
        });

        if (match) {
            match.outTime = new Date().getTime();
            meService.getIdentity().openEntryLogs.splice(0, 1);
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
        getEntryLogList: function (options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var entryLogList;
            if (options.entryLogId) {
                entryLogList = _getById(options.entryLogId);
            } else if (options.locusId) {
                entryLogList = _getByLocusId(options.locusId);
            } else if (options.identityId) {
                entryLogList = _getByIdentityId(options.identityId);
            } else if (options.coords) {
                entryLogList = _getByCoords(options.coords, env.getDistanceThreshold(), env.getSearchResultsThreshold());
            } else {
                entryLogList = _entryLogList;
            }

            var results = {
                identity: meService.getIdentity(),
                entryLogList: entryLogList
            };

            globals.window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 50);

            return deferred.promise();
        },
        getCheckInOptions: function (options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var results = {
                identity: meService.getIdentity(),
                purposes: _purposes,
                durations: _durations
            };

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

            var results = {
                entryLog: entryLog,
                identity: meService.getIdentity()
            };

            globals.window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 50);

            return deferred.promise();
        },
        postEditCheckIn: function (options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var entryLog = _postEditCheckIn(options);

            var results = {
                entryLog: entryLog,
                identity: meService.getIdentity()
            };

            globals.window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 50);

            return deferred.promise();
        },
        getCheckOutOptions: function (options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var results = {
                identity: meService.getIdentity(),
                durations: _durations
            };

            globals.window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 50);

            return deferred.promise();
        },
        postCheckOut: function (options) {
            options || (options = {});
            var currentContext = this;
            var deferred = $.Deferred();

            var entryLog = _postCheckOut(options);

            var results = {
                entryLog: entryLog,
                identity: meService.getIdentity()
            };

            globals.window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 50);

            return deferred.promise();
        }
    });

    return EntryLogService;
});