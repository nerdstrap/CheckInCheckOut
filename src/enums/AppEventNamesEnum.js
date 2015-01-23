define(function(require) {
    'use strict';

    var AppEventNamesEnum = {
        login: 'login',
        logout: 'logout',
        userRoleUpdated: 'userRoleUpdated',
        goToStationList: 'goToStationList',
	goToStationWithId: 'goToStationWithId',
        refreshStationList: 'refreshStationList',
        checkIn: 'checkIn',
        cancelCheckIn: 'cancelCheckIn',
        checkInSuccess: 'checkInSuccess',
        checkInError: 'checkInError',
        checkOut: 'checkOut',
        cancelCheckOut: 'cancelCheckOut',
        checkOutSuccess: 'checkOutSuccess',
        checkOutError: 'checkOutError',
	updateCheckIn: 'updateCheckIn',
        cancelUpdateCheckIn: 'cancelUpdateCheckIn',
        updateCheckInSuccess: 'updateCheckInSuccess',
        updateCheckInError: 'updateCheckInError',
    };

    if (Object.freeze) {
        Object.freeze(AppEventNamesEnum);
    }

    return AppEventNamesEnum;
});
