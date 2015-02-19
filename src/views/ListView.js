define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseView = require('views/BaseView'),
        globals = require('globals'),
        env = require('env'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        template = require('hbs!templates/List');

    var ListView = BaseView.extend({
        listItemView: BaseView,
        initialize: function (options) {
            console.trace('ListView.initialize');
            options || (options = {});
            this._options = options;
            this.dispatcher = options.dispatcher || this;
            this.listItemView = options.listItemView;

            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('ListView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            this.hideLoading();

            return this;
        },
        updateHeader: function (listHeaderText) {
            this.$('#list-header').html(listHeaderText);
        },
        addAll: function () {
            this.showLoading();
            this._leaveChildren();
            _.each(this.collection.models, this.addOne, this);
            this.hideLoading();
        },
        addOne: function (model) {
            var currentContext = this;
            var options = _.extend(currentContext._options, { 'model': model });
            var listItemViewInstance = new currentContext.listItemView(options);
            this.appendChildTo(listItemViewInstance, '#list-item-view-container');
        },
        removeAll: function () {
            this.showLoading();
            this._leaveChildren();
            this.hideLoading();
        },
        onLeave: function () {
            console.trace('ListView.onLeave');
        }
    });

    return ListView;
});
