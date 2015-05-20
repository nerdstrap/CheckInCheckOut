'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var BaseView = require('views/BaseView');
var LocusListItemView = require('views/LocusListItemView');
var env = require('env');
var utils = require('utils');
var EventNamesEnum = require('enums/EventNamesEnum');
var template = require('hbs!templates/LocusListView');

var LocusListView = BaseView.extend({
    /**
     *
     */
    tagName: 'div',

    /**
     *
     */
    className: 'locus-list-view',

    /**
     *
     */
    headerTextFormatString: utils.getResource('locusListViewHeaderTextFormatString'),

    /**
     *
     * @param options
     */
    initialize: function (options) {
        console.trace('LocusListView.initialize');
        options || (options = {});
        this.controller = options.controller;
        this.dispatcher = options.dispatcher || this;

        this.listenTo(this.collection, 'reset', this.addAll);
        this.listenTo(this, 'leave', this.onLeave);
    },

    /**
     *
     * @returns {LocusListView}
     */
    render: function () {
        console.trace('LocusListView.render()');
        var currentContext = this;
        var renderModel = _.extend({}, currentContext.model);
        currentContext.$el.html(template(renderModel));
        return this;
    },

    /**
     *
     * @returns {LocusListView}
     */
    updateHeader: function () {
        var currentContext = this;
        var headerText = '';
        if (currentContext.collection) {
            headerText = utils.formatString(currentContext.headerTextFormatString, [currentContext.collection.length]);

        }
        currentContext.$('#locus-list-view-header').html(headerText);
        return this;
    },

    /**
     *
     * @returns {LocusListView}
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
     * @returns {LocusListView}
     */
    addOne: function (model) {
        var currentContext = this;
        var locusListItemViewInstance = new LocusListItemView({
            'controller': currentContext.controller,
            'dispatcher': currentContext.dispatcher,
            'model': model
        });
        currentContext.appendChildTo(locusListItemViewInstance, '#locus-rows-container');
        return this;
    },

    /**
     *
     * @returns {LocusListView}
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
        console.trace('LocusListView.onLeave');
    }
});

module.exports = LocusListView;