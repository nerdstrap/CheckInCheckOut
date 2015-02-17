define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        SwappingRouter = require('routers/SwappingRouter'),
        ShellView = require('views/ShellView'),
        LocusController = require('controllers/LocusController'),
        IdentityController = require('controllers/IdentityController'),
        EntryLogController = require('controllers/EntryLogController'),
        eventBusSingleton = require('eventBusSingleton');

    var AppRouter = SwappingRouter.extend({
        initialize: function (options) {
            console.trace('appRouter.initialize');
            options || (options = {});
            var currentContext = this;

            //shell
            var shellViewInstance = new ShellView({
                model: new Backbone.Model({id: 1}),
                el: $('body'),
                dispatcher: eventBusSingleton
            });
            shellViewInstance.render();
            this.contentViewEl = shellViewInstance.contentViewEl();

            //controllers
            this.locusControllerInstance = new LocusController({
                router: currentContext,
                dispatcher: eventBusSingleton
            });
            this.identityControllerInstance = new IdentityController({
                router: currentContext,
                dispatcher: eventBusSingleton
            });
            this.entryLogControllerInstance = new EntryLogController({
                router: currentContext,
                dispatcher: eventBusSingleton
            });
        },

        routes: {
            '': 'goToLocusSearch',
            'station': 'goToLocusSearch',
            'station/:id': 'goToLocusWithId',
            'person': 'goToIdentitySearch',
            'person/:id': 'goToIdentityWithId'
        },

        goToLocusSearch: function () {
            console.trace('appRouter.goToLocusSearch');
            this.locusControllerInstance.goToLocusSearch();
        },

        goToLocusWithId: function (locusId) {
            console.trace('appRouter.goToLocusWithId');
            this.locusControllerInstance.goToLocusWithId(locusId);
        },

        goToIdentitySearch: function () {
            console.trace('appRouter.goToIdentitySearch');
            this.identityControllerInstance.goToIdentitySearch();
        },

        goToIdentityWithId: function (identityId) {
            console.trace('appRouter.goToIdentityWithId');
            this.identityControllerInstance.goToIdentityWithId(identityId);
        }
    });

    return AppRouter;
});