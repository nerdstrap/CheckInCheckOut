define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        GeoLocationService = require('services/GeoLocationService'),
        LocusService = require('services/LocusService'),
        LocusModel = require('models/LocusModel'),
        LocusCollection = require('collections/LocusCollection'),
        EntryLogCollection = require('collections/EntryLogCollection'),
        LocusSearchView = require('views/LocusSearchView'),
        LocusDetailView = require('views/LocusDetailView'),
        AdminView = require('views/AdminView'),
        EventNamesEnum = require('enums/EventNamesEnum'),
        SearchTypesEnum = require('enums/SearchTypesEnum'),
        globals = require('globals'),
        utils = require('utils');

    /**
     * Creates a new LocusController with the specified attributes.
     * @constructor
     * @param {object} options
     */
    var LocusController = function (options) {
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

            this.listenTo(this.dispatcher, EventNamesEnum.goToLocusAdmin, this.goToLocusAdmin);
            this.listenTo(this.dispatcher, EventNamesEnum.adminAddLocusList, this.adminAddLocusList);
        },

        goToLocusSearch: function () {
            console.trace('LocusController.goToLocusSearch');
            var currentContext = this,
                deferred = $.Deferred();

            var locusCollectionInstance = new LocusCollection();
            var locusSearchViewInstance = new LocusSearchView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                collection: locusCollectionInstance
            });
            currentContext.router.swapContent(locusSearchViewInstance);

            var routerFragment = 'locus';
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
            var openEntryLogCollectionInstance = new EntryLogCollection();
            var recentEntryLogCollectionInstance = new EntryLogCollection();
            var locusDetailViewInstance = new LocusDetailView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                model: locusModelInstance,
                openEntryLogCollection: openEntryLogCollectionInstance,
                recentEntryLogCollection: recentEntryLogCollectionInstance
            });

            currentContext.router.swapContent(locusDetailViewInstance);
            var routerFragment = 'locus/' + locusId;
            var fragmentAlreadyMatches = (Backbone.history.fragment === routerFragment || Backbone.history.fragment === '');
            currentContext.router.navigate(routerFragment, {replace: fragmentAlreadyMatches});

            locusDetailViewInstance.showLoading();
            currentContext.locusService.getLocusList({locusId: locusId})
                .then(function (getLocusListResponse) {
                    locusDetailViewInstance.setIdentityModel(getLocusListResponse.identity);
                    currentContext.dispatcher.trigger(EventNamesEnum.identityUpdated, locusDetailViewInstance.identityModel);
                    if (getLocusListResponse.locusList && getLocusListResponse.locusList.length > 0) {
                        currentContext.geoLocationService.getCurrentPosition()
                            .then(function (position) {
                                utils.computeDistances(position.coords, getLocusListResponse.locusList);
                                locusModelInstance.set(getLocusListResponse.locusList[0]);
                                locusDetailViewInstance.updateViewFromModel();
                                locusDetailViewInstance.completeLoading();
                                deferred.resolve(locusDetailViewInstance);
                            })
                            .fail(function (error) {
                                locusModelInstance.set(getLocusListResponse.locusList[0]);
                                locusDetailViewInstance.updateViewFromModel();
                                locusDetailViewInstance.completeLoading();
                                deferred.resolve(locusDetailViewInstance);
                            });
                    } else {
                        locusModelInstance.clear();
                        locusDetailViewInstance.showError(utils.getResource('locusNotFoundErrorMessage'));
                        locusDetailViewInstance.completeLoading();
                        deferred.reject(locusDetailViewInstance);
                    }
                })
                .fail(function (error) {
                    locusModelInstance.clear();
                    locusDetailViewInstance.showError(utils.getResource('criticalSystemErrorMessage'));
                    locusDetailViewInstance.completeLoading();
                    deferred.reject(locusDetailViewInstance);
                });

            return deferred.promise();
        },

        refreshLocusList: function (locusCollection, options) {
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
                                locusCollection.reset(getLocusListResponse.locusList);
                                deferred.resolve(locusCollection);
                            })
                            .fail(function (error) {
                                locusCollection.reset();
                                deferred.reject(locusCollection);
                            });
                    })
                    .fail(function (error) {
                        locusCollection.reset();
                        deferred.reject(locusCollection);
                    });
            } else {
                currentContext.locusService.getLocusList(options)
                    .then(function (getLocusListResponse) {
                        currentContext.geoLocationService.getCurrentPosition()
                            .then(function (position) {
                                utils.computeDistances(position.coords, getLocusListResponse.locusList);
                                locusCollection.reset(getLocusListResponse.locusList);
                                deferred.resolve(locusCollection);
                            })
                            .fail(function () {
                                locusCollection.reset(getLocusListResponse.locusList);
                                deferred.resolve(locusCollection);
                            });
                    })
                    .fail(function (error) {
                        locusCollection.reset();
                        deferred.reject(locusCollection);
                    });
            }

            return deferred.promise();
        },

        goToDirectionsWithLatLng: function (latitude, longitude) {
            console.trace('LocusController.goToDirectionsWithLatLng');
            var directionsUri = 'http://maps.google.com?daddr=' + latitude + ',' + longitude;
            globals.window.open(directionsUri);
        },

        goToLocusAdmin: function () {
            console.trace('LocusController.goToLocusAdmin');
            var currentContext = this,
                deferred = $.Deferred();

            var locusCollectionInstance = new LocusCollection();
            var adminViewInstance = new AdminView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                collection: locusCollectionInstance
            });

            currentContext.router.swapContent(adminViewInstance);
            var routerFragment = utils.getResource('locusAdmin.fragment');
            var fragmentAlreadyMatches = (Backbone.history.fragment === routerFragment || Backbone.history.fragment === '');
            currentContext.router.navigate(routerFragment, {replace: fragmentAlreadyMatches});

            adminViewInstance.showLoading();
            currentContext.locusService.getLocusList({'admin': true})
                .then(function (getLocusListResponse) {
                    adminViewInstance.setIdentityModel(getLocusListResponse.identity);
                    currentContext.dispatcher.trigger(EventNamesEnum.identityUpdated, adminViewInstance.identityModel);
                    locusCollectionInstance.reset(getLocusListResponse.locusList);
                    adminViewInstance.completeLoading();
                    deferred.resolve(adminViewInstance);
                })
                .fail(function (error) {
                    adminViewInstance.showError(utils.getResource('criticalSystemErrorMessage'));
                    locusCollectionInstance.reset();
                    adminViewInstance.completeLoading();
                    deferred.reject(adminViewInstance);
                });

            return deferred.promise();
        },

        adminAddLocusList: function (locusCollection, options) {
            console.trace('LocusController.adminAddLocusList');
            options || (options = {});
            var currentContext = this,
                deferred = $.Deferred();

            var index = 0;
            var count = 100;//locusCollection.length;
            for (index; index < count; index++) {

                var locusModel = locusCollection.at(index);

                currentContext.locusService.postLocus(locusModel.attributes)
                    .then(function (postLocusResponse) {
                        currentContext.dispatcher.trigger(EventNamesEnum.addLocusSuccess, postLocusResponse.locus);
                    })
                    .fail(function (error) {
                        currentContext.dispatcher.trigger(EventNamesEnum.addLocusError, error);
                    });

                if (index === count) {
                    deferred.resolve();
                }
            }

            return deferred.promise();
        }
    });

    return LocusController;
});