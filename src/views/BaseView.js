define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        CompositeView = require('views/CompositeView'),
        IdentityModel = require('models/IdentityModel'),
        AlertView = require('views/AlertView'),
        AlertModel = require('models/AlertModel'),
        EventNamesEnum = require('enums/EventNamesEnum'),
        globals = require('globals'),
        env = require('env');

    var BaseView = function (options) {
        CompositeView.apply(this, [options]);
    };

    _.extend(BaseView.prototype, CompositeView.prototype, {
        setIdentityModel: function (identity) {
            if (this.identityModel) {
                if (identity.hasOwnProperty('identityId')) {
                    delete identity.identityId;
                }
                this.identityModel.set(identity, {silent: true});
            } else {
                this.identityModel = new IdentityModel(identity);
            }
        },
        showLoading: function () {
            this.$('.loading.' + this.cid).removeClass('hidden');
        },
        completeLoading: function () {
            this.hideLoading();
            this.trigger('loaded');
        },
        hideLoading: function () {
            this.$('.loading.' + this.cid).addClass('hidden');
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
            var alertModelInstance = new AlertModel({
                level: level,
                message: message
            });
            var alertViewInstance = new AlertView({
                model: alertModelInstance,
                dispatcher: this.dispatcher
            });
            this.prependChildTo(alertViewInstance, '.alert-view-container.' + this.cid);
        }
    });

    BaseView.extend = CompositeView.extend;

    return BaseView;
});
