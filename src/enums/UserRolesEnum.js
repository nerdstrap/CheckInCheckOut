define(function(require) {
    'use strict';

    var UserRolesEnum = {
        NocAdmin: 'Admin',
        NocUser: 'User',
        NocRead: 'ReadOnly'
    };

    if (Object.freeze) {
        Object.freeze(UserRolesEnum);
    }

    return UserRolesEnum;
});
