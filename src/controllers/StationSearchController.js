define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        StationService = require('services/StationService'),
        LocatorService = require('services/LocatorService'),
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
            this.locatorService = options.locatorService || new LocatorService();

            this.listenTo(this.dispatcher, AppEventNamesEnum.goToStationSearch, this.goToStationSearch);
            this.listenTo(this.dispatcher, AppEventNamesEnum.refreshStations, this.refreshStations);

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
            currentContext.router.navigate('station', { replace: fragmentAlreadyMatches });

            stationSearchViewInstance.showLoading();
            currentContext.stationService.getStationSearchOptions()
                .then(function (getStationsResponse) {
                    currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getStationsResponse.userRole);
                    stationSearchViewInstance.hideLoading();
                    deferred.resolve(stationSearchViewInstance);
                })
                .fail(function (errorCode, errorMessage) {
                    deferred.reject({
                        stationSearchView: stationSearchViewInstance,
                        errorCode: errorCode,
                        errorMessage: errorMessage
                    })
                });

            return deferred.promise();
        },

        refreshStations: function (stationCollectionInstance, options) {
            console.trace('StationSearchController.refreshStations');
            options || (options = {});
            var currentContext = this,
                deferred = $.Deferred();

            if (options.gps) {
                currentContext.locatorService.getCurrentPosition()
                    .then(currentContext.stationService.getStations)
                    .then(function (getStationsResponse) {
                        stationCollectionInstance.reset(getStationsResponse.stations);
                        deferred.resolve(stationCollectionInstance);
                    })
                    .fail(function (errorCode, errorMessage) {
                        stationCollectionInstance.reset();
                        deferred.reject({
                            stationCollection: stationCollectionInstance,
                            errorCode: errorCode,
                            errorMessage: errorMessage
                        })
                    });
            } else {
                currentContext.stationService.getStations(options)
                    .then(function (getStationsResponse) {
                        stationCollectionInstance.reset(getStationsResponse.stations);
                        deferred.resolve(stationCollectionInstance);
                    })
                    .fail(function (errorCode, errorMessage) {
                        stationCollectionInstance.reset();
                        deferred.reject({
                            stationCollection: stationCollectionInstance,
                            errorCode: errorCode,
                            errorMessage: errorMessage
                        });
                    });
            }

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