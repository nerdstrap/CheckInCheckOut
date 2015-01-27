define(function (require) {

    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        CompositeView = require('views/CompositeView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        template = require('hbs!templates/StationListItem');

    var StationListItemView = CompositeView.extend({
        initialize: function (options) {
            console.trace('StationListItemView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.userRole = options.userRole;

            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('StationListItemView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        events: {
            'click .station-link': 'goToStationWithId'
        },
        goToStationWithId: function (event) {
            if (event) {
                event.preventDefault();
            }

            var stationId = this.model.get('stationId');
            this.dispatcher.trigger(AppEventNamesEnum.goToStationWithId, stationId);
        },
        onLeave: function () {
            console.trace('StationListItemView.onLeave');
        }
    });

    return StationListItemView;

});