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

    describe('check in', function () {
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

        it('should post the model attributes', function (done) {
            //arrange
            var fakeStationEntryLogId = 1976;
            var fakeStationEntryLog = {
                'stationEntryLogId': fakeStationEntryLogId
            };
            var fakeUserRole = UserRolesEnum.Admin;

            var fakeStationEntryLogServiceInstance = {};
            fakeStationEntryLogServiceInstance.postCheckIn = function (options) {
                options || (options = {});
                var currentContext = this;
                var deferred = $.Deferred();

                var results = {
                    stationEntryLog: fakeStationEntryLog,
                    userRole: fakeUserRole
                };

                globals.window.setTimeout(function () {
                    deferred.resolveWith(currentContext, [results]);
                }, 50);

                return deferred.promise();
            };
            spyOn(fakeStationEntryLogServiceInstance, 'postCheckIn').and.callThrough();
            self.stationEntryLogSearchControllerInstance.stationEntryLogService = fakeStationEntryLogServiceInstance;

            var mockStationEntryLogModelInstance = new MockModel();

            //act
            var promise = self.stationEntryLogSearchControllerInstance.checkIn(mockStationEntryLogModelInstance);

            promise.then(function (stationEntryLogModel) {
                //assert
                expect(self.stationEntryLogSearchControllerInstance.stationEntryLogService.postCheckIn).toHaveBeenCalledWith(mockStationEntryLogModelInstance.attributes);
                expect(mockStationEntryLogModelInstance.reset).toHaveBeenCalledWith(fakeStationEntryLog);
                expect(self.stationEntryLogSearchControllerInstance.dispatcher.trigger).toHaveBeenCalledWith(AppEventNamesEnum.checkInSuccess, mockStationEntryLogModelInstance);
                done();
            }, function () {
                this.fail(new Error('stationEntryLogSearchControllerInstance.checkIn call failed'));
                done();
            });
        });

    });
});