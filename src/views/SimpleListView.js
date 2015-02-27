define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseView = require('views/BaseView'),
        globals = require('globals'),
        env = require('env'),
        utils = require('utils'),
        EventNamesEnum = require('enums/EventNamesEnum'),
        template = require('hbs!templates/SimpleList');

    var SimpleListView = BaseView.extend({
        headerTextFormatString: utils.getResource('simpleList.headerTextFormatString'),
        loadingMessage: utils.getResource('simpleList.loadingMessage'),
        listItemView: BaseView,
        initialize: function (options) {
            console.trace('SimpleListView.initialize');
            options || (options = {});
            this._options = options;
            this.controller = options.controller;
            this.dispatcher = options.dispatcher || this;
            if (options.listItemView) {
                this.listItemView = options.listItemView;
            }
            if (options.headerTextFormatString) {
                this.headerTextFormatString = options.headerTextFormatString;
            }

            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('SimpleListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            this.hideLoading();

            return this;
        },
        updateHeader: function () {
            if (this.collection) {
                var headerText = utils.formatString(this.headerTextFormatString, [this.collection.length]);
                this.$('#list-header').html(headerText);
            }
        },
        addAll: function () {
            this.showLoading();
            this._leaveChildren();
            _.each(this.collection.models, this.addOne, this);
            this.updateHeader();
            this.hideLoading();
        },
        addOne: function (model) {
            var currentContext = this;
            var options = _.extend(currentContext._options, { 'model': model });
            var listItemViewInstance = new currentContext.listItemView(options);
            this.appendChildTo(listItemViewInstance, '#list-item-view-container');
        },
        removeAll: function () {
            this.showLoading();
            this._leaveChildren();
            this.hideLoading();
        },
        onLeave: function () {
            console.trace('SimpleListView.onLeave');
        }
    });

    return SimpleListView;
});
