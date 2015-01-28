define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone');

    var MockRouter = Backbone.Router.extend({
        initialize: function (options) {
            options || (options = {});
            this.navigate = jasmine.createSpy();
            this.swapContent = jasmine.createSpy();
            this.goToStationSearch = jasmine.createSpy();
            this.goToStationWithId = jasmine.createSpy();
        }
    });
    return MockRouter;
});
