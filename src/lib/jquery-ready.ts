/**
 * Helper function to ensure jQuery is available and the DOM is ready
 * @param callback Function to call when jQuery is ready
 */
export function jQueryReady(callback: (jQuery: JQueryStatic) => void): void {
  // Function to check if jQuery is properly initialized
  const isJQueryReady = (): boolean => {
    return typeof window !== 'undefined' && 
           typeof window.jQuery !== 'undefined' && 
           window.jQuery && 
           typeof window.jQuery.fn === 'object';
  };

  // Check if jQuery is already available and fully initialized
  if (isJQueryReady()) {
    // If DOM is already ready, execute callback immediately
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      callback(window.jQuery);
    } else {
      // Wait for DOM to be ready
      document.addEventListener('DOMContentLoaded', () => {
        callback(window.jQuery);
      });
    }
  } else {
    console.log('Waiting for jQuery to be available...');
    
    // Wait for both jQuery and DOM to be ready
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds at 100ms intervals
    
    const checkJQuery = setInterval(() => {
      attempts++;
      
      if (isJQueryReady()) {
        clearInterval(checkJQuery);
        console.log('jQuery is now available');
        
        // Wait for DOM if not already ready
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
          callback(window.jQuery);
        } else {
          document.addEventListener('DOMContentLoaded', () => {
            callback(window.jQuery);
          });
        }
      } else if (attempts >= maxAttempts) {
        clearInterval(checkJQuery);
        console.error('jQuery was not loaded within the timeout period. Attempting fallback...');
        
        // Try to dynamically load jQuery as a fallback
        const script = document.createElement('script');
        script.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
        script.integrity = 'sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=';
        script.crossOrigin = 'anonymous';
        
        script.onload = () => {
          console.log('jQuery loaded via fallback');
          callback(window.jQuery);
        };
        
        script.onerror = () => {
          console.error('Failed to load jQuery via fallback');
        };
        
        document.head.appendChild(script);
      }
    }, 100);
  }
} 