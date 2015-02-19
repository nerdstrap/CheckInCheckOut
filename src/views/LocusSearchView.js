define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseView = require('views/BaseView'),
        LocusCollection = require('collections/LocusCollection'),
        LocusListView = require('views/LocusListView'),
        globals = require('globals'),
        env = require('env'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        template = require('hbs!templates/LocusSearch');

    var LocusSearchView = BaseView.extend({
        initialize: function (options) {
            console.trace('LocusSearchView.initialize');
            options || (options = {});
            this.controller = options.controller || this;
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('LocusListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            currentContext.listCollection = new LocusCollection();
            currentContext.listViewInstance = new LocusListView({
                controller: currentContext.controller,
                dispatcher: currentContext.dispatcher,
                collection: currentContext.listCollection
            });
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
            if (options.nearby) {
                this.dispatcher.trigger(AppEventNamesEnum.refreshLocusListByGps, this.listCollection, options);
            } else {
                this.dispatcher.trigger(AppEventNamesEnum.refreshLocusList, this.listCollection, options);
            }
        },
        onLeave: function () {
            console.trace('LocusSearchView.onLeave');
        }
    });

    return LocusSearchView;
});
