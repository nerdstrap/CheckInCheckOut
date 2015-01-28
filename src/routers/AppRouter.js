define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        SwappingRouter = require('routers/SwappingRouter'),
        ShellView = require('views/ShellView'),
        StationSearchController = require('controllers/StationSearchController'),
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
            this.stationSearchControllerInstance = new StationSearchController({
                router: currentContext,
                dispatcher: eventBusSingleton
            });
        },

        routes: {
            '': 'goToStationSearch',
            'station': 'goToStationSearch',
            'station/:id': 'goToStationWithId'
        },

        goToStationSearch: function () {
            console.trace('appRouter.goToStationSearch');
            this.stationSearchControllerInstance.goToStationSearch();
        },

        goToStationWithId: function (stationId) {
            console.trace('appRouter.goToStationWithId');
            this.stationSearchControllerInstance.goToStationWithId(stationId);
        }
    });

    return AppRouter;
});