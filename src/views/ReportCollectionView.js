'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var BaseView = require('views/BaseView');
var ReportTileView = require('views/ReportTileView');
var EventNameEnum = require('enums/EventNameEnum');
var utils = require('lib/utils');
var template = require('templates/ReportCollectionView.hbs');

var ReportCollectionView = BaseView.extend({

    /**
     *
     */
    headerText: utils.getResource('reportCollectionViewHeaderText'),

    /**
     *
     */
    headerTextFormatString: utils.getResource('reportCollectionViewHeaderTextFormatString'),

    /**
     *
     * @param options
     */
    initialize: function (options) {
        console.trace('ReportCollectionView.initialize');
        options || (options = {});
        this.dispatcher = options.dispatcher || this;

        this.listenTo(this.collection, 'sync', this.onSync);
        this.listenTo(this.collection, 'reset', this.onReset);
        this.listenTo(this, 'loaded', this.onLoaded);
        this.listenTo(this, 'leave', this.onLeave);
    },

    /**
     *
     * @returns {ReportCollectionView}
     */
    render: function () {
        var currentContext = this;
        currentContext.setElement(template());
        currentContext.updateHeader();
        return this;
    },

    /**
     *
     * @returns {ReportCollectionView}
     */
    updateHeader: function (useFormat) {
        var currentContext = this;
        var formattedHeaderText = '';
        if (useFormat && currentContext.collection) {
            formattedHeaderText = utils.formatString(currentContext.headerTextFormatString, [currentContext.collection.length]);
        } else {
            formattedHeaderText = currentContext.headerText;
        }
        currentContext.$('.collection-header').text(formattedHeaderText);
        return this;
    },

    /**
     *
     * @param locusModel
     * @returns {ReportCollectionView}
     */
    appendTile: function (locusModel) {
        var currentContext = this;
        var reportTileView = new ReportTileView({
            'dispatcher': currentContext.dispatcher,
            'model': locusModel
        });
        currentContext.appendChildTo(reportTileView, '.tile-wrap');
        return this;
    },


    /**
     *
     */
    onSync: function () {
        var currentContext = this;
        currentContext.$('.tile-wrap').removeClass('el-loading-done');
        currentContext._leaveChildren();
        currentContext.updateHeader();
    },

    /**
     *
     */
    onReset: function () {
        var currentContext = this;
        currentContext._leaveChildren();
        _.each(currentContext.collection.models, currentContext.appendTile, currentContext);
        currentContext.updateHeader(true);
        currentContext.$('.tile-wrap').addClass('el-loading-done');
    },

    /**
     *
     */
    onLoaded: function () {
        var currentContext = this;
        console.trace('ReportCollectionView.onLoaded');
    },

    /**
     *
     */
    onLeave: function () {
        var currentContext = this;
        console.trace('ReportCollectionView.onLeave');
    }
});

module.exports = ReportCollectionView;