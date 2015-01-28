define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        CompositeView = require('views/CompositeView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        template = require('hbs!templates/Footer');

    var FooterView = CompositeView.extend({
        initialize: function (options) {
            console.trace('FooterView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            //this.listenTo(appEvents, AppEventNamesEnum.userRoleUpdated, this.userRoleUpdated);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('FooterView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        events: {
            'click #footer-button': 'footerButtonClick'
        },
        userRoleUpdated: function (userRole) {
            if (userRole === UserRolesEnum.Admin) {
                //show admin functions
            } else {
                //hide admin functions
            }
        },
        footerButtonClick: function (event) {
            if (event) {
                event.preventDefault();
            }
        },
        onLeave: function() {
            console.trace('FooterView.onLeave');
        }
    });

    return FooterView;

});