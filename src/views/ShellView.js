define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        CompositeView = require('views/CompositeView'),
        HeaderView = require('views/HeaderView'),
        FooterView = require('views/FooterView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        template = require('hbs!templates/Shell');

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

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            currentContext.headerViewInstance = new HeaderView({
                model: currentContext.model,
                el: $('#header-view', currentContext.$el),
                dispatcher: currentContext.dispatcher
            });
            this.renderChild(currentContext.headerViewInstance);

            currentContext.footerViewInstance = new FooterView({
                model: currentContext.model,
                el: $('#footer-view', currentContext.$el),
                dispatcher: currentContext.dispatcher
            });
            this.renderChild(currentContext.footerViewInstance);

            return this;
        },
        contentViewEl: function () {
            return $('#content-view', this.el);
        },
        onLeave: function() {
            console.trace('ShellView.onLeave');
        }
    });

    return ShellView;
});