# Extion Consulting website

Static site built from the client's Figma design (PDF export, 5 pages).
Plain HTML, CSS and JavaScript: no build step, no dependencies.

## Files

| File | Page |
| --- | --- |
| `index.html` | Home |
| `services.html` | Services |
| `about.html` | About |
| `resources.html` | Resources |
| `contact.html` | Contact |
| `css/styles.css` | All styles; colors, fonts and the layout gutter are variables at the top |
| `js/main.js` | Mobile menu, pop-up form, form sending, resource search |
| `assets/img/` | Photos and logo exported from the Figma design |

Fonts (Radio Canada, Radio Canada Big, Roboto) load from Google Fonts.

## Run locally

Open the folder in VS Code and use the Live Server extension, or run:

```bash
python -m http.server 8000
```

## Deploy

Upload the whole folder to any static host (Netlify, Vercel, GitHub Pages,
cPanel / shared hosting). `index.html` is the home page.

## Client feedback applied

1. **Footer text** is 12px regular (not bold).
2. **Pop-up form**: every call-to-action button (Book a free consultation, Talk to Us,
   Contact us, Say Hello, Assess My Business, Book a discovery conversation,
   Schedule a call, Get in touch, …) opens an enquiry form in a pop-up. Buttons on
   the Services page pre-fill the "What would you like to discuss?" field.
   To make a new button open it, add `data-popup="Heading text"` to it.
3. **Resources thumbnails**: resource cards show a thumbnail image on the left with
   the tag, title, description and link on the right, as in the client's sketch.
4. **Alignment**: the design's left edges varied (120, 186, 205, 227, 244px). Everything
   now sits on one grid: logo, hero cards, headings and footer share the same left
   edge, and the nav, dividers, cards and forms share the same right edge.

## Before going live

- **Contact forms**: they show a thank-you message but don't send anywhere yet. Set
  `FORM_ENDPOINT` at the top of `js/main.js` to a form service URL (e.g. Formspree).
  This covers the "Stay Connected" forms and the pop-up.
- **Placeholders from the design**: phone numbers (`+91-98 XXXX XXXX`,
  `+91-99XXXXXX00`), the address ("ABC, Sonipat"), LinkedIn links, Privacy Policy and
  Accessibility Statement links, and the "Access resource" / framework links (`#`).
- **Emails differ**: footer says `info@extionconsulting.com`, Contact page says
  `info@Extion.com`.
- **Photos**: both founders and all nine experts use the same placeholder portrait.
- **Team bios** on Home repeat the section intro text, as in the design.
- **FAQ answers** were not in the design. Draft answers were written from the site's
  own content; the client should review them.
- **Case Studies** section is a "coming soon" placeholder; the design had none.
- Check the spelling of "Abhishek Srivastva" (an earlier design spelled it "Srivastava").

Small copy fixes from the design: "SUMBIT" → "SUBMIT", "All right reserved" →
"All rights reserved", and the Home "Build systems to scale" card had the same text as
"Strengthen your business", so it uses the scaling description instead.

The header and footer are repeated in each HTML file, so edit all five when
changing them.
