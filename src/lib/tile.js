var $ = require('jquery');
// tile hide
$(document).on('hide.bs.collapse', '.tile-active-show', function() {
    $(this).closest('.tile-collapse').css({
        '-webkit-transition-delay': '',
        'transition-delay': ''
    }).removeClass('active');
});

// tile show
$(document).on('show.bs.collapse', '.tile-active-show', function() {
    $(this).closest('.tile-collapse').css({
        '-webkit-transition-delay': '',
        'transition-delay': ''
    }).addClass('active');
});
