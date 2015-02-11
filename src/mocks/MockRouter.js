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
            this.goToLocus = jasmine.createSpy();
            this.goToLocusWithId = jasmine.createSpy();
        }
    });
    return MockRouter;
});
