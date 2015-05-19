'use strict';

var UserRolesEnum = {
    Admin: 'Admin',
    User: 'User',
    ReadOnly: 'ReadOnly'
};

if (Object.freeze) {
    Object.freeze(UserRolesEnum);
}

module.exports = UserRolesEnum;