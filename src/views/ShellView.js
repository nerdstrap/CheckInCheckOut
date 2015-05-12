define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        CompositeView = require('views/CompositeView'),
        HeaderView = require('views/HeaderView'),
        EventNamesEnum = require('enums/EventNamesEnum'),
        template = require('hbs!templates/ShellView');

    var ShellView = CompositeView.extend({
        initialize: function (options) {
            console.trace('ShellView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('ShellView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            currentContext.headerViewInstance = new HeaderView({
                model: currentContext.model,
                el: $('#header-container', currentContext.$el),
                dispatcher: currentContext.dispatcher
            });
            this.renderChild(currentContext.headerViewInstance);

            return this;
        },
        contentViewEl: function () {
            return $('#content-container', this.el);
        },
        onLeave: function() {
            console.trace('ShellView.onLeave');
        }
    });

    return ShellView;
});