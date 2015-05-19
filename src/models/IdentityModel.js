'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var env = require('env');
var EntryLogCollection = require('collections/EntryLogCollection');

var IdentityModel = Backbone.Model.extend({

    idAttribute: 'identityId',

    set: function (key, val, options) {
        var attributes;
        if (typeof key === 'object') {
            attributes = key;
            options = val;
        } else {
            (attributes = {})[key] = val;
        }
        if (attributes) {
            if (attributes.hasOwnProperty('identityName')) {
                var identityNameParts = attributes.identityName.split(', ');
                if (identityNameParts && identityNameParts.length > 1) {
                    attributes.identityFullName = identityNameParts[1] + ' ' + identityNameParts[0];
                }
            }

            if (attributes.hasOwnProperty('openEntryLogs')) {
                if (this.openEntryLogCollection) {
                    this.openEntryLogCollection.reset(attributes.openEntryLogs, { silent: true });
                } else {
                    this.openEntryLogCollection = new EntryLogCollection(attributes.openEntryLogs, { silent: true });
                }
                delete attributes.openEntryLogs;
            }
        }
        return Backbone.Model.prototype.set.call(this, attributes, options);
    }
});

module.exports = IdentityModel;