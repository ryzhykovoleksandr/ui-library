/**
 * modal.js
 *
 * Controls the demo modal: open, close, focus trap,
 * scroll lock, keyboard (Escape), and backdrop click.
 *
 * Public API (for other scripts to use if needed):
 *   openModal()
 *   closeModal()
 */

// ── Constants ────────────────────────────────────────────────────

// All element types that can receive keyboard focus
const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

// ── State ────────────────────────────────────────────────────────

let previouslyFocusedElement = null; // element to restore focus to on close

// ── Helpers ──────────────────────────────────────────────────────

/**
 * Measures the scrollbar width to prevent layout shift
 * when overflow: hidden is applied to the body.
 * @returns {number} scrollbar width in pixels
 */
function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

// ── Focus Trap ───────────────────────────────────────────────────

/**
 * Traps Tab / Shift+Tab focus within the modal.
 * Called on every keydown while the modal is open.
 * @param {KeyboardEvent} e
 * @param {HTMLElement}   modal
 */
function handleFocusTrap(e, modal) {
  if (e.key !== 'Tab') return;

  const focusable = Array.from(modal.querySelectorAll(FOCUSABLE_SELECTORS));
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  if (e.shiftKey) {
    // Shift+Tab: if focus is on first element → wrap to last
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    // Tab: if focus is on last element → wrap to first
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

// ── Open / Close ─────────────────────────────────────────────────

function openModal() {
  const modal    = document.getElementById('demo-modal');
  const backdrop = document.getElementById('modal-backdrop');
  if (!modal || !backdrop) return;

  // Remember what triggered the modal — we'll restore focus here on close
  previouslyFocusedElement = document.activeElement;

  // Compensate for scrollbar disappearing (prevents layout jump)
  const scrollbarWidth = getScrollbarWidth();
  document.documentElement.style.setProperty(
    '--scrollbar-width',
    `${scrollbarWidth}px`
  );

  // Lock body scroll
  document.body.classList.add('scroll-locked');

  // Reveal backdrop + modal
  backdrop.classList.add('is-open');
  backdrop.setAttribute('aria-hidden', 'true');
  modal.classList.add('is-open');

  // Move focus into modal — onto the modal container itself first
  // (CSS transition needs one frame before we shift focus)
  requestAnimationFrame(() => {
    const firstFocusable = modal.querySelector(FOCUSABLE_SELECTORS);
    if (firstFocusable) {
      firstFocusable.focus();
    } else {
      modal.focus(); // fallback: focus the dialog itself (tabindex="-1")
    }
  });

  // Attach keyboard listeners
  modal._trapHandler = (e) => {
    if (e.key === 'Escape') closeModal();
    handleFocusTrap(e, modal);
  };
  document.addEventListener('keydown', modal._trapHandler);
}

function closeModal() {
  const modal    = document.getElementById('demo-modal');
  const backdrop = document.getElementById('modal-backdrop');
  if (!modal || !backdrop) return;

  // Hide modal + backdrop
  modal.classList.remove('is-open');
  backdrop.classList.remove('is-open');

  // Unlock scroll
  document.body.classList.remove('scroll-locked');
  document.documentElement.style.removeProperty('--scrollbar-width');

  // Remove keyboard listener
  if (modal._trapHandler) {
    document.removeEventListener('keydown', modal._trapHandler);
    modal._trapHandler = null;
  }

  // Restore focus to the element that opened the modal
  if (previouslyFocusedElement) {
    previouslyFocusedElement.focus();
    previouslyFocusedElement = null;
  }
}

// ── Event bindings ───────────────────────────────────────────────

function initModal() {
  const openBtn    = document.getElementById('modal-open-btn');
  const closeBtn   = document.getElementById('modal-close-btn');
  const cancelBtn  = document.getElementById('modal-cancel-btn');
  const confirmBtn = document.getElementById('modal-confirm-btn');
  const backdrop   = document.getElementById('modal-backdrop');

  if (!openBtn || !closeBtn || !backdrop) return;

  openBtn.addEventListener('click',   openModal);
  closeBtn.addEventListener('click',  closeModal);
  cancelBtn?.addEventListener('click', closeModal);

  confirmBtn?.addEventListener('click', () => {
    console.log('Action confirmed');
    closeModal();
  });

  backdrop.addEventListener('click', closeModal);
}