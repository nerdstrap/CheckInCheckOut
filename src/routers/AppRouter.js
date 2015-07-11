'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var SwappingRouter = require('routers/SwappingRouter');
var EventDispatcher = require('dispatchers/EventDispatcher');
var ShellView = require('views/ShellView');
var IdentityRepository = require('repositories/IdentityRepository');
var LocusRepository = require('repositories/LocusRepository');
var EntryLogRepository = require('repositories/EntryLogRepository');
var LookupDataRepository = require('repositories/LookupDataRepository');
var IssueRepository = require('repositories/IssueRepository');
var ReportRepository = require('repositories/ReportRepository');
var GeoLocationService = require('services/GeoLocationService');
var IdentityViewController = require('controllers/LocusViewController');
var LocusViewController = require('controllers/LocusViewController');
var EntryLogViewController = require('controllers/EntryLogViewController');
var PersistenceContext = require('contexts/PersistenceContext');
var ModelMapper = require('mappers/ModelMapper');

var AppRouter = SwappingRouter.extend({

    /**
     *
     * @param options
     */
    initialize: function (options) {
        console.trace('appRouter.initialize');
        options || (options = {});

        this.initializeDependencies();
        this.renderShellView();
        this.contentViewEl = this.shellView.contentViewEl();
    },

    /**
     *
     * @returns {AppRouter}
     */
    initializeDependencies: function () {
        var currentContext = this;
        // dispatchers
        currentContext.dispatcher = new EventDispatcher();

        //mappers
        currentContext.mapper = new ModelMapper();

        //repositories
        currentContext.identityRepository = new IdentityRepository();
        currentContext.locusRepository = new LocusRepository();
        currentContext.entryLogRepository = new EntryLogRepository();
        currentContext.lookupDataRepository = new LookupDataRepository();
        currentContext.issueRepository = new IssueRepository();
        currentContext.reportRepository = new ReportRepository();

        //services
        currentContext.geoLocationService = new GeoLocationService();

        //contexts
        currentContext.persistenceContext = new PersistenceContext({
            dispatcher: currentContext.dispatcher,
            identityRepository: currentContext.identityRepository,
            locusRepository: currentContext.locusRepository,
            entryLogRepository: currentContext.entryLogRepository,
            lookupDataRepository: currentContext.lookupDataRepository,
            issueRepository: currentContext.issueRepository,
            reportRepository: currentContext.reportRepository,
            geoLocationService: currentContext.geoLocationService,
            mapper: currentContext.mapper
        });

        //view controllers
        currentContext.identityViewController = new IdentityViewController({
            router: currentContext,
            dispatcher: currentContext.dispatcher,
            persistenceContext: currentContext.persistenceContext
        });
        currentContext.locusViewController = new LocusViewController({
            router: currentContext,
            dispatcher: currentContext.dispatcher,
            persistenceContext: currentContext.persistenceContext
        });
        currentContext.entryLogViewController = new EntryLogViewController({
            router: currentContext,
            dispatcher: currentContext.dispatcher,
            persistenceContext: currentContext.persistenceContext
        });
        return this;
    },

    /**
     *
     * @returns {AppRouter}
     */
    renderShellView: function () {
        var currentContext = this;
        currentContext.shellView = new ShellView({
            dispatcher: currentContext.dispatcher
        });
        currentContext.shellView.render();
        $('body').append(currentContext.shellView.el);
        return this;
    },

    /**
     *
     */
    routes: {
        '': 'goToLocusSearch',
        'locus': 'goToLocusSearch',
        'locus/:id': 'goToLocusWithId',
        'locus/:id/checkIn': 'goToCheckIn',
        'entryLog/:id': 'goToEditCheckIn',
        'entryLog/:id/checkOut': 'goToCheckOut',
        'identity': 'goToIdentitySearch',
        'identity/:id': 'goToIdentityWithId'
    },

    /**
     *
     * @returns {AppRouter}
     */
    goToLocusSearch: function () {
        var currentContext = this;
        currentContext.locusViewController.goToLocusSearch();
        return this;
    },

    /**
     *
     * @param locusId
     * @returns {AppRouter}
     */
    goToLocusWithId: function (locusId) {
        var currentContext = this;
        currentContext.locusViewController.goToLocusWithId(locusId);
        return this;
    },

    /**
     *
     * @param locusId
     * @returns {AppRouter}
     */
    goToCheckIn: function (locusId) {
        var currentContext = this;
        currentContext.entryLogViewController.goToCheckIn(locusId);
        return this;
    },

    /**
     *
     * @param entryLogId
     * @returns {AppRouter}
     */
    goToEditCheckIn: function (entryLogId) {
        var currentContext = this;
        currentContext.entryLogViewController.goToCheckIn(entryLogId);
        return this;
    },

    /**
     *
     * @param entryLogId
     * @returns {AppRouter}
     */
    goToCheckOut: function (entryLogId) {
        var currentContext = this;
        currentContext.entryLogViewController.goToCheckOut(entryLogId);
        return this;
    },

    /**
     *
     * @returns {AppRouter}
     */
    goToIdentitySearch: function () {
        var currentContext = this;
        currentContext.identityViewController.goToIdentitySearch();
        return this;
    },

    /**
     *
     * @param identityId
     * @returns {AppRouter}
     */
    goToIdentityWithId: function (identityId) {
        var currentContext = this;
        currentContext.identityViewController.goToIdentityWithId(identityId);
        return this;
    }
});

module.exports = AppRouter;