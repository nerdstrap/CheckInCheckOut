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
        'models/EntryLogModel': MockModel,
        'collections/EntryLogCollection': MockCollection,
        'views/EntryLogView': MockView
    });

    describe('refresh locus entry logs by gps', function () {
        var self = this;

        beforeEach(function (done) {
            self.mockRouterInstance = new MockRouter();

            self.mockEventBusSingleton = new EventBus();
            self.mockEventBusSingleton.trigger = jasmine.createSpy();

            builder.require(['controllers/EntryLogController'], function (EntryLogController) {
                self.entryLogSearchControllerInstance = new EntryLogController({
                    router: self.mockRouterInstance,
                    dispatcher: self.mockEventBusSingleton
                });
                done();
            }, function (err) {
                this.fail('require controllers/EntryLogController failed to load!');
            });
        });

        it('should update the collection', function (done) {
            //arrange
            var fakeEntryLogId1 = 1976;
            var fakeEntryLog1 = {
                'entryLogId': fakeEntryLogId1
            };
            var fakeEntryLogId2 = 1978;
            var fakeEntryLog2 = {
                'entryLogId': fakeEntryLogId2
            };
            var fakeEntryLogId3 = 2002;
            var fakeEntryLog3 = {
                'entryLogId': fakeEntryLogId3
            };
            var fakeEntryLogs = [fakeEntryLog1, fakeEntryLog2, fakeEntryLog3];
            var fakeUserRole = UserRolesEnum.Admin;

            var fakeEntryLogServiceInstance = {};
            fakeEntryLogServiceInstance.getEntryLogList = function (options) {
                options || (options = {});
                var currentContext = this;
                var deferred = $.Deferred();

                var results = {
                    entryLogList: fakeEntryLogs,
                    userRole: fakeUserRole
                };

                globals.window.setTimeout(function () {
                    deferred.resolveWith(currentContext, [results]);
                }, 50);

                return deferred.promise();
            };
            spyOn(fakeEntryLogServiceInstance, 'getEntryLogList').and.callThrough();
            self.entryLogSearchControllerInstance.entryLogService = fakeEntryLogServiceInstance;

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
            self.entryLogSearchControllerInstance.geoLocationService = fakeGeoLocationServiceInstance;

            var mockEntryLogCollectionInstance = new MockCollection();
            var fakeOptions = {};

            //act
            var promise = self.entryLogSearchControllerInstance.refreshEntryLogListByGps(mockEntryLogCollectionInstance, fakeOptions);

            promise.then(function (entryLogCollection) {
                //assert
                expect(self.entryLogSearchControllerInstance.geoLocationService.getCurrentPosition).toHaveBeenCalled();
                expect(self.entryLogSearchControllerInstance.entryLogService.getEntryLogList).toHaveBeenCalled();
                expect(entryLogCollection.reset).toHaveBeenCalledWith(fakeEntryLogs);
                done();
            }, function () {
                this.fail(new Error('entryLogSearchControllerInstance.refreshEntryLogList call failed'));
                done();
            });
        });

        it('should empty the collection and trigger an error', function (done) {
            //arrange
            var fakeUserRole = UserRolesEnum.Admin;

            var fakeEntryLogServiceInstance = {};
            fakeEntryLogServiceInstance.getEntryLogList = function (options) {
                var currentContext = this;
                var deferred = $.Deferred();

                var serverError = new Error({ errorCode: 500, errorMessage: 'server error' });

                globals.window.setTimeout(function () {
                    deferred.rejectWith(currentContext, [serverError]);
                }, 50);

                return deferred.promise();
            };
            spyOn(fakeEntryLogServiceInstance, 'getEntryLogList').and.callThrough();
            self.entryLogSearchControllerInstance.geoLocationService = fakeEntryLogServiceInstance;

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
            self.entryLogSearchControllerInstance.geoLocationService = fakeGeoLocationServiceInstance;

            var mockEntryLogCollectionInstance = new MockCollection();
            var fakeOptions = {};

            //act
            var promise = self.entryLogSearchControllerInstance.refreshEntryLogListByGps(mockEntryLogCollectionInstance, fakeOptions);

            promise.fail(function (entryLogCollection) {
                //assert
                expect(self.entryLogSearchControllerInstance.geoLocationService.getCurrentPosition).toHaveBeenCalled();
                expect(entryLogCollection.reset).toHaveBeenCalledWith();
                done();
            }, function () {
                this.fail(new Error('entryLogSearchControllerInstance.refreshEntryLogList call failed'));
                done();
            });
        });

    });
});