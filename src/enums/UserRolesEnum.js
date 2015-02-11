define(function(require) {
    'use strict';

    var UserRolesEnum = {
        Admin: 'Admin',
        User: 'User',
        ReadOnly: 'ReadOnly'
    };

    if (Object.freeze) {
        Object.freeze(UserRolesEnum);
    }

    return UserRolesEnum;
});
