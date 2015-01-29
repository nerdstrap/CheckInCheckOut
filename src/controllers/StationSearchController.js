define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        StationService = require('services/StationService'),
        GeoLocationService = require('services/GeoLocationService'),
        StationSearchView = require('views/StationSearchView'),
        StationModel = require('models/StationModel'),
        StationView = require('views/StationView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        globals = require('globals'),
        utils = require('utils');

    /**
     * Creates a new StationSearchController with the specified attributes.
     * @constructor
     * @param {object} options
     */
    var StationSearchController;
    StationSearchController = function (options) {
        console.trace('new StationSearchController()');
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(StationSearchController.prototype, Backbone.Events, {
        /** @class StationSearchController
         * @constructs StationSearchController object
         * @param {object} options
         */
        initialize: function (options) {
            console.trace('StationSearchController.initialize');
            options || (options = {});
            this.router = options.router;
            this.dispatcher = options.dispatcher;
            this.stationService = options.stationService || new StationService();
            this.geoLocationService = options.geoLocationService || new GeoLocationService();

            this.listenTo(this.dispatcher, AppEventNamesEnum.goToStationSearch, this.goToStationSearch);
            this.listenTo(this.dispatcher, AppEventNamesEnum.goToStationWithId, this.goToStationWithId);
            this.listenTo(this.dispatcher, AppEventNamesEnum.refreshStations, this.refreshStations);
            this.listenTo(this.dispatcher, AppEventNamesEnum.refreshStationsByGps, this.refreshStationsByGps);

            this.listenTo(this.dispatcher, AppEventNamesEnum.goToDirectionsWithLatLng, this.goToDirectionsWithLatLng);
        },

        goToStationSearch: function () {
            console.trace('StationSearchController.goToStationSearch');
            var currentContext = this,
                deferred = $.Deferred();

            var stationSearchViewInstance = new StationSearchView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher
            });

            currentContext.router.swapContent(stationSearchViewInstance);
            var fragmentAlreadyMatches = (Backbone.history.fragment === 'station' || Backbone.history.fragment === '');
            currentContext.router.navigate('station', {replace: fragmentAlreadyMatches});

            stationSearchViewInstance.showLoading();
            currentContext.stationService.getStationSearchOptions()
                .then(function (getStationSearchOptionsResponse) {
                    currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getStationSearchOptionsResponse.userRole);
                    deferred.resolve(stationSearchViewInstance);
                })
                .fail(function (error) {
                    stationSearchViewInstance.showError(utils.getResource('criticalSystemErrorMessage'));
                    deferred.reject(stationSearchViewInstance);
                })
                .always(function () {
                    stationSearchViewInstance.hideLoading();
                })
            ;

            return deferred.promise();
        },

        goToStationWithId: function (stationId) {
            console.trace('StationSearchController.goToStationWithId');
            var currentContext = this,
                deferred = $.Deferred();

            var stationModelInstance = new StationModel({stationId: stationId});
            var stationViewInstance = new StationView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                model: stationModelInstance
            });

            currentContext.router.swapContent(stationViewInstance);
            var fragmentAlreadyMatches = (Backbone.history.fragment === 'station/' + stationId || Backbone.history.fragment === '');
            currentContext.router.navigate('station/' + stationId, {replace: fragmentAlreadyMatches});

            stationViewInstance.showLoading();
            currentContext.stationService.getStations({ stationId: stationId })
                .then(function (getStationsResponse) {
                    currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getStationsResponse.userRole);
                    stationViewInstance.setUserRole(getStationsResponse.userRole);
                    if (getStationsResponse.stations && getStationsResponse.stations.length > 0) {
                        currentContext.geoLocationService.getCurrentPosition()
                        .then(function (position) {
                            utils.computeDistances(position, getStationsResponse.stations);
                        })
                        .always(function () {
                            stationModelInstance.reset(getStationsResponse.stations[0]);
                            deferred.resolve(stationViewInstance);
                        });
                    } else {
                        stationModelInstance.reset();
                        stationViewInstance.showError(utils.getResource('stationNotFoundErrorMessage'));
                        deferred.reject(stationViewInstance);
                    }
                })
                .fail(function (error) {
                    stationModelInstance.reset();
                    stationViewInstance.showError(utils.getResource('criticalSystemErrorMessage'));
                    deferred.reject(stationViewInstance);
                })
                .always(function () {
                    stationViewInstance.hideLoading();
                });

            return deferred.promise();
        },

        refreshStations: function (stationCollectionInstance, options) {
            console.trace('StationSearchController.refreshStations');
            options || (options = {});
            var currentContext = this,
                deferred = $.Deferred();

            currentContext.stationService.getStations(options)
                .then(function (getStationsResponse) {
                    currentContext.geoLocationService.getCurrentPosition()
                        .then(function (position) {
                            utils.computeDistances(position, getStationsResponse.stations);
                        })
                        .always(function () {
                            stationCollectionInstance.reset(getStationsResponse.stations);
                            deferred.resolve(stationCollectionInstance);
                        });
                })
                .fail(function (error) {
                    stationCollectionInstance.reset();
                    deferred.reject(error);
                });

            return deferred.promise();
        },

        refreshStationsByGps: function (stationCollectionInstance, options) {
            console.trace('StationSearchController.refreshStations');
            options || (options = {});
            var currentContext = this,
                deferred = $.Deferred();

            currentContext.geoLocationService.getCurrentPosition()
                .then(currentContext.stationService.getStations)
                .then(function (getStationsResponse) {
                    stationCollectionInstance.reset(getStationsResponse.stations);
                    deferred.resolve(stationCollectionInstance);
                })
                .fail(function (error) {
                    stationCollectionInstance.reset();
                    deferred.reject(error);
                });

            return deferred.promise();
        },

        goToDirectionsWithLatLng: function (latitude, longitude) {
            console.trace('StationSearchController.goToDirectionsWithLatLng');
            var directionsUri = 'http://maps.google.com?daddr=' + latitude + ',' + longitude;
            globals.window.open(directionsUri);
        }
    });

    return StationSearchController;
});