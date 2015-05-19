define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        GeoLocationService = require('services/GeoLocationService'),
        IdentityService = require('services/IdentityService'),
        IdentitySearchView = require('views/IdentitySearchView'),
        IdentityModel = require('models/IdentityModel'),
        IdentityCollection = require('collections/IdentityCollection'),
        EntryLogCollection = require('collections/EntryLogCollection'),
        IdentityListView = require('views/IdentityListView'),
        IdentityListItemView = require('views/IdentityListItemView'),
        IdentityDetailView = require('views/IdentityDetailView'),
        EventNamesEnum = require('enums/EventNamesEnum'),
        SearchTypesEnum = require('enums/SearchTypesEnum'),
        globals = require('globals'),
        utils = require('utils');

    /**
     * Creates a new IdentityController with the specified attributes.
     * @constructor
     * @param {object} options
     */
    var IdentityController = function (options) {
        console.trace('new IdentityController()');
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(IdentityController.prototype, Backbone.Events, {
        /** @class IdentityController
         * @constructs IdentityController object
         * @param {object} options
         */
        initialize: function (options) {
            console.trace('IdentityController.initialize');
            options || (options = {});
            this.router = options.router;
            this.dispatcher = options.dispatcher;
            this.identityService = options.identityService || new IdentityService();
            this.geoLocationService = options.geoLocationService || new GeoLocationService();

            this.listenTo(this.dispatcher, EventNamesEnum.goToIdentitySearch, this.goToIdentitySearch);
            this.listenTo(this.dispatcher, EventNamesEnum.goToIdentityWithId, this.goToIdentityWithId);
            this.listenTo(this.dispatcher, EventNamesEnum.refreshIdentityList, this.refreshIdentityList);
        },

        goToIdentitySearch: function () {
            console.trace('IdentityController.goToIdentity');
            var currentContext = this,
                deferred = $.Deferred();

            var identityCollectionInstance = new IdentityCollection();
            var identitySearchViewInstance = new IdentitySearchView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                collection: identityCollectionInstance
            });

            currentContext.router.swapContent(identitySearchViewInstance);
            var routerFragment = 'identity'
            var fragmentAlreadyMatches = (Backbone.history.fragment === routerFragment || Backbone.history.fragment === '');
            currentContext.router.navigate(routerFragment, {replace: fragmentAlreadyMatches});

            identitySearchViewInstance.showLoading();
            currentContext.identityService.getIdentitySearchOptions()
                .then(function (getIdentitySearchOptionsResponse) {
                    identitySearchViewInstance.setIdentityModel(getIdentitySearchOptionsResponse.identity);
                    currentContext.dispatcher.trigger(EventNamesEnum.identityUpdated, identitySearchViewInstance.identityModel);
                    identitySearchViewInstance.completeLoading();
                    deferred.resolve(identitySearchViewInstance);
                })
                .fail(function (error) {
                    identitySearchViewInstance.showError(utils.getResource('criticalSystemErrorMessage'));
                    identitySearchViewInstance.completeLoading();
                    deferred.reject(identitySearchViewInstance);
                });

            return deferred.promise();
        },

        goToIdentityWithId: function (identityId) {
            console.trace('IdentityController.goToIdentityWithId');
            var currentContext = this,
                deferred = $.Deferred();

            var identityModelInstance = new IdentityModel({identityId: identityId});
            var openEntryLogCollectionInstance = new EntryLogCollection();
            var recentEntryLogCollectionInstance = new EntryLogCollection();
            var identityDetailViewInstance = new IdentityDetailView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                model: identityModelInstance,
                openEntryLogCollection: openEntryLogCollectionInstance,
                recentEntryLogCollection: recentEntryLogCollectionInstance
            });

            currentContext.router.swapContent(identityDetailViewInstance);
            var routerFragment = 'identity/' + identityId
            var fragmentAlreadyMatches = (Backbone.history.fragment === routerFragment || Backbone.history.fragment === '');
            currentContext.router.navigate(routerFragment, {replace: fragmentAlreadyMatches});

            identityDetailViewInstance.showLoading();
            currentContext.identityService.getIdentityList({identityId: identityId})
                .then(function (getIdentityListResponse) {
                    identityDetailViewInstance.setIdentityModel(getIdentityListResponse.identity);
                    currentContext.dispatcher.trigger(EventNamesEnum.identityUpdated, identityDetailViewInstance.identityModel);
                    if (getIdentityListResponse.identityList && getIdentityListResponse.identityList.length > 0) {
                        identityModelInstance.set(getIdentityListResponse.identityList[0]);
                        identityDetailViewInstance.updateViewFromModel();
                        identityDetailViewInstance.completeLoading();
                        deferred.resolve(identityDetailViewInstance);
                    }
                })
                .fail(function (error) {
                    identityModelInstance.clear();
                    identityDetailViewInstance.showError(utils.getResource('criticalSystemErrorMessage'));
                    identityDetailViewInstance.completeLoading();
                    deferred.reject(identityDetailViewInstance);
                });

            return deferred.promise();
        },

        refreshIdentityList: function (identityCollection, options) {
            console.trace('IdentityController.refreshIdentityList');
            options || (options = {});
            var currentContext = this,
                deferred = $.Deferred();

            if (options.searchType === SearchTypesEnum.nearby) {
                currentContext.geoLocationService.getCurrentPosition()
                    .then(function (position) {
                        currentContext.identityService.getIdentityList(_.extend(options, position))
                            .then(function (getIdentityListResponse) {
                                utils.computeDistances(position.coords, getIdentityListResponse.identityList);
                                identityCollection.reset(getIdentityListResponse.identityList);
                                deferred.resolve(identityCollection);
                            })
                            .fail(function (error) {
                                identityCollection.reset();
                                deferred.reject(identityCollection);
                            });
                    })
                    .fail(function (error) {
                        locusCollectionInstance.reset();
                        deferred.reject(locusCollectionInstance);
                    });
            } else {
                currentContext.identityService.getIdentityList(options)
                    .then(function (getIdentityListResponse) {
                        identityCollection.reset(getIdentityListResponse.identityList);
                        deferred.resolve(identityCollection);
                    })
                    .fail(function (error) {
                        identityCollection.reset();
                        deferred.reject(identityCollection);
                    });
            }

            return deferred.promise();
        }
    });

    return IdentityController;
});