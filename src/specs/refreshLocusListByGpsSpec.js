define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        globals = require('globals'),
        EventBus = require('EventBus'),
        EventNamesEnum = require('enums/EventNamesEnum'),
        UserRolesEnum = require('enums/UserRolesEnum'),
        MockRouter = require('mocks/MockRouter'),
        MockModel = require('mocks/MockModel'),
        MockCollection = require('mocks/MockCollection'),
        MockView = require('mocks/MockView'),
        Squire = require('squire');

    var injector = new Squire();
    var builder = injector.mock({
        'models/LocusModel': MockModel,
        'collections/LocusCollection': MockCollection,
        'views/LocusView': MockView
    });

    describe('refresh locus list by gps', function () {
        var self = this;

        beforeEach(function (done) {
            self.mockRouterInstance = new MockRouter();

            self.mockEventBusSingleton = new EventBus();
            self.mockEventBusSingleton.trigger = jasmine.createSpy();

            builder.require(['controllers/LocusController'], function (LocusController) {
                self.locusSearchControllerInstance = new LocusController({
                    router: self.mockRouterInstance,
                    dispatcher: self.mockEventBusSingleton
                });
                done();
            }, function (err) {
                this.fail('require controllers/LocusController failed to load!');
            });
        });

        it('should update the collection', function (done) {
            //arrange
            var fakeLocusId1 = 1976;
            var fakeLocus1 = {
                'locusId': fakeLocusId1
            };
            var fakeLocusId2 = 1978;
            var fakeLocus2 = {
                'locusId': fakeLocusId2
            };
            var fakeLocusId3 = 2002;
            var fakeLocus3 = {
                'locusId': fakeLocusId3
            };
            var fakeLoci = [fakeLocus1, fakeLocus2, fakeLocus3];
            var fakeUserRole = UserRolesEnum.Admin;

            var fakeLocusServiceInstance = {};
            fakeLocusServiceInstance.getLocusList = function (options) {
                options || (options = {});
                var currentContext = this;
                var deferred = $.Deferred();

                var results = {
                    locusList: fakeLoci,
                    userRole: fakeUserRole
                };

                globals.window.setTimeout(function () {
                    deferred.resolveWith(currentContext, [results]);
                }, 50);

                return deferred.promise();
            };
            spyOn(fakeLocusServiceInstance, 'getLocusList').and.callThrough();
            self.locusSearchControllerInstance.locusService = fakeLocusServiceInstance;

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
            self.locusSearchControllerInstance.geoLocationService = fakeGeoLocationServiceInstance;

            var mockLocusCollectionInstance = new MockCollection();
            var fakeOptions = {};

            //act
            var promise = self.locusSearchControllerInstance.refreshLocusListByGps(mockLocusCollectionInstance, fakeOptions);

            promise.then(function (locusCollection) {
                //assert
                expect(self.locusSearchControllerInstance.geoLocationService.getCurrentPosition).toHaveBeenCalled();
                expect(self.locusSearchControllerInstance.locusService.getLocusList).toHaveBeenCalled();
                expect(locusCollection.reset).toHaveBeenCalledWith(fakeLoci);
                done();
            }, function () {
                this.fail(new Error('locusSearchControllerInstance.refreshLocusList call failed'));
                done();
            });
        });

        it('should empty the collection and trigger an error', function (done) {
            //arrange
            var fakeUserRole = UserRolesEnum.Admin;

            var fakeLocusServiceInstance = {};
            fakeLocusServiceInstance.getLocusList = function (options) {
                var currentContext = this;
                var deferred = $.Deferred();

                var serverError = new Error({ errorCode: 500, errorMessage: 'server error' });

                globals.window.setTimeout(function () {
                    deferred.rejectWith(currentContext, [serverError]);
                }, 50);

                return deferred.promise();
            };
            spyOn(fakeLocusServiceInstance, 'getLocusList').and.callThrough();
            self.locusSearchControllerInstance.geoLocationService = fakeLocusServiceInstance;

            var fakeGeoLocationServiceInstance = {};
            fakeGeoLocationServiceInstance.getCurrentPosition = function (options) {
                options || (options = {});
                var currentContext = this;
                var deferred = $.Deferred();

                var results = {
                    error: {
                        errorCode: 999, errorMessage: 'error'
                    }
                };

                globals.window.setTimeout(function () {
                    deferred.rejectWith(currentContext, [results]);
                }, 50);

                return deferred.promise();
            };
            spyOn(fakeGeoLocationServiceInstance, 'getCurrentPosition').and.callThrough();
            self.locusSearchControllerInstance.geoLocationService = fakeGeoLocationServiceInstance;

            var mockLocusCollectionInstance = new MockCollection();
            var fakeOptions = {};

            //act
            var promise = self.locusSearchControllerInstance.refreshLocusListByGps(mockLocusCollectionInstance, fakeOptions);

            promise.fail(function (locusCollection) {
                //assert
                expect(self.locusSearchControllerInstance.geoLocationService.getCurrentPosition).toHaveBeenCalled();
                expect(locusCollection.reset).toHaveBeenCalledWith();
                done();
            }, function () {
                this.fail(new Error('locusSearchControllerInstance.refreshLocusList call failed'));
                done();
            });
        });

    });
});