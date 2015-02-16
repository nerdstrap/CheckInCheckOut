define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone');

    var MockView = Backbone.View.extend({
        initialize: function (options) {
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.setUserId = jasmine.createSpy();
            this.setUserRole = jasmine.createSpy();
            this.showLoading = jasmine.createSpy();
            this.completeLoading = jasmine.createSpy();
            this.hideLoading = jasmine.createSpy();
            this.showSuccess = jasmine.createSpy();
            this.showError = jasmine.createSpy();
        }
    });
    return MockView;
});
