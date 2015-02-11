define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        LocusService = require('services/LocusService'),
        GeoLocationService = require('services/GeoLocationService'),
        LocusSearchView = require('views/LocusSearchView'),
        LocusModel = require('models/LocusModel'),
        LocusView = require('views/LocusView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        globals = require('globals'),
        utils = require('utils');

    /**
     * Creates a new LocusController with the specified attributes.
     * @constructor
     * @param {object} options
     */
    var LocusController;
    LocusController = function (options) {
        console.trace('new LocusController()');
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(LocusController.prototype, Backbone.Events, {
        /** @class LocusController
         * @constructs LocusController object
         * @param {object} options
         */
        initialize: function (options) {
            console.trace('LocusController.initialize');
            options || (options = {});
            this.router = options.router;
            this.dispatcher = options.dispatcher;
            this.locusService = options.locusService || new LocusService();
            this.geoLocationService = options.geoLocationService || new GeoLocationService();

            this.listenTo(this.dispatcher, AppEventNamesEnum.goToLocusSearch, this.goToLocusSearch);
            this.listenTo(this.dispatcher, AppEventNamesEnum.goToLocusWithId, this.goToLocusWithId);
            this.listenTo(this.dispatcher, AppEventNamesEnum.refreshLocusList, this.refreshLocusList);
            this.listenTo(this.dispatcher, AppEventNamesEnum.refreshLocusListByGps, this.refreshLocusListByGps);

            this.listenTo(this.dispatcher, AppEventNamesEnum.goToDirectionsWithLatLng, this.goToDirectionsWithLatLng);
        },

        goToLocusSearch: function () {
            console.trace('LocusController.goToLocus');
            var currentContext = this,
                deferred = $.Deferred();

            var locusSearchViewInstance = new LocusSearchView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher
            });

            currentContext.router.swapContent(locusSearchViewInstance);
            var fragmentAlreadyMatches = (Backbone.history.fragment === 'locus' || Backbone.history.fragment === '');
            currentContext.router.navigate('locus', {replace: fragmentAlreadyMatches});

            locusSearchViewInstance.showLoading();
            currentContext.locusService.getLocusSearchOptions()
                .then(function (getLocusSearchOptionsResponse) {
                    currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getLocusSearchOptionsResponse.userRole);
                    locusSearchViewInstance.setUserId(getLocusSearchOptionsResponse.userId);
                    locusSearchViewInstance.setUserRole(getLocusSearchOptionsResponse.userRole);
                    locusSearchViewInstance.hideLoading();
                    deferred.resolve(locusSearchViewInstance);
                })
                .fail(function (error) {
                    locusSearchViewInstance.showError(utils.getResource('criticalSystemErrorMessage'));
                    locusSearchViewInstance.hideLoading();
                    deferred.reject(locusSearchViewInstance);
                });

            return deferred.promise();
        },

        goToLocusWithId: function (locusId) {
            console.trace('LocusController.goToLocusWithId');
            var currentContext = this,
                deferred = $.Deferred();

            var locusModelInstance = new LocusModel({locusId: locusId});
            var locusViewInstance = new LocusView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                model: locusModelInstance
            });

            currentContext.router.swapContent(locusViewInstance);
            var fragmentAlreadyMatches = (Backbone.history.fragment === 'locus/' + locusId || Backbone.history.fragment === '');
            currentContext.router.navigate('locus/' + locusId, {replace: fragmentAlreadyMatches});

            locusViewInstance.showLoading();
            currentContext.locusService.getLocusList({locusId: locusId})
                .then(function (getLocusListResponse) {
                    currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getLocusListResponse.userRole);
                    locusViewInstance.setUserId(getLocusListResponse.userId);
                    locusViewInstance.setUserRole(getLocusListResponse.userRole);
                    if (getLocusListResponse.locusList && getLocusListResponse.locusList.length > 0) {
                        currentContext.geoLocationService.getCurrentPosition()
                            .then(function (position) {
                                utils.computeDistances(position.coords, getLocusListResponse.locusList);
                                locusModelInstance.reset(getLocusListResponse.locusList[0]);
                                locusViewInstance.hideLoading();
                                deferred.resolve(locusViewInstance);
                            });
                    } else {
                        locusModelInstance.reset();
                        locusViewInstance.showError(utils.getResource('locusNotFoundErrorMessage'));
                        locusViewInstance.hideLoading();
                        deferred.reject(locusViewInstance);
                    }
                })
                .fail(function (error) {
                    locusModelInstance.reset();
                    locusViewInstance.showError(utils.getResource('criticalSystemErrorMessage'));
                    locusViewInstance.hideLoading();
                    deferred.reject(locusViewInstance);
                });

            return deferred.promise();
        },

        refreshLocusList: function (locusCollectionInstance, options) {
            console.trace('LocusController.refreshLocusList');
            options || (options = {});
            var currentContext = this,
                deferred = $.Deferred();

            currentContext.locusService.getLocusList(options)
                .then(function (getLocusListResponse) {
                    currentContext.geoLocationService.getCurrentPosition()
                        .then(function (position) {
                            utils.computeDistances(position.coords, getLocusListResponse.locusList);
                            locusCollectionInstance.reset(getLocusListResponse.locusList);
                            deferred.resolve(locusCollectionInstance);
                        })
                        .fail(function () {
                            locusCollectionInstance.reset(getLocusListResponse.locusList);
                            deferred.resolve(locusCollectionInstance);
                        });
                })
                .fail(function (error) {
                    locusCollectionInstance.reset();
                    deferred.reject(locusCollectionInstance);
                });

            return deferred.promise();
        },

        refreshLocusListByGps: function (locusCollectionInstance, options) {
            console.trace('LocusController.refreshLocusList');
            options || (options = {});
            var currentContext = this,
                deferred = $.Deferred();

            currentContext.geoLocationService.getCurrentPosition()
                .then(function (position) {
                    currentContext.locusService.getLocusList(position)
                        .then(function (getLocusListResponse) {
                            utils.computeDistances(position.coords, getLocusListResponse.locusList);
                            locusCollectionInstance.reset(getLocusListResponse.locusList);
                            deferred.resolve(locusCollectionInstance);
                        })
                        .fail(function (error) {
                            locusCollectionInstance.reset();
                            deferred.reject(locusCollectionInstance);
                        });
                })
                .fail(function (error) {
                    locusCollectionInstance.reset();
                    deferred.reject(locusCollectionInstance);
                });

            return deferred.promise();
        },

        goToDirectionsWithLatLng: function (latitude, longitude) {
            console.trace('LocusController.goToDirectionsWithLatLng');
            var directionsUri = 'http://maps.google.com?daddr=' + latitude + ',' + longitude;
            globals.window.open(directionsUri);
        }
    });

    return LocusController;
});