'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var utils = require('utils');

var LocusModel = Backbone.Model.extend({

    idAttribute: 'locusId',

    set: function (key, val, options) {
        var attributes;
        if (typeof key === 'object') {
            attributes = key;
            options = val;
        } else {
            (attributes = {})[key] = val;
        }
        if (attributes) {
            if (attributes.hasOwnProperty('latitude')) {
                var latitude = attributes.latitude;
                if (latitude && !isNaN(latitude)) {
                    attributes.latitude = Number(latitude);
                } else {
                    delete attributes.latitude;
                }
            }

            if (attributes.hasOwnProperty('longitude')) {
                var longitude = attributes.longitude;
                if (longitude && !isNaN(longitude)) {
                    attributes.longitude = Number(longitude);
                } else {
                    delete attributes.longitude;
                }
            }

            if (attributes.hasOwnProperty('distance')) {
                var distance = attributes.distance;
                if (distance && !isNaN(distance)) {
                    attributes.distance = Number(distance);
                } else {
                    delete attributes.distance;
                }
            }
        }
        return Backbone.Model.prototype.set.call(this, attributes, options);
    }
});

module.exports = LocusModel;