# UI Component Library

A handcrafted collection of fully accessible, reusable UI components
built without frameworks — demonstrating clean HTML structure,
utility-first CSS with Tailwind, and vanilla JavaScript interaction patterns.

## 🔗 Live Demo

**[View live on Netlify →](https://oryzhykov-ui-library.netlify.app)**

## 📦 Components

| Component | Variants | Interactions |
|-----------|----------|--------------|
| **Buttons** | Primary, Secondary, Disabled | Hover, focus states |
| **Cards** | Article, Profile, Stat | Hover lift animation |
| **Forms** | Input, Textarea | Real-time validation, char counter |
| **Modal** | Confirmation dialog | Focus trap, scroll lock, Escape key |
| **Tabs** | 4-panel tabbed UI | Arrow key nav, roving tabindex |
| **Dropdown** | Actions, Select, Icon | Outside-click, keyboard nav |

## ✨ Features

- **Zero dependencies** — no npm install, no build step
- **Accessible** — ARIA roles, keyboard navigation, focus management
  throughout; implements W3C APG patterns for modal, tabs, and dropdown
- **Dark mode** — CSS custom properties, OS preference detection,
  persisted to `localStorage`
- **Responsive** — mobile-first, tested from 320px to 1440px
- **Clean Git history** — one logical change per commit,
  conventional commit messages

## 🚀 Getting Started
```bash
# 1. Clone
git clone https://github.com/ryzhykovoleksandr/ui-library.git
cd ui-library

# 2. Serve locally (fetch() requires a server — file:// won't work)
npx serve .

# 3. Open in browser
open http://localhost:3000
```

## 📁 Project Structure
```
ui-library/
├── index.html              # Showcase page + component loader
├── assets/
│   └── css/
│       └── main.css        # Component styles + dark mode
├── components/             # One HTML file per component
│   ├── buttons.html
│   ├── cards.html
│   ├── forms.html
│   ├── modal.html
│   ├── tabs.html
│   └── dropdown.html
└── js/                     # One JS file per concern
    ├── modal.js
    ├── tabs.js
    ├── dropdown.js
    ├── validation.js
    ├── theme.js
    └── nav.js
```

## 🏗️ Architecture Decisions

**No build step.** The showcase runs directly in the browser via
Tailwind CDN. This is intentional for a portfolio demo — zero friction
to evaluate the work.

**BEM naming.** Component CSS uses BEM (`.card__body`, `.card--stat`)
for explicit structure, collision resistance, and readability without
a CSS-in-JS tool.

**`components:ready` event.** Components load via `fetch()` in parallel.
A custom DOM event fires after `Promise.all()` resolves, giving all JS
files a safe hook to initialise without race conditions.

**ARIA-driven state.** Interactive components derive their visual state
from ARIA attributes (`aria-selected`, `aria-expanded`) rather than
custom classes — one source of truth, free semantics.

**IntersectionObserver for nav.** Active nav link detection uses
`IntersectionObserver`, not scroll event listeners — no layout
thrashing, no continuous firing.

## ♿ Accessibility

- All interactive components keyboard-navigable
- Modal implements focus trap (WCAG 2.1 SC 2.1.2)
- Tabs implement W3C APG roving tabindex pattern
- Dropdown implements W3C APG disclosure button pattern
- Form errors announced via `aria-live="polite"`
- Dark mode respects `prefers-color-scheme`

## 📄 License

MIT — use freely in personal and commercial projects.