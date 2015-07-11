'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var utils = require('lib/utils');
var config = require('lib/config');

var _identities = require('repositories/identities.json');

var _getById = function (identityId) {
    return _.where(_identities, {identityId: identityId});
};

var _getBySearchQuery = function (searchQuery) {
    return _.where(_identities, {identityName: searchQuery});
};

var IdentityRepository = function (options) {
    options || (options = {});
    this.initialize.apply(this, arguments);
};

_.extend(IdentityRepository.prototype, {
    initialize: function (options) {
        console.trace('IdentityRepository.initialize');
        options || (options = {});
    },
    getIdentitySearchOptions: function (options) {
        options || (options = {});
        var currentContext = this;
        var deferred = $.Deferred();

        var results;

        window.setTimeout(function () {
            deferred.resolveWith(currentContext, [results]);
        }, 20);

        return deferred.promise();
    },
    getMyIdentity: function () {
        var currentContext = this;
        var deferred = $.Deferred();

        var myIdentityId = config.myIdentity.identityId;
        var identities = _getById(myIdentityId);

        var results = {
            identities: identities
        };

        window.setTimeout(function () {
            deferred.resolveWith(currentContext, [results]);
        }, 20);

        return deferred.promise();
    },
    getIdentities: function (options) {
        options || (options = {});
        var currentContext = this;
        var deferred = $.Deferred();

        var identities;
        if (options.identityId) {
            identities = _getById(options.identityId);
        } else if (options.searchQuery && options.searchQuery.length > 1) {
            identities = _getBySearchQuery(options.searchQuery);
        } else if (options.coords) {
            identities = [];
        } else {
            identities = [];
        }

        var results = {
            identities: identities
        };

        window.setTimeout(function () {
            deferred.resolveWith(currentContext, [results]);
        }, 20);

        return deferred.promise();
    }
});

module.exports = IdentityRepository;