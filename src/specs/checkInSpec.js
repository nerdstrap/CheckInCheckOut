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

    describe('check in', function () {
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

        it('should post the model attributes', function (done) {
            //arrange
            var fakeListingId = 1976;
            var fakeListing = {
                'listingId': fakeListingId
            };
            var fakeUserRole = UserRolesEnum.Admin;

            var fakeListingServiceInstance = {};
            fakeListingServiceInstance.postCheckIn = function (options) {
                options || (options = {});
                var currentContext = this;
                var deferred = $.Deferred();

                var results = {
                    listing: fakeListing,
                    userRole: fakeUserRole
                };

                globals.window.setTimeout(function () {
                    deferred.resolveWith(currentContext, [results]);
                }, 50);

                return deferred.promise();
            };
            spyOn(fakeListingServiceInstance, 'postCheckIn').and.callThrough();
            self.listingSearchControllerInstance.listingService = fakeListingServiceInstance;

            var mockListingModelInstance = new MockModel();

            //act
            var promise = self.listingSearchControllerInstance.checkIn(mockListingModelInstance);

            promise.then(function (listingModel) {
                //assert
                expect(self.listingSearchControllerInstance.listingService.postCheckIn).toHaveBeenCalledWith(mockListingModelInstance.attributes);
                expect(mockListingModelInstance.reset).toHaveBeenCalledWith(fakeListing);
                expect(self.listingSearchControllerInstance.dispatcher.trigger).toHaveBeenCalledWith(AppEventNamesEnum.checkInSuccess, mockListingModelInstance);
                done();
            }, function () {
                this.fail(new Error('listingSearchControllerInstance.checkIn call failed'));
                done();
            });
        });

    });
});