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

    describe('go to station with id', function () {
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

        it('should render the view', function (done) {
            //arrange
            var fakeStationId = 1976;
            var fakeStation = {
                'stationId': fakeStationId
            };
            var fakeStations = [fakeStation];
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

            //act
            var promise = self.stationSearchControllerInstance.goToStationWithId(fakeStationId);

            promise.then(function (stationView) {
                //assert
                expect(self.stationSearchControllerInstance.router.swapContent).toHaveBeenCalledWith(stationView);
                expect(self.stationSearchControllerInstance.router.navigate).toHaveBeenCalledWith('station/' + fakeStationId, jasmine.any(Object));
                expect(stationView.showLoading).toHaveBeenCalled();
                expect(self.stationSearchControllerInstance.stationService.getStations).toHaveBeenCalled();
                expect(self.stationSearchControllerInstance.dispatcher.trigger).toHaveBeenCalledWith(AppEventNamesEnum.userRoleUpdated, fakeUserRole);
                expect(stationView.setUserRole).toHaveBeenCalledWith(fakeUserRole);
                expect(stationView.model.trigger).toHaveBeenCalledWith('reset', fakeStation);
                expect(stationView.hideLoading).toHaveBeenCalled();
                done();
            }, function () {
                self.fail(new Error('stationSearchControllerInstance.goToStationWithId call failed'));
                done();
            });
        });

        it('should render the view, clear the model, trigger an error on the model, and show an alert', function (done) {
            //arrange
            var fakeStationId = 1976;
            var fakeStations = [];
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

            //act
            var promise = self.stationSearchControllerInstance.goToStationWithId(fakeStationId);

            promise.fail(function (stationView) {
                //assert
                expect(self.stationSearchControllerInstance.router.swapContent).toHaveBeenCalledWith(stationView);
                expect(self.stationSearchControllerInstance.router.navigate).toHaveBeenCalledWith('station/' + fakeStationId, jasmine.any(Object));
                expect(stationView.showLoading).toHaveBeenCalled();
                expect(self.stationSearchControllerInstance.stationService.getStations).toHaveBeenCalled();
                expect(self.stationSearchControllerInstance.dispatcher.trigger).toHaveBeenCalledWith(AppEventNamesEnum.userRoleUpdated, fakeUserRole);
                expect(stationView.setUserRole).toHaveBeenCalledWith(fakeUserRole);
                expect(stationView.model.clear).toHaveBeenCalled();
                expect(stationView.model.trigger).toHaveBeenCalledWith('error');
                expect(stationView.hideLoading).toHaveBeenCalled();
                expect(stationView.showError).toHaveBeenCalled();
                done();
            }, function () {
                self.fail(new Error('stationSearchControllerInstance.goToStationWithId call failed'));
                done();
            });
        });

        it('should render the view, clear the model, trigger an error on the model, and show an alert', function (done) {
            //arrange
            var fakeStationId = 1976;
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
            self.stationSearchControllerInstance.stationService = fakeStationServiceInstance;

            //act
            var promise = self.stationSearchControllerInstance.goToStationWithId(fakeStationId);

            promise.fail(function (results) {
                //assert
                expect(self.stationSearchControllerInstance.router.swapContent).toHaveBeenCalledWith(results.stationView);
                expect(self.stationSearchControllerInstance.router.navigate).toHaveBeenCalledWith('station/' + fakeStationId, jasmine.any(Object));
                expect(results.stationView.showLoading).toHaveBeenCalled();
                expect(self.stationSearchControllerInstance.stationService.getStations).toHaveBeenCalled();
                expect(results.stationView.model.clear).toHaveBeenCalled();
                expect(results.stationView.model.trigger).toHaveBeenCalledWith('error');
                expect(results.stationView.hideLoading).toHaveBeenCalled();
                expect(results.stationView.showError).toHaveBeenCalled();
                done();
            }, function () {
                self.fail(new Error('stationSearchControllerInstance.goToStationWithId call failed'));
                done();
            });
        });

    });
});