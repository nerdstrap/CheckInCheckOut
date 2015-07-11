'use strict';

var consolePolyfill = require('console-polyfill');
var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var AppRouter = require('routers/AppRouter');

// these modules setup functions & configuration that are used elsewhere
var transition = require('lib/transition');
var collapse = require('lib/collapse');
var dropdown = require('lib/dropdown');
var tab = require('lib/tab');

var tile = require('lib/tile');
var appDropdown = require('lib/app-dropdown');
var appTab = require('lib/app-tab');
var menu = require('lib/menu');
var form = require('lib/form');

var handlebarsHelpers = require('lib/handlebars.helpers');

var appRouterInstance = new AppRouter();

Backbone.history.start();