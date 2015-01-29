define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone');

    var BaseModel = function (options) {
        Backbone.Model.apply(this, [options]);
    };

    _.extend(BaseModel.prototype, Backbone.Model.prototype, {
        reset: function (attrs, options) {
            options || (options = {});
            options.previousAttributes = this.attributes;

            this.clear(_.extend({ silent: true }, options));
            this.set(attrs, _.extend({ silent: true }, options));
            if (!options.silent) {
                this.trigger('reset', this, options);
            }
        }
    });

    BaseModel.extend = Backbone.Model.extend;

    return BaseModel;
});