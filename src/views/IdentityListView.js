'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var BaseView = require('views/BaseView');
var IdentityListItemView = require('views/IdentityListItemView');
var env = require('env');
var utils = require('utils');
var EventNamesEnum = require('enums/EventNamesEnum');
var template = require('hbs!templates/IdentityListView');

var IdentityListView = BaseView.extend({
    /**
     *
     */
    tagName: 'div',

    /**
     *
     */
    className: 'identity-list-view',

    /**
     *
     */
    headerTextFormatString: utils.getResource('identityListViewHeaderTextFormatString'),

    /**
     *
     * @param options
     */
    initialize: function (options) {
        console.trace('IdentityListView.initialize');
        options || (options = {});
        this.controller = options.controller;
        this.dispatcher = options.dispatcher || this;

        this.listenTo(this.collection, 'reset', this.addAll);
        this.listenTo(this, 'leave', this.onLeave);
    },

    /**
     *
     * @returns {IdentityListView}
     */
    render: function () {
        console.trace('IdentityListView.render()');
        var currentContext = this;
        var renderModel = _.extend({}, currentContext.model);
        currentContext.$el.html(template(renderModel));
        return this;
    },

    /**
     *
     * @returns {IdentityListView}
     */
    updateHeader: function () {
        var currentContext = this;
        var headerText = '';
        if (currentContext.collection) {
            headerText = utils.formatString(currentContext.headerTextFormatString, [currentContext.collection.length]);

        }
        currentContext.$('#identity-list-view-header').html(headerText);
        return this;
    },

    /**
     *
     * @returns {IdentityListView}
     */
    addAll: function () {
        var currentContext = this;
        currentContext._leaveChildren();
        _.each(currentContext.collection.models, currentContext.addOne, currentContext);
        currentContext.updateHeader();
        return this;
    },

    /**
     *
     * @param model
     * @returns {IdentityListView}
     */
    addOne: function (model) {
        var currentContext = this;
        var identityListItemViewInstance = new IdentityListItemView({
            'controller': currentContext.controller,
            'dispatcher': currentContext.dispatcher,
            'model': model
        });
        currentContext.appendChildTo(identityListItemViewInstance, '#identity-rows-container');
        return this;
    },

    /**
     *
     * @returns {IdentityListView}
     */
    removeAll: function () {
        var currentContext = this;
        currentContext._leaveChildren();
        currentContext.updateHeader();
        return this;
    },

    /**
     *
     */
    onLeave: function () {
        var currentContext = this;
        console.trace('IdentityListView.onLeave');
    }
});

module.exports = IdentityListView;
