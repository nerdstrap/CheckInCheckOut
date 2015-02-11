define(function (require) {
    'use strict';

    var AppEventNamesEnum = {
        login: 'login',
        logout: 'logout',
        userRoleUpdated: 'userRoleUpdated',

        goToStationSearch: 'goToStationSearch',
        goToStationWithId: 'goToStationWithId',
        refreshStationsByGps: 'refreshStationsByGps',
        refreshStations: 'refreshStations',

        goToStationEntryLogWithId: 'goToStationEntryLogWithId',
        refreshStationEntryLogsByGps: 'refreshStationEntryLogsByGps',
        refreshStationEntryLogs: 'refreshStationEntryLogs',

        goToNewStationEntryLog: 'goToNewStationEntryLog',
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
