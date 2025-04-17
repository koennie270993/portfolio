// Enhanced Google Analytics tracking

// 1. Event tracking for clicks
document.addEventListener('DOMContentLoaded', function() {
  // Track button clicks
  document.querySelectorAll('button, .btn, a.button').forEach(function(button) {
    button.addEventListener('click', function() {
      gtag('event', 'button_click', {
        'event_category': 'engagement',
        'event_label': button.innerText || button.textContent || 'unnamed button',
        'button_class': button.className
      });
    });
  });

  // Track form submissions
  document.querySelectorAll('form').forEach(function(form) {
    form.addEventListener('submit', function() {
      gtag('event', 'form_submission', {
        'event_category': 'engagement',
        'event_label': form.id || form.name || 'unnamed form'
      });
    });
  });
  
  // Track file downloads
  document.querySelectorAll('a[href$=".pdf"], a[href$=".doc"], a[href$=".docx"], a[href$=".xls"], a[href$=".xlsx"], a[href$=".zip"]').forEach(function(link) {
    link.addEventListener('click', function() {
      gtag('event', 'file_download', {
        'event_category': 'engagement',
        'event_label': link.href.split('/').pop() || 'unnamed file',
        'file_extension': link.href.split('.').pop()
      });
    });
  });

  // Track external link clicks
  document.querySelectorAll('a').forEach(function(link) {
    if (link.hostname !== window.location.hostname && link.hostname !== '') {
      link.addEventListener('click', function() {
        gtag('event', 'external_link_click', {
          'event_category': 'outbound',
          'event_label': link.href,
          'transport_type': 'beacon'
        });
      });
    }
  });

  // 2. Custom dimensions - Portfolio specific tracking
  // Track portfolio item views
  document.querySelectorAll('.portfolio-item, .project-item').forEach(function(item) {
    item.addEventListener('click', function() {
      let projectName = item.querySelector('h4') ? 
                        (item.querySelector('h4').innerText || item.querySelector('h4').textContent) : 
                        'Unnamed Project';
      
      let projectCategory = item.dataset.category || 'Uncategorized';
      
      gtag('event', 'view_project', {
        'event_category': 'portfolio',
        'event_label': projectName,
        'project_category': projectCategory
      });
    });
  });

  // 3. Scroll depth tracking
  let scrollDepths = [25, 50, 75, 100];
  let scrollDepthTriggered = {};
  
  scrollDepths.forEach(function(depth) {
    scrollDepthTriggered[depth] = false;
  });
  
  window.addEventListener('scroll', function() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
    
    scrollDepths.forEach(function(depth) {
      if (scrollPercentage >= depth && !scrollDepthTriggered[depth]) {
        gtag('event', 'scroll_depth', {
          'event_category': 'engagement',
          'event_label': depth + '%',
          'non_interaction': true
        });
        scrollDepthTriggered[depth] = true;
      }
    });
  });

  // 4. Page timing measurements
  // Record time spent on page
  let startTime = new Date().getTime();
  let pageTitle = document.title;
  let pagePath = window.location.pathname;
  
  window.addEventListener('beforeunload', function() {
    let endTime = new Date().getTime();
    let timeSpent = (endTime - startTime) / 1000;
    
    gtag('event', 'time_spent', {
      'event_category': 'engagement',
      'event_label': pageTitle,
      'page_path': pagePath,
      'time_seconds': timeSpent
    });
  });
}); 