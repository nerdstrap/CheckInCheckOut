define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        StationService = require('services/StationService'),
        StationSearchView = require('views/StationSearchView'),
        StationListView = require('views/StationListView'),
        StationView = require('views/StationView'),
        StationCollection = require('collections/StationCollection'),
        StationModel = require('models/StationModel'),
        Locator = require('Locator'),
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
            this.locator = new Locator();

            this.listenTo(this.dispatcher, AppEventNamesEnum.goToStationSearch, this.goToStationSearch);
            this.listenTo(this.dispatcher, AppEventNamesEnum.refreshStationList, this.refreshStationList);

            this.listenTo(this.dispatcher, AppEventNamesEnum.goToDirectionsWithLatLng, this.goToDirectionsWithLatLng);
        },

        //goToStationSearch: function () {
        //    console.trace('StationSearchController.goToStationSearch');
        //    var currentContext = this,
        //        deferred = $.Deferred();
        //
        //    var stationCollectionInstance = new StationCollection();
        //    var stationSearchViewInstance = new StationSearchView({
        //        controller: currentContext,
        //        dispatcher: currentContext.dispatcher,
        //        stationCollection: stationCollectionInstance
        //    });
        //
        //    currentContext.router.swapContent(stationSearchViewInstance);
        //    var fragmentAlreadyMatches = (Backbone.history.fragment === 'station' || Backbone.history.fragment === '');
        //    currentContext.router.navigate('station', {replace: fragmentAlreadyMatches});
        //
        //    var options = {};
        //    stationSearchViewInstance.showLoading();
        //    currentContext.stationService.getSearchOptions()
        //        .done(function (getSearchOptionsResponse) {
        //            currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getSearchOptionsResponse.userRole);
        //            stationSearchViewInstance.hideLoading();
        //            stationSearchViewInstance.dispatchRefreshSearch();
        //            deferred.resolve(stationSearchViewInstance);
        //        })
        //        .fail(function (jqXHR, textStatus, errorThrown) {
        //            stationSearchViewInstance.showError(textStatus);
        //            deferred.reject({
        //                stationSearchView: stationSearchViewInstance,
        //                error: textStatus
        //            });
        //        });
        //
        //    return deferred.promise();
        //},

        goToStationSearch: function () {
            console.trace('StationSearchController.goToStationSearch');
            var currentContext = this,
                deferred = $.Deferred();

            var stationCollectionInstance = new StationCollection();
            var stationSearchViewInstance = new StationSearchView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                stationCollection: stationCollectionInstance
            });

            currentContext.router.swapContent(stationSearchViewInstance);
            var fragmentAlreadyMatches = (Backbone.history.fragment === 'station' || Backbone.history.fragment === '');
            currentContext.router.navigate('station', {replace: fragmentAlreadyMatches});

            var options = {};
            stationSearchViewInstance.showLoading();
            currentContext.locator.getCurrentPosition()
                .then(currentContext.stationService.getStations)
                .then(function (getStationsResponse) {
                    currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getStationsResponse.userRole);
                    stationSearchViewInstance.hideLoading();
                    deferred.resolve(stationSearchViewInstance);
                })
                .fail(function (error) {
                    stationCollectionInstance.reset();
                    deferred.reject({
                        stationCollection: stationCollectionInstance,
                        error: textStatus
                    })
                });

            return deferred.promise();
        },

        refreshStations: function (stationCollectionInstance, options) {
            console.trace('StationSearchController.refreshStationList');
            options || (options = {});
            var currentContext = this,
                deferred = $.Deferred();

            if (options.gps) {
                stationSearchViewInstance.showLoading();
                currentContext.locator.getCurrentPosition()
                    .then(currentContext.stationService.getStations)
                    .then(function (getStationsResponse) {
                        stationCollectionInstance.reset(getStationsResponse.stations);
                        deferred.resolve(stationCollectionInstance);
                    })
                    .fail(function (error) {
                        stationCollectionInstance.reset();
                        deferred.reject({
                            stationCollection: stationCollectionInstance,
                            error: textStatus
                        })
                    });
            }

            currentContext.stationService.getStations(options)
            ).
            done(function (getStationsResponse) {
                stationCollectionInstance.reset(getStationsResponse.stations);
                deferred.resolve(stationCollectionInstance);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                stationCollectionInstance.reset();
                deferred.reject({
                    stationCollection: stationCollectionInstance,
                    error: textStatus
                });
            });

            return deferred.promise();
        },

        refreshStationList: function (stationCollectionInstance, options) {
            console.trace('StationSearchController.refreshStationList');
            var currentContext = this,
                deferred = $.Deferred();

            $.when(currentContext.stationService.getStations(options)).done(function (getStationsResponse) {
                stationCollectionInstance.reset(getStationsResponse.stations);
                deferred.resolve(stationCollectionInstance);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                stationCollectionInstance.reset();
                deferred.reject({
                    stationCollection: stationCollectionInstance,
                    error: textStatus
                });
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