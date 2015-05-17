define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseView = require('views/BaseView'),
        LocusListView = require('views/LocusListView'),
        globals = require('globals'),
        env = require('env'),
        utils = require('utils'),
        EventNamesEnum = require('enums/EventNamesEnum'),
        SearchTypesEnum = require('enums/SearchTypesEnum'),
        template = require('hbs!templates/LocusSearchView');

    var LocusSearchView = BaseView.extend({
        /**
         *
         */
        tagName: 'div',

        /**
         *
         */
        className: 'locus-search-view',

        /**
         *
         */
        loadingIconContainerId: 'locus-search-view-loading-icon-container',

        /**
         *
         */
        alertsContainerId: 'locus-search-view-alerts-container',
        searchType: SearchTypesEnum.alphabetic,

        /**
         *
         * @param options
         */
        initialize: function (options) {
            console.trace('LocusSearchView.initialize');
            options || (options = {});
            this.controller = options.controller;
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.collection, 'reset', this.onLoaded);
            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);
        },

        /**
         *
         * @returns {LocusSearchView}
         */
        render: function () {
            console.trace('LocusSearchView.render()');
            var currentContext = this;
            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));
            currentContext.locusListViewInstance = new LocusListView({
                'controller': currentContext.controller,
                'dispatcher': currentContext.dispatcher,
                'collection': currentContext.collection
            });
            currentContext.appendChildTo(currentContext.locusListViewInstance, '#locus-search-results-container');

            return this;
        },

        /**
         *
         */
        events: {
            //'keypress #user-name-input': 'dispatchManualSearch',
            'click #open-locus-search-query-button': 'openSearchQuery',
            'click #clear-locus-search-query-button': 'clearSearchQuery',
            'click #submit-locus-search-query-button': 'validateAndSubmitSearchQuery',
            'click #cancel-locus-search-query-button': 'cancelSearchQuery',
            'click #filter-locus-search-by-alphabetic-button': 'filterSearchByAlphabetic',
            'click #filter-locus-search-by-nearby-button': 'filterSearchByNearby',
            'click #filter-locus-search-by-favorites-button': 'filterSearchByFavorites'
        },

        /**
         *
         * @param event
         * @returns {LocusSearchView}
         */
        openSearchQuery: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.$('#open-locus-search-query-button').addClass('hidden');
            currentContext.$('#locus-search-query-input-container').removeClass('hidden');
            currentContext.$('#submit-locus-search-query-button').removeClass('hidden');
            currentContext.$('#cancel-locus-search-query-button').removeClass('hidden');
            return this;
        },

        /**
         *
         * @param event
         * @returns {LocusSearchView}
         */
        clearSearchQuery: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.$('#locus-search-query-input').val('');
            return this;
        },

        /**
         *
         * @param event
         * @returns {LocusSearchView}
         */
        validateAndSubmitSearchQuery: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            var searchQuery = currentContext.$('#locus-search-query-input').val();
            if (searchQuery && searchQuery.length > 1) {
                currentContext.getSearchResults({'searchQuery': searchQuery});
            }
            return this;
        },

        /**
         *
         * @param event
         * @returns {LocusSearchView}
         */
        cancelSearchQuery: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.clearSearchQuery();
            currentContext.$('#open-locus-search-query-button').removeClass('hidden');
            currentContext.$('#locus-search-query-input-container').addClass('hidden');
            currentContext.$('#submit-locus-search-query-button').addClass('hidden');
            currentContext.$('#cancel-locus-search-query-button').addClass('hidden');
            return this;
        },

        /**
         *
         * @param event
         * @returns {LocusSearchView}
         */
        filterSearchByAlphabetic: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.searchType = SearchTypesEnum.alphabetic;
            currentContext.$('#filter-locus-search-by-alphabetic-button').removeClass('secondary');
            currentContext.$('#filter-locus-search-by-nearby-button').addClass('secondary');
            currentContext.$('#filter-locus-search-by-favorites-button').addClass('secondary');
            currentContext.getSearchResults();
            return this;
        },

        /**
         *
         * @param event
         * @returns {LocusSearchView}
         */
        filterSearchByNearby: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.searchType = SearchTypesEnum.nearby;
            currentContext.$('#filter-locus-search-by-alphabetic-button').addClass('secondary');
            currentContext.$('#filter-locus-search-by-nearby-button').removeClass('secondary');
            currentContext.$('#filter-locus-search-by-favorites-button').addClass('secondary');
            currentContext.getSearchResults();
            return this;
        },

        /**
         *
         * @param event
         * @returns {LocusSearchView}
         */
        filterSearchByFavorites: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.searchType = SearchTypesEnum.favorites;
            currentContext.$('#filter-locus-search-by-alphabetic-button').addClass('secondary');
            currentContext.$('#filter-locus-search-by-nearby-button').addClass('secondary');
            currentContext.$('#filter-locus-search-by-favorites-button').removeClass('secondary');
            currentContext.getSearchResults();
            return this;
        },

        /**
         *
         * @param options
         * @returns {LocusSearchView}
         */
        getSearchResults: function (options) {
            var currentContext = this;
            options || (options = {});
            options.searchType = currentContext.searchType;
            currentContext.showLoading();
            currentContext.dispatcher.trigger(EventNamesEnum.refreshLocusList, currentContext.collection, options);
            return this;
        },

        /**
         *
         * @returns {LocusSearchView}
         */
        showLoading: function () {
            var currentContext = this;
            currentContext.$('#locus-search-view-loading-icon-container').removeClass('hidden');
            return this;
        },

        /**
         *
         * @returns {LocusSearchView}
         */
        hideLoading: function () {
            var currentContext = this;
            currentContext.$('#locus-search-view-loading-icon-container').addClass('hidden');
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
            console.trace('LocusSearchView.onLeave');
        }
    });

    return LocusSearchView;
});
