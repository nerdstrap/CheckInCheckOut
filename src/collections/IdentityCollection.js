'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var IdentityModel = require('models/IdentityModel');

/**
 *
 * @type {IdentityCollection}
 */
var IdentityCollection = Backbone.Collection.extend({
    model: IdentityModel
});

module.exports = IdentityCollection;