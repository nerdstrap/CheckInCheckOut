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

    describe('go to locus with id', function () {
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

        it('should render the view', function (done) {
            //arrange
            var fakeLocusId = 1976;
            var fakeLocus = {
                'locusId': fakeLocusId
            };
            var fakeLoci = [fakeLocus];
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

            //act
            var promise = self.locusSearchControllerInstance.goToLocusWithId(fakeLocusId);

            promise.then(function (locusView) {
                //assert
                expect(self.locusSearchControllerInstance.router.swapContent).toHaveBeenCalledWith(locusView);
                expect(self.locusSearchControllerInstance.router.navigate).toHaveBeenCalledWith('locus/' + fakeLocusId, jasmine.any(Object));
                expect(locusView.showLoading).toHaveBeenCalled();
                expect(self.locusSearchControllerInstance.locusService.getLocusList).toHaveBeenCalled();
                expect(self.locusSearchControllerInstance.dispatcher.trigger).toHaveBeenCalledWith(EventNamesEnum.identityUpdated, fakeUserRole);
                expect(self.locusSearchControllerInstance.geoLocationService.getCurrentPosition).toHaveBeenCalled();
                expect(locusView.model.reset).toHaveBeenCalledWith(fakeLocus);
                expect(locusView.hideLoading).toHaveBeenCalled();
                done();
            }, function () {
                this.fail(new Error('locusSearchControllerInstance.goToLocusWithId call failed'));
                done();
            });
        });

        it('should render the view, clear the model, trigger an error on the model, and show an alert', function (done) {
            //arrange
            var fakeLocusId = 1976;
            var fakeLoci = [];
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

            //act
            var promise = self.locusSearchControllerInstance.goToLocusWithId(fakeLocusId);

            promise.fail(function (locusView) {
                //assert
                expect(self.locusSearchControllerInstance.router.swapContent).toHaveBeenCalledWith(locusView);
                expect(self.locusSearchControllerInstance.router.navigate).toHaveBeenCalledWith('locus/' + fakeLocusId, jasmine.any(Object));
                expect(locusView.showLoading).toHaveBeenCalled();
                expect(self.locusSearchControllerInstance.locusService.getLocusList).toHaveBeenCalled();
                expect(self.locusSearchControllerInstance.dispatcher.trigger).toHaveBeenCalledWith(EventNamesEnum.identityUpdated, fakeUserRole);
                expect(locusView.model.reset).toHaveBeenCalled();
                expect(locusView.hideLoading).toHaveBeenCalled();
                expect(locusView.showError).toHaveBeenCalled();
                done();
            }, function () {
                this.fail(new Error('locusSearchControllerInstance.goToLocusWithId call failed'));
                done();
            });
        });

        it('should render the view, clear the model, trigger an error on the model, and show an alert', function (done) {
            //arrange
            var fakeLocusId = 1976;
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
            self.locusSearchControllerInstance.locusService = fakeLocusServiceInstance;

            //act
            var promise = self.locusSearchControllerInstance.goToLocusWithId(fakeLocusId);

            promise.fail(function (locusView) {
                //assert
                expect(self.locusSearchControllerInstance.router.swapContent).toHaveBeenCalledWith(locusView);
                expect(self.locusSearchControllerInstance.router.navigate).toHaveBeenCalledWith('locus/' + fakeLocusId, jasmine.any(Object));
                expect(locusView.showLoading).toHaveBeenCalled();
                expect(self.locusSearchControllerInstance.locusService.getLocusList).toHaveBeenCalled();
                expect(locusView.model.reset).toHaveBeenCalled();
                expect(locusView.hideLoading).toHaveBeenCalled();
                expect(locusView.showError).toHaveBeenCalled();
                done();
            }, function () {
                this.fail(new Error('locusSearchControllerInstance.goToLocusWithId call failed'));
                done();
            });
        });

    });
});