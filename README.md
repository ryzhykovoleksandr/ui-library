# UI Component Library

A handcrafted collection of reusable UI components built without frameworks —
demonstrating clean HTML structure, utility-first CSS with Tailwind, and
vanilla JavaScript interaction patterns.

## Live Demo

[View on Netlify](#) · [View on Vercel](#)

## Components

| Component | Features |
|-----------|----------|
| **Buttons** | Primary, Secondary, Disabled variants |
| **Cards** | Content card with image, title, description |
| **Forms** | Input, Textarea, live validation |
| **Modal** | Open/close with keyboard (Escape) support |
| **Tabs** | Accessible tab switching |
| **Dropdown** | Toggle menu with outside-click to close |

## Getting Started
```bash
# Clone the repository
git clone https://github.com/ryzhykovoleksandr/ui-library.git
cd ui-library

# Serve locally (required — fetch() doesn't work on file://)
npx serve .
```

Then open `http://localhost:3000` in your browser.

## Project Structure
```
ui-library/
├── index.html          # Showcase page
├── assets/
│   └── css/
│       └── main.css    # Custom styles + component classes
├── components/         # One HTML file per component
└── js/                 # One JS file per interactive component
```

## Design Decisions

- **No build step** — runs directly in the browser; zero config friction
- **Component-scoped CSS** — each variant is a named class, not an inline mess
- **Accessibility first** — ARIA attributes, keyboard navigation, focus management
- **Conventional Commits** — clean Git history readable by any engineer

## Tech Stack

- HTML5
- [Tailwind CSS](https://tailwindcss.com/) via CDN
- Vanilla JavaScript (ES6+)

## License

MIT