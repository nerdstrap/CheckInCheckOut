define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        utils = require('utils');

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
                if (attributes.hasOwnProperty('locusName')) {
                    var locusNameParts = attributes.locusName.split(' ');
                    if (locusNameParts && locusNameParts.length > 0) {
                        attributes.locusInitials = locusNameParts[0][0];
                        if (locusNameParts.length > 1) {
                            attributes.locusInitials += locusNameParts[1][0];
                        }
                    }
                }

                if (attributes.hasOwnProperty('latitude')) {
                    var latitude = attributes.latitude;
                    if (latitude && !isNaN(latitude)) {
                        attributes.latitude = Number(latitude);
                    }
                }

                if (attributes.hasOwnProperty('longitude')) {
                    var longitude = attributes.longitude;
                    if (longitude && !isNaN(longitude)) {
                        attributes.longitude = Number(longitude);
                    }
                }

                if (attributes.hasOwnProperty('distance')) {
                    var distance = attributes.distance;
                    if (distance && !isNaN(distance)) {
                        attributes.distance = Number(distance);
                    }
                }
            }
            return Backbone.Model.prototype.set.call(this, attributes, options);
        }
    });

    return LocusModel;
});