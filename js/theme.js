/**
 * theme.js
 *
 * Toggles between light and dark mode.
 * Persists preference to localStorage so it survives page reload.
 */

function initTheme() {
  const html      = document.documentElement;
  const toggle    = document.getElementById('theme-toggle');
  const iconMoon  = document.getElementById('icon-moon');
  const iconSun   = document.getElementById('icon-sun');

  if (!toggle) return;

  // Restore saved preference, fall back to OS preference
  const saved   = localStorage.getItem('ui-lib-theme');
  const osDark  = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved ?? (osDark ? 'dark' : 'light');

  applyTheme(initial);

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('ui-lib-theme', theme);

    // Swap icons
    iconMoon.hidden = theme === 'dark';
    iconSun.hidden  = theme === 'light';

    // Update button label for screen readers
    toggle.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
  }
}