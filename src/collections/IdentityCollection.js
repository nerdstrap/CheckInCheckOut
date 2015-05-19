'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var IdentityModel = require('models/IdentityModel');

var IdentityCollection = Backbone.Collection.extend({
    model: IdentityModel,
    initialize: function (options) {
        options || (options = {});
    }
});

module.exports = IdentityCollection;