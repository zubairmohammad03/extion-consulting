/* Extion Consulting — site interactions */

// Where enquiries are sent. Leave empty to only show the thank-you message,
// or paste a form service URL (e.g. https://formspree.io/f/xxxx) to receive them.
const FORM_ENDPOINT = "";

const ARROW_ICON = `<svg class="btn__icon" viewBox="0 0 30 30" aria-hidden="true"><circle cx="15" cy="15" r="15" fill="#fff"/><path d="M8.5 15h12M15.5 10l5 5-5 5" fill="none" stroke="#ff6b15" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// Mobile menu ---------------------------------------------------------------
const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.getElementById("mobile-nav");

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!open));
    menuToggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
    mobileNav.hidden = open;
  });
}

// Forms ---------------------------------------------------------------------
// Sends the form (when FORM_ENDPOINT is set) and swaps it for a thank-you note.
function initForm(form, onDone) {
  const error = form.querySelector(".form-note");
  const submit = form.querySelector("button[type='submit']");
  const done = form.parentElement.querySelector(".form-done");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    error.hidden = true;

    if (FORM_ENDPOINT) {
      submit.disabled = true;
      try {
        const response = await fetch(FORM_ENDPOINT, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
      } catch {
        error.hidden = false;
        submit.disabled = false;
        return;
      }
      submit.disabled = false;
    }

    form.reset();
    form.hidden = true;
    done.hidden = false;
    done.querySelector("button").focus();
  });

  done.querySelector("button").addEventListener("click", () => {
    done.hidden = true;
    form.hidden = false;
    onDone?.();
  });
}

document.querySelectorAll(".form-card .contact-form").forEach((form) => {
  initForm(form, () => form.querySelector("input")?.focus());
});

// Pop-up form ------------------------------------------------------------------
// Any element with data-popup opens it. data-popup is the pop-up heading;
// data-topic (optional) pre-fills "What would you like to discuss?".
const popup = document.createElement("dialog");
popup.className = "popup";
popup.setAttribute("aria-labelledby", "popup-title");
popup.innerHTML = `
  <div class="popup__inner">
    <button class="popup__close" type="button" aria-label="Close">
      <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M2 2l14 14M16 2L2 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    </button>
    <p class="popup__eyebrow"></p>
    <h2 class="popup__title" id="popup-title">Let's talk about your business</h2>
    <p class="popup__text">Share a few details and we'll get back to you shortly.</p>
    <form class="contact-form">
      <input type="hidden" name="enquiry">
      <div class="field">
        <label for="pf-name">Name*</label>
        <input id="pf-name" name="name" type="text" placeholder="Enter your full name" autocomplete="name" required>
      </div>
      <div class="field">
        <label for="pf-email">Email id*</label>
        <input id="pf-email" name="email" type="email" placeholder="Enter your email" autocomplete="email" required>
      </div>
      <div class="field">
        <label for="pf-phone">Phone no*</label>
        <input id="pf-phone" name="phone" type="tel" placeholder="+91- XXXXXXXXXX" autocomplete="tel" required>
      </div>
      <div class="field">
        <label for="pf-company">Company name*</label>
        <input id="pf-company" name="company" type="text" placeholder="Enter your company name" autocomplete="organization" required>
      </div>
      <div class="field">
        <label for="pf-position">Position*</label>
        <input id="pf-position" name="position" type="text" placeholder="Enter your position or title" autocomplete="organization-title" required>
      </div>
      <div class="field">
        <label for="pf-topic">What would you like to discuss?*</label>
        <textarea id="pf-topic" name="topic" rows="2" placeholder="E.g. Current challenges, Future roadmap, Growth planning etc." required></textarea>
      </div>
      <button type="submit" class="btn btn--block">${ARROW_ICON}<span class="btn__label">SUBMIT</span></button>
      <p class="form-note" role="alert" hidden>Sorry, something went wrong. Please try again or email us directly.</p>
    </form>
    <div class="form-done" role="status" hidden>
      <div class="form-done__icon" aria-hidden="true">✓</div>
      <p class="form-done__title">Thank you!</p>
      <p class="form-done__text">We'll be in touch shortly.</p>
      <button class="text-link" type="button">Close</button>
    </div>
  </div>`;
document.body.appendChild(popup);

const popupForm = popup.querySelector("form");
const popupTopic = popup.querySelector("#pf-topic");
let lastTrigger = null;

function openPopup(trigger) {
  const label = trigger.dataset.popup || trigger.textContent.trim();
  popup.querySelector(".popup__eyebrow").textContent = label;
  popupForm.elements.enquiry.value = `${label} (${document.title})`;
  if (trigger.dataset.topic && !popupTopic.value) popupTopic.value = trigger.dataset.topic;

  lastTrigger = trigger;
  popup.showModal();
  document.body.classList.add("popup-open");
  popup.querySelector("#pf-name").focus();
}

function closePopup() {
  popup.close();
}

popup.addEventListener("close", () => {
  document.body.classList.remove("popup-open");
  lastTrigger?.focus();
});

popup.querySelector(".popup__close").addEventListener("click", closePopup);

// Clicking the dimmed backdrop (outside the dialog box) closes it.
popup.addEventListener("click", (event) => {
  if (event.target === popup) closePopup();
});

initForm(popupForm, closePopup);

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-popup]");
  if (!trigger) return;
  event.preventDefault();
  openPopup(trigger);
});

// Resource search (Resources page) ------------------------------------------
const search = document.getElementById("resource-search");

if (search) {
  const results = document.getElementById("search-results");
  const items = [...document.querySelectorAll("[data-resource]")].map((card) => ({
    title: card.dataset.resource,
    tag: card.dataset.tag || "",
    href: `#${card.id}`,
    img: card.querySelector("img")?.getAttribute("src") || "",
    text: card.textContent.toLowerCase(),
  }));

  const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  search.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    if (!query) {
      results.hidden = true;
      results.innerHTML = "";
      return;
    }
    const matches = items.filter((item) => item.text.includes(query));
    results.innerHTML = matches.length
      ? matches
          .map(
            (m) => `<li><a href="${escape(m.href)}"><img src="${escape(m.img)}" alt=""><span class="search-results__title">${escape(m.title)}</span><span class="search-results__tag">${escape(m.tag)}</span></a></li>`
          )
          .join("")
      : `<li class="search-results__empty">No resources match “${escape(search.value.trim())}”.</li>`;
    results.hidden = false;
  });
}
