define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseView = require('views/BaseView'),
        EntryLogListItemView = require('views/EntryLogListItemView'),
        globals = require('globals'),
        env = require('env'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        template = require('hbs!templates/EntryLogList');

    var EntryLogListView = BaseView.extend({
        initialize: function (options) {
            console.trace('EntryLogListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.showLocus = options.showLocus;
            this.showIdentity = options.showIdentity;

            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('EntryLogListView.render()');
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
        addOne: function (entryLog) {
            var currentContext = this;
            var entryLogListItemViewInstance = new EntryLogListItemView({
                model: entryLog,
                dispatcher: currentContext.dispatcher,
                showLocus: currentContext.showLocus,
                showIdentity: currentContext.showIdentity
            });
            this.appendChildTo(entryLogListItemViewInstance, '#list-item-view-container');
        },
        onLeave: function () {
            console.trace('EntryLogListView.onLeave');
        }
    });

    return EntryLogListView;
});
