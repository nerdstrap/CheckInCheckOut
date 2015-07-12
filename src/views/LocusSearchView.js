'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var BaseView = require('views/BaseView');
var LocusCollection = require('collections/LocusCollection');
var LocusCollectionView = require('views/LocusCollectionView');
var EventNameEnum = require('enums/EventNameEnum');
var SearchTypeEnum = require('enums/SearchTypeEnum');
var utils = require('lib/utils');
var template = require('templates/LocusSearchView.hbs');

var LocusSearchView = BaseView.extend({
    /**
     *
     * @param options
     */
    initialize: function (options) {
        console.trace('LocusSearchView.initialize');
        options || (options = {});
        this.dispatcher = options.dispatcher || this;

        this.myIdentityModel = options.myIdentityModel;
        this.openEntryLogModel = options.openEntryLogModel;
        this.locusCollection = options.locusCollection || new LocusCollection();
        this.searchType = SearchTypeEnum.nearby;

        this.listenTo(this, 'loaded', this.onLoaded);
        this.listenTo(this, 'leave', this.onLeave);
    },

    /**
     *
     * @returns {LocusSearchView}
     */
    render: function () {
        var currentContext = this;
        currentContext.setElement(template());
        currentContext.renderLocusCollectionView();
        return this;
    },
    /**
     *
     * @returns {LocusSearchView}
     */
    renderLocusCollectionView: function () {
        var currentContext = this;
        currentContext.locusCollectionView = new LocusCollectionView({
            dispatcher: currentContext.dispatcher,
            collection: currentContext.locusCollection
        });
        currentContext.appendChildTo(currentContext.locusCollectionView, '.search-results-container');
        return this;
    },

    /**
     *
     */
    events: {
        //'keypress #user-name-input': 'dispatchManualSearch',
        'click #open-search-query-button': 'openSearchQuery',
        'click #clear-search-query-button': 'clearSearchQuery',
        'click #submit-search-query-button': 'validateAndSubmitSearchQuery',
        'click #cancel-search-query-button': 'cancelSearchQuery',
        'click #search-by-alphabetic-button': 'searchByAlphabetic',
        'click #search-by-nearby-button': 'searchByNearby',
        'click #search-by-favorites-button': 'searchByFavorites'
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
        currentContext.$('#open-search-query-button').addClass('hidden');
        currentContext.$('#search-query-input-container').removeClass('hidden');
        currentContext.$('#submit-search-query-button').removeClass('hidden');
        currentContext.$('#cancel-search-query-button').removeClass('hidden');
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
        currentContext.$('#search-query-input').val('');
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
        var searchQuery = currentContext.$('#search-query-input').val();
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
        currentContext.$('#open-search-query-button').removeClass('hidden');
        currentContext.$('#search-query-input-container').addClass('hidden');
        currentContext.$('#submit-search-query-button').addClass('hidden');
        currentContext.$('#cancel-search-query-button').addClass('hidden');
        return this;
    },

    /**
     *
     * @param event
     * @returns {LocusSearchView}
     */
    searchByAlphabetic: function (event) {
        if (event) {
            event.preventDefault();

            //$(event.target).tab('show');
        }
        var currentContext = this;
        currentContext.searchType = SearchTypeEnum.alphabetic;
        //currentContext.$('#search-by-alphabetic-button').removeClass('secondary');
        //currentContext.$('#search-by-nearby-button').addClass('secondary');
        //currentContext.$('#search-by-favorites-button').addClass('secondary');
        currentContext.getSearchResults();
        return this;
    },

    /**
     *
     * @param event
     * @returns {LocusSearchView}
     */
    searchByNearby: function (event) {
        if (event) {
            event.preventDefault();
            //$(event.target).tab('show');
        }
        var currentContext = this;
        currentContext.searchType = SearchTypeEnum.nearby;
        //currentContext.$('#search-by-alphabetic-button').addClass('secondary');
        //currentContext.$('#search-by-nearby-button').removeClass('secondary');
        //currentContext.$('#search-by-favorites-button').addClass('secondary');
        currentContext.getSearchResults();
        return this;
    },

    /**
     *
     * @param event
     * @returns {LocusSearchView}
     */
    searchByFavorites: function (event) {
        if (event) {
            event.preventDefault();
            //$(event.target).tab('show');
        }
        var currentContext = this;
        currentContext.searchType = SearchTypeEnum.favorites;

        //currentContext.$('#search-by-alphabetic-button').addClass('secondary');
        //currentContext.$('#search-by-nearby-button').addClass('secondary');
        //currentContext.$('#search-by-favorites-button').removeClass('secondary');
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
        //options.searchType = currentContext.searchType;
        currentContext.searchType = SearchTypeEnum.admin;
        options.admin = true;
        currentContext.dispatcher.trigger(EventNameEnum.refreshLocusCollection, currentContext.locusCollection, currentContext.searchType, options);
        return this;
    },

    /**
     *
     */
    onLoaded: function () {
        var currentContext = this;
        console.trace('LocusSearchView.onLoaded');
    },

    /**
     *
     */
    onLeave: function () {
        var currentContext = this;
        console.trace('LocusSearchView.onLeave');
    }
});

module.exports = LocusSearchView;