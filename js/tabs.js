/**
 * tabs.js
 *
 * Implements the W3C APG "Tabs with Automatic Activation" pattern.
 * https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 *
 * Keyboard contract:
 *   ArrowRight / ArrowLeft → move between tabs (wraps around)
 *   Home                   → activate first tab
 *   End                    → activate last tab
 *   Tab                    → moves focus out of tablist into panel
 */

// ── Core activation logic ─────────────────────────────────────────

/**
 * Activates a tab and shows its associated panel.
 * Deactivates all other tabs and hides their panels.
 *
 * @param {HTMLElement}   selectedTab - The tab button to activate
 * @param {HTMLElement[]} allTabs     - All tab buttons in the group
 */
function activateTab(selectedTab, allTabs) {
  allTabs.forEach(tab => {
    const isSelected = tab === selectedTab;
    const panelId    = tab.getAttribute('aria-controls');
    const panel      = document.getElementById(panelId);

    // Update tab state
    tab.setAttribute('aria-selected', String(isSelected));

    // Only the active tab is in the Tab key sequence
    // All others use tabindex="-1" (arrow keys only)
    tab.setAttribute('tabindex', isSelected ? '0' : '-1');

    // Show/hide the associated panel
    if (panel) {
      if (isSelected) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    }
  });
}

// ── Keyboard handler ─────────────────────────────────────────────

/**
 * Handles arrow key, Home, and End navigation within a tablist.
 *
 * @param {KeyboardEvent} e
 * @param {HTMLElement[]} tabs - All tab buttons in the group
 */
function handleTabKeydown(e, tabs) {
  const currentIndex = tabs.indexOf(document.activeElement);
  if (currentIndex === -1) return;   // focused element isn't a tab

  let targetIndex = null;

  switch (e.key) {
    case 'ArrowRight':
      // Wrap: last tab → first tab
      targetIndex = (currentIndex + 1) % tabs.length;
      break;

    case 'ArrowLeft':
      // Wrap: first tab → last tab
      targetIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      break;

    case 'Home':
      targetIndex = 0;
      break;

    case 'End':
      targetIndex = tabs.length - 1;
      break;

    default:
      return;   // not a key we handle — don't prevent default
  }

  e.preventDefault();   // stop page from scrolling on arrow/home/end

  const targetTab = tabs[targetIndex];
  targetTab.focus();
  activateTab(targetTab, tabs);
}

// ── Initialisation ────────────────────────────────────────────────

function initTabs() {
  // Support multiple independent tab groups on one page
  const tabGroups = document.querySelectorAll('[role="tablist"]');

  tabGroups.forEach(tablist => {
    const tabs = Array.from(
      tablist.querySelectorAll('[role="tab"]')
    );

    if (tabs.length === 0) return;

    // Click: activate the clicked tab
    tabs.forEach(tab => {
      tab.addEventListener('click', () => activateTab(tab, tabs));
    });

    // Keyboard: arrow key navigation
    tablist.addEventListener('keydown', e => handleTabKeydown(e, tabs));
  });
}