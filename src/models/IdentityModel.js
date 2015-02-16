define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseModel = require('models/BaseModel'),
        env = require('env');

    var IdentityModel = BaseModel.extend({
        idAttribute: 'identityId'
    });

    return IdentityModel;
});