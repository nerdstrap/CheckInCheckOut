define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        CompositeView = require('views/CompositeView'),
        AlertView = require('views/AlertView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        globals = require('globals'),
        env = require('env'),
        utils = require('utils');

    var BaseView = function (options) {
        CompositeView.apply(this, [options]);
    };

    _.extend(BaseView.prototype, CompositeView.prototype, {
        setUserRole: function(userRole) {
            this.userRole = userRole;
        },
        showLoading: function () {
            this.$('.view-status').removeClass('hidden');
        },
        hideLoading: function () {
            this.$('.view-status').addClass('hidden');
        },
        showInfo: function (message) {
            var level;
            this.addAlert(level, message);
        },
        showSuccess: function (message) {
            this.addAlert('success', message);
        },
        showError: function (message) {
            this.addAlert('alert', message);
        },
        addAlert: function (level, message) {
            var alertModel = {
                level: level,
                message: message
            };
            var alertViewInstance = new AlertView({
                model: alertModel,
                dispatcher: currentContext.dispatcher
            });
            this.prependChildTo(alertViewInstance, '.view-alerts:first .columns');
        }
    });

    BaseView.extend = CompositeView.extend;

    return BaseView;
});
