define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        globals = require('globals'),
        EventBus = require('EventBus'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        UserRolesEnum = require('enums/UserRolesEnum'),
        MockRouter = require('mocks/MockRouter'),
        MockModel = require('mocks/MockModel'),
        MockCollection = require('mocks/MockCollection'),
        MockView = require('mocks/MockView'),
        Squire = require('squire');

    var injector = new Squire();
    var builder = injector.mock({
        'models/ListingModel': MockModel,
        'collections/ListingCollection': MockCollection,
        'views/ListingView': MockView
    });

    describe('refresh listings', function () {
        var self = this;

        beforeEach(function (done) {
            self.mockRouterInstance = new MockRouter();

            self.mockEventBusSingleton = new EventBus();
            self.mockEventBusSingleton.trigger = jasmine.createSpy();

            builder.require(['controllers/ListingController'], function (ListingController) {
                self.listingSearchControllerInstance = new ListingController({
                    router: self.mockRouterInstance,
                    dispatcher: self.mockEventBusSingleton
                });
                done();
            }, function (err) {
                this.fail('require controllers/ListingController failed to load!');
            });
        });

        it('should update the collection', function (done) {
            //arrange
            var fakeListingId1 = 1976;
            var fakeListing1 = {
                'listingId': fakeListingId1
            };
            var fakeListingId2 = 1978;
            var fakeListing2 = {
                'listingId': fakeListingId2
            };
            var fakeListingId3 = 2002;
            var fakeListing3 = {
                'listingId': fakeListingId3
            };
            var fakeListings = [fakeListing1, fakeListing2, fakeListing3];
            var fakeUserRole = UserRolesEnum.Admin;

            var fakeListingServiceInstance = {};
            fakeListingServiceInstance.getListings = function (options) {
                options || (options = {});
                var currentContext = this;
                var deferred = $.Deferred();

                var results = {
                    listings: fakeListings,
                    userRole: fakeUserRole
                };

                globals.window.setTimeout(function () {
                    deferred.resolveWith(currentContext, [results]);
                }, 50);

                return deferred.promise();
            };
            spyOn(fakeListingServiceInstance, 'getListings').and.callThrough();
            self.listingSearchControllerInstance.listingService = fakeListingServiceInstance;

            var fakeGeoLocationServiceInstance = {};
            fakeGeoLocationServiceInstance.getCurrentPosition = function (options) {
                options || (options = {});
                var currentContext = this;
                var deferred = $.Deferred();

                var results = {
                    coords: {
                        latitude: 40,
                        longitude: 82
                    }
                };

                globals.window.setTimeout(function () {
                    deferred.resolveWith(currentContext, [results]);
                }, 1000);

                return deferred.promise();
            };
            spyOn(fakeGeoLocationServiceInstance, 'getCurrentPosition').and.callThrough();
            self.listingSearchControllerInstance.geoLocationService = fakeGeoLocationServiceInstance;

            var mockListingCollectionInstance = new MockCollection();
            var fakeOptions = {};

            //act
            var promise = self.listingSearchControllerInstance.refreshListingList(mockListingCollectionInstance, fakeOptions);

            promise.then(function (listingCollection) {
                //assert
                expect(self.listingSearchControllerInstance.listingService.getListings).toHaveBeenCalled();
                expect(self.listingSearchControllerInstance.geoLocationService.getCurrentPosition).toHaveBeenCalled();
                expect(listingCollection.reset).toHaveBeenCalledWith(fakeListings);
                done();
            }, function () {
                this.fail(new Error('listingSearchControllerInstance.refreshListingList call failed'));
                done();
            });
        });

        it('should empty the collection and trigger an error', function (done) {
            //arrange
            var fakeUserRole = UserRolesEnum.Admin;

            var fakeListingServiceInstance = {};
            fakeListingServiceInstance.getListings = function (options) {
                var currentContext = this;
                var deferred = $.Deferred();

                var serverError = new Error({ errorCode: 500, errorMessage: 'server error' });

                globals.window.setTimeout(function () {
                    deferred.rejectWith(currentContext, [serverError]);
                }, 50);

                return deferred.promise();
            };
            spyOn(fakeListingServiceInstance, 'getListings').and.callThrough();
            self.listingSearchControllerInstance.listingService = fakeListingServiceInstance;

            var mockListingCollectionInstance = new MockCollection();
            var fakeOptions = {};

            //act
            var promise = self.listingSearchControllerInstance.refreshListingList(mockListingCollectionInstance, fakeOptions);

            promise.fail(function (listingCollection) {
                //assert
                expect(self.listingSearchControllerInstance.listingService.getListings).toHaveBeenCalled();
                expect(listingCollection.reset).toHaveBeenCalledWith();
                done();
            }, function () {
                this.fail(new Error('listingSearchControllerInstance.refreshListingList call failed'));
                done();
            });
        });

    });
});