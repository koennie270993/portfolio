/*!
 * Simple Video Player Helper
 */

$(function() {
    // Handle video errors
    $('video').on('error', function(error) {
        console.error('Video error detected - check video format and encoding');
        
        // Show the poster image if there's an error
        $(this).attr('poster', $(this).attr('poster'));
        
        // Make sure the download button is visible
        $(this).closest('.video-container').find('a[download]').show();
    });
    
    // Add click-to-play functionality
    $('.portfolio-modal').on('shown.bs.modal', function() {
        // Reset any videos in other modals
        $('video').each(function() {
            if ($(this).get(0)) {
                $(this).get(0).pause();
            }
        });
    });
}); 