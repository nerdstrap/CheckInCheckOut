'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var IdentityModel = require('models/IdentityModel');
var IdentityCollection = require('collections/IdentityCollection');
var EventNameEnum = require('enums/EventNameEnum');
var utils = require('lib/utils');

/**
 *
 * @param options
 * @constructor
 */
var IdentityViewController = function (options) {
    options || (options = {});
    this.initialize.apply(this, arguments);
};

_.extend(IdentityViewController.prototype, Backbone.Events, {
    /**
     *
     * @param options
     */
    initialize: function (options) {
        console.trace('IdentityViewController.initialize');
        options || (options = {});
        this.router = options.router;
        this.dispatcher = options.dispatcher;
        this.persistenceContext = options.persistenceContext;
    }
});

module.exports = IdentityViewController;