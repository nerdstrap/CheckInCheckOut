'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var BaseView = require('views/BaseView');
var EntryLogListItemView = require('views/EntryLogListItemView');
var env = require('env');
var utils = require('utils');
var EventNamesEnum = require('enums/EventNamesEnum');
var template = require('hbs!templates/EntryLogListView');

var EntryLogListView = BaseView.extend({
    /**
     *
     */
    tagName: 'div',

    /**
     *
     */
    className: 'entry-log-list-view',

    /**
     *
     */
    headerTextFormatString: utils.getResource('entryLogListViewHeaderTextFormatString'),

    /**
     *
     */
    showIdentity: true,

    /**
     *
     */
    showLocus: false,

    /**
     *
     * @param options
     */
    initialize: function (options) {
        console.trace('EntryLogListView.initialize');
        options || (options = {});
        this.controller = options.controller;
        this.dispatcher = options.dispatcher || this;

        if (options.headerTextFormatString) {
            this.headerTextFormatString = options.headerTextFormatString;
        }

        if (options.showIdentity) {
            this.showIdentity = options.showIdentity;
        }

        if (options.showLocus) {
            this.showLocus = options.showLocus;
        }

        this.listenTo(this.collection, 'reset', this.addAll);
        this.listenTo(this, 'leave', this.onLeave);
    },

    /**
     *
     * @returns {EntryLogListView}
     */
    render: function () {
        console.trace('EntryLogListView.render()');
        var currentContext = this;
        var renderModel = _.extend({}, currentContext.model);
        currentContext.$el.html(template(renderModel));
        return this;
    },

    /**
     *
     * @returns {EntryLogListView}
     */
    updateHeader: function () {
        var currentContext = this;
        var headerText = '';
        if (currentContext.collection && currentContext.collection.length) {
            headerText = utils.formatString(currentContext.headerTextFormatString, [currentContext.collection.length]);
        }
        currentContext.$('#entry-log-list-view-header').html(headerText);
        return this;
    },

    /**
     *
     * @returns {EntryLogListView}
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
     * @returns {EntryLogListView}
     */
    addOne: function (model) {
        var currentContext = this;
        var entryLogListItemViewInstance = new EntryLogListItemView({
            'controller': currentContext.controller,
            'dispatcher': currentContext.dispatcher,
            'model': model,
            'showIdentity': currentContext.showIdentity,
            'showLocus': currentContext.showLocus
        });
        currentContext.appendChildTo(entryLogListItemViewInstance, '#entry-log-rows-container');
        return this;
    },

    /**
     *
     * @returns {EntryLogListView}
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
        console.trace('EntryLogListView.onLeave');
    }
});

module.exports = EntryLogListView;
