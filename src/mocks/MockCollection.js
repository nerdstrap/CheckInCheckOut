define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        MockModel = require('mocks/MockModel');

    var MockCollection = Backbone.Collection.extend({
        model: MockModel,
        initialize: function (options) {
            options || (options = {});
            this.reset = jasmine.createSpy();
        }
    });
    return MockCollection;
});
