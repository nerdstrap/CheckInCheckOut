'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var BaseView = require('views/BaseView');
var EventNameEnum = require('enums/EventNameEnum');
var utils = require('lib/utils');
var template = require('templates/IssueTileView.hbs');

var IssueTileView = BaseView.extend({
    /**
     *
     * @param options
     */
    initialize: function (options) {
        console.trace('IssueTileView.initialize');
        options || (options = {});
        this.dispatcher = options.dispatcher || this;

        this.listenTo(this, 'loaded', this.onLoaded);
        this.listenTo(this, 'leave', this.onLeave);
    },

    /**
     *
     * @returns {IssueTileView}
     */
    render: function () {
        var currentContext = this;
        var renderModel = _.extend({}, currentContext.model.attributes);
        currentContext.setElement(template(renderModel));
        currentContext.updateViewFromModel();
        return this;
    },

    /**
     *
     */
    events: {
    },

    /**
     *
     * @returns {IssueTileView}
     */
    updateViewFromModel: function () {
        var currentContext = this;
        currentContext.updateDescriptionLabel();
        return this;
    },

    /**
     *
     * @returns {IssueTileView}
     */
    updateDescriptionLabel: function () {
        var currentContext = this;
        if (currentContext.model.has('description')) {
            var description = currentContext.model.get('description');
            currentContext.$('.description-label').html(description);
        }
        return this;
    },

    /**
     *
     */
    onLoaded: function () {
        var currentContext = this;
        console.trace('IssueTileView.onLoaded');
    },

    /**
     *
     */
    onLeave: function () {
        var currentContext = this;
        console.trace('IssueTileView.onLeave');
    }
});

module.exports = IssueTileView;