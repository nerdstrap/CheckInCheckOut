define(function (require) {

    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        CompositeView = require('views/CompositeView'),
        AppEventNamesEnum = require('enums/AppEventNamesEnum'),
        utils = require('utils'),
        template = require('hbs!templates/IdentityListItem');

    var IdentityListItemView = CompositeView.extend({
        initialize: function (options) {
            console.trace('IdentityListItemView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.model, 'reset', this.updateViewFromModel);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function () {
            console.trace('IdentityListItemView.render()');
            var currentContext = this;

            var renderModel = _.extend({}, {cid: currentContext.cid}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));

            this.updateViewFromModel();

            return this;
        },
        events: {
            'click .go-to-identity-button': 'goToIdentityWithId'
        },
        updateViewFromModel: function () {
            if (this.model.has('identityName')) {
                this.$('.go-to-identity-button').html(this.model.get('identityName'));
            }
        },
        goToIdentityWithId: function (event) {
            if (event) {
                event.preventDefault();
            }

            var identityId = this.model.get('identityId');
            this.dispatcher.trigger(AppEventNamesEnum.goToIdentityWithId, identityId);
        },
        onLeave: function () {
            console.trace('IdentityListItemView.onLeave');
        }
    });

    return IdentityListItemView;

});