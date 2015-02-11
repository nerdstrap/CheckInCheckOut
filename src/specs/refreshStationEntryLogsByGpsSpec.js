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
        'models/StationEntryLogModel': MockModel,
        'collections/StationEntryLogCollection': MockCollection,
        'views/StationEntryLogView': MockView
    });

    describe('refresh station entry logs by gps', function () {
        var self = this;

        beforeEach(function (done) {
            self.mockRouterInstance = new MockRouter();

            self.mockEventBusSingleton = new EventBus();
            self.mockEventBusSingleton.trigger = jasmine.createSpy();

            builder.require(['controllers/StationEntryLogSearchController'], function (StationEntryLogSearchController) {
                self.stationEntryLogSearchControllerInstance = new StationEntryLogSearchController({
                    router: self.mockRouterInstance,
                    dispatcher: self.mockEventBusSingleton
                });
                done();
            }, function (err) {
                this.fail('require controllers/StationEntryLogSearchController failed to load!');
            });
        });

        it('should update the collection', function (done) {
            //arrange
            var fakeStationEntryLogId1 = 1976;
            var fakeStationEntryLog1 = {
                'stationEntryLogId': fakeStationEntryLogId1
            };
            var fakeStationEntryLogId2 = 1978;
            var fakeStationEntryLog2 = {
                'stationEntryLogId': fakeStationEntryLogId2
            };
            var fakeStationEntryLogId3 = 2002;
            var fakeStationEntryLog3 = {
                'stationEntryLogId': fakeStationEntryLogId3
            };
            var fakeStationEntryLogs = [fakeStationEntryLog1, fakeStationEntryLog2, fakeStationEntryLog3];
            var fakeUserRole = UserRolesEnum.Admin;

            var fakeStationEntryLogServiceInstance = {};
            fakeStationEntryLogServiceInstance.getStationEntryLogs = function (options) {
                options || (options = {});
                var currentContext = this;
                var deferred = $.Deferred();

                var results = {
                    stationEntryLogs: fakeStationEntryLogs,
                    userRole: fakeUserRole
                };

                globals.window.setTimeout(function () {
                    deferred.resolveWith(currentContext, [results]);
                }, 50);

                return deferred.promise();
            };
            spyOn(fakeStationEntryLogServiceInstance, 'getStationEntryLogs').and.callThrough();
            self.stationEntryLogSearchControllerInstance.stationEntryLogService = fakeStationEntryLogServiceInstance;

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
            self.stationEntryLogSearchControllerInstance.geoLocationService = fakeGeoLocationServiceInstance;

            var mockStationEntryLogCollectionInstance = new MockCollection();
            var fakeOptions = {};

            //act
            var promise = self.stationEntryLogSearchControllerInstance.refreshStationEntryLogsByGps(mockStationEntryLogCollectionInstance, fakeOptions);

            promise.then(function (stationEntryLogCollection) {
                //assert
                expect(self.stationEntryLogSearchControllerInstance.geoLocationService.getCurrentPosition).toHaveBeenCalled();
                expect(self.stationEntryLogSearchControllerInstance.stationEntryLogService.getStationEntryLogs).toHaveBeenCalled();
                expect(stationEntryLogCollection.reset).toHaveBeenCalledWith(fakeStationEntryLogs);
                done();
            }, function () {
                this.fail(new Error('stationEntryLogSearchControllerInstance.refreshStationEntryLogs call failed'));
                done();
            });
        });

        it('should empty the collection and trigger an error', function (done) {
            //arrange
            var fakeUserRole = UserRolesEnum.Admin;

            var fakeStationEntryLogServiceInstance = {};
            fakeStationEntryLogServiceInstance.getStationEntryLogs = function (options) {
                var currentContext = this;
                var deferred = $.Deferred();

                var serverError = new Error({ errorCode: 500, errorMessage: 'server error' });

                globals.window.setTimeout(function () {
                    deferred.rejectWith(currentContext, [serverError]);
                }, 50);

                return deferred.promise();
            };
            spyOn(fakeStationEntryLogServiceInstance, 'getStationEntryLogs').and.callThrough();
            self.stationEntryLogSearchControllerInstance.geoLocationService = fakeStationEntryLogServiceInstance;

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
            self.stationEntryLogSearchControllerInstance.geoLocationService = fakeGeoLocationServiceInstance;

            var mockStationEntryLogCollectionInstance = new MockCollection();
            var fakeOptions = {};

            //act
            var promise = self.stationEntryLogSearchControllerInstance.refreshStationEntryLogsByGps(mockStationEntryLogCollectionInstance, fakeOptions);

            promise.fail(function (stationEntryLogCollection) {
                //assert
                expect(self.stationEntryLogSearchControllerInstance.geoLocationService.getCurrentPosition).toHaveBeenCalled();
                expect(stationEntryLogCollection.reset).toHaveBeenCalledWith();
                done();
            }, function () {
                this.fail(new Error('stationEntryLogSearchControllerInstance.refreshStationEntryLogs call failed'));
                done();
            });
        });

    });
});