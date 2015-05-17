define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseView = require('views/BaseView'),
        EntryLogListItemView = require('views/EntryLogListItemView'),
        globals = require('globals'),
        env = require('env'),
        utils = require('utils'),
        EventNamesEnum = require('enums/EventNamesEnum'),
        template = require('hbs!templates/EntryLogListView');

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
         * @param options
         */
        initialize: function (options) {
            console.trace('EntryLogListView.initialize');
            options || (options = {});
            this.controller = options.controller;
            this.dispatcher = options.dispatcher || this;

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
                'model': model
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

    return EntryLogListView;
});
