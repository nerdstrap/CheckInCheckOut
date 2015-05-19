'use strict';

var EventNamesEnum = {
    login: 'login',
    logout: 'logout',
    identityUpdated: 'identityUpdated',

    goToMyIdentity: 'goToMyIdentity',

    goToLocusSearch: 'goToLocusSearch',
    goToLocusWithId: 'goToLocusWithId',
    refreshLocusList: 'refreshLocusList',

    goToIdentitySearch: 'goToIdentitySearch',
    goToIdentityWithId: 'goToIdentityWithId',
    refreshIdentityList: 'refreshIdentityList',

    goToAdHocCheckIn: 'goToAdHocCheckIn',
    goToSettings: 'goToSettings',

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

    goToDirectionsWithLatLng: 'goToDirectionsWithLatLng',

    goToLocusAdmin: 'goToLocusAdmin',
    adminAddLocusList: 'adminAddLocusList',
    addLocusSuccess: 'addLocusSuccess',
    addLocusError: 'addLocusError'
};

if (Object.freeze) {
    Object.freeze(EventNamesEnum);
}

module.exports = EventNamesEnum;
