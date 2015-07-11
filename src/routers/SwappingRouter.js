'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');

/**
 * Creates a new SwappingRouter with the specified attributes.
 * @constructor
 * @param {object} options
 */
var SwappingRouter = function (options) {
    Backbone.Router.apply(this, [options]);
};

_.extend(SwappingRouter.prototype, Backbone.Router.prototype, {
    /** Cleans up resources used by the previous view
     * @param {object} newContentView
     */
    swapContent: function (newContentView) {
        if (this.currentContentView && this.currentContentView.leave) {
            this.currentContentView.leave();
        }

        this.currentContentView = newContentView;
        $(this.contentViewEl).html(this.currentContentView.render().el);

        if (this.currentContentView && this.currentContentView.swapped) {
            this.currentContentView.swapped();
            $('html, body').animate({
                scrollTop: $('body').offset().top
            }, 250);
        }
    }
});

SwappingRouter.extend = Backbone.Router.extend;

module.exports = SwappingRouter;