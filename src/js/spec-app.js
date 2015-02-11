define(function (require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone');

    var specs = [];
    //specs.push('specs/goToLocusSpec');
    //specs.push('specs/goToLocusWithIdSpec');
    //specs.push('specs/refreshLocusListSpec');
    //specs.push('specs/refreshLocusListByGpsSpec');
    specs.push('specs/checkInSpec');

    $(document).ready(function () {
        require(specs, function (spec) {
            window.executeTests();
        });
    });
});
