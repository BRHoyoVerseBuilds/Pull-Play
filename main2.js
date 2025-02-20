// Theme toggling functionality
const themeToggle = document.getElementById('themeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Set initial theme based on system preference
document.documentElement.setAttribute('data-theme', 
  prefersDarkScheme.matches ? 'dark' : 'light'
);

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// Add mobile quick nav
if (window.innerWidth <= 768) {
  const quickNavMobile = document.createElement('div');
  quickNavMobile.className = 'quick-nav-mobile';
  quickNavMobile.innerHTML = `
    <a href="#trackers" class="quick-link">Trackers</a>
    <a href="#tools" class="quick-link">Tools</a>
  `;
  document.body.appendChild(quickNavMobile);
}

// Add ripple effect to tracker links
document.querySelectorAll('.tracker-link').forEach(link => {
  link.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    
    const rect = link.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    link.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 1000);
  });
});