    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/CompositeView'),
            env = require('env'),
            template = require('templates/AlertView.hbs');

    var AlertView = CompositeView.extend({
        initialize: function(options) {
            console.trace('AlertView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.dismissDelay = env.getNotificationTimeout();

            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function() {
            console.trace('AlertView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));
            
            currentContext.timeoutId = window.setTimeout(function() {
                currentContext.dismiss();
            }, currentContext.dismissDelay);

            return this;
        },
        events: {
            'click .close-button': 'close'
        },
        close: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.leave();
        },
        dismiss: function() {
            this.leave();
        },
        onLeave: function() {
            if (this.timeoutId) {
                window.clearTimeout(this.timeoutId);
            }
        }
    });

    module.exports = AlertView;