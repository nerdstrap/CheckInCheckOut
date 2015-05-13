define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseView = require('views/BaseView'),
        ListView = require('views/ListView'),
        globals = require('globals'),
        env = require('env'),
        utils = require('utils'),
        EventNamesEnum = require('enums/EventNamesEnum'),
        SearchTypesEnum = require('enums/SearchTypesEnum'),
        template = require('hbs!templates/SearchView');

    var SearchView = BaseView.extend({
        tagName: 'div',
        className: 'search-view',
        id: 'search-view',
        headerText: utils.getResource('searchViewHeaderText'),
        loadingIconId: 'search-view-loading-icon',
        alertsContainerId: 'search-view-alerts-container',
        searchResultsModelType: Backbone.Model,
        searchResultsCollectionType: Backbone.Collection,
        searchResultsListViewType: ListView,
        searchResultsTileViewType: BaseView,
        getSearchResultsTrigger: EventNamesEnum.refreshList,

        initialize: function (options) {
            console.trace('SearchView.initialize');
            options || (options = {});
            this._options = options;
            this.controller = options.controller;
            this.dispatcher = options.dispatcher || this;

            if (options.headerText) {
                this.headerText = options.headerText;
            }
            if (options.searchResultsModelType) {
                this.searchResultsModelType = options.searchResultsModelType;
            }
            if (options.searchResultsCollectionType) {
                this.searchResultsCollectionType = options.searchResultsCollectionType;
            }
            if (options.searchResultsListViewType) {
                this.searchResultsListViewType = options.searchResultsListViewType;
            }
            if (options.searchResultsTileViewType) {
                this.searchResultsTileViewType = options.searchResultsTileViewType;
            }
            if (options.getSearchResultsTrigger) {
                this.getSearchResultsTrigger = options.getSearchResultsTrigger;
            }
            this.collection = new this.searchResultsCollectionType();
            this.searchType = SearchTypesEnum.alphabetic;

            this.listenTo(this.collection, 'reset', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);
        },

        render: function () {
            console.trace('SearchView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            currentContext.searchResultsListViewInstance = new currentContext.searchResultsListViewType(_.extend(currentContext._options, { 'collection': currentContext.collection, 'tileViewType': currentContext.searchResultsTileViewType }));
            currentContext.appendChildTo(currentContext.searchResultsListViewInstance, '#search-results-container');

            currentContext.updateHeader(currentContext.headerText);

            return this;
        },

        events: {
            //'keypress #user-name-input': 'dispatchManualSearch',
            'click #open-search-query-button': 'openSearchQuery',
            'click #clear-search-query-button': 'clearSearchQuery',
            'click #submit-search-query-button': 'validateAndSubmitSearchQuery',
            'click #cancel-search-query-button': 'cancelSearchQuery',
            'click #filter-search-by-alphabetic-button': 'filterSearchByAlphabetic',
            'click #filter-search-by-nearby-button': 'filterSearchByNearby',
            'click #filter-search-by-favorites-button': 'filterSearchByFavorites'
        },

        updateHeader: function (headerText) {
            this.$('#search-view-header').html(headerText);
        },

        openSearchQuery: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#open-search-query-container').addClass('hidden');
            this.$('#search-query-container').removeClass('hidden');
        },

        clearSearchQuery: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#search-query-input').val('');
        },

        validateAndSubmitSearchQuery: function (event) {
            if (event) {
                event.preventDefault();
            }
            var searchQuery = this.$('#search-query-input').val();
            if (searchQuery && searchQuery.length > 1) {
                this.getSearchResults({'searchQuery': searchQuery});
            }
        },

        cancelSearchQuery: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#search-query-container').addClass('hidden');
            this.$('#open-search-query-container').removeClass('hidden');
        },

        filterSearchByAlphabetic: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.searchType = SearchTypesEnum.alphabetic;
            this.$('#filter-search-by-alphabetic-button').removeClass('secondary');
            this.$('#filter-search-by-nearby-button').addClass('secondary');
            this.$('#filter-search-by-favorites-button').addClass('secondary');
            this.getSearchResults();
        },

        filterSearchByNearby: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.searchType = SearchTypesEnum.nearby;
            this.$('#filter-search-by-alphabetic-button').addClass('secondary');
            this.$('#filter-search-by-nearby-button').removeClass('secondary');
            this.$('#filter-search-by-favorites-button').addClass('secondary');
            this.getSearchResults();
        },

        filterSearchByFavorites: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.searchType = SearchTypesEnum.favorites;
            this.$('#filter-search-by-alphabetic-button').addClass('secondary');
            this.$('#filter-search-by-nearby-button').addClass('secondary');
            this.$('#filter-search-by-favorites-button').removeClass('secondary');
            this.getSearchResults();
        },

        getSearchResults: function (options) {
            options || (options = {});
            var currentContext = this;
            options.searchType = this.searchType;
            this.showLoading();
            this.dispatcher.trigger(currentContext.getSearchResultsTrigger, this.collection, options);
        },

        onLoaded: function () {
            this.hideLoading();
        },

        showLoading: function () {
            this.$('#search-view-loading-icon').removeClass('hidden');
        },

        hideLoading: function () {
            this.$('#search-view-loading-icon').addClass('hidden');
        },

        onLeave: function () {
            console.trace('SearchView.onLeave');
        }
    });

    return SearchView;
});
