define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        StationService = require('services/StationService'),
        StationListView = require('views/StationListView'),
        StationView = require('views/StationView'),
        StationCollection = require('collections/StationCollection'),
        StationModel = require('models/StationModel'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        globals = require('globals'),
        utils = require('utils');

    /**
     * Creates a new StationController with the specified attributes.
     * @constructor
     * @param {object} options
     */
    var StationController;
    StationController = function (options) {
        console.trace('new StationController()');
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(StationController.prototype, Backbone.Events, {
        /** @class StationController
         * @constructs StationController object
         * @param {object} options
         */
        initialize: function (options) {
            console.trace('StationController.initialize');
            options || (options = {});
            this.router = options.router;
            this.dispatcher = options.dispatcher;
            this.stationService = options.stationService || new StationService();

            this.listenTo(this.dispatcher, AppEventNamesEnum.goToStationList, this.goToStationList);
            this.listenTo(this.dispatcher, AppEventNamesEnum.goToStationWithId, this.goToStationWithId);
            this.listenTo(this.dispatcher, AppEventNamesEnum.refreshStationList, this.refreshStationList);

            this.listenTo(this.dispatcher, AppEventNamesEnum.checkIn, this.checkIn);
            this.listenTo(this.dispatcher, AppEventNamesEnum.checkOut, this.checkOut);
            this.listenTo(this.dispatcher, AppEventNamesEnum.updateCheckIn, this.updateCheckIn);

            this.listenTo(this.dispatcher, AppEventNamesEnum.goToDirectionsWithLatLng, this.goToDirectionsWithLatLng);
        },

        goToStationList: function () {
            console.trace('StationController.goToStationList');
            var currentContext = this,
                deferred = $.Deferred();

            var stationCollectionInstance = new StationCollection();
            var stationListViewInstance = new StationListView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                collection: stationCollectionInstance
            });

            currentContext.router.swapContent(stationListViewInstance);
            var fragmentAlreadyMatches = (Backbone.history.fragment === 'station' || Backbone.history.fragment === '');
            currentContext.router.navigate('station', {replace: fragmentAlreadyMatches});

            var options = {};
            stationListViewInstance.showLoading();
            $.when(currentContext.stationService.getStations(options)).done(function (getStationsResponse) {
                currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getStationsResponse.userRole);
                stationListViewInstance.setUserRole(getStationsResponse.userRole);
                stationCollectionInstance.reset(getStationsResponse.stations);
                deferred.resolve(stationListViewInstance);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                stationCollectionInstance.reset();
                stationListViewInstance.showError(textStatus);
                deferred.reject({
                    stationListView: stationListViewInstance,
                    error: textStatus
                });
            });

            return deferred.promise();
        },

        goToStationWithId: function (stationId) {
            console.trace('StationController.goToStationWithId');
            var currentContext = this,
                deferred = $.Deferred();

            var stationModelInstance = new StationModel({stationId: stationId});
            var stationViewInstance = new StationView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                model: stationModelInstance
            });

            currentContext.router.swapContent(stationViewInstance);
            var fragmentAlreadyMatches = (Backbone.history.fragment === 'station' || Backbone.history.fragment === '');
            currentContext.router.navigate('station/' + stationId, {replace: fragmentAlreadyMatches});

            var options = {stationId: stationId};
            stationViewInstance.showLoading();
            $.when(currentContext.stationService.getStations(options)).done(function (getStationsResponse) {
                currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getStationsResponse.userRole);
                stationViewInstance.setUserRole(getStationsResponse.userRole);
                if (getStationsResponse.stations && getStationsResponse.stations.length > 0) {
                    stationModelInstance.set(getStationsResponse.stations[0]);
                    deferred.resolve(stationViewInstance);
                } else {
                    var getStationsErrorMessage = '';
                    stationModelInstance.clear();
                    stationViewInstance.showError(getStationsErrorMessage);
                    deferred.reject({
                        stationView: stationViewInstance,
                        error: getStationsErrorMessage
                    });
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                stationModelInstance.clear();
                stationViewInstance.showError(textStatus);
                deferred.reject({
                    stationView: stationViewInstance,
                    error: textStatus
                });
            });

            return deferred.promise();
        },

        refreshStationList: function (stationCollectionInstance, options) {
            console.trace('StationController.refreshStationList');
            var currentContext = this,
                deferred = $.Deferred();

            $.when(currentContext.stationService.getStations(options)).done(function (getStationsResponse) {
                stationCollectionInstance.reset(getStationsResponse.stations);
                deferred.resolve(stationCollectionInstance);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                stationCollectionInstance.reset();
                deferred.reject(textStatus);
                deferred.reject({
                    stationCollection: stationCollectionInstance,
                    error: textStatus
                });
            });

            return deferred.promise();
        },

        goToDirectionsWithLatLng: function (latitude, longitude) {
            console.trace('StationController.goToDirectionsWithLatLng');
            var directionsUri = 'http://maps.google.com?daddr=' + latitude + ',' + longitude;
            globals.window.open(directionsUri);
        }
    });

    return StationController;
});