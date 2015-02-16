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
            "identityId": "S251201",
            "identityName": "baltic, michael",
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
            "identityId": "S251202",
            "identityName": "walden, heather",
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
            "identityId": "S251203",
            "identityName": "shu, shujing",
            "purpose": "burgers",
            "additionalInfo": "ermahgerd",
            "inTime": "1416959498287",
            "outTime": "1416959498287",
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
            "identityId": "S251204",
            "identityName": "veit, alex",
            "purpose": "cake",
            "additionalInfo": "ermahgerd",
            "inTime": "1419959468287",
            "outTime": "1419959468287",
            "contactNumber": "6145551212",
            "email": "aaveit@aep.com",
            "duration": "60",
            "locusName": "Locus One",
            "latitude": "40.45",
            "longitude": "-75.50",
            "hasCrew": "true"
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
        }
    ];
    var _durations = [
        {
            "value": "30",
            "description": "30 minutes"
        },
        {
            "value": "60",
            "description": "1 hour"
        },
        {

            "value": "120",
            "description": "2 hours"
        },
        {
            "value": "360",
            "description": "3 hours"
        },
        {
            "value": "480",
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

    var _getByidentityId = function (identityId) {
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
        return entryLog;
    };

    var _postEditCheckIn = function (entryLogAttributes) {
        var match = _.find(_entryLogList, function (entryLog) {
            return entryLog.entryLogId === entryLogAttributes.entryLogId;
        })

        if (match) {
            match.duration = entryLogAttributes.duration;
            match.additionalInfo = entryLogAttributes.additionalInfo;
        }

        return match;
    };

    var _postCheckOut = function (entryLogAttributes) {
        var match = _.find(_entryLogList, function (entryLog) {
            return entryLog.entryLogId === entryLogAttributes.entryLogId;
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
                entryLogList = _getByidentityId(options.identityId);
            } else if (options.coords) {
                entryLogList = _getByCoords(options.coords, env.getDistanceThreshold(), env.getSearchResultsThreshold());
            } else {
                entryLogList = _entryLogList;
            }

            var results = {
                entryLogList: entryLogList,
                identity: _userIdentity
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
                identity: _userIdentity,
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
                identity: _userIdentity
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
                identity: _userIdentity
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
                identity: _userIdentity
            };

            globals.window.setTimeout(function () {
                deferred.resolveWith(currentContext, [results]);
            }, 50);

            return deferred.promise();
        }
    });

    return EntryLogService;
});