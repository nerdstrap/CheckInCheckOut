define(function (require) {

    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        CompositeView = require('views/CompositeView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        utils = require('utils'),
        handlebarsHelpers = require('handlebars.helpers'),
        template = require('hbs!templates/EntryLogListItem');

    var EntryLogListItemView = CompositeView.extend({
        initialize: function (options) {
            console.trace('EntryLogListItemView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.model, 'reset', this.updateViewFromModel);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('EntryLogListItemView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            this.updateViewFromModel();

            return this;
        },
        events: {
            'click .go-to-locus-button': 'goToLocusWithId',
            'click .go-to-personnel-button': 'goToPersonnelWithId',
            'click .go-to-directions-button': 'goToDirectionsWithLatLng'
        },
        updateViewFromModel: function () {
            if (this.model.has('locusName')) {
                this.$('.go-to-locus-button').html(this.model.get('locusName'));
            }
            if (this.model.has('userName')) {
                this.$('.go-to-personnel-button').attr('', this.model.get('personnelId')).html(this.model.get('personnelName'));
            }
            if (this.model.has('distance')) {
                this.$('.distance-label').html(utils.formatString(utils.getResource('distanceFormatString'), [this.model.get('distance')]));
            } else {
                this.$('.distance-label').html(utils.getResource('distanceUnknownErrorMessage'));
            }
            if (this.model.has('latitude') && this.model.has('longitude')) {
                this.$('.directions-unavailable-label').addClass('hidden');
                this.$('.go-to-directions-button').removeClass('hidden').attr('data-latitude', this.model.get('latitude')).attr('data-longitude', this.model.get('longitude'));
            } else {
                this.$('.go-to-directions-button').addClass('hidden');
                this.$('.directions-unavailable-label').removeClass('hidden');
            }
            //if (this.model.has('hasHazard') && this.model.get('hasHazard') === "true") {
            //    this.$('.go-to-locus-button').parent().append('<i class="fa fa-warning"></i>');
            //}
            //if (this.model.has('hasOpenCheckIns') && this.model.get('hasOpenCheckIns') === "true") {
            //    this.$('.go-to-locus-button').parent().append('<i class="fa fa-user-plus"></i>');
            //}
            //if (this.model.has('linkedEntryLogId')) {
            //    this.$('.go-to-locus-button').parent().append('<i class="fa fa-arrows-h"></i>');
            //}
            if (this.model.has('purpose')) {
                this.$('.purpose-label').html(this.model.get('purpose'));
            }
            if (this.model.has('duration')) {
                this.$('.duration-label').html(this.model.get('duration'));
            }
            if (this.model.has('inTime')) {
                this.$('.in-time-label').html(handlebarsHelpers.formatDateWithDefault(this.model.get('inTime'), 'format', 'nbsp;'));
            }
            if (this.model.has('outTime')) {
                this.$('.out-time-label').html(handlebarsHelpers.formatDateWithDefault(this.model.get('outime'), 'format', 'nbsp;'));
            }
        },
        goToLocusWithId: function (event) {
            if (event) {
                event.preventDefault();
            }

            var locusId = this.model.get('locusId');
            this.dispatcher.trigger(AppEventNamesEnum.goToLocusWithId, locusId);
        },
        goToPersonnelWithId: function (event) {
            if (event) {
                event.preventDefault();
            }

            var personnelId = this.model.get('personnelId');
            this.dispatcher.trigger(AppEventNamesEnum.goToPersonnelWithId, personnelId);
        },
        goToDirectionsWithLatLng: function (event) {
            if (event) {
                event.preventDefault();
            }

            var latitude = this.model.get('latitude');
            var longitude = this.model.get('longitude');
            this.dispatcher.trigger(AppEventNamesEnum.goToDirectionsWithLatLng, latitude, longitude);
        },
        onLeave: function () {
            console.trace('EntryLogListItemView.onLeave');
        }
    });

    return EntryLogListItemView;

});