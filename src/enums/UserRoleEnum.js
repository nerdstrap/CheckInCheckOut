'use strict';

/**
 *
 * @type {{Admin: string, User: string, ReadOnly: string}}
 */
var UserRoleEnum = {
    Admin: 1,
    User: 2,
    ReadOnly: 3
};

if (Object.freeze) {
    Object.freeze(UserRoleEnum);
}

module.exports = UserRoleEnum;