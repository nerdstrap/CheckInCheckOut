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
        'models/LocusModel': MockModel,
        'collections/LocusCollection': MockCollection,
        'views/LocusSearchView': MockView
    });

    describe('go to locus search', function () {
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
            var fakeUserRole = UserRolesEnum.Admin;

            var fakeLocusServiceInstance = {};
            fakeLocusServiceInstance.getLocusSearchOptions = function () {
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
            spyOn(fakeLocusServiceInstance, 'getLocusSearchOptions').and.callThrough();
            self.locusSearchControllerInstance.locusService = fakeLocusServiceInstance;

            //act
            var promise = self.locusSearchControllerInstance.goToLocusSearch();

            promise.then(function (locusSearchView) {
                //assert
                expect(self.locusSearchControllerInstance.router.swapContent).toHaveBeenCalledWith(locusSearchView);
                expect(self.locusSearchControllerInstance.router.navigate).toHaveBeenCalledWith('locus', jasmine.any(Object));
                expect(locusSearchView.showLoading).toHaveBeenCalled();
                expect(self.locusSearchControllerInstance.locusService.getLocusSearchOptions).toHaveBeenCalled();
                expect(self.locusSearchControllerInstance.dispatcher.trigger).toHaveBeenCalledWith(AppEventNamesEnum.userRoleUpdated, fakeUserRole);
                expect(locusSearchView.hideLoading).toHaveBeenCalled();
                done();
            }, function () {
                this.fail(new Error('locusSearchControllerInstance.getLocusSearchOptions call failed'));
                done();
            });
        });

        it('should show error', function (done) {
            //arrange
            var fakeUserRole = UserRolesEnum.Admin;

            var fakeLocusServiceInstance = {};
            fakeLocusServiceInstance.getLocusSearchOptions = function () {
                var currentContext = this;
                var deferred = $.Deferred();

                var serverError = new Error({ errorCode: 500, errorMessage: 'server error' });

                globals.window.setTimeout(function () {
                    deferred.rejectWith(currentContext, [serverError]);
                }, 50);

                return deferred.promise();
            };
            spyOn(fakeLocusServiceInstance, 'getLocusSearchOptions').and.callThrough();
            self.locusSearchControllerInstance.locusService = fakeLocusServiceInstance;

            //act
            var promise = self.locusSearchControllerInstance.goToLocusSearch();

            promise.fail(function (locusSearchView) {
                //assert
                expect(self.locusSearchControllerInstance.router.swapContent).toHaveBeenCalledWith(locusSearchView);
                expect(self.locusSearchControllerInstance.router.navigate).toHaveBeenCalledWith('locus', jasmine.any(Object));
                expect(locusSearchView.showLoading).toHaveBeenCalled();
                expect(self.locusSearchControllerInstance.locusService.getLocusSearchOptions).toHaveBeenCalled();
                expect(locusSearchView.hideLoading).toHaveBeenCalled();
                expect(locusSearchView.showError).toHaveBeenCalled();
                done();
            }, function () {
                this.fail(new Error('locusSearchControllerInstance.getLocusSearchOptions call failed'));
                done();
            });
        });

    });
});