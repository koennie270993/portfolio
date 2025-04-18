/*!
 * Simple Video Player Helper
 */

import { jQueryReady } from './lib/jquery-ready';

/**
 * Custom video player functionality
 */

// Initialize video player with jQuery
jQueryReady(($) => {
  // Handle errors for video elements
  $('video').on('error', function(error: Event) {
    console.error('Video error:', error);
    
    // When a video fails to load, show the poster image instead
    const video = this as HTMLVideoElement;
    if ($(video).attr('poster')) {
      $(video).attr('poster', $(video).attr('poster'));
    }
    
    // Add error class for styling
    $(video).addClass('video-error');
  });
  
  // Custom play/pause controls
  $('.video-control-play').on('click', function() {
    const videoId = $(this).data('video-target');
    const video = $('#' + videoId)[0] as HTMLVideoElement;
    
    if (video) {
      if (video.paused) {
        video.play();
        $(this).addClass('playing');
      } else {
        video.pause();
        $(this).removeClass('playing');
      }
    }
  });
  
  // Autoplay videos when they come into view (if they have 'data-autoplay' attribute)
  $(window).on('scroll', function() {
    $('video[data-autoplay]').each(function() {
      const video = this as HTMLVideoElement;
      const videoTop = $(video).offset()?.top || 0;
      const videoHeight = $(video).height() || 0;
      const windowHeight = $(window).height() || 0;
      const windowScrollTop = $(window).scrollTop() || 0;
      
      // Check if video is in viewport
      if (videoTop < (windowScrollTop + windowHeight) && 
          (videoTop + videoHeight) > windowScrollTop) {
        // Play video if it's paused
        if (video.paused) {
          video.play().catch(e => {
            console.log('Autoplay prevented:', e);
          });
        }
      } else {
        // Pause video if it's playing
        if (!video.paused) {
          video.pause();
        }
      }
    });
  });
}); 