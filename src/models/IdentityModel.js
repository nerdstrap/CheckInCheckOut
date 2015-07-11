'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var EntryLogCollection = require('collections/EntryLogCollection');

/**
 *
 * @type {IdentityModel}
 */
var IdentityModel = Backbone.Model.extend({

    /**
     *
     */
    idAttribute: 'identityId',

    /**
     *
     * @param key
     * @param val
     * @param options
     * @returns {IdentityModel}
     */
    set: function (key, val, options) {
        var attributes;
        if (typeof key === 'object') {
            attributes = key;
            options = val;
        } else {
            (attributes = {})[key] = val;
        }
        var attributesToSet = _.extend({}, attributes);
        if (attributesToSet) {
            if (attributesToSet.hasOwnProperty('openEntryLogs')) {
                if (this.openEntryLogCollection) {
                    this.openEntryLogCollection.reset(attributesToSet.openEntryLogs, {silent: true});
                } else {
                    this.openEntryLogCollection = new EntryLogCollection(attributes.openEntryLogs, {silent: true});
                }
                delete attributesToSet.openEntryLogs;
            }
        }
        return Backbone.Model.prototype.set.call(this, attributesToSet, options);
    }
});

module.exports = IdentityModel;