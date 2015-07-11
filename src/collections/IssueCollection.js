'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var IssueModel = require('models/IssueModel');

/**
 *
 * @type {IssueCollection}
 */
var IssueCollection = Backbone.Collection.extend({
    model: IssueModel
});

module.exports = IssueCollection;