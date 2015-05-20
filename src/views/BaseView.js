'use strict';

var $ = require('jquery');
var _ = require('underscore');
var CompositeView = require('views/CompositeView');
var IdentityModel = require('models/IdentityModel');
var AlertView = require('views/AlertView');
var AlertModel = require('models/AlertModel');
var EventNamesEnum = require('enums/EventNamesEnum');
var env = require('env');

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
    completeLoading: function () {
        this.trigger('loaded');
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

module.exports = BaseView;
