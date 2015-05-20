'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var BaseView = require('views/BaseView');
var IdentityListView = require('views/IdentityListView');
var env = require('env');
var utils = require('utils');
var EventNamesEnum = require('enums/EventNamesEnum');
var SearchTypesEnum = require('enums/SearchTypesEnum');
var template = require('hbs!templates/IdentitySearchView');

var IdentitySearchView = BaseView.extend({
    /**
     *
     */
    tagName: 'div',

    /**
     *
     */
    className: 'identity-search-view',

    /**
     *
     */
    loadingIconContainerId: 'identity-search-view-loading-icon-container',

    /**
     *
     */
    alertsContainerId: 'identity-search-view-alerts-container',
    searchType: SearchTypesEnum.alphabetic,

    /**
     *
     * @param options
     */
    initialize: function (options) {
        console.trace('IdentitySearchView.initialize');
        options || (options = {});
        this.controller = options.controller;
        this.dispatcher = options.dispatcher || this;

        this.listenTo(this.collection, 'reset', this.onLoaded);
        this.listenTo(this, 'loaded', this.onLoaded);
        this.listenTo(this, 'leave', this.onLeave);
    },

    /**
     *
     * @returns {IdentitySearchView}
     */
    render: function () {
        console.trace('IdentitySearchView.render()');
        var currentContext = this;
        var renderModel = _.extend({}, currentContext.model);
        currentContext.$el.html(template(renderModel));
        currentContext.identityListViewInstance = new IdentityListView({
            'controller': currentContext.controller,
            'dispatcher': currentContext.dispatcher,
            'collection': currentContext.collection
        });
        currentContext.appendChildTo(currentContext.identityListViewInstance, '#identity-search-results-container');

        return this;
    },

    /**
     *
     */
    events: {
        //'keypress #user-name-input': 'dispatchManualSearch',
        'click #open-identity-search-query-button': 'openSearchQuery',
        'click #clear-identity-search-query-button': 'clearSearchQuery',
        'click #submit-identity-search-query-button': 'validateAndSubmitSearchQuery',
        'click #cancel-identity-search-query-button': 'cancelSearchQuery',
        'click #filter-identity-search-by-alphabetic-button': 'filterSearchByAlphabetic',
        'click #filter-identity-search-by-nearby-button': 'filterSearchByNearby',
        'click #filter-identity-search-by-favorites-button': 'filterSearchByFavorites'
    },

    /**
     *
     * @param event
     * @returns {IdentitySearchView}
     */
    openSearchQuery: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        currentContext.$('#open-identity-search-query-button').addClass('hidden');
        currentContext.$('#identity-search-query-input-container').removeClass('hidden');
        currentContext.$('#submit-identity-search-query-button').removeClass('hidden');
        currentContext.$('#cancel-identity-search-query-button').removeClass('hidden');
        return this;
    },

    /**
     *
     * @param event
     * @returns {IdentitySearchView}
     */
    clearSearchQuery: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        currentContext.$('#identity-search-query-input').val('');
        return this;
    },

    /**
     *
     * @param event
     * @returns {IdentitySearchView}
     */
    validateAndSubmitSearchQuery: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        var searchQuery = currentContext.$('#identity-search-query-input').val();
        if (searchQuery && searchQuery.length > 1) {
            currentContext.getSearchResults({'searchQuery': searchQuery});
        }
        return this;
    },

    /**
     *
     * @param event
     * @returns {IdentitySearchView}
     */
    cancelSearchQuery: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        currentContext.clearSearchQuery();
        currentContext.$('#open-identity-search-query-button').removeClass('hidden');
        currentContext.$('#identity-search-query-input-container').addClass('hidden');
        currentContext.$('#submit-identity-search-query-button').addClass('hidden');
        currentContext.$('#cancel-identity-search-query-button').addClass('hidden');
        return this;
    },

    /**
     *
     * @param event
     * @returns {IdentitySearchView}
     */
    filterSearchByAlphabetic: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        currentContext.searchType = SearchTypesEnum.alphabetic;
        currentContext.$('#filter-identity-search-by-alphabetic-button').removeClass('secondary');
        currentContext.$('#filter-identity-search-by-nearby-button').addClass('secondary');
        currentContext.$('#filter-identity-search-by-favorites-button').addClass('secondary');
        currentContext.getSearchResults();
        return this;
    },

    /**
     *
     * @param event
     * @returns {IdentitySearchView}
     */
    filterSearchByNearby: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        currentContext.searchType = SearchTypesEnum.nearby;
        currentContext.$('#filter-identity-search-by-alphabetic-button').addClass('secondary');
        currentContext.$('#filter-identity-search-by-nearby-button').removeClass('secondary');
        currentContext.$('#filter-identity-search-by-favorites-button').addClass('secondary');
        currentContext.getSearchResults();
        return this;
    },

    /**
     *
     * @param event
     * @returns {IdentitySearchView}
     */
    filterSearchByFavorites: function (event) {
        if (event) {
            event.preventDefault();
        }
        var currentContext = this;
        currentContext.searchType = SearchTypesEnum.favorites;
        currentContext.$('#filter-identity-search-by-alphabetic-button').addClass('secondary');
        currentContext.$('#filter-identity-search-by-nearby-button').addClass('secondary');
        currentContext.$('#filter-identity-search-by-favorites-button').removeClass('secondary');
        currentContext.getSearchResults();
        return this;
    },

    /**
     *
     * @param options
     * @returns {IdentitySearchView}
     */
    getSearchResults: function (options) {
        var currentContext = this;
        options || (options = {});
        options.searchType = currentContext.searchType;
        currentContext.showLoading();
        currentContext.dispatcher.trigger(EventNamesEnum.refreshIdentityList, currentContext.collection, options);
        return this;
    },

    /**
     *
     * @returns {IdentitySearchView}
     */
    showLoading: function () {
        var currentContext = this;
        currentContext.$('#identity-search-view-loading-icon-container').removeClass('hidden');
        return this;
    },

    /**
     *
     * @returns {IdentitySearchView}
     */
    hideLoading: function () {
        var currentContext = this;
        currentContext.$('#identity-search-view-loading-icon-container').addClass('hidden');
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
        console.trace('IdentitySearchView.onLeave');
    }
});

module.exports = IdentitySearchView;