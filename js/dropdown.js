/**
 * dropdown.js
 *
 * Manages one or more independent dropdown menus on the page.
 *
 * Keyboard contract:
 *   Enter / Space  → open menu, focus first item
 *   ArrowDown      → next item (wraps to first)
 *   ArrowUp        → previous item (wraps to last)
 *   Home           → first item
 *   End            → last item
 *   Escape         → close, return focus to trigger
 *   Tab            → close (focus leaves naturally)
 */

// ── Helpers ───────────────────────────────────────────────────────

/**
 * Returns all focusable menu items within a menu element.
 * Excludes hidden items to handle future conditional visibility.
 * @param   {HTMLElement}   menu
 * @returns {HTMLElement[]}
 */
function getMenuItems(menu) {
  return Array.from(
    menu.querySelectorAll('[role="menuitem"]:not([disabled]):not([hidden])')
  );
}

// ── Open / Close ─────────────────────────────────────────────────

/**
 * Opens a single dropdown.
 * @param {HTMLElement} trigger - The button that owns the dropdown
 * @param {HTMLElement} menu    - The ul[role="menu"] element
 */
function openDropdown(trigger, menu) {
  trigger.setAttribute('aria-expanded', 'true');
  menu.removeAttribute('hidden');

  // Focus first item on open
  const items = getMenuItems(menu);
  if (items.length > 0) {
    // One frame delay — menu needs to be visible before focus
    requestAnimationFrame(() => items[0].focus());
  }
}

/**
 * Closes a single dropdown.
 * @param {HTMLElement} trigger
 * @param {HTMLElement} menu
 * @param {boolean}     [returnFocus=true] - Whether to refocus trigger
 */
function closeDropdown(trigger, menu, returnFocus = true) {
  trigger.setAttribute('aria-expanded', 'false');
  menu.setAttribute('hidden', '');
  if (returnFocus) trigger.focus();
}

/**
 * Closes ALL open dropdowns on the page.
 * Used when clicking outside or pressing Escape globally.
 * @param {HTMLElement} [except] - Optional dropdown wrapper to skip
 */
function closeAllDropdowns(except = null) {
  document.querySelectorAll('.dropdown').forEach(wrapper => {
    if (wrapper === except) return;
    const trigger = wrapper.querySelector('[aria-expanded]');
    const menuId  = trigger?.getAttribute('aria-controls');
    const menu    = menuId ? document.getElementById(menuId) : null;
    if (trigger && menu && trigger.getAttribute('aria-expanded') === 'true') {
      closeDropdown(trigger, menu, false); // don't steal focus
    }
  });
}

// ── Keyboard navigation ───────────────────────────────────────────

/**
 * Handles keyboard navigation within an open menu.
 * @param {KeyboardEvent} e
 * @param {HTMLElement}   trigger
 * @param {HTMLElement}   menu
 */
function handleMenuKeydown(e, trigger, menu) {
  const items        = getMenuItems(menu);
  const currentIndex = items.indexOf(document.activeElement);

  switch (e.key) {

    case 'ArrowDown': {
      e.preventDefault();
      const next = (currentIndex + 1) % items.length;
      items[next].focus();
      break;
    }

    case 'ArrowUp': {
      e.preventDefault();
      const prev = (currentIndex - 1 + items.length) % items.length;
      items[prev].focus();
      break;
    }

    case 'Home':
      e.preventDefault();
      items[0]?.focus();
      break;

    case 'End':
      e.preventDefault();
      items[items.length - 1]?.focus();
      break;

    case 'Escape':
      e.preventDefault();
      closeDropdown(trigger, menu, true);  // return focus to trigger
      break;

    case 'Tab':
      // Don't prevent default — let Tab move focus naturally
      // but close the menu so it doesn't hang open
      closeDropdown(trigger, menu, false);
      break;

    default:
      break;
  }
}

// ── Select-style option handler ───────────────────────────────────

/**
 * Wires up the select-style dropdown to update its trigger label
 * when a user picks an option.
 * @param {HTMLElement} wrapper - The .dropdown root element
 */
function initSelectDropdown(wrapper) {
  const trigger     = wrapper.querySelector('[aria-expanded]');
  const labelEl     = wrapper.querySelector('#select-label');
  const menuId      = trigger?.getAttribute('aria-controls');
  const menu        = menuId ? document.getElementById(menuId) : null;

  if (!menu || !labelEl) return;

  menu.querySelectorAll('[data-value]').forEach(item => {
    item.addEventListener('click', () => {
      const value = item.dataset.value;
      // Capitalise first letter for display
      labelEl.textContent = value.charAt(0).toUpperCase() + value.slice(1);
      // Mark selected visually
      menu.querySelectorAll('[data-value]').forEach(i =>
        i.style.fontWeight = i === item ? '600' : '400'
      );
      closeDropdown(trigger, menu, true);
    });
  });
}

// ── Per-dropdown initialisation ───────────────────────────────────

/**
 * Wires up a single .dropdown wrapper.
 * @param {HTMLElement} wrapper
 */
function initDropdown(wrapper) {
  const trigger = wrapper.querySelector('[aria-expanded]');
  const menuId  = trigger?.getAttribute('aria-controls');
  const menu    = menuId ? document.getElementById(menuId) : null;

  if (!trigger || !menu) return;

  // ── Toggle on trigger click ──────────────────────────────────
  trigger.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent document click from firing immediately

    const isOpen = trigger.getAttribute('aria-expanded') === 'true';

    // Close all other open dropdowns first
    closeAllDropdowns(wrapper);

    if (isOpen) {
      closeDropdown(trigger, menu, true);
    } else {
      openDropdown(trigger, menu);
    }
  });

  // ── Keyboard on trigger (closed state) ──────────────────────
  trigger.addEventListener('keydown', (e) => {
    // Open on Enter/Space (browser fires click for Enter automatically
    // on buttons, but ArrowDown should also open)
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      if (!isOpen) openDropdown(trigger, menu);
    }
  });

  // ── Keyboard navigation inside open menu ────────────────────
  menu.addEventListener('keydown', (e) => {
    handleMenuKeydown(e, trigger, menu);
  });

  // ── Select-style: update label on pick ──────────────────────
  if (wrapper.id === 'dropdown-select') {
    initSelectDropdown(wrapper);
  }
}

// ── Global outside-click handler ─────────────────────────────────

function initOutsideClickHandler() {
  document.addEventListener('click', (e) => {
    // If click is outside every .dropdown, close them all
    const clickedInsideAny = e.target.closest('.dropdown');
    if (!clickedInsideAny) {
      closeAllDropdowns();
    }
  });
}

// ── Entry point ───────────────────────────────────────────────────

function initDropdowns() {
  const wrappers = document.querySelectorAll('.dropdown');
  wrappers.forEach(wrapper => initDropdown(wrapper));
  initOutsideClickHandler();
}