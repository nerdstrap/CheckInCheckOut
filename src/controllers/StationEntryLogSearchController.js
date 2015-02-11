define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        StationEntryLogService = require('services/StationEntryLogService'),
        GeoLocationService = require('services/GeoLocationService'),
        StationEntryLogModel = require('models/StationEntryLogModel'),
        //StationEntryLogView = require('views/StationEntryLogView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        globals = require('globals'),
        utils = require('utils');

    /**
     * Creates a new StationEntryLogSearchController with the specified attributes.
     * @constructor
     * @param {object} options
     */
    var StationEntryLogSearchController;
    StationEntryLogSearchController = function (options) {
        console.trace('new StationEntryLogSearchController()');
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(StationEntryLogSearchController.prototype, Backbone.Events, {
        /** @class StationEntryLogSearchController
         * @constructs StationEntryLogSearchController object
         * @param {object} options
         */
        initialize: function (options) {
            console.trace('StationEntryLogSearchController.initialize');
            options || (options = {});
            this.router = options.router;
            this.dispatcher = options.dispatcher;
            this.stationEntryLogService = options.stationEntryLogService || new StationEntryLogService();
            this.geoLocationService = options.geoLocationService || new GeoLocationService();

            //this.listenTo(this.dispatcher, AppEventNamesEnum.goToStationEntryLogWithId, this.goToStationEntryLogWithId);
            this.listenTo(this.dispatcher, AppEventNamesEnum.refreshStationEntryLogs, this.refreshStationEntryLogs);
            this.listenTo(this.dispatcher, AppEventNamesEnum.refreshStationEntryLogsByGps, this.refreshStationEntryLogsByGps);
            this.listenTo(this.dispatcher, AppEventNamesEnum.checkIn, this.checkIn);
        },

        //goToStationEntryLogWithId: function (stationEntryLogId) {
        //    console.trace('StationEntryLogSearchController.goToStationEntryLogWithId');
        //    var currentContext = this,
        //        deferred = $.Deferred();
        //
        //    var stationEntryLogModelInstance = new StationEntryLogModel({stationEntryLogId: stationEntryLogId});
        //    var stationEntryLogViewInstance = new StationEntryLogView({
        //        controller: currentContext,
        //        dispatcher: currentContext.dispatcher,
        //        model: stationEntryLogModelInstance
        //    });
        //
        //    currentContext.router.swapContent(stationEntryLogViewInstance);
        //    var fragmentAlreadyMatches = (Backbone.history.fragment === 'stationEntryLog/' + stationEntryLogId || Backbone.history.fragment === '');
        //    currentContext.router.navigate('stationEntryLog/' + stationEntryLogId, {replace: fragmentAlreadyMatches});
        //
        //    stationEntryLogViewInstance.showLoading();
        //    currentContext.stationEntryLogService.getStationEntryLogs({stationEntryLogId: stationEntryLogId})
        //        .then(function (getStationEntryLogsResponse) {
        //            currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getStationEntryLogsResponse.userRole);
        //            if (getStationEntryLogsResponse.stationEntryLogs && getStationEntryLogsResponse.stationEntryLogs.length > 0) {
        //                currentContext.geoLocationService.getCurrentPosition()
        //                    .then(function (position) {
        //                        utils.computeDistances(position.coords, getStationEntryLogsResponse.stationEntryLogs);
        //                        stationEntryLogModelInstance.reset(getStationEntryLogsResponse.stationEntryLogs[0]);
        //                        stationEntryLogViewInstance.hideLoading();
        //                        deferred.resolve(stationEntryLogViewInstance);
        //                    });
        //            } else {
        //                stationEntryLogModelInstance.reset();
        //                stationEntryLogViewInstance.showError(utils.getResource('stationEntryLogNotFoundErrorMessage'));
        //                stationEntryLogViewInstance.hideLoading();
        //                deferred.reject(stationEntryLogViewInstance);
        //            }
        //        })
        //        .fail(function (error) {
        //            stationEntryLogModelInstance.reset();
        //            stationEntryLogViewInstance.showError(utils.getResource('criticalSystemErrorMessage'));
        //            stationEntryLogViewInstance.hideLoading();
        //            deferred.reject(stationEntryLogViewInstance);
        //        });
        //
        //    return deferred.promise();
        //},

        refreshStationEntryLogs: function (stationEntryLogCollectionInstance, options) {
            console.trace('StationEntryLogSearchController.refreshStationEntryLogs');
            options || (options = {});
            var currentContext = this,
                deferred = $.Deferred();

            currentContext.stationEntryLogService.getStationEntryLogs(options)
                .then(function (getStationEntryLogsResponse) {
                    currentContext.geoLocationService.getCurrentPosition()
                        .then(function (position) {
                            utils.computeDistances(position.coords, getStationEntryLogsResponse.stationEntryLogs);
                            stationEntryLogCollectionInstance.reset(getStationEntryLogsResponse.stationEntryLogs);
                            deferred.resolve(stationEntryLogCollectionInstance);
                        })
                        .fail(function(){
                            stationEntryLogCollectionInstance.reset(getStationEntryLogsResponse.stationEntryLogs);
                            deferred.resolve(stationEntryLogCollectionInstance);
                        });
                })
                .fail(function (error) {
                    stationEntryLogCollectionInstance.reset();
                    deferred.reject(stationEntryLogCollectionInstance);
                });

            return deferred.promise();
        },

        refreshStationEntryLogsByGps: function (stationEntryLogCollectionInstance, options) {
            console.trace('StationEntryLogSearchController.refreshStationEntryLogs');
            options || (options = {});
            var currentContext = this,
                deferred = $.Deferred();

            currentContext.geoLocationService.getCurrentPosition()
                .then(currentContext.stationEntryLogService.getStationEntryLogs)
                .then(function (getStationEntryLogsResponse) {
                    utils.computeDistances(getStationEntryLogsResponse.coords, getStationEntryLogsResponse.stationEntryLogs);
                    stationEntryLogCollectionInstance.reset(getStationEntryLogsResponse.stationEntryLogs);
                    deferred.resolve(stationEntryLogCollectionInstance);
                })
                .fail(function (error) {
                    stationEntryLogCollectionInstance.reset();
                    deferred.reject(stationEntryLogCollectionInstance);
                });

            return deferred.promise();
        },

        checkIn: function(stationEntryLogModelInstance) {
            console.trace('StationEntryLogSearchController.checkIn');
            var currentContext = this,
                deferred = $.Deferred();

            currentContext.stationEntryLogService.postCheckIn(stationEntryLogModelInstance.attributes)
                .done(function(postCheckInResponse) {
                    stationEntryLogModelInstance.reset(postCheckInResponse.stationEntryLog);
                    currentContext.dispatcher.trigger(AppEventNamesEnum.checkInSuccess, stationEntryLogModelInstance);
                    deferred.resolve(stationEntryLogModelInstance);
                })
                .fail(function(error) {
                    stationEntryLogModelInstance.reset();
                    currentContext.dispatcher.trigger(AppEventNamesEnum.checkInError, error);
                    deferred.reject(stationEntryLogModelInstance);
            });

            return deferred.promise();
        }
    });

    return StationEntryLogSearchController;
});