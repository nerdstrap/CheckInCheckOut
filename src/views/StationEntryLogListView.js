define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseView = require('views/BaseView'),
        StationEntryLogListItemView = require('views/StationEntryLogListItemView'),
        globals = require('globals'),
        env = require('env'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        template = require('hbs!templates/StationEntryLogList');

    var StationEntryLogListView = BaseView.extend({
        initialize: function (options) {
            console.trace('StationEntryLogListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('StationEntryLogListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            this.hideLoading();

            return this;
        },
        addAll: function () {
            this.showLoading();
            this._leaveChildren();
            _.each(this.collection.models, this.addOne, this);
            this.hideLoading();
        },
        addOne: function (stationEntryLog) {
            var currentContext = this;
            var stationEntryLogListItemViewInstance = new StationEntryLogListItemView({
                model: stationEntryLog,
                dispatcher: currentContext.dispatcher,
                userRole: currentContext.userRole
            });
            this.appendChildTo(stationEntryLogListItemViewInstance, '#station-list-item-view-container');
        },
        onLeave: function () {
            console.trace('StationEntryLogListView.onLeave');
        }
    });

    return StationEntryLogListView;
});
