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

        loadingIconContainerId: 'search-view-loading-icon-container',
        alertsContainerId: 'search-view-alerts-container',

        searchResultsModelType: Backbone.Model,
        searchResultsCollectionType: Backbone.Collection,
        searchResultsTileViewType: BaseView,
        searchResultsListHeaderTextFormatString: '',
        getSearchResultsTrigger: EventNamesEnum.refreshList,

        /**
         *
         * @param options
         */
        initialize: function (options) {
            console.trace('SearchView.initialize');
            options || (options = {});
            this._options = options;
            this.controller = options.controller;
            this.dispatcher = options.dispatcher || this;

            if (options.headerText) {
                this.headerText = options.headerText;
            }
            if (options.searchResultsTileViewType) {
                this.searchResultsTileViewType = options.searchResultsTileViewType;
            }
            if (options.getSearchResultsTrigger) {
                this.getSearchResultsTrigger = options.getSearchResultsTrigger;
            }
            if (options.searchResultsListHeaderTextFormatString) {
                this.searchResultsListHeaderTextFormatString = options.searchResultsListHeaderTextFormatString;
            }
            this.searchType = SearchTypesEnum.alphabetic;

            this.listenTo(this.collection, 'reset', this.onLoaded);
            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);
        },

        /**
         *
         * @returns {SearchView}
         */
        render: function () {
            console.trace('SearchView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            currentContext.searchResultsListViewInstance = new ListView(_.extend(currentContext._options, {'tileViewType': currentContext.searchResultsTileViewType, 'headerTextFormatString': currentContext.searchResultsListHeaderTextFormatString}));
            currentContext.appendChildTo(currentContext.searchResultsListViewInstance, '#search-results-container');
            currentContext.hideLoading();

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

        /**
         *
         * @param headerText
         * @returns {SearchView}
         */
        updateHeader: function (headerText) {
            var currentContext = this;
            currentContext.$('#search-view-header').html(headerText);
            return this;
        },

        /**
         *
         * @param event
         * @returns {SearchView}
         */
        openSearchQuery: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.$('#open-search-query-button').addClass('hidden');
            currentContext.$('#search-query-input-container').removeClass('hidden');
            currentContext.$('#submit-search-query-button').removeClass('hidden');
            currentContext.$('#cancel-search-query-button').removeClass('hidden');
            return this;
        },

        /**
         *
         * @param event
         * @returns {SearchView}
         */
        clearSearchQuery: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.$('#search-query-input').val('');
            return this;
        },

        /**
         *
         * @param event
         * @returns {SearchView}
         */
        validateAndSubmitSearchQuery: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            var searchQuery = currentContext.$('#search-query-input').val();
            if (searchQuery && searchQuery.length > 1) {
                currentContext.getSearchResults({'searchQuery': searchQuery});
            }
            return this;
        },

        /**
         *
         * @param event
         * @returns {SearchView}
         */
        cancelSearchQuery: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.clearSearchQuery();
            currentContext.$('#open-search-query-button').removeClass('hidden');
            currentContext.$('#search-query-input-container').addClass('hidden');
            currentContext.$('#submit-search-query-button').addClass('hidden');
            currentContext.$('#cancel-search-query-button').addClass('hidden');
            return this;
        },

        /**
         *
         * @param event
         * @returns {SearchView}
         */
        filterSearchByAlphabetic: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.searchType = SearchTypesEnum.alphabetic;
            currentContext.$('#filter-search-by-alphabetic-button').removeClass('secondary');
            currentContext.$('#filter-search-by-nearby-button').addClass('secondary');
            currentContext.$('#filter-search-by-favorites-button').addClass('secondary');
            currentContext.getSearchResults();
            return this;
        },

        /**
         *
         * @param event
         * @returns {SearchView}
         */
        filterSearchByNearby: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.searchType = SearchTypesEnum.nearby;
            currentContext.$('#filter-search-by-alphabetic-button').addClass('secondary');
            currentContext.$('#filter-search-by-nearby-button').removeClass('secondary');
            currentContext.$('#filter-search-by-favorites-button').addClass('secondary');
            currentContext.getSearchResults();
            return this;
        },

        /**
         *
         * @param event
         * @returns {SearchView}
         */
        filterSearchByFavorites: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.searchType = SearchTypesEnum.favorites;
            currentContext.$('#filter-search-by-alphabetic-button').addClass('secondary');
            currentContext.$('#filter-search-by-nearby-button').addClass('secondary');
            currentContext.$('#filter-search-by-favorites-button').removeClass('secondary');
            currentContext.getSearchResults();
            return this;
        },

        /**
         *
         * @param options
         * @returns {SearchView}
         */
        getSearchResults: function (options) {
            var currentContext = this;
            options || (options = {});
            options.searchType = currentContext.searchType;
            currentContext.showLoading();
            currentContext.dispatcher.trigger(currentContext.getSearchResultsTrigger, currentContext.collection, options);
            return this;
        },

        /**
         *
         * @returns {SearchView}
         */
        showLoading: function () {
            var currentContext = this;
            currentContext.$('#search-view-loading-icon-container').removeClass('hidden');
            return this;
        },

        /**
         *
         * @returns {SearchView}
         */
        hideLoading: function () {
            var currentContext = this;
            currentContext.$('#search-view-loading-icon-container').addClass('hidden');
            return this;
        },

        /**
         *
         */
        onLoaded: function () {
            var currentContext = this;
            currentContext.hideLoading();
        },

        /**
         *
         */
        onLeave: function () {
            var currentContext = this;
            console.trace('SearchView.onLeave');
        }
    });

    return SearchView;
});
