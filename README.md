# Extion Consulting website

Static site built from the Figma design at https://grace-nova-05727759.figma.site/.
Plain HTML, CSS and JavaScript: no build step, no dependencies.

## Files

| File | Page |
| --- | --- |
| `index.html` | Home |
| `services.html` | Services (sortable / filterable services table) |
| `about.html` | About (founders, sortable / filterable experts table) |
| `resources.html` | Resources (filter by type) |
| `contact.html` | Contact |
| `css/styles.css` | All styles; colors and fonts are variables at the top |
| `js/main.js` | Mobile menu, expandable cards, tables, filters, contact form |

Fonts (Radio Canada, Radio Canada Big, Roboto) load from Google Fonts.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

## Deploy

Upload the whole folder to any static host (Netlify, Vercel, GitHub Pages,
cPanel / shared hosting). `index.html` is the home page.

## Before going live

These are placeholders carried over from the design:

- **Contact form**: it currently only shows the thank-you message. To receive
  submissions, add `data-endpoint="https://formspree.io/f/XXXX"` (or any
  service that accepts a form POST) to the `<form class="contact-form">` on
  `index.html` and `contact.html`.
- **Phone numbers**: `+91-98 XXXX XXXX` (footer) and `+91-99XXXXXX00` (contact page).
- **Emails**: the footer says `info@extionconsulting.com`, the contact page says
  `info@Extion.com`. Pick one.
- **Address**: "ABC, Sonipat, Haryana - 131001" in the footer.
- **Photos**: all images are Unsplash stock photos. Both founders use the same photo.
- **LinkedIn links**: they point to `https://linkedin.com`.
- **Privacy Policy, Accessibility Statement, "Access resource →" links**: point to `#`.

The header and footer are repeated in each HTML file, so edit all five when
changing them.
"# extion-consulting" 
