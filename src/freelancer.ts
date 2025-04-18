/*!
 * Start Bootstrap - Freelancer Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

import { jQueryReady } from './lib/jquery-ready';

// Initialize Freelancer theme functionality
jQueryReady(($) => {
    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('.page-scroll a').on('click', function(event) {
        const $anchor = $(this);
        const targetElement = $($anchor.attr('href') || '');
        
        if (targetElement.length) {
            $('html, body').stop().animate({
                scrollTop: targetElement.offset()?.top || 0
            }, 1500, 'easeInOutExpo');
            event.preventDefault();
        }
    });

    // Floating label headings for the contact form
    $("body").on("input propertychange", ".floating-label-form-group", function(e) {
        $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
    }).on("focus", ".floating-label-form-group", function() {
        $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function() {
        $(this).removeClass("floating-label-form-group-with-focus");
    });
    
    // Highlight the top nav as scrolling occurs
    $('body').on('scroll', function() {
        const scrollspy = $('body').data('bs.scrollspy');
        if (scrollspy) {
            scrollspy.process();
        }
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').on('click', function() {
        $('.navbar-toggle:visible').click();
    });
}); 