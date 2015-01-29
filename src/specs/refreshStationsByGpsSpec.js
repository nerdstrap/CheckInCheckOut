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
        'models/StationModel': MockModel,
        'collections/StationCollection': MockCollection,
        'views/StationView': MockView
    });

    describe('refresh stations by gps', function () {
        var self = this;

        beforeEach(function (done) {
            self.mockRouterInstance = new MockRouter();

            self.mockEventBusSingleton = new EventBus();
            self.mockEventBusSingleton.trigger = jasmine.createSpy();

            builder.require(['controllers/StationSearchController'], function (StationSearchController) {
                self.stationSearchControllerInstance = new StationSearchController({
                    router: self.mockRouterInstance,
                    dispatcher: self.mockEventBusSingleton
                });
                done();
            }, function (err) {
                self.fail('require controllers/StationSearchController failed to load!');
            });
        });

        it('should update the collection', function (done) {
            //arrange
            var fakeStationId1 = 1976;
            var fakeStation1 = {
                'stationId': fakeStationId1
            };
            var fakeStationId2 = 1978;
            var fakeStation2 = {
                'stationId': fakeStationId2
            };
            var fakeStationId3 = 2002;
            var fakeStation3 = {
                'stationId': fakeStationId3
            };
            var fakeStations = [fakeStation1, fakeStation2, fakeStation3];
            var fakeUserRole = UserRolesEnum.Admin;

            var fakeStationServiceInstance = {};
            fakeStationServiceInstance.getStations = function (options) {
                options || (options = {});
                var currentContext = this;
                var deferred = $.Deferred();

                var results = {
                    stations: fakeStations,
                    userRole: fakeUserRole
                };

                globals.window.setTimeout(function () {
                    deferred.resolveWith(currentContext, [results]);
                }, 1000);

                return deferred.promise();
            };
            spyOn(fakeStationServiceInstance, 'getStations').and.callThrough();
            self.stationSearchControllerInstance.stationService = fakeStationServiceInstance;

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
            self.stationSearchControllerInstance.geoLocationService = fakeGeoLocationServiceInstance;

            var mockStationCollectionInstance = new MockCollection();
            var fakeOptions = {};

            //act
            var promise = self.stationSearchControllerInstance.refreshStationsByGps(mockStationCollectionInstance, fakeOptions);

            promise.then(function (stationCollection) {
                //assert
                expect(self.stationSearchControllerInstance.geoLocationService.getCurrentPosition).toHaveBeenCalled();
                expect(self.stationSearchControllerInstance.stationService.getStations).toHaveBeenCalled();
                expect(mockStationCollectionInstance.reset).toHaveBeenCalledWith(fakeStations);
                done();
            }, function () {
                self.fail(new Error('stationSearchControllerInstance.refreshStations call failed'));
                done();
            });
        });

        it('should empty the collection and trigger an error', function (done) {
            //arrange
            var fakeUserRole = UserRolesEnum.Admin;

            var fakeStationServiceInstance = {};
            fakeStationServiceInstance.getStations = function (options) {
                var currentContext = this;
                var deferred = $.Deferred();

                var serverError = new Error({ errorCode: 500, errorMessage: 'server error' });

                globals.window.setTimeout(function () {
                    deferred.rejectWith(currentContext, [serverError]);
                }, 1000);

                return deferred.promise();
            };
            spyOn(fakeStationServiceInstance, 'getStations').and.callThrough();
            self.stationSearchControllerInstance.geoLocationService = fakeStationServiceInstance;

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
                }, 1000);

                return deferred.promise();
            };
            spyOn(fakeGeoLocationServiceInstance, 'getCurrentPosition').and.callThrough();
            self.stationSearchControllerInstance.geoLocationService = fakeGeoLocationServiceInstance;

            var mockStationCollectionInstance = new MockCollection();
            var fakeOptions = {};

            //act
            var promise = self.stationSearchControllerInstance.refreshStationsByGps(mockStationCollectionInstance, fakeOptions);

            promise.fail(function (results) {
                //assert
                expect(self.stationSearchControllerInstance.geoLocationService.getCurrentPosition).toHaveBeenCalled();
                expect(mockStationCollectionInstance.reset).toHaveBeenCalledWith();
                expect(mockStationCollectionInstance.trigger).toHaveBeenCalledWith('error');
                expect(results.error).toBeDefined();
                done();
            }, function () {
                self.fail(new Error('stationSearchControllerInstance.refreshStations call failed'));
                done();
            });
        });

    });
});