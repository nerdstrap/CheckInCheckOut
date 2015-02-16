define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        IdentityModel = require('models/IdentityModel');

    var IdentityCollection = Backbone.Collection.extend({
        model: IdentityModel,
        initialize: function (options) {
            options || (options = {});
        }
    });

    return IdentityCollection;
});
