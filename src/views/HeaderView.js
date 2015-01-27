define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        CompositeView = require('views/CompositeView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        UserRolesEnum = require('enums/UserRolesEnum'),
        template = require('hbs!templates/Header');

    var HeaderView = CompositeView.extend({
        initialize: function (options) {
            console.trace('HeaderView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            //this.listenTo(appEvents, AppEventNamesEnum.userRoleUpdated, this.userRoleUpdated);
            this.listenTo(this, 'leave', this.onLeave);
        },
        events: {
            'click #app-title-button': 'titleButtonClick',
            'click #go-to-station-list-button': 'goToStationList'
        },
        render: function () {
            console.trace('HeaderView.render');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        userRoleUpdated: function (userRole) {
            if (userRole === UserRolesEnum.Admin) {
                //show admin functions
            } else {
                //hide admin functions
            }
        },
        titleButtonClick: function (event) {
            if (event) {
                event.preventDefault();
            }
        },
        goToStationList: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(AppEventNamesEnum.goToStationList);
        },
        onLeave: function() {
            console.trace('HeaderView.onLeave');
        }
    });

    return HeaderView;
});