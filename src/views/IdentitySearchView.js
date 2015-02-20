define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseView = require('views/BaseView'),
        IdentityCollection = require('collections/IdentityCollection'),
        IdentityListView = require('views/IdentityListView'),
        IdentityListItemView = require('views/IdentityListItemView'),
        globals = require('globals'),
        env = require('env'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        template = require('hbs!templates/IdentitySearch');

    var IdentitySearchView = BaseView.extend({
        listCollection: IdentityCollection,
        listView: IdentityListView,
        listItemView: IdentityListItemView,
        refreshListTrigger: AppEventNamesEnum.refreshIdentityList,
        initialize: function (options) {
            console.trace('IdentitySearchView.initialize');
            options || (options = {});
            this._options = options;
            this.controller = options.controller || this;
            this.dispatcher = options.dispatcher || this;
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

            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('IdentityListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            currentContext.listViewInstance = new currentContext.listView(_.extend(currentContext._options, { 'collection': currentContext.collection }));
            this.appendChildTo(currentContext.listViewInstance, '#list-view-container');

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
            this.$('#show-alphabetic-results-button').removeClass('secondary');
            this.$('#show-nearby-results-button').addClass('secondary');
            this.$('#show-favorites-results-button').addClass('secondary');
            this.refreshList({ 'alphabetic': true });
        },
        showNearbyResults: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#show-alphabetic-results-button').addClass('secondary');
            this.$('#show-nearby-results-button').removeClass('secondary');
            this.$('#show-favorites-results-button').addClass('secondary');
            this.refreshList({ 'nearby': true });
        },
        showFavoritesResults: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#show-alphabetic-results-button').addClass('secondary');
            this.$('#show-nearby-results-button').addClass('secondary');
            this.$('#show-favorites-results-button').removeClass('secondary');
            this.refreshList({ 'favorites': true });
        },
        refreshList: function (options) {
            options || (options = {});
            var currentContext = this;
            var searchQuery = this.$('#manual-search-input').val();
            if (searchQuery && searchQuery.length > 1) {
                options.searchQuery = searchQuery;
            }
            this.listViewInstance.showLoading();
            this.dispatcher.trigger(currentContext.refreshListTrigger, this.collection, options);
        },
        onLeave: function () {
            console.trace('IdentitySearchView.onLeave');
        }
    });

    return IdentitySearchView;
});
