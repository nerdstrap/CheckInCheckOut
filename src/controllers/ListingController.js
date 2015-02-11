define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        ListingService = require('services/ListingService'),
        GeoLocationService = require('services/GeoLocationService'),
        ListingModel = require('models/ListingModel'),
        //ListingView = require('views/ListingView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        globals = require('globals'),
        utils = require('utils');

    /**
     * Creates a new ListingController with the specified attributes.
     * @constructor
     * @param {object} options
     */
    var ListingController;
    ListingController = function (options) {
        console.trace('new ListingController()');
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(ListingController.prototype, Backbone.Events, {
        /** @class ListingController
         * @constructs ListingController object
         * @param {object} options
         */
        initialize: function (options) {
            console.trace('ListingController.initialize');
            options || (options = {});
            this.router = options.router;
            this.dispatcher = options.dispatcher;
            this.listingService = options.listingService || new ListingService();
            this.geoLocationService = options.geoLocationService || new GeoLocationService();

            //this.listenTo(this.dispatcher, AppEventNamesEnum.goToListingWithId, this.goToListingWithId);
            this.listenTo(this.dispatcher, AppEventNamesEnum.refreshListingList, this.refreshListingList);
            this.listenTo(this.dispatcher, AppEventNamesEnum.refreshListingListByGps, this.refreshListingListByGps);
            this.listenTo(this.dispatcher, AppEventNamesEnum.checkIn, this.checkIn);
        },

        //goToListingWithId: function (listingId) {
        //    console.trace('ListingController.goToListingWithId');
        //    var currentContext = this,
        //        deferred = $.Deferred();
        //
        //    var listingModelInstance = new ListingModel({listingId: listingId});
        //    var listingViewInstance = new ListingView({
        //        controller: currentContext,
        //        dispatcher: currentContext.dispatcher,
        //        model: listingModelInstance
        //    });
        //
        //    currentContext.router.swapContent(listingViewInstance);
        //    var fragmentAlreadyMatches = (Backbone.history.fragment === 'listing/' + listingId || Backbone.history.fragment === '');
        //    currentContext.router.navigate('listing/' + listingId, {replace: fragmentAlreadyMatches});
        //
        //    listingViewInstance.showLoading();
        //    currentContext.listingService.getListings({listingId: listingId})
        //        .then(function (getListingsResponse) {
        //            currentContext.dispatcher.trigger(AppEventNamesEnum.userRoleUpdated, getListingsResponse.userRole);
        //            if (getListingsResponse.listings && getListingsResponse.listings.length > 0) {
        //                currentContext.geoLocationService.getCurrentPosition()
        //                    .then(function (position) {
        //                        utils.computeDistances(position.coords, getListingsResponse.listings);
        //                        listingModelInstance.reset(getListingsResponse.listings[0]);
        //                        listingViewInstance.hideLoading();
        //                        deferred.resolve(listingViewInstance);
        //                    });
        //            } else {
        //                listingModelInstance.reset();
        //                listingViewInstance.showError(utils.getResource('listingNotFoundErrorMessage'));
        //                listingViewInstance.hideLoading();
        //                deferred.reject(listingViewInstance);
        //            }
        //        })
        //        .fail(function (error) {
        //            listingModelInstance.reset();
        //            listingViewInstance.showError(utils.getResource('criticalSystemErrorMessage'));
        //            listingViewInstance.hideLoading();
        //            deferred.reject(listingViewInstance);
        //        });
        //
        //    return deferred.promise();
        //},

        refreshListingList: function (listingCollectionInstance, options) {
            console.trace('ListingController.refreshListingList');
            options || (options = {});
            var currentContext = this,
                deferred = $.Deferred();

            currentContext.listingService.getListings(options)
                .then(function (getListingsResponse) {
                    currentContext.geoLocationService.getCurrentPosition()
                        .then(function (position) {
                            utils.computeDistances(position.coords, getListingsResponse.listings);
                            listingCollectionInstance.reset(getListingsResponse.listings);
                            deferred.resolve(listingCollectionInstance);
                        })
                        .fail(function(){
                            listingCollectionInstance.reset(getListingsResponse.listings);
                            deferred.resolve(listingCollectionInstance);
                        });
                })
                .fail(function (error) {
                    listingCollectionInstance.reset();
                    deferred.reject(listingCollectionInstance);
                });

            return deferred.promise();
        },

        refreshListingListByGps: function (listingCollectionInstance, options) {
            console.trace('ListingController.refreshListingList');
            options || (options = {});
            var currentContext = this,
                deferred = $.Deferred();

            currentContext.geoLocationService.getCurrentPosition()
                .then(currentContext.listingService.getListings)
                .then(function (getListingsResponse) {
                    utils.computeDistances(getListingsResponse.coords, getListingsResponse.listings);
                    listingCollectionInstance.reset(getListingsResponse.listings);
                    deferred.resolve(listingCollectionInstance);
                })
                .fail(function (error) {
                    listingCollectionInstance.reset();
                    deferred.reject(listingCollectionInstance);
                });

            return deferred.promise();
        },

        checkIn: function(listingModelInstance) {
            console.trace('ListingController.checkIn');
            var currentContext = this,
                deferred = $.Deferred();

            currentContext.listingService.postCheckIn(listingModelInstance.attributes)
                .done(function(postCheckInResponse) {
                    listingModelInstance.reset(postCheckInResponse.listing);
                    currentContext.dispatcher.trigger(AppEventNamesEnum.checkInSuccess, listingModelInstance);
                    deferred.resolve(listingModelInstance);
                })
                .fail(function(error) {
                    listingModelInstance.reset();
                    currentContext.dispatcher.trigger(AppEventNamesEnum.checkInError, error);
                    deferred.reject(listingModelInstance);
            });

            return deferred.promise();
        }
    });

    return ListingController;
});