'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var EntryLogModel = require('models/EntryLogModel');

/**
 *
 * @type {EntryLogCollection}
 */
var EntryLogCollection = Backbone.Collection.extend({
    model: EntryLogModel
});

module.exports = EntryLogCollection;