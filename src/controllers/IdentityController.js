define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        GeoLocationService = require('services/GeoLocationService'),
        IdentityService = require('services/IdentityService'),
        SimpleSearchView = require('views/SimpleSearchView'),
        IdentityModel = require('models/IdentityModel'),
        IdentityCollection = require('collections/IdentityCollection'),
        IdentityListItemView = require('views/IdentityListItemView'),
        IdentityView = require('views/IdentityView'),
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

            this.listenTo(this.dispatcher, EventNamesEnum.goToDirectionsWithLatLng, this.goToDirectionsWithLatLng);
        },

        goToIdentitySearch: function () {
            console.trace('IdentityController.goToIdentity');
            var currentContext = this,
                deferred = $.Deferred();

            var identitySearchViewInstance = new SimpleSearchView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                headerText: utils.getResource('identitySearch.headerText'),
                listCollection: IdentityCollection,
                listItemView: IdentityListItemView,
                headerTextFormatString: utils.getResource('identityList.headerTextFormatString'),
                refreshListTrigger: EventNamesEnum.refreshIdentityList
            });

            currentContext.router.swapContent(identitySearchViewInstance);
            var routerFragment = utils.getResource('identity.fragment');
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
            var identityViewInstance = new IdentityView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher,
                model: identityModelInstance
            });

            currentContext.router.swapContent(identityViewInstance);
            var routerFragment = utils.getResource('identityWithId.fragment');
            var fragmentAlreadyMatches = (Backbone.history.fragment === routerFragment + identityId || Backbone.history.fragment === '');
            currentContext.router.navigate(routerFragment + identityId, {replace: fragmentAlreadyMatches});

            identityViewInstance.showLoading();
            currentContext.identityService.getIdentityList({identityId: identityId})
                .then(function (getIdentityListResponse) {
                    identityViewInstance.setIdentityModel(getIdentityListResponse.identity);
                    currentContext.dispatcher.trigger(EventNamesEnum.identityUpdated, identityViewInstance.identityModel);
                    if (getIdentityListResponse.identityList && getIdentityListResponse.identityList.length > 0) {
                        identityModelInstance.set(getIdentityListResponse.identityList[0]);
                        identityViewInstance.updateViewFromModel();
                        identityViewInstance.completeLoading();
                        deferred.resolve(identityViewInstance);
                    }
                })
                .fail(function (error) {
                    identityModelInstance.clear();
                    identityViewInstance.showError(utils.getResource('criticalSystemErrorMessage'));
                    identityViewInstance.completeLoading();
                    deferred.reject(identityViewInstance);
                });

            return deferred.promise();
        },

        refreshIdentityList: function (identityCollectionInstance, options) {
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
                                identityCollectionInstance.reset(getIdentityListResponse.identityList);
                                deferred.resolve(identityCollectionInstance);
                            })
                            .fail(function (error) {
                                identityCollectionInstance.reset();
                                deferred.reject(identityCollectionInstance);
                            });
                    })
                    .fail(function (error) {
                        locusCollectionInstance.reset();
                        deferred.reject(locusCollectionInstance);
                    });
            } else {
                currentContext.identityService.getIdentityList(options)
                    .then(function (getIdentityListResponse) {
                        identityCollectionInstance.reset(getIdentityListResponse.identityList);
                        deferred.resolve(identityCollectionInstance);
                    })
                    .fail(function (error) {
                        identityCollectionInstance.reset();
                        deferred.reject(identityCollectionInstance);
                    });
            }

            return deferred.promise();
        }
    });

    return IdentityController;
});