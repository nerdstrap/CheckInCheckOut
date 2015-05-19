'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var SwappingRouter = require('routers/SwappingRouter');
var ShellView = require('views/ShellView');
var LocusController = require('controllers/LocusController');
var IdentityController = require('controllers/IdentityController');
var EntryLogController = require('controllers/EntryLogController');
var eventBusSingleton = require('eventBusSingleton');

var AppRouter = SwappingRouter.extend({
    
    initialize: function (options) {
        console.trace('appRouter.initialize');
        options || (options = {});
        var currentContext = this;

        //shell
        var shellViewInstance = new ShellView({
            model: new Backbone.Model({ id: 1 }),
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
        'locus': 'goToLocusSearch',
        'locus/:id': 'goToLocusWithId',
        'identity': 'goToIdentitySearch',
        'identity/:id': 'goToIdentityWithId',
        'admin/station': 'goToLocusAdmin'
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
    },

    goToLocusAdmin: function () {
        console.trace('appRouter.goToAdmin');
        this.locusControllerInstance.goToLocusAdmin();
    }
});

module.exports = AppRouter;