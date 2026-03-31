/**
 * nav.js
 *
 * Highlights the active nav link based on which section
 * is currently visible — using IntersectionObserver,
 * not scroll event listeners.
 *
 * Why IntersectionObserver over scroll events?
 *   — No continuous firing — only triggers on state change
 *   — No layout thrashing (no getBoundingClientRect in scroll)
 *   — Better performance on low-end devices
 */

function initNav() {
  const navLinks = Array.from(
    document.querySelectorAll('.site-nav__link')
  );

  if (navLinks.length === 0) return;

  // Map href → nav link for O(1) lookup
  const linkMap = new Map(
    navLinks.map(link => [link.getAttribute('href').slice(1), link])
  );

  // Track which sections are currently intersecting
  const visibleSections = new Set();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          visibleSections.add(entry.target.id);
        } else {
          visibleSections.delete(entry.target.id);
        }
      });

      updateActiveLink();
    },
    {
      // Section is "active" when its top 30% is in the viewport
      rootMargin: '0px 0px -60% 0px',
      threshold: 0,
    }
  );

  // Observe every section that has a matching nav link
  linkMap.forEach((_, id) => {
    const section = document.getElementById(id);
    // Observe the first child (the actual <section> tag
    // injected by loadComponent) if it exists
    const target = section?.querySelector('section') ?? section;
    if (target) observer.observe(target);
  });

  function updateActiveLink() {
    // Find the first nav link whose section is visible
    // (navLinks are in DOM order = page order)
    let found = false;

    navLinks.forEach(link => {
      const id        = link.getAttribute('href').slice(1);
      const container = document.getElementById(id);
      const section   = container?.querySelector('section') ?? container;
      const isVisible = section && visibleSections.has(section.id);

      if (isVisible && !found) {
        link.classList.add('is-active');
        found = true;
      } else {
        link.classList.remove('is-active');
      }
    });
  }
}