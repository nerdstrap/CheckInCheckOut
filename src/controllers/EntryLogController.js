define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        EntryLogService = require('services/EntryLogService'),
        GeoLocationService = require('services/GeoLocationService'),
        EntryLogModel = require('models/EntryLogModel'),
        //EntryLogView = require('views/EntryLogView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        globals = require('globals'),
        utils = require('utils');

    /**
     * Creates a new EntryLogController with the specified attributes.
     * @constructor
     * @param {object} options
     */
    var EntryLogController;
    EntryLogController = function (options) {
        console.trace('new EntryLogController()');
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(EntryLogController.prototype, Backbone.Events, {
        /** @class EntryLogController
         * @constructs EntryLogController object
         * @param {object} options
         */
        initialize: function (options) {
            console.trace('EntryLogController.initialize');
            options || (options = {});
            this.router = options.router;
            this.dispatcher = options.dispatcher;
            this.entryLogService = options.entryLogService || new EntryLogService();
            this.geoLocationService = options.geoLocationService || new GeoLocationService();

            //this.listenTo(this.dispatcher, AppEventNamesEnum.goToEntryLogWithId, this.goToEntryLogWithId);
            this.listenTo(this.dispatcher, AppEventNamesEnum.refreshEntryLogList, this.refreshEntryLogList);
            this.listenTo(this.dispatcher, AppEventNamesEnum.refreshEntryLogListByGps, this.refreshEntryLogListByGps);
            this.listenTo(this.dispatcher, AppEventNamesEnum.checkIn, this.checkIn);
        },

        //goToEntryLogWithId: function (entryLogId) {
        //    console.trace('EntryLogController.goToEntryLogWithId');
        //    var currentContext = this,
        //        deferred = $.Deferred();
        //
        //    var entryLogModelInstance = new EntryLogModel({entryLogId: entryLogId});
        //    var entryLogViewInstance = new EntryLogView({
        //        controller: currentContext,
        //        dispatcher: currentContext.dispatcher,
        //        model: entryLogModelInstance
        //    });
        //
        //    currentContext.router.swapContent(entryLogViewInstance);
        //    var fragmentAlreadyMatches = (Backbone.history.fragment === 'entryLog/' + entryLogId || Backbone.history.fragment === '');
        //    currentContext.router.navigate('entryLog/' + entryLogId, {replace: fragmentAlreadyMatches});
        //
        //    entryLogViewInstance.showLoading();
        //    currentContext.entryLogService.getEntryLogList({entryLogId: entryLogId})
        //        .then(function (getEntryLogListResponse) {
        //            currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getEntryLogListResponse.userRole);
        //            if (getEntryLogListResponse.entryLogList && getEntryLogListResponse.entryLogList.length > 0) {
        //                currentContext.geoLocationService.getCurrentPosition()
        //                    .then(function (position) {
        //                        utils.computeDistances(position.coords, getEntryLogListResponse.entryLogList);
        //                        entryLogModelInstance.reset(getEntryLogListResponse.entryLogList[0]);
        //                        entryLogViewInstance.hideLoading();
        //                        deferred.resolve(entryLogViewInstance);
        //                    });
        //            } else {
        //                entryLogModelInstance.reset();
        //                entryLogViewInstance.showError(utils.getResource('entryLogNotFoundErrorMessage'));
        //                entryLogViewInstance.hideLoading();
        //                deferred.reject(entryLogViewInstance);
        //            }
        //        })
        //        .fail(function (error) {
        //            entryLogModelInstance.reset();
        //            entryLogViewInstance.showError(utils.getResource('criticalSystemErrorMessage'));
        //            entryLogViewInstance.hideLoading();
        //            deferred.reject(entryLogViewInstance);
        //        });
        //
        //    return deferred.promise();
        //},

        refreshEntryLogList: function (entryLogCollectionInstance, options) {
            console.trace('EntryLogController.refreshEntryLogList');
            options || (options = {});
            var currentContext = this,
                deferred = $.Deferred();

            currentContext.entryLogService.getEntryLogList(options)
                .then(function (getEntryLogListResponse) {
                    currentContext.geoLocationService.getCurrentPosition()
                        .then(function (position) {
                            utils.computeDistances(position.coords, getEntryLogListResponse.entryLogList);
                            entryLogCollectionInstance.reset(getEntryLogListResponse.entryLogList);
                            deferred.resolve(entryLogCollectionInstance);
                        })
                        .fail(function(){
                            entryLogCollectionInstance.reset(getEntryLogListResponse.entryLogList);
                            deferred.resolve(entryLogCollectionInstance);
                        });
                })
                .fail(function (error) {
                    entryLogCollectionInstance.reset();
                    deferred.reject(entryLogCollectionInstance);
                });

            return deferred.promise();
        },

        refreshEntryLogListByGps: function (entryLogCollectionInstance, options) {
            console.trace('EntryLogController.refreshEntryLogList');
            options || (options = {});
            var currentContext = this,
                deferred = $.Deferred();

            currentContext.geoLocationService.getCurrentPosition()
                .then(function (position) {
                    currentContext.entryLogService.getEntryLogList(position)
                        .then(function (getEntryLogListResponse) {
                            utils.computeDistances(position.coords, getEntryLogListResponse.entryLogList);
                            entryLogCollectionInstance.reset(getEntryLogListResponse.entryLogList);
                            deferred.resolve(entryLogCollectionInstance);
                        })
                        .fail(function (error) {
                            entryLogCollectionInstance.reset();
                            deferred.reject(entryLogCollectionInstance);
                        });
                })
                .fail(function (error) {
                    entryLogCollectionInstance.reset();
                    deferred.reject(entryLogCollectionInstance);
                });

            return deferred.promise();
        },

        checkIn: function(entryLogModelInstance) {
            console.trace('EntryLogController.checkIn');
            var currentContext = this,
                deferred = $.Deferred();

            currentContext.entryLogService.postCheckIn(entryLogModelInstance.attributes)
                .done(function(postCheckInResponse) {
                    entryLogModelInstance.reset(postCheckInResponse.entryLog);
                    currentContext.dispatcher.trigger(AppEventNamesEnum.checkInSuccess, entryLogModelInstance);
                    deferred.resolve(entryLogModelInstance);
                })
                .fail(function(error) {
                    entryLogModelInstance.reset();
                    currentContext.dispatcher.trigger(AppEventNamesEnum.checkInError, error);
                    deferred.reject(entryLogModelInstance);
            });

            return deferred.promise();
        }
    });

    return EntryLogController;
});