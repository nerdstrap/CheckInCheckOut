define(function (require) {
    'use strict';

    var AppEventNamesEnum = {
        login: 'login',
        logout: 'logout',
        userRoleUpdated: 'userRoleUpdated',

        goToLocusSearch: 'goToLocusSearch',
        goToLocusWithId: 'goToLocusWithId',
        refreshLocusListByGps: 'refreshLocusListByGps',
        refreshLocusList: 'refreshLocusList',

        goToEntryLogWithId: 'goToEntryLogWithId',
        refreshEntryLogListByGps: 'refreshEntryLogListByGps',
        refreshEntryLogList: 'refreshEntryLogList',

        goToNewEntryLog: 'goToNewEntryLog',
        checkIn: 'checkIn',
        checkInSuccess: 'checkInSuccess',
        checkInError: 'checkInError',

        goToDirectionsWithLatLng: 'goToDirectionsWithLatLng'
    };

    if (Object.freeze) {
        Object.freeze(AppEventNamesEnum);
    }

    return AppEventNamesEnum;
});
