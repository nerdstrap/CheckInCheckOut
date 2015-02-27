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
        'models/EntryLogModel': MockModel,
        'collections/EntryLogCollection': MockCollection,
        'views/EntryLogView': MockView
    });

    describe('check in', function () {
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

        it('should post the model attributes', function (done) {
            //arrange
            var fakeEntryLogId = 1976;
            var fakeEntryLog = {
                'entryLogId': fakeEntryLogId
            };
            var fakeUserRole = UserRolesEnum.Admin;

            var fakeEntryLogServiceInstance = {};
            fakeEntryLogServiceInstance.postCheckIn = function (options) {
                options || (options = {});
                var currentContext = this;
                var deferred = $.Deferred();

                var results = {
                    entryLog: fakeEntryLog,
                    userRole: fakeUserRole
                };

                globals.window.setTimeout(function () {
                    deferred.resolveWith(currentContext, [results]);
                }, 50);

                return deferred.promise();
            };
            spyOn(fakeEntryLogServiceInstance, 'postCheckIn').and.callThrough();
            self.entryLogSearchControllerInstance.entryLogService = fakeEntryLogServiceInstance;

            var mockEntryLogModelInstance = new MockModel();

            //act
            var promise = self.entryLogSearchControllerInstance.checkIn(mockEntryLogModelInstance);

            promise.then(function (entryLogModel) {
                //assert
                expect(self.entryLogSearchControllerInstance.entryLogService.postCheckIn).toHaveBeenCalledWith(mockEntryLogModelInstance.attributes);
                expect(mockEntryLogModelInstance.reset).toHaveBeenCalledWith(fakeEntryLog);
                expect(self.entryLogSearchControllerInstance.dispatcher.trigger).toHaveBeenCalledWith(EventNamesEnum.checkInSuccess, mockEntryLogModelInstance);
                done();
            }, function () {
                this.fail(new Error('entryLogSearchControllerInstance.checkIn call failed'));
                done();
            });
        });

    });
});