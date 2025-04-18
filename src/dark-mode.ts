// Function to toggle dark mode
function toggleDarkMode(isDark: boolean): void {
  console.log('Toggling dark mode:', isDark);
  if (isDark) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
  }
}

// Initialize dark mode as soon as possible
function initDarkMode() {
  console.log('Initializing dark mode...');
  const toggleSwitch = document.querySelector('#checkbox') as HTMLInputElement;
  
  if (!toggleSwitch) {
    console.error('Dark mode toggle not found in DOM');
    // Try again later when DOM might be ready
    setTimeout(initDarkMode, 500);
    return;
  }
  
  const currentTheme = localStorage.getItem('theme');
  console.log('Current theme from localStorage:', currentTheme);
  
  // Check for saved user preference, if any
  if (currentTheme) {
    if (currentTheme === 'dark') {
      console.log('Applying saved dark theme preference');
      toggleSwitch.checked = true;
      toggleDarkMode(true);
    }
  } else {
    // Check for system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      console.log('Applying system dark theme preference');
      toggleSwitch.checked = true;
      toggleDarkMode(true);
    }
  }
  
  // Add event listener for toggle
  toggleSwitch.addEventListener('change', function(e: Event) {
    const isDark = (e.target as HTMLInputElement).checked;
    console.log('Toggle switch changed:', isDark);
    toggleDarkMode(isDark);
  });
}

// Try to initialize as soon as possible
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDarkMode);
} else {
  // DOM already loaded, run now
  initDarkMode();
}

// Also add a fallback initialization
window.addEventListener('load', function() {
  const toggleSwitch = document.querySelector('#checkbox') as HTMLInputElement;
  if (toggleSwitch && !toggleSwitch.hasAttribute('data-initialized')) {
    console.log('Initializing dark mode on window load (fallback)');
    initDarkMode();
    toggleSwitch.setAttribute('data-initialized', 'true');
  }
}); 