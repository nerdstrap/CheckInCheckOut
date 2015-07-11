'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var BaseView = require('views/BaseView');
var EntryLogTileView = require('views/EntryLogTileView');
var EventNameEnum = require('enums/EventNameEnum');
var utils = require('lib/utils');
var template = require('templates/EntryLogCollectionView.hbs');

var EntryLogCollectionView = BaseView.extend({

    /**
     *
     */
    headerText: utils.getResource('entryLogCollectionViewHeaderText'),

    /**
     *
     */
    headerTextFormatString: utils.getResource('entryLogCollectionViewHeaderTextFormatString'),

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
        console.trace('EntryLogCollectionView.initialize');
        options || (options = {});
        this.dispatcher = options.dispatcher || this;

        if (options.showIdentity) {
            this.showIdentity = options.showIdentity;
        }

        if (options.showLocus) {
            this.showLocus = options.showLocus;
        }

        this.listenTo(this.collection, 'sync', this.onSync);
        this.listenTo(this.collection, 'reset', this.onReset);
        this.listenTo(this, 'loaded', this.onLoaded);
        this.listenTo(this, 'leave', this.onLeave);
    },

    /**
     *
     * @returns {EntryLogCollectionView}
     */
    render: function () {
        var currentContext = this;
        currentContext.setElement(template());
        currentContext.updateHeader
        return this;
    },

    /**
     *
     * @returns {LocusCollectionView}
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
     * @param model
     * @returns {EntryLogCollectionView}
     */
    appendTile: function (model) {
        var currentContext = this;
        var entryLogTileView = new EntryLogTileView({
            'dispatcher': currentContext.dispatcher,
            'model': model,
            'showIdentity': currentContext.showIdentity,
            'showLocus': currentContext.showLocus
        });
        currentContext.appendChildTo(entryLogTileView, '.tile-container');
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
        console.trace('EntryLogCollectionView.onLoaded');
    },

    /**
     *
     */
    onLeave: function () {
        var currentContext = this;
        console.trace('EntryLogCollectionView.onLeave');
    }
});

module.exports = EntryLogCollectionView;
