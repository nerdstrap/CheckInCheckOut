'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');

/**
 *
 * @type {IssueModel}
 */
var IssueModel = Backbone.Model.extend({

    /**
     *
     */
    idAttribute: 'issueId',

    /**
     *
     */
    validation: {
        description: {
            required: true,
            minLength: 1,
            maxLength: 100
        }
    }

});

module.exports = IssueModel;