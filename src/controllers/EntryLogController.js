define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        EntryLogService = require('services/EntryLogService'),
        GeoLocationService = require('services/GeoLocationService'),
        EntryLogModel = require('models/EntryLogModel'),
        EntryLogCollection = require('collections/EntryLogCollection'),
        CheckInView = require('views/CheckInView'),
        CheckOutView = require('views/CheckOutView'),
        EventNamesEnum = require('enums/EventNamesEnum'),
        utils = require('utils');

    /**
     *
     * @param options
     * @constructor
     */
    var EntryLogController = function (options) {
        console.trace('new EntryLogController()');
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(EntryLogController.prototype, Backbone.Events, {
        /**
         *
         * @param options
         */
        initialize: function (options) {
            console.trace('EntryLogController.initialize');
            options || (options = {});
            this.router = options.router;
            this.dispatcher = options.dispatcher;
            this.entryLogService = options.entryLogService || new EntryLogService();
            this.geoLocationService = options.geoLocationService || new GeoLocationService();

            this.listenTo(this.dispatcher, EventNamesEnum.refreshEntryLogList, this.refreshEntryLogList);
            this.listenTo(this.dispatcher, EventNamesEnum.refreshEntryLogListByGps, this.refreshEntryLogListByGps);
            this.listenTo(this.dispatcher, EventNamesEnum.goToCheckIn, this.goToCheckIn);
            this.listenTo(this.dispatcher, EventNamesEnum.checkIn, this.checkIn);
            this.listenTo(this.dispatcher, EventNamesEnum.goToCheckOut, this.goToCheckOut);
            this.listenTo(this.dispatcher, EventNamesEnum.checkOut, this.checkOut);
        },

        refreshEntryLogList: function (entryLogCollection, options) {
            console.trace('EntryLogController.refreshEntryLogList');
            options || (options = {});
            var currentContext = this,
                deferred = $.Deferred();

            currentContext.entryLogService.getEntryLogList(options)
                .then(function (getEntryLogListResponse) {
                    currentContext.geoLocationService.getCurrentPosition()
                        .then(function (position) {
                            utils.computeDistances(position.coords, getEntryLogListResponse.entryLogList);
                            entryLogCollection.reset(getEntryLogListResponse.entryLogList);
                            deferred.resolve(entryLogCollection);
                        })
                        .fail(function () {
                            entryLogCollection.reset(getEntryLogListResponse.entryLogList);
                            deferred.resolve(entryLogCollection);
                        });
                })
                .fail(function (error) {
                    entryLogCollection.reset();
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

        goToCheckIn: function (locusModelInstance) {
            console.trace('EntryLogController.goToCheckIn');
            var currentContext = this,
                deferred = $.Deferred();

            var entryLogModelInstance = new EntryLogModel();
            var checkInViewInstance = new CheckInView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                model: entryLogModelInstance,
                locusModel: locusModelInstance
            });

            currentContext.router.swapContent(checkInViewInstance);

            checkInViewInstance.showLoading();
            currentContext.entryLogService.getCheckInOptions()
                .then(function (getCheckInOptionsResponse) {
                    checkInViewInstance.setIdentityModel(getCheckInOptionsResponse.identity);
                    currentContext.dispatcher.trigger(EventNamesEnum.identityUpdated, checkInViewInstance.identityModel);
                    currentContext.geoLocationService.getCurrentPosition()
                        .then(function (position) {
                            var distance = utils.computeDistanceBetween(position.coords, locusModelInstance.attributes);
                            if (distance) {
                                locusModelInstance.set({
                                    'distance': distance
                                });
                            } else {
                                locusModelInstance.unset('distance');
                            }
                            checkInViewInstance.updateViewFromModel();
                            checkInViewInstance.renderPurposes(getCheckInOptionsResponse.purposes);
                            checkInViewInstance.renderDurations(getCheckInOptionsResponse.durations);
                            checkInViewInstance.completeLoading();
                            deferred.resolve(checkInViewInstance);
                        })
                        .fail(function (error) {
                            locusModelInstance.unset('distance');
                            checkInViewInstance.updateViewFromModel();
                            checkInViewInstance.completeLoading();
                            deferred.resolve(checkInViewInstance);
                        });
                })
                .fail(function (error) {
                    entryLogModelInstance.clear();
                    checkInViewInstance.showError(utils.getResource('criticalSystemErrorMessage'));
                    checkInViewInstance.completeLoading();
                    deferred.reject(checkInViewInstance);
                });

            return deferred.promise();
        },

        checkIn: function (entryLogModelInstance) {
            console.trace('EntryLogController.checkIn');
            var currentContext = this,
                deferred = $.Deferred();

            currentContext.entryLogService.postCheckIn(entryLogModelInstance.attributes)
                .done(function (postCheckInResponse) {
                    entryLogModelInstance.set(postCheckInResponse.entryLog);
                    currentContext.dispatcher.trigger(EventNamesEnum.checkInSuccess, entryLogModelInstance);
                    deferred.resolve(entryLogModelInstance);
                })
                .fail(function (error) {
                    currentContext.dispatcher.trigger(EventNamesEnum.checkInError, error);
                    deferred.reject(entryLogModelInstance);
                });

            return deferred.promise();
        },

        goToCheckOut: function (entryLogModel) {
            console.trace('EntryLogController.goToCheckOut');
            var currentContext = this,
                deferred = $.Deferred();

            var checkOutViewInstance = new CheckOutView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                model: entryLogModel
            });

            currentContext.router.swapContent(checkOutViewInstance);

            checkOutViewInstance.showLoading();
            currentContext.entryLogService.getCheckOutOptions()
                .then(function (getCheckOutOptionsResponse) {
                    checkOutViewInstance.setIdentityModel(getCheckOutOptionsResponse.identity);
                    currentContext.dispatcher.trigger(EventNamesEnum.identityUpdated, checkOutViewInstance.identityModel);
                    checkOutViewInstance.updateViewFromModel();
                    checkOutViewInstance.completeLoading();
                    deferred.resolve(checkOutViewInstance);
                })
                .fail(function (error) {
                    entryLogModel.clear();
                    checkOutViewInstance.showError(utils.getResource('criticalSystemErrorMessage'));
                    checkOutViewInstance.completeLoading();
                    deferred.reject(checkOutViewInstance);
                });

            return deferred.promise();
        },

        checkOut: function (entryLogModelInstance) {
            console.trace('EntryLogController.checkOut');
            var currentContext = this,
                deferred = $.Deferred();

            currentContext.entryLogService.postCheckOut(entryLogModelInstance.attributes)
                .done(function (postCheckOutResponse) {
                    entryLogModelInstance.set(postCheckOutResponse.entryLog);
                    currentContext.dispatcher.trigger(EventNamesEnum.checkOutSuccess, entryLogModelInstance);
                    deferred.resolve(entryLogModelInstance);
                })
                .fail(function (error) {
                    currentContext.dispatcher.trigger(EventNamesEnum.checkOutError, error);
                    deferred.reject(entryLogModelInstance);
                });

            return deferred.promise();
        }
    });

    return EntryLogController;
});