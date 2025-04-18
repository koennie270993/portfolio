/**
 * Enhanced Analytics Module
 * This module provides advanced tracking capabilities using Google Analytics.
 */

// Declare the gtag function for TypeScript
declare function gtag(...args: any[]): void;

// Track button clicks with additional data
export function trackButtonClick(button: HTMLElement, category = 'Engagement'): void {
  try {
    gtag('event', 'button_click', {
      'event_category': category,
      'event_label': button.innerText || button.textContent || 'unnamed button',
      'button_id': button.id || undefined,
      'button_class': button.className || undefined
    });
  } catch (error) {
    console.error('Analytics error:', error);
  }
}

// Track form submissions
export function trackFormSubmission(form: HTMLFormElement, formName: string): void {
  try {
    gtag('event', 'form_submission', {
      'event_category': 'Forms',
      'event_label': formName,
      'form_id': form.id || undefined,
      'form_fields': form.elements.length
    });
  } catch (error) {
    console.error('Analytics error:', error);
  }
}

// Track file downloads
export function trackDownload(link: HTMLAnchorElement): void {
  try {
    gtag('event', 'file_download', {
      'event_category': 'Downloads',
      'event_label': link.href.split('/').pop() || 'unnamed file',
      'file_extension': link.href.split('.').pop()
    });
  } catch (error) {
    console.error('Analytics error:', error);
  }
}

// Track external link clicks
export function trackExternalLink(link: HTMLAnchorElement): void {
  try {
    const host = window.location.hostname;
    
    // Check if the link is external
    if (link.hostname && link.hostname !== host && !link.hostname.includes(host)) {
      gtag('event', 'external_link_click', {
        'event_category': 'Outbound Links',
        'event_label': link.href,
        'destination_domain': link.hostname
      });
    }
  } catch (error) {
    console.error('Analytics error:', error);
  }
}

// Track portfolio item views
export function trackPortfolioItemView(item: HTMLElement): void {
  try {
    let projectTitle = '';
    
    // Try to get the title from various elements
    const titleElem = item.querySelector('h3, h4, .portfolio-title');
    if (titleElem) {
      projectTitle = titleElem.textContent || '';
    }
    
    // Get the category if available
    let projectCategory = item.dataset.category || 'Uncategorized';
    
    // Send the event
    gtag('event', 'view_project', {
      'event_category': 'Portfolio',
      'event_label': projectTitle,
      'project_category': projectCategory
    });
  } catch (error) {
    console.error('Analytics error:', error);
  }
}

// Track scroll depth
export function initScrollDepthTracking(): void {
  try {
    let scrollMarks = [25, 50, 75, 90, 100];
    let scrollMarksReached: number[] = [];
    
    window.addEventListener('scroll', function() {
      // Calculate current scroll percentage
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const scrollPercentage = Math.round((scrollPosition / scrollHeight) * 100);
      
      // Check which scroll marks we've passed
      for (const mark of scrollMarks) {
        if (scrollPercentage >= mark && !scrollMarksReached.includes(mark)) {
          scrollMarksReached.push(mark);
          
          // Track the scroll depth
          gtag('event', 'scroll_depth', {
            'event_category': 'Page Interaction',
            'event_label': `Scrolled ${mark}%`,
            'value': mark
          });
        }
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
  }
}

// Track time spent on page
export function trackTimeOnPage(): void {
  try {
    // Record page load time
    const loadTime = new Date();
    
    // Track time on unload
    window.addEventListener('beforeunload', function() {
      const timeSpent = Math.round((new Date().getTime() - loadTime.getTime()) / 1000);
      
      gtag('event', 'time_spent', {
        'event_category': 'Page Interaction',
        'event_label': 'Time on page',
        'value': timeSpent
      });
    });
  } catch (error) {
    console.error('Analytics error:', error);
  }
}

// Initialize all tracking
export function initializeEnhancedAnalytics(): void {
  try {
    // Initialize scroll depth tracking
    initScrollDepthTracking();
    
    // Initialize time tracking
    trackTimeOnPage();
    
    // Add click tracking to buttons
    document.querySelectorAll('button, .btn').forEach(button => {
      button.addEventListener('click', function() {
        trackButtonClick(this as HTMLElement);
      });
    });
    
    // Add download tracking
    document.querySelectorAll('a[download], a[href$=".pdf"], a[href$=".doc"], a[href$=".docx"], a[href$=".xls"], a[href$=".xlsx"], a[href$=".zip"]').forEach(link => {
      link.addEventListener('click', function() {
        trackDownload(this as HTMLAnchorElement);
      });
    });
    
    // Add external link tracking
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      link.addEventListener('click', function() {
        trackExternalLink(this as HTMLAnchorElement);
      });
    });
    
    // Track form submissions
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', function() {
        trackFormSubmission(this as HTMLFormElement, this.id || 'unnamed-form');
      });
    });
    
    console.log('Enhanced analytics initialized');
  } catch (error) {
    console.error('Analytics initialization error:', error);
  }
} 