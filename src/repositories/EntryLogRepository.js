'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var utils = require('lib/utils');
var config = require('lib/config');

var _entryLogs = require('repositories/entryLogs.json');

var _getById = function (entryLogId) {
    return _.where(_entryLogs, {entryLogId: entryLogId});
};

var _getByLocusId = function (locusId) {
    return _.where(_entryLogs, {locusId: locusId});
};

var _getOpenByLocusId = function (locusId) {
    var filteredEntryLogs = _.filter(_entryLogs, function (entryLog) {
        return entryLog.locusId === locusId && entryLog.hasOwnProperty('outTime') === false;
    });
    return filteredEntryLogs;
};

var _getRecentByLocusId = function (locusId) {
    var filteredEntryLogs = _.filter(_entryLogs, function (entryLog) {
        return entryLog.locusId === locusId && entryLog.hasOwnProperty('outTime') === true;
    });
    return filteredEntryLogs;
};

var _getByIdentityId = function (identityId) {
    return _.where(_entryLogs, {identityId: identityId});
};

var _getOpenByIdentityId = function (identityId) {
    var filteredEntryLogs = _.filter(_entryLogs, function (entryLog) {
        return entryLog.identityId === identityId && entryLog.hasOwnProperty('outTime') === false;
    });
    return filteredEntryLogs;
};

var _getRecentByIdentityId = function (identityId) {
    var filteredEntryLogs = _.filter(_entryLogs, function (entryLog) {
        return entryLog.identityId === identityId && entryLog.hasOwnProperty('outTime') === true;
    });
    return filteredEntryLogs;
};

var _getByStatus = function (entryLogs, status) {
    return _.where(entryLogs, function (entryLog) {
        return entryLog.hasOwnProperty('outTime') === status;
    });
};

var _postCheckIn = function (entryLog) {
    entryLog.id = utils.getNewGuid();
    entryLog.inTime = new Date().getTime();
    _entryLogs.push(entryLog);
    return entryLog;
};

var _postEditCheckIn = function (entryLogAttributes) {
    var match = _.find(_entryLogs, function (entryLog) {
        return entryLog.entryLogId === entryLogAttributes.entryLogId;
    });

    if (match) {
        match.duration = entryLogAttributes.duration;
        match.additionalInfo = entryLogAttributes.additionalInfo;
    }

    return match;
};

var _postCheckOut = function (entryLogAttributes) {
    var match = _.find(_entryLogs, {entryLogId: entryLogAttributes.entryLogId});

    if (match) {
        match.outTime = new Date().getTime();
    }

    return match;
};

var _getByCoords = function (coords, distanceThreshold, searchResultsThreshold) {
    utils.computeDistances(coords, _entryLogs);
    var nearbyEntryLogs = _.filter(_entryLogs, function (entryLog) {
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

var EntryLogRepository = function (options) {
    options || (options = {});
    this.initialize.apply(this, arguments);
};

_.extend(EntryLogRepository.prototype, {
    initialize: function (options) {
        console.trace('EntryLogRepository.initialize');
        options || (options = {});
    },
    getEntryLogs: function (options) {
        options || (options = {});
        var currentContext = this;
        var deferred = $.Deferred();

        var entryLogs;
        if (options.entryLogId) {
            entryLogs = _getById(options.entryLogId);
        } else if (options.locusId) {
            if (options.open) {
                entryLogs = _getOpenByLocusId(options.locusId);
            } else if (options.recent) {
                entryLogs = _getRecentByLocusId(options.locusId);
            } else {
                entryLogs = _getByLocusId(options.locusId);
            }
        } else if (options.identityId) {
            if (options.open) {
                entryLogs = _getOpenByIdentityId(options.identityId);
            } else if (options.recent) {
                entryLogs = _getRecentByIdentityId(options.identityId);
            } else {
                entryLogs = _getByIdentityId(options.identityId);
            }
        } else if (options.coords) {
            entryLogs = _getByCoords(options.coords, config.app.distanceThreshold, config.app.searchResultsThreshold);
        } else if (options.open) {
            var identityId = config.myIdentity.identityId;
            entryLogs = _getOpenByIdentityId(identityId);
        } else {
            entryLogs = _entryLogs;
        }

        var results = {
            entryLogs: entryLogs
        };

        window.setTimeout(function () {
            deferred.resolveWith(currentContext, [results]);
        }, 20);

        return deferred.promise();
    },
    postCheckIn: function (options) {
        options || (options = {});
        var currentContext = this;
        var deferred = $.Deferred();

        var entryLog = _postCheckIn(options);

        var results = {
            entryLog: entryLog
        };

        window.setTimeout(function () {
            deferred.resolveWith(currentContext, [results]);
        }, 20);

        return deferred.promise();
    },
    postEditCheckIn: function (options) {
        options || (options = {});
        var currentContext = this;
        var deferred = $.Deferred();

        var entryLog = _postEditCheckIn(options);

        var results = {
            entryLog: entryLog
        };

        window.setTimeout(function () {
            deferred.resolveWith(currentContext, [results]);
        }, 20);

        return deferred.promise();
    },
    postCheckOut: function (options) {
        options || (options = {});
        var currentContext = this;
        var deferred = $.Deferred();

        var entryLog = _postCheckOut(options);

        var results = {
            entryLog: entryLog
        };

        window.setTimeout(function () {
            deferred.resolveWith(currentContext, [results]);
        }, 20);

        return deferred.promise();
    }
});

module.exports = EntryLogRepository;