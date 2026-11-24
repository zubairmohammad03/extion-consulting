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
| `google-apps-script/Code.gs` | Script that saves form enquiries to the client's Google Sheet |

Fonts (Radio Canada, Radio Canada Big, Roboto) load from Google Fonts.

## Run locally

Open the folder in VS Code and use the Live Server extension, or run:

```bash
python -m http.server 8000
```

## Deploy

Upload the whole folder to any static host (Netlify, Vercel, GitHub Pages,
cPanel / shared hosting). `index.html` is the home page.

## Form enquiries → Google Sheet

Both the "Stay Connected" form and the pop-up form send each enquiry to the
client's Google Sheet ("Contact_Forms"). Each one becomes a row with:
Timestamp, Name, Email, Phone, Company, Position, Message, Source (which form or
button) and Page. The header row is added automatically on the first enquiry.

Setup (once, by someone with edit access to the sheet):

1. Open the sheet, then **Extensions → Apps Script**.
2. Replace the code in `Code.gs` with `google-apps-script/Code.gs` from this repo,
   and click **Save**.
3. **Deploy → New deployment**, choose type **Web app**, set
   *Execute as: Me* and *Who has access: Anyone*, then **Deploy** and allow access.
4. Copy the **Web app URL** (`https://script.google.com/macros/s/…/exec`) into
   `FORM_ENDPOINT` at the top of `js/main.js`.

If you change `Code.gs` later, use **Deploy → Manage deployments → Edit → New
version** so the URL stays the same.

## Analytics (Google Tag Manager + Google Analytics)

Every page loads Google Tag Manager container `GTM-NVSBZQLS` (Google's official
snippet: in `<head>`, plus the `<noscript>` fallback right after `<body>`). The
container loads the Google tag for the Google Analytics 4 property
"DBS Website COM" (`G-SZNFB21TSL`), which records page views.

When an enquiry is saved, `js/main.js` also sends a `generate_lead` event straight
to Google Analytics through that Google tag:

```js
gtag("event", "generate_lead", { form_source: "Pop-up: Book a free consultation" });
```

No Tag Manager setup is needed for this, and only the form name is sent, never
the visitor's personal details. Don't also add a Tag Manager tag for
`generate_lead`, or each lead would be counted twice.

**Still to do once:** after the first real enquiry comes in (it can take up to a
day to appear), in Google Analytics go to **Admin → Data display → Events →
Recent events** and click the star next to `generate_lead` to make it a key event.
Analytics doesn't allow marking an event before it has been received.

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

- **Contact forms**: until `FORM_ENDPOINT` is set (see above), they show the
  thank-you message but save nothing.
- **Footer** shows Delhi Business Studio's name, phone, email, websites and
  address (Delhi, India). Edit it in all five HTML files if these change.
- **Placeholders from the design**: the Contact page phone number
  (`+91-99XXXXXX00`), LinkedIn links, Privacy Policy and
  Accessibility Statement links, and the "Access resource" / framework links (`#`).
- **Emails differ**: footer says `delhibusinessstudio@gmail.com`, Contact page says
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
