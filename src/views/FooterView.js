'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var BaseView = require('views/BaseView');
var EventNameEnum = require('enums/EventNameEnum');
var template = require('templates/FooterView.hbs');

var FooterView = BaseView.extend({
    /**
     *
     * @param options
     */
    initialize: function (options) {
        console.trace('FooterView.initialize');
        options || (options = {});
        this.dispatcher = options.dispatcher || this;

        this.listenTo(this.dispatcher, EventNameEnum.openEntryLogReset, this.onOpenEntryLogReset);
        this.listenTo(this, 'loaded', this.onLoaded);
        this.listenTo(this, 'leave', this.onLeave);
    },

    /**
     *
     * @returns {FooterView}
     */
    render: function () {
        var currentContext = this;
        var renderModel = _.extend({}, currentContext.model);
        currentContext.setElement(template(renderModel));
        return this;
    },

    /**
     *
     */
    events: {
        'click #go-to-settings-button': 'goToSettings'
    },

    /**
     *
     * @param openEntryLogModel
     */
    onOpenEntryLogReset: function (openEntryLogModel) {
        var currentContext = this;
        currentContext.openEntryLogModel = openEntryLogModel;
        if (currentContext.openEntryLogModel && currentContext.openEntryLogModel.has('entryLogId')) {
            currentContext.$('#edit-open-check-in-fbtn-container').removeClass('hidden');
            currentContext.$('#ad-hoc-check-in-fbtn-container').addClass('hidden');
        } else {
            currentContext.$('#edit-open-check-in-fbtn-container').addClass('hidden');
            currentContext.$('#ad-hoc-check-in-fbtn-container').removeClass('hidden');
        }
    },

    /**
     *
     */
    onLoaded: function () {
        console.trace('FooterView.onLoaded');
    },

    /**
     *
     */
    onLeave: function () {
        console.trace('FooterView.onLeave');
    }
});

module.exports = FooterView;