define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        IdentityService = require('services/IdentityService'),
        GeoLocationService = require('services/GeoLocationService'),
        IdentitySearchView = require('views/IdentitySearchView'),
        IdentityModel = require('models/IdentityModel'),
        IdentityView = require('views/IdentityView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        globals = require('globals'),
        utils = require('utils');

    /**
     * Creates a new IdentityController with the specified attributes.
     * @constructor
     * @param {object} options
     */
    var IdentityController;
    IdentityController = function (options) {
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

            this.listenTo(this.dispatcher, AppEventNamesEnum.goToIdentitySearch, this.goToIdentitySearch);
            this.listenTo(this.dispatcher, AppEventNamesEnum.goToIdentityWithId, this.goToIdentityWithId);
            this.listenTo(this.dispatcher, AppEventNamesEnum.refreshIdentityList, this.refreshIdentityList);
            this.listenTo(this.dispatcher, AppEventNamesEnum.refreshIdentityListByGps, this.refreshIdentityListByGps);

            this.listenTo(this.dispatcher, AppEventNamesEnum.goToDirectionsWithLatLng, this.goToDirectionsWithLatLng);
        },

        goToIdentitySearch: function () {
            console.trace('IdentityController.goToIdentity');
            var currentContext = this,
                deferred = $.Deferred();

            var identitySearchViewInstance = new IdentitySearchView({
                controller: currentContext,
                dispatcher: currentContext.dispatcher
            });

            currentContext.router.swapContent(identitySearchViewInstance);
            var routerFragment = utils.getResource('identity.fragment');
            var fragmentAlreadyMatches = (Backbone.history.fragment === routerFragment || Backbone.history.fragment === '');
            currentContext.router.navigate(routerFragment, {replace: fragmentAlreadyMatches});

            identitySearchViewInstance.showLoading();
            currentContext.identityService.getIdentitySearchOptions()
                .then(function (getIdentitySearchOptionsResponse) {
                    currentContext.dispatcher.trigger(AppEventNamesEnum.identityUpdated, getIdentitySearchOptionsResponse.userRole);
                    identitySearchViewInstance.setUserId(getIdentitySearchOptionsResponse.userId);
                    identitySearchViewInstance.setUserRole(getIdentitySearchOptionsResponse.userRole);
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
                    currentContext.dispatcher.trigger(AppEventNamesEnum.identityUpdated, getIdentityListResponse.userRole);
                    identityViewInstance.setUserId(getIdentityListResponse.userId);
                    identityViewInstance.setUserRole(getIdentityListResponse.userRole);
                    if (getIdentityListResponse.identityList && getIdentityListResponse.identityList.length > 0) {
                        currentContext.geoLocationService.getCurrentPosition()
                            .then(function (position) {
                                utils.computeDistances(position.coords, getIdentityListResponse.identityList);
                                identityModelInstance.reset(getIdentityListResponse.identityList[0]);
                                identityViewInstance.completeLoading();
                                deferred.resolve(identityViewInstance);
                            });
                    } else {
                        identityModelInstance.reset();
                        identityViewInstance.showError(utils.getResource('identityNotFoundErrorMessage'));
                        identityViewInstance.completeLoading();
                        deferred.reject(identityViewInstance);
                    }
                })
                .fail(function (error) {
                    identityModelInstance.reset();
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

            currentContext.identityService.getIdentityList(options)
                .then(function (getIdentityListResponse) {
                    currentContext.geoLocationService.getCurrentPosition()
                        .then(function (position) {
                            utils.computeDistances(position.coords, getIdentityListResponse.identityList);
                            identityCollectionInstance.reset(getIdentityListResponse.identityList);
                            deferred.resolve(identityCollectionInstance);
                        })
                        .fail(function () {
                            identityCollectionInstance.reset(getIdentityListResponse.identityList);
                            deferred.resolve(identityCollectionInstance);
                        });
                })
                .fail(function (error) {
                    identityCollectionInstance.reset();
                    deferred.reject(identityCollectionInstance);
                });

            return deferred.promise();
        },

        refreshIdentityListByGps: function (identityCollectionInstance, options) {
            console.trace('IdentityController.refreshIdentityList');
            options || (options = {});
            var currentContext = this,
                deferred = $.Deferred();

            currentContext.geoLocationService.getCurrentPosition()
                .then(function (position) {
                    currentContext.identityService.getIdentityList(position)
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
                    identityCollectionInstance.reset();
                    deferred.reject(identityCollectionInstance);
                });

            return deferred.promise();
        },

        goToDirectionsWithLatLng: function (latitude, longitude) {
            console.trace('IdentityController.goToDirectionsWithLatLng');
            var directionsUri = 'http://maps.google.com?daddr=' + latitude + ',' + longitude;
            globals.window.open(directionsUri);
        }
    });

    return IdentityController;
});