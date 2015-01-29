define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseView = require('views/BaseView'),
        StationCollection = require('collections/StationCollection'),
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

            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('StationListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            currentContext.stationCollection = new StationCollection();
            currentContext.stationListViewInstance = new StationListView({
                controller: currentContext.controller,
                dispatcher: currentContext.dispatcher,
                collection: currentContext.stationCollection
            });
            this.appendChildTo(currentContext.stationListViewInstance, '#station-list-view-container');

            return this;
        },
        events: {
            'click #gps-search-button': 'dispatchGpsSearch',
            'click #show-manual-search-button': 'showManualSearchForm',
            'keypress #user-name-input': 'dispatchManualSearch',
            'click #manual-search-button': 'dispatchManualSearch',
            'click #recent-search-button': 'dispatchRecentSearch'
        },
        dispatchGpsSearch: function (event) {
            if (event) {
                event.preventDefault();
            }

            this.stationCollection.reset();
            this.hideManualSearchForm();
            this.refreshStationsByGps();
        },
        showManualSearchForm: function (event) {
            if (event) {
                event.preventDefault();
            }

            this.stationCollection.reset();
            this.$('#manual-search-form').removeClass('hidden');
            this.$('#manual-search-input').focus();
        },
        hideManualSearchForm: function() {
            this.$('#manual-search-input').val('');
            this.$('#manual-search-form').addClass('hidden');
        },
        dispatchRecentSearch: function (event) {
            if (event) {
                event.preventDefault();
            }

            this.stationCollection.reset();
            this.hideManualSearchForm();
            this.refreshStations();
        },
        dispatchManualSearch: function(event) {
            if (event) {
                event.preventDefault();
            }

            this.stationCollection.reset();
            this.refreshStations();
            //var validPattern = /^[A-Za-z0-9\s]*$/;
            //if (event) {
            //    if (event.keyCode === 13) {
            //        /* enter key pressed */
            //        this.refreshStations();
            //    }
            //    var charCode = event.charCode || event.keyCode || event.which;
            //    var inputChar = String.fromCharCode(charCode);
            //    if (!validPattern.test(inputChar) && event.charCode !== 0) {
            //        event.preventDefault();
            //        return false;
            //    }
            //}
        },
        refreshStations: function () {
            var stationName = this.$('#manual-search-input').val();
            if (stationName && stationName.length > 1) {
                var options = {
                    stationName: stationName
                }
                this.stationListViewInstance.showLoading();
                this.dispatcher.trigger(AppEventNamesEnum.refreshStations, this.stationCollection, options);
            }
        },
        refreshStationsByGps: function () {
            var options = {
                gps: true
            }
            this.stationListViewInstance.showLoading();
            this.dispatcher.trigger(AppEventNamesEnum.refreshStationsByGps, this.stationCollection, options);
        },
        onLeave: function () {
            console.trace('StationSearchView.onLeave');
        }
    });

    return StationSearchView;
});
