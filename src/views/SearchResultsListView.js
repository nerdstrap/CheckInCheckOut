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
        template = require('hbs!templates/SearchResultsList');

    var SearchResultsListView = BaseView.extend({
        headerTextFormatString: utils.getResource('searchResultsItemViewHeaderTextFormatString'),
        searchResultsItemViewType: BaseView,

        initialize: function (options) {
            console.trace('SearchResultsListView.initialize');
            options || (options = {});
            this._options = options;
            this.controller = options.controller;
            this.dispatcher = options.dispatcher || this;

            if (options.searchResultsItemViewType) {
                this.searchResultsItemViewType = options.searchResultsItemViewType;
            }
            if (options.headerTextFormatString) {
                this.headerTextFormatString = options.headerTextFormatString;
            }

            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('SearchResultsListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            this.hideLoading();

            return this;
        },

        updateHeader: function () {
            if (this.collection) {
                var headerText = utils.formatString(this.headerTextFormatString, [this.collection.length]);
                this.$('#search-results-list-view-header').html(headerText);
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
            var options = _.extend(currentContext._options, {'model': model});
            var searchResultsItemViewInstance = new currentContext.searchResultsItemViewType(options);
            this.appendChildTo(searchResultsItemViewInstance, '#search-results-item-container');
        },

        removeAll: function () {
            this.showLoading();
            this._leaveChildren();
            this.hideLoading();
        },

        onLeave: function () {
            console.trace('SearchResultsListView.onLeave');
        }
    });

    return SearchResultsListView;
});
