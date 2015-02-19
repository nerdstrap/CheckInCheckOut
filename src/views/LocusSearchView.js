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
            this.dispatcher = options.dispatcher || this;
            this.locusCollection = new LocusCollection();

            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('LocusListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            currentContext.locusListViewInstance = new LocusListView({
                controller: currentContext.controller,
                dispatcher: currentContext.dispatcher,
                collection: currentContext.locusCollection
            });
            this.appendChildTo(currentContext.locusListViewInstance, '#locus-list-view-container');

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
        },
        showNearbyResults: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#show-alphabetic-results-button').addClass('secondary');
            this.$('#show-nearby-results-button').removeClass('secondary');
            this.$('#show-favorites-results-button').addClass('secondary');
        },
        showFavoritesResults: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.$('#show-alphabetic-results-button').addClass('secondary');
            this.$('#show-nearby-results-button').addClass('secondary');
            this.$('#show-favorites-results-button').removeClass('secondary');
        },
        refreshLocusList: function (options) {
            var locusName = this.$('#manual-search-input').val();
            if (locusName && locusName.length > 1) {
                options.locusName = locusName;
            }
            this.locusListViewInstance.showLoading();
            this.dispatcher.trigger(AppEventNamesEnum.refreshLocusList, this.locusCollection, options);
        },
        onLeave: function () {
            console.trace('LocusSearchView.onLeave');
        }
    });

    return LocusSearchView;
});
