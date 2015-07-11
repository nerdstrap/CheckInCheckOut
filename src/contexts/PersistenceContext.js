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

_.extend(PersistenceContext.prototype, Backbone.Events, {
    /**
     *
     * @param options
     */
    initialize: function (options) {
        console.trace('PersistenceContext.initialize');
        options || (options = {});
        this.dispatcher = options.dispatcher;
        this.identityRepository = options.identityRepository;
        this.locusRepository = options.locusRepository;
        this.entryLogRepository = options.entryLogRepository;
        this.lookupDataRepository = options.lookupDataRepository;
        this.reportRepository = options.reportRepository;
        this.issueRepository = options.issueRepository;
        this.geoLocationService = options.geoLocationService;
        this.mapper = options.mapper;

        this.listenTo(this.dispatcher, EventNameEnum.refreshLocusCollection, this.refreshLocusCollection);
        this.listenTo(this.dispatcher, EventNameEnum.refreshEntryLogCollection, this.refreshEntryLogCollection);
        this.listenTo(this.dispatcher, EventNameEnum.checkIn, this.checkIn);
        this.listenTo(this.dispatcher, EventNameEnum.checkOut, this.checkOut);
    },

    /**
     *
     * @param myIdentityModel
     * @param openEntryLogModel
     * @returns {promise}
     */
    getMyIdentityAndOpenEntryLogs: function (myIdentityModel, openEntryLogModel) {
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
        options || (options = {});
        var currentContext = this;
        var deferred = $.Deferred();

        locusCollection.trigger('sync');
        if (searchType === SearchTypeEnum.nearby) {
            currentContext.geoLocationService.getCurrentPosition()
                .then(function (position) {
                    var getNearbyLociRequest = _.extend({}, options, position);
                    currentContext.locusRepository.getLoci(getNearbyLociRequest)
                        .then(function (getNearbyLociResponse) {
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
                .then(function (getLociResponse) {
                    currentContext.geoLocationService.getCurrentPosition()
                        .then(function (position) {
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
        options || (options = {});
        var currentContext = this;
        var deferred = $.Deferred();

        entryLogCollection.trigger('sync');
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
     * @param entryLogModel
     * @returns {promise}
     */
    checkIn: function (entryLogModel) {
        var currentContext = this;
        var deferred = $.Deferred();

        var checkInRequest = _.extend({}, entryLogModel.attributes);
        currentContext.entryLogRepository.postCheckIn(checkInRequest)
            .done(function (checkInResponse) {
                entryLogModel.set(checkInResponse.entryLog);
                currentContext.dispatcher.trigger(EventNameEnum.checkInSuccess, entryLogModel);
                deferred.resolve(entryLogModel);
            })
            .fail(function (error) {
                currentContext.dispatcher.trigger(EventNameEnum.checkInError, error);
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
        console.trace('EntryLogController.checkOut');
        var currentContext = this,
            deferred = $.Deferred();

        var checkOutRequest = _.extend({}, entryLogModel.attributes);
        currentContext.entryLogRepository.postCheckOut(checkOutRequest)
            .done(function (checkOutResponse) {
                entryLogModel.set(checkOutResponse.entryLog);
                currentContext.dispatcher.trigger(EventNameEnum.checkOutSuccess, entryLogModel);
                deferred.resolve(entryLogModel);
            })
            .fail(function (error) {
                currentContext.dispatcher.trigger(EventNameEnum.checkOutError, error);
                deferred.reject(error);
            });

        return deferred.promise();
    }

});

module.exports = PersistenceContext;