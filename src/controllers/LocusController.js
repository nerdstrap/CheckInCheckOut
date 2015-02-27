define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        GeoLocationService = require('services/GeoLocationService'),
        LocusService = require('services/LocusService'),
        SimpleSearchView = require('views/SimpleSearchView'),
        LocusModel = require('models/LocusModel'),
        LocusCollection = require('collections/LocusCollection'),
        LocusListItemView = require('views/LocusListItemView'),
        LocusView = require('views/LocusView'),
        EventNamesEnum = require('enums/EventNamesEnum'),
        SearchTypesEnum = require('enums/SearchTypesEnum'),
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

            this.listenTo(this.dispatcher, EventNamesEnum.goToLocusSearch, this.goToLocusSearch);
            this.listenTo(this.dispatcher, EventNamesEnum.goToLocusWithId, this.goToLocusWithId);
            this.listenTo(this.dispatcher, EventNamesEnum.refreshLocusList, this.refreshLocusList);

            this.listenTo(this.dispatcher, EventNamesEnum.goToDirectionsWithLatLng, this.goToDirectionsWithLatLng);
        },

        goToLocusSearch: function () {
            console.trace('LocusController.goToLocusSearch');
            var currentContext = this,
                deferred = $.Deferred();

            var locusSearchViewInstance = new SimpleSearchView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                headerText: utils.getResource('locusSearch.headerText'),
                listCollection: LocusCollection,
                listItemView: LocusListItemView,
                headerTextFormatString: utils.getResource('locusList.headerTextFormatString'),
                refreshListTrigger: EventNamesEnum.refreshLocusList
            });

            currentContext.router.swapContent(locusSearchViewInstance);
            var routerFragment = utils.getResource('locus.fragment');
            var fragmentAlreadyMatches = (Backbone.history.fragment === routerFragment || Backbone.history.fragment === '');
            currentContext.router.navigate(routerFragment, {replace: fragmentAlreadyMatches});

            locusSearchViewInstance.showLoading();
            currentContext.locusService.getLocusSearchOptions()
                .then(function (getLocusSearchOptionsResponse) {
                    locusSearchViewInstance.setIdentityModel(getLocusSearchOptionsResponse.identity);
                    currentContext.dispatcher.trigger(EventNamesEnum.identityUpdated, locusSearchViewInstance.identityModel);
                    locusSearchViewInstance.completeLoading();
                    deferred.resolve(locusSearchViewInstance);
                })
                .fail(function (error) {
                    locusSearchViewInstance.showError(utils.getResource('criticalSystemErrorMessage'));
                    locusSearchViewInstance.completeLoading();
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
            var routerFragment = utils.getResource('locusWithId.fragment');
            var fragmentAlreadyMatches = (Backbone.history.fragment === routerFragment + locusId || Backbone.history.fragment === '');
            currentContext.router.navigate(routerFragment + locusId, {replace: fragmentAlreadyMatches});

            locusViewInstance.showLoading();
            currentContext.locusService.getLocusList({locusId: locusId})
                .then(function (getLocusListResponse) {
                    locusViewInstance.setIdentityModel(getLocusListResponse.identity);
                    currentContext.dispatcher.trigger(EventNamesEnum.identityUpdated, locusViewInstance.identityModel);
                    if (getLocusListResponse.locusList && getLocusListResponse.locusList.length > 0) {
                        currentContext.geoLocationService.getCurrentPosition()
                            .then(function (position) {
                                utils.computeDistances(position.coords, getLocusListResponse.locusList);
                                locusModelInstance.set(getLocusListResponse.locusList[0]);
                                locusViewInstance.updateViewFromModel();
                                locusViewInstance.completeLoading();
                                deferred.resolve(locusViewInstance);
                            })
                            .fail(function(error) {
                                locusModelInstance.set(getLocusListResponse.locusList[0]);
                                locusViewInstance.updateViewFromModel();
                                locusViewInstance.completeLoading();
                                deferred.resolve(locusViewInstance);
                            });
                    } else {
                        locusModelInstance.clear();
                        locusViewInstance.showError(utils.getResource('locusNotFoundErrorMessage'));
                        locusViewInstance.completeLoading();
                        deferred.reject(locusViewInstance);
                    }
                })
                .fail(function (error) {
                    locusModelInstance.clear();
                    locusViewInstance.showError(utils.getResource('criticalSystemErrorMessage'));
                    locusViewInstance.completeLoading();
                    deferred.reject(locusViewInstance);
                });

            return deferred.promise();
        },

        refreshLocusList: function (locusCollectionInstance, options) {
            console.trace('LocusController.refreshLocusList');
            options || (options = {});
            var currentContext = this,
                deferred = $.Deferred();

            if (options.searchType === SearchTypesEnum.nearby) {
                currentContext.geoLocationService.getCurrentPosition()
                    .then(function (position) {
                        currentContext.locusService.getLocusList(_.extend(options, position))
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
            } else {
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
            }

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