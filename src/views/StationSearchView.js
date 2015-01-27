define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseView = require('views/BaseView'),
        StationListView = require('views/StationListView'),
        globals = require('globals'),
        env = require('env'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        template = require('hbs!templates/StationSearch');

    var StationSearchView = BaseView.extend({
        initialize: function (options) {
            console.trace('StationSearchView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.stationCollection = options.stationCollection;

            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('StationListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            currentContext.stationListViewInstance = new StationListView({
                controller: currentContext.controller,
                dispatcher: currentContext.dispatcher,
                collection: currentContext.stationCollection
            });
            this.appendChildTo(currentContext.stationListViewInstance, '#station-list-view-container');

            //var options = {};
            //currentContext.stationListViewInstance.showLoading();
            //currentContext.dispatcher.trigger(AppEventNamesEnum.refreshStationList, currentContext.stationCollection, options);

            return this;
        },
        events: {
            'click #refresh-search-button': 'dispatchRefreshSearch',
            'click #reset-search-button': 'resetSearch'
        },
        dispatchRefreshSearch: function (event) {
            if (event) {
                event.preventDefault();
            }

            this.refreshSearch();
        },
        resetSearch: function (event) {
            if (event) {
                event.preventDefault();
            }

            this.refreshSearch();
        },
        refreshSearch: function () {
            this.showLoading();

            var options = {};
            this.stationListViewInstance.showLoading();
            this.dispatcher.trigger(AppEventNamesEnum.refreshStationList, this.stationCollection, options);
        },
        onLeave: function () {
            console.trace('StationSearchView.onLeave');
        }
    });

    return StationSearchView;
});
