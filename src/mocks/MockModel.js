define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone');

    var MockModel = Backbone.Model.extend({
        initialize: function (options) {
            options || (options = {});
            this.clear = jasmine.createSpy();
            this.set = jasmine.createSpy();
            this.trigger = jasmine.createSpy();
        }
    });
    return MockModel;
});
