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
        'views/StationSearchView': MockView
    });

    describe('go to station search', function () {
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
                this.fail('require controllers/StationSearchController failed to load!');
            });
        });

        it('should render the view', function (done) {
            //arrange
            var fakeUserRole = UserRolesEnum.Admin;

            var fakeStationServiceInstance = {};
            fakeStationServiceInstance.getStationSearchOptions = function () {
                var currentContext = this;
                var deferred = $.Deferred();

                var results = {
                    userRole: fakeUserRole
                };

                globals.window.setTimeout(function () {
                    deferred.resolveWith(currentContext, [results]);
                }, 50);

                return deferred.promise();
            };
            spyOn(fakeStationServiceInstance, 'getStationSearchOptions').and.callThrough();
            self.stationSearchControllerInstance.stationService = fakeStationServiceInstance;

            //act
            var promise = self.stationSearchControllerInstance.goToStationSearch();

            promise.then(function (stationSearchView) {
                //assert
                expect(self.stationSearchControllerInstance.router.swapContent).toHaveBeenCalledWith(stationSearchView);
                expect(self.stationSearchControllerInstance.router.navigate).toHaveBeenCalledWith('station', jasmine.any(Object));
                expect(stationSearchView.showLoading).toHaveBeenCalled();
                expect(self.stationSearchControllerInstance.stationService.getStationSearchOptions).toHaveBeenCalled();
                expect(self.stationSearchControllerInstance.dispatcher.trigger).toHaveBeenCalledWith(AppEventNamesEnum.userRoleUpdated, fakeUserRole);
                expect(stationSearchView.hideLoading).toHaveBeenCalled();
                done();
            }, function () {
                this.fail(new Error('stationSearchControllerInstance.goToStationSearch call failed'));
                done();
            });
        });

        it('should show error', function (done) {
            //arrange
            var fakeUserRole = UserRolesEnum.Admin;

            var fakeStationServiceInstance = {};
            fakeStationServiceInstance.getStationSearchOptions = function () {
                var currentContext = this;
                var deferred = $.Deferred();

                var serverError = new Error({ errorCode: 500, errorMessage: 'server error' });

                globals.window.setTimeout(function () {
                    deferred.rejectWith(currentContext, [serverError]);
                }, 50);

                return deferred.promise();
            };
            spyOn(fakeStationServiceInstance, 'getStationSearchOptions').and.callThrough();
            self.stationSearchControllerInstance.stationService = fakeStationServiceInstance;

            //act
            var promise = self.stationSearchControllerInstance.goToStationSearch();

            promise.fail(function (stationSearchView) {
                //assert
                expect(self.stationSearchControllerInstance.router.swapContent).toHaveBeenCalledWith(stationSearchView);
                expect(self.stationSearchControllerInstance.router.navigate).toHaveBeenCalledWith('station', jasmine.any(Object));
                expect(stationSearchView.showLoading).toHaveBeenCalled();
                expect(self.stationSearchControllerInstance.stationService.getStationSearchOptions).toHaveBeenCalled();
                expect(stationSearchView.hideLoading).toHaveBeenCalled();
                expect(stationSearchView.showError).toHaveBeenCalled();
                done();
            }, function () {
                this.fail(new Error('stationSearchControllerInstance.goToStationSearch call failed'));
                done();
            });
        });

    });
});