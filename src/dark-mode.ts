// Function to toggle dark mode
function toggleDarkMode(isDark: boolean): void {
  if (isDark) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
  }
}

// On page load, check for saved preferences
document.addEventListener('DOMContentLoaded', function() {
  const toggleSwitch = document.querySelector('#checkbox') as HTMLInputElement;
  const currentTheme = localStorage.getItem('theme');
  
  // Check for saved user preference, if any
  if (currentTheme) {
    if (currentTheme === 'dark') {
      toggleSwitch.checked = true;
      toggleDarkMode(true);
    }
  } else {
    // Check for system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      toggleSwitch.checked = true;
      toggleDarkMode(true);
    }
  }
  
  // Add event listener for toggle
  toggleSwitch.addEventListener('change', function(e: Event) {
    toggleDarkMode((e.target as HTMLInputElement).checked);
  });
}); 