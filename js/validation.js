/**
 * validation.js
 * 
 * Handles real-time and submit-time form validation for #demo-form.
 * 
 * Rules:
 *  - Validate on blur (user leaves field)
 *  - Validate all fields on submit
 *  - Never show errors before user interaction
 *  - All DOM queries are scoped to the form element
 */

// ── Validation rules ────────────────────────────────────────────
// Each rule is a function: (value: string) => string | null
// Returns an error message string, or null if valid.

const RULES = {
  name(value) {
    if (!value.trim())           return 'Full name is required.';
    if (value.trim().length < 2) return 'Name must be at least 2 characters.';
    return null;
  },

  email(value) {
    if (!value.trim()) return 'Email address is required.';
    // Simple but solid regex — no need for RFC 5322 madness in a UI library
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(value)) return 'Please enter a valid email address.';
    return null;
  },

  message(value) {
    if (!value.trim())             return 'Message is required.';
    if (value.trim().length < 10)  return 'Message must be at least 10 characters.';
    if (value.trim().length > 300) return 'Message must be 300 characters or fewer.';
    return null;
  },
};

// ── DOM helpers ─────────────────────────────────────────────────

/**
 * Marks a form group as invalid and displays the error message.
 * @param {HTMLElement} group  - The .form__group wrapper element
 * @param {string}      message - The error string to display
 */
function setInvalid(group, message) {
  group.classList.remove('is-valid');
  group.classList.add('is-invalid');
  const errorEl = group.querySelector('.form__error');
  if (errorEl) errorEl.textContent = message;
}

/**
 * Marks a form group as valid and clears any error message.
 * @param {HTMLElement} group - The .form__group wrapper element
 */
function setValid(group) {
  group.classList.remove('is-invalid');
  group.classList.add('is-valid');
  const errorEl = group.querySelector('.form__error');
  if (errorEl) errorEl.textContent = '';
}

/**
 * Resets a form group to its neutral (untouched) state.
 * @param {HTMLElement} group - The .form__group wrapper element
 */
function clearState(group) {
  group.classList.remove('is-valid', 'is-invalid');
  const errorEl = group.querySelector('.form__error');
  if (errorEl) errorEl.textContent = '';
}

// ── Core validate function ───────────────────────────────────────

/**
 * Validates a single field by its data-field attribute.
 * @param   {HTMLElement} group - The .form__group wrapper
 * @returns {boolean}           - true if valid
 */
function validateField(group) {
  const fieldName = group.dataset.field;
  const rule = RULES[fieldName];

  if (!rule) return true; // No rule = no validation needed

  const input = group.querySelector('.form__input');
  const error = rule(input.value);

  if (error) {
    setInvalid(group, error);
    return false;
  }

  setValid(group);
  return true;
}

// ── Character counter ────────────────────────────────────────────

function initCharCounter(form) {
  const textarea = form.querySelector('#field-message');
  const counter  = form.querySelector('#field-message-count');
  if (!textarea || !counter) return;

  const MAX = 300;

  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    counter.textContent = `${len} / ${MAX}`;
    counter.style.color = len > MAX ? '#ef4444' : '#9ca3af';
  });
}

// ── Form initialisation ──────────────────────────────────────────

function initForm() {
  const form = document.getElementById('demo-form');
  if (!form) return; // Guard: component may not be on the page

  const groups    = Array.from(form.querySelectorAll('.form__group'));
  const successEl = document.getElementById('form-success');

  // Validate each field when the user leaves it (blur)
  groups.forEach(group => {
    const input = group.querySelector('.form__input');
    if (!input) return;

    input.addEventListener('blur', () => {
      // Only validate if user has typed something — don't punish empty
      // untouched fields on blur (they'll be caught on submit)
      if (input.value.trim() !== '' || group.classList.contains('is-invalid')) {
        validateField(group);
      }
    });

    // Re-validate live while typing, but only if already in invalid state
    input.addEventListener('input', () => {
      if (group.classList.contains('is-invalid')) {
        validateField(group);
      }
    });
  });

  // Character counter for textarea
  initCharCounter(form);

  // Submit: validate all fields, block if any invalid
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const allValid = groups
      .map(group => validateField(group))  // validate all, collect results
      .every(Boolean);                     // true only if ALL passed

    if (!allValid) {
      // Focus the first invalid input for accessibility
      const firstInvalid = form.querySelector('.is-invalid .form__input');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // All valid — show success state
    successEl.hidden = false;
    form.reset();
    groups.forEach(clearState);

    // Auto-hide success banner after 4 seconds
    setTimeout(() => { successEl.hidden = true; }, 4000);
  });

  // Reset button: clear all states
  form.addEventListener('reset', () => {
    // Let the browser reset values first, then clear our states
    setTimeout(() => {
      groups.forEach(clearState);
      successEl.hidden = true;
      const counter = form.querySelector('#field-message-count');
      if (counter) counter.textContent = '0 / 300';
    }, 0);
  });
}

window.initValidation = initForm;