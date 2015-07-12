'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var EventNameEnum = require('enums/EventNameEnum');
var SearchTypeEnum = require('enums/SearchTypeEnum');
var utils = require('lib/utils');

/**
 *
 * @param options
 * @constructor
 */
var PersistenceContext = function (options) {
    options || (options = {});
    this.initialize.apply(this, arguments);
};

_.extend(PersistenceContext.prototype, {
    /**
     *
     * @param options
     */
    initialize: function (options) {
        console.trace('PersistenceContext.initialize');
        options || (options = {});
        this.identityRepository = options.identityRepository;
        this.locusRepository = options.locusRepository;
        this.entryLogRepository = options.entryLogRepository;
        this.lookupDataRepository = options.lookupDataRepository;
        this.reportRepository = options.reportRepository;
        this.issueRepository = options.issueRepository;
        this.geoLocationService = options.geoLocationService;
        this.mapper = options.mapper;
    },

    /**
     *
     * @param myIdentityModel
     * @param openEntryLogModel
     * @returns {promise}
     */
    getMyIdentityAndOpenEntryLogs: function (myIdentityModel, openEntryLogModel) {
        console.trace('PersistenceContext.getMyIdentityAndOpenEntryLogs');
        var currentContext = this;
        var deferred = $.Deferred();

        var getOpenEntryLogsRequest = {
            open: true
        };
        $.when(currentContext.identityRepository.getMyIdentity(), currentContext.entryLogRepository.getEntryLogs(getOpenEntryLogsRequest))
            .done(function (getMyIdentityResponse, getOpenEntryLogsResponse) {
                currentContext.mapper.mapGetIdentityResponse(getMyIdentityResponse, myIdentityModel);
                currentContext.mapper.mapGetEntryLogsResponse(getOpenEntryLogsResponse, openEntryLogModel);
                deferred.resolve(myIdentityModel, openEntryLogModel);
            })
            .fail(function (error) {
                deferred.reject(error);
            });

        return deferred.promise();
    },

    /**
     *
     * @param locusModel
     * @returns {promise}
     */
    getLocusById: function (locusModel) {
        console.trace('PersistenceContext.getLocusById');
        var currentContext = this;
        var deferred = $.Deferred();

        var getLocusByIdRequest = _.extend({}, locusModel.attributes);
        $.when(currentContext.locusRepository.getLoci(getLocusByIdRequest))
            .done(function (getLociResponse) {
                currentContext.mapper.mapGetLociResponse(getLociResponse, locusModel);
                deferred.resolve(locusModel);
            })
            .fail(function (error) {
                deferred.reject(error);
            });

        return deferred.promise();
    },

    /**
     *
     * @param purposeCollection
     * @param durationCollection
     * @returns {promise}
     */
    getOptions: function (purposeCollection, durationCollection) {
        console.trace('PersistenceContext.getOptions');
        var currentContext = this;
        var deferred = $.Deferred();

        $.when(currentContext.lookupDataRepository.getPurposes(), currentContext.lookupDataRepository.getDurations())
            .done(function (getPurposesResponse, getDurationsResponse) {
                purposeCollection.reset(getPurposesResponse.purposes);
                durationCollection.reset(getDurationsResponse.durations);
                deferred.resolve(purposeCollection, durationCollection);
            })
            .fail(function (error) {
                deferred.reject(error);
            });

        return deferred.promise();
    },

    /**
     *
     * @param locusCollection
     * @param searchType
     * @param options
     * @returns {promise}
     */
    refreshLocusCollection: function (locusCollection, searchType, options) {
        console.trace('PersistenceContext.refreshLocusCollection');
        options || (options = {});
        var currentContext = this;
        var deferred = $.Deferred();

        if (searchType === SearchTypeEnum.nearby) {
            currentContext.geoLocationService.getCurrentPosition()
                .done(function (position) {
                    var getNearbyLociRequest = _.extend({}, options, position);
                    currentContext.locusRepository.getLoci(getNearbyLociRequest)
                        .done(function (getNearbyLociResponse) {
                            utils.computeDistances(position.coords, getNearbyLociResponse.loci);
                            locusCollection.reset(getNearbyLociResponse.loci);
                            deferred.resolve(locusCollection);
                        })
                        .fail(function (error) {
                            locusCollection.reset();
                            deferred.reject(error);
                        });
                })
                .fail(function (error) {
                    locusCollection.trigger('error');
                    deferred.reject(error);
                });
        } else {
            var getLociRequest = _.extend({}, options);
            currentContext.locusRepository.getLoci(getLociRequest)
                .done(function (getLociResponse) {
                    currentContext.geoLocationService.getCurrentPosition()
                        .done(function (position) {
                            utils.computeDistances(position.coords, getLociResponse.loci);
                            locusCollection.reset(getLociResponse.loci);
                            deferred.resolve(locusCollection);
                        })
                        .fail(function (error) {
                            locusCollection.reset(getLociResponse.loci);
                            deferred.resolve(locusCollection);
                        });
                })
                .fail(function (error) {
                    locusCollection.trigger('error');
                    deferred.reject(error);
                });
        }

        return deferred.promise();
    },

    /**
     *
     * @param entryLogCollection
     * @param searchType
     * @param options
     * @returns {promise}
     */
    refreshEntryLogCollection: function (entryLogCollection, searchType, options) {
        console.trace('PersistenceContext.refreshEntryLogCollection');
        options || (options = {});
        var currentContext = this;
        var deferred = $.Deferred();

        if (searchType === SearchTypeEnum.nearby) {
            currentContext.geoLocationService.getCurrentPosition()
                .then(function (position) {
                    var getNearbyEntryLogsRequest = _.extend({}, options, position);
                    currentContext.entryLogRepository.getEntryLogs(getNearbyEntryLogsRequest)
                        .then(function (getNearbyEntryLogsResponse) {
                            utils.computeDistances(position.coords, getNearbyEntryLogsResponse.entryLogs);
                            entryLogCollection.reset(getNearbyEntryLogsResponse.entryLogs);
                            deferred.resolve(entryLogCollection);
                        })
                        .fail(function (error) {
                            entryLogCollection.trigger('error');
                            deferred.reject(error);
                        });
                })
                .fail(function (error) {
                    entryLogCollection.trigger('error');
                    deferred.reject(error);
                });
        } else {
            var getEntryLogsRequest = _.extend({}, options);
            currentContext.entryLogRepository.getEntryLogs(getEntryLogsRequest)
                .then(function (getEntryLogsResponse) {
                    currentContext.geoLocationService.getCurrentPosition()
                        .then(function (position) {
                            utils.computeDistances(position.coords, getEntryLogsResponse.entryLogs);
                            entryLogCollection.reset(getEntryLogsResponse.entryLogs);
                            deferred.resolve(entryLogCollection);
                        })
                        .fail(function (error) {
                            entryLogCollection.reset(getEntryLogsResponse.entryLogs);
                            deferred.resolve(entryLogCollection);
                        });
                })
                .fail(function (error) {
                    entryLogCollection.trigger('error');
                    deferred.reject(error);
                });
        }

        return deferred.promise();
    },


    /**
     *
     * @param issueCollection
     * @param options
     * @returns {promise}
     */
    refreshIssueCollection: function (issueCollection, options) {
        console.trace('PersistenceContext.refreshIssueCollection');
        options || (options = {});
        var currentContext = this;
        var deferred = $.Deferred();

        var getIssuesRequest = _.extend({}, options);
        currentContext.issueRepository.getIssues(getIssuesRequest)
            .done(function (getIssuesResponse) {
                issueCollection.reset(getIssuesResponse.issues);
                deferred.resolve(issueCollection);
            })
            .fail(function (error) {
                issueCollection.trigger('error');
                deferred.reject(error);
            });

        return deferred.promise();
    },


    /**
     *
     * @param reportCollection
     * @param options
     * @returns {promise}
     */
    refreshReportCollection: function (reportCollection, options) {
        console.trace('PersistenceContext.refreshReportCollection');
        options || (options = {});
        var currentContext = this;
        var deferred = $.Deferred();

        var getReportsRequest = _.extend({}, options);
        currentContext.reportRepository.getReports(getReportsRequest)
            .done(function (getReportsResponse) {
                reportCollection.reset(getReportsResponse.reports);
                deferred.resolve(reportCollection);
            })
            .fail(function (error) {
                reportCollection.trigger('error');
                deferred.reject(error);
            });

        return deferred.promise();
    },

    /**
     *
     * @param entryLogModel
     * @returns {promise}
     */
    checkIn: function (entryLogModel) {
        console.trace('PersistenceContext.checkIn');
        var currentContext = this;
        var deferred = $.Deferred();

        var checkInRequest = _.extend({}, entryLogModel.attributes);
        currentContext.entryLogRepository.postCheckIn(checkInRequest)
            .done(function (checkInResponse) {
                entryLogModel.set(checkInResponse.entryLog);
                deferred.resolve(entryLogModel);
            })
            .fail(function (error) {
                deferred.reject(error);
            });

        return deferred.promise();
    },

    /**
     *
     * @param entryLogModel
     * @returns {promise}
     */
    editCheckIn: function (entryLogModel) {
        console.trace('PersistenceContext.editCheckIn');
        var currentContext = this,
            deferred = $.Deferred();

        var editCheckInRequest = _.extend({}, entryLogModel.attributes);
        currentContext.entryLogRepository.postEditCheckIn(editCheckInRequest)
            .done(function (editCheckInResponse) {
                entryLogModel.set(editCheckInResponse.entryLog);
                deferred.resolve(entryLogModel);
            })
            .fail(function (error) {
                deferred.reject(error);
            });

        return deferred.promise();
    },

    /**
     *
     * @param entryLogModel
     * @returns {promise}
     */
    checkOut: function (entryLogModel) {
        console.trace('PersistenceContext.checkOut');
        var currentContext = this,
            deferred = $.Deferred();

        var checkOutRequest = _.extend({}, entryLogModel.attributes);
        currentContext.entryLogRepository.postCheckOut(checkOutRequest)
            .done(function (checkOutResponse) {
                entryLogModel.set(checkOutResponse.entryLog);
                deferred.resolve(entryLogModel);
            })
            .fail(function (error) {
                deferred.reject(error);
            });

        return deferred.promise();
    }

});

module.exports = PersistenceContext;