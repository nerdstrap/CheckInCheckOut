'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

// these modules setup functions & configuration that are used elsewhere
require('utils');
require('routers/appRouterSingleton');
require('handlebars.helpers');

Backbone.history.start();