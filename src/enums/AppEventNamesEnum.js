define(function (require) {
    'use strict';

    var AppEventNamesEnum = {
        login: 'login',
        logout: 'logout',
        identityUpdated: 'identityUpdated',

        goToLocusSearch: 'goToLocusSearch',
        goToLocusWithId: 'goToLocusWithId',
        refreshLocusListByGps: 'refreshLocusListByGps',
        refreshLocusList: 'refreshLocusList',

        goToIdentitySearch: 'goToIdentitySearch',
        goToIdentityWithId: 'goToIdentityWithId',
        refreshIdentityList: 'refreshIdentityList',

        refreshEntryLogListByGps: 'refreshEntryLogListByGps',
        refreshEntryLogList: 'refreshEntryLogList',

        goToCheckIn: 'goToCheckIn',
        checkIn: 'checkIn',
        checkInSuccess: 'checkInSuccess',
        checkInError: 'checkInError',

        goToEditCheckIn: 'goToEditCheckIn',
        editCheckIn: 'editCheckIn',
        editCheckInSuccess: 'editCheckInSuccess',
        editCheckInError: 'editCheckInError',

        goToCheckOut: 'goToCheckOut',
        checkOut: 'checkOut',
        checkOutSuccess: 'checkOutSuccess',
        checkOutError: 'checkOutError',

        goToDirectionsWithLatLng: 'goToDirectionsWithLatLng'
    };

    if (Object.freeze) {
        Object.freeze(AppEventNamesEnum);
    }

    return AppEventNamesEnum;
});
