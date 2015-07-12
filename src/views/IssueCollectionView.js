'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var BaseView = require('views/BaseView');
var IssueTileView = require('views/IssueTileView');
var EventNameEnum = require('enums/EventNameEnum');
var utils = require('lib/utils');
var template = require('templates/IssueCollectionView.hbs');

var IssueCollectionView = BaseView.extend({

    /**
     *
     */
    headerText: utils.getResource('issueCollectionViewHeaderText'),

    /**
     *
     */
    headerTextFormatString: utils.getResource('issueCollectionViewHeaderTextFormatString'),

    /**
     *
     * @param options
     */
    initialize: function (options) {
        options || (options = {});
        this.dispatcher = options.dispatcher || this;

        this.listenTo(this.collection, 'sync', this.onSync);
        this.listenTo(this.collection, 'reset', this.onReset);
        this.listenTo(this, 'loaded', this.onLoaded);
        this.listenTo(this, 'leave', this.onLeave);
    },

    /**
     *
     * @returns {IssueCollectionView}
     */
    render: function () {
        var currentContext = this;
        currentContext.setElement(template());
        currentContext.updateHeader();
        return this;
    },

    /**
     *
     * @returns {IssueCollectionView}
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
     * @param issueModel
     * @returns {IssueCollectionView}
     */
    appendTile: function (issueModel) {
        var currentContext = this;
        var issueTileView = new IssueTileView({
            'dispatcher': currentContext.dispatcher,
            'model': issueModel
        });
        currentContext.appendChildTo(issueTileView, '.tile-wrap');
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
    },

    /**
     *
     */
    onLeave: function () {
        var currentContext = this;
    }
});

module.exports = IssueCollectionView;