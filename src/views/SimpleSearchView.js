define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseView = require('views/BaseView'),
        SimpleListView = require('views/SimpleListView'),
        globals = require('globals'),
        env = require('env'),
        utils = require('utils'),
        EventNamesEnum = require('enums/EventNamesEnum'),
        SearchTypesEnum = require('enums/SearchTypesEnum'),
        template = require('hbs!templates/SimpleSearch');

    var SimpleSearchView = BaseView.extend({
        headerText: utils.getResource('simpleSearch.headerText'),
        loadingMessage: utils.getResource('simpleSearch.loadingMessage'),
        listCollection: Backbone.Collection,
        listView: SimpleListView,
        listItemView: BaseView,
        refreshListTrigger: EventNamesEnum.refreshList,
        initialize: function (options) {
            console.trace('SimpleSearchView.initialize');
            options || (options = {});
            this._options = options;
            this.controller = options.controller;
            this.dispatcher = options.dispatcher || this;
            if (options.headerText) {
                this.headerText = options.headerText;
            }
            if (options.listCollection) {
                this.listCollection = options.listCollection;
            }
            if (options.listView) {
                this.listView = options.listView;
            }
            if (options.listItemView) {
                this.listItemView = options.listItemView;
            }
            if (options.refreshListTrigger) {
                this.refreshListTrigger = options.refreshListTrigger;
            }
            this.collection = new this.listCollection();
            this.searchType = SearchTypesEnum.alphabetic;

            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('SimpleSearchView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            currentContext.listViewInstance = new currentContext.listView(_.extend(currentContext._options, { 'collection': currentContext.collection }));
            currentContext.appendChildTo(currentContext.listViewInstance, '#list-view-container');

            currentContext.updateHeader(currentContext.headerText);

            return this;
        },
        events: {
            //'keypress #user-name-input': 'dispatchManualSearch',
            'click #open-manual-search-button': 'openManualSearch',
            'click #clear-manual-search-input-button': 'clearManualSearchInput',
            'click #search-button': 'dispatchManualSearch',
            'click #cancel-button': 'cancelManualSearch',
            'click #show-alphabetic-results-button': 'showAlphabeticResults',
            'click #show-nearby-results-button': 'showNearbyResults',
            'click #show-favorites-results-button': 'showFavoritesResults'
        },
        updateHeader: function (headerText) {
            this.$('#header-label').html(headerText);
        },
        openManualSearch: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#open-manual-search-container').addClass('hidden');
            this.$('#manual-search-container').removeClass('hidden');
        },
        clearManualSearchInput: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#manual-search-input').val('');
        },
        dispatchManualSearch: function (event) {
            if (event) {
                event.preventDefault();
            }
            var searchQuery = this.$('#manual-search-input').val();
            if (searchQuery && searchQuery.length > 1) {
                this.refreshList({ 'searchQuery': searchQuery });
            }
        },
        cancelManualSearch: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#manual-search-container').addClass('hidden');
            this.$('#open-manual-search-container').removeClass('hidden');
        },
        showAlphabeticResults: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.searchType = SearchTypesEnum.alphabetic;
            this.$('#show-alphabetic-results-button').removeClass('secondary');
            this.$('#show-nearby-results-button').addClass('secondary');
            this.$('#show-favorites-results-button').addClass('secondary');
            this.refreshList();
        },
        showNearbyResults: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.searchType = SearchTypesEnum.nearby;
            this.$('#show-alphabetic-results-button').addClass('secondary');
            this.$('#show-nearby-results-button').removeClass('secondary');
            this.$('#show-favorites-results-button').addClass('secondary');
            this.refreshList();
        },
        showFavoritesResults: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.searchType = SearchTypesEnum.favorites;
            this.$('#show-alphabetic-results-button').addClass('secondary');
            this.$('#show-nearby-results-button').addClass('secondary');
            this.$('#show-favorites-results-button').removeClass('secondary');
            this.refreshList();
        },
        refreshList: function (options) {
            options || (options = {});
            var currentContext = this;
            options.searchType = this.searchType;
            this.listViewInstance.showLoading();
            this.dispatcher.trigger(currentContext.refreshListTrigger, this.collection, options);
        },
        onLeave: function () {
            console.trace('SimpleSearchView.onLeave');
        }
    });

    return SimpleSearchView;
});
