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
        goToDirectionsWithLatLng: 'goToDirectionsWithLatLng'
    };

    if (Object.freeze) {
        Object.freeze(AppEventNamesEnum);
    }

    return AppEventNamesEnum;
});
