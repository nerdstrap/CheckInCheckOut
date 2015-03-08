define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseView = require('views/BaseView'),
        globals = require('globals'),
        env = require('env'),
        utils = require('utils'),
        EventNamesEnum = require('enums/EventNamesEnum'),
        template = require('hbs!templates/Admin');

    var AdminView = BaseView.extend({
        initialize: function (options) {
            console.trace('AdminView.initialize');
            options || (options = {});
            this._options = options;
            this.controller = options.controller;
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this, EventNamesEnum.addLocusSuccess, this.onAddLocusSuccess);
            this.listenTo(this, EventNamesEnum.addLocusError, this.onAddLocusError);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('AdminView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        events: {
            'click #post-list-button': 'postList'
        },
        postList: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.count = this.collection.length;
            this.$('#count-label').html(this.count.toString());
            this.dispatcher.trigger(EventNamesEnum.adminAddLocusList, this.collection);
        },
        onAddLocusSuccess: function () {
            this.count -= 1;
            this.$('#count-label').html(this.count.toString());
        },
        onAddLocusError: function () {
            this.count -= 1;
            this.$('#count-label').html(this.count.toString());
        },
        onLeave: function () {
            console.trace('AdminView.onLeave');
        }
    });

    return AdminView;
});
