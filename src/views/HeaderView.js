define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        CompositeView = require('views/CompositeView'),
        EventNamesEnum = require('enums/EventNamesEnum'),
        template = require('hbs!templates/HeaderView');

    var HeaderView = CompositeView.extend({
        initialize: function (options) {
            console.trace('HeaderView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.dispatcher, EventNamesEnum.identityUpdated, this.onIdentityUpdated);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('HeaderView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, currentContext.model);
            currentContext.$el.html(template(renderModel));

            return this;
        },
        events: {
            'click #go-to-my-identity-button': 'goToMyIdentity',
            'click #go-to-open-check-in-button': 'goToLocusWithId',
            'click #go-to-locus-search-button': 'goToLocusSearch',
            'click #go-to-identity-search-button': 'goToIdentitySearch',
            'click #go-to-ad-hoc-entry-button': 'goToAdHocEntry',
            'click #go-to-settings-button': 'goToSettings'
        },
        onIdentityUpdated: function (identityModel) {
            if (identityModel.openEntryLogCollection && identityModel.openEntryLogCollection.length > 0) {
                var openEntryLog = identityModel.openEntryLogCollection.at(0);
                if (openEntryLog.has('locusId')) {
                    var locusId = openEntryLog.get('locusId');
                    var checkInClass = 'open';
                    if (openEntryLog.has('checkOutOverdue')) {
                        checkInClass = 'overdue';
                    }
                    if (openEntryLog.has('checkOutExpired')) {
                        checkInClass = 'expired';
                    }
                    this.$('#go-to-my-open-check-in-button').attr('data-locus-id', locusId).removeClass().addClass(checkInClass);
                }
                this.$('#go-to-my-identity-container').addClass('hidden');
                this.$('#go-to-my-open-check-in-container').removeClass('hidden');
            } else {
                if (identityModel.has('identityId')) {
                    var identityId = identityModel.get('identityId');
                    this.$('#go-to-my-identity-button').attr('data-identity-id', identityId);
                }
                this.$('#go-to-my-identity-container').removeClass('hidden');
                this.$('#go-to-my-open-check-in-container').addClass('hidden');
            }
        },
        goToMyIdentity: function (event) {
            if (event) {
                event.preventDefault();
                if (event.target) {
                    var identityId = $(event.target).attr('data-identity-id');
                    if (identityId) {
                        this.dispatcher.trigger(EventNamesEnum.goToIdentityWithId, identityId);
                    }
                    $(event.target).parent().addClass('active').siblings().removeClass('active');
                }
            }
        },
        goToLocusWithId: function (event) {
            if (event) {
                event.preventDefault();
                if (event.target) {
                    var locusId = $(event.target).attr('data-locus-id');
                    if (locusId) {
                        this.dispatcher.trigger(EventNamesEnum.goToLocusWithId, locusId);
                    }
                    $(event.target).parent().addClass('active').siblings().removeClass('active');
                }
            }
        },
        goToLocusSearch: function (event) {
            if (event) {
                event.preventDefault();
                if (event.target) {
                    $(event.target).parent().addClass('active').siblings().removeClass('active');
                }
            }
            this.dispatcher.trigger(EventNamesEnum.goToLocusSearch);
        },
        goToIdentitySearch: function (event) {
            if (event) {
                event.preventDefault();
                if (event.target) {
                    $(event.target).parent().addClass('active').siblings().removeClass('active');
                }
            }
            this.dispatcher.trigger(EventNamesEnum.goToIdentitySearch);
        },
        goToAdHocEntry: function (event) {
            if (event) {
                event.preventDefault();
                if (event.target) {
                    $(event.target).parent().addClass('active').siblings().removeClass('active');
                }
            }
            //this.dispatcher.trigger(EventNamesEnum.goToAdHocCheckIn);
        },
        goToSettings: function (event) {
            if (event) {
                event.preventDefault();
                if (event.target) {
                    $(event.target).parent().addClass('active').siblings().removeClass('active');
                }
            }
            this.dispatcher.trigger(EventNamesEnum.goToSettings);
        },
        onLeave: function () {
            console.trace('HeaderView.onLeave');
        }
    });

    return HeaderView;

});