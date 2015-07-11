'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var Handlebars = require('hbsfy/runtime');
var utils = require('lib/utils');

Handlebars.registerHelper('resource', utils.getResource);

Handlebars.registerHelper('default', function (value, defaultValue) {
    if (value) {
        return value;
    } else {
        return new Handlebars.SafeString(defaultValue);
    }
});

Handlebars.registerHelper('phone', function (value, defaultValue) {
    if (value) {
        return utils.formatPhone(value);
    } else {
        return new Handlebars.SafeString(defaultValue);
    }
});

Handlebars.registerHelper('datetime', function (value, defaultValue) {
    if (value) {
        return utils.formatDate(value);
    } else {
        return new Handlebars.SafeString(defaultValue);
    }
});