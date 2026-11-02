/* Extion Consulting — site interactions */

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

// Expandable service cards (home page) --------------------------------------
document.querySelectorAll(".svc-card").forEach((card) => {
  const button = card.querySelector(".svc-card__head");
  const panel = card.querySelector(".svc-card__desc");
  const icon = card.querySelector(".svc-card__icon");

  // The whole card is clickable; the button inside keeps it keyboard-accessible.
  card.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!open));
    panel.hidden = open;
    icon.textContent = open ? "+" : "−";
  });
});

// Filter chips --------------------------------------------------------------
// Calls onChange with the selected chip's value whenever the selection changes.
function initChips(group, onChange) {
  const chips = [...group.querySelectorAll(".chip")];
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      onChange(chip.dataset.value);
    });
  });
}

// Sortable / filterable tables (services + experts) ------------------------
// Each [data-item] element is one sortable unit: a <tr>, or a <tbody> that
// groups a row with its expandable details row.
function initDataTable(table) {
  const items = [...table.querySelectorAll("[data-item]")];
  if (!items.length) return;

  const container = items[0].parentNode;
  const headers = [...table.querySelectorAll("th[data-sort]")];
  const emptyRow = table.querySelector(".empty-row");
  const search = document.querySelector(`[data-search-for="${table.id}"]`);
  const chips = document.querySelector(`[data-chips-for="${table.id}"]`);
  const count = document.querySelector(`[data-count-for="${table.id}"]`);

  const state = {
    key: table.dataset.defaultSort,
    dir: "asc",
    query: "",
    category: "All",
  };

  const rowOf = (item) => (item.matches(".row") ? item : item.querySelector(".row"));

  function compare(a, b) {
    const header = headers.find((h) => h.dataset.sort === state.key);
    const x = a.dataset[state.key];
    const y = b.dataset[state.key];
    const result = header?.dataset.type === "number" ? Number(x) - Number(y) : x.localeCompare(y);
    return state.dir === "asc" ? result : -result;
  }

  function render() {
    let visible = 0;
    items
      .slice()
      .sort(compare)
      .forEach((item) => {
        const matches =
          (state.category === "All" || item.dataset.category === state.category) &&
          (!state.query || item.dataset.search.toLowerCase().includes(state.query));
        item.hidden = !matches;
        if (matches) rowOf(item).classList.toggle("is-alt", visible++ % 2 === 1);
        container.appendChild(item);
      });

    headers.forEach((h) => {
      const active = h.dataset.sort === state.key;
      h.setAttribute("aria-sort", active ? (state.dir === "asc" ? "ascending" : "descending") : "none");
      h.querySelector(".sort-icon").textContent = active ? (state.dir === "asc" ? "↑" : "↓") : "↕";
    });

    if (emptyRow) emptyRow.hidden = visible > 0;
    if (count) count.textContent = `${visible} ${visible === 1 ? "expert" : "experts"} shown.`;
  }

  headers.forEach((h) => {
    h.querySelector(".sort-btn").addEventListener("click", () => {
      if (state.key === h.dataset.sort) {
        state.dir = state.dir === "asc" ? "desc" : "asc";
      } else {
        state.key = h.dataset.sort;
        state.dir = "asc";
      }
      render();
    });
  });

  search?.addEventListener("input", () => {
    state.query = search.value.trim().toLowerCase();
    render();
  });

  if (chips) {
    initChips(chips, (value) => {
      state.category = value;
      render();
    });
  }

  // Expandable rows: only one open at a time.
  const expandRows = [...table.querySelectorAll(".row--clickable")];

  function setOpen(row, open) {
    const button = row.querySelector(".expand-btn");
    button.setAttribute("aria-expanded", String(open));
    button.textContent = open ? "−" : "+";
    document.getElementById(button.getAttribute("aria-controls")).hidden = !open;
  }

  expandRows.forEach((row) => {
    row.addEventListener("click", () => {
      const open = row.querySelector(".expand-btn").getAttribute("aria-expanded") === "true";
      expandRows.forEach((r) => setOpen(r, false));
      if (!open) setOpen(row, true);
    });
  });

  render();
}

document.querySelectorAll(".data-table").forEach(initDataTable);

// Resource filters ----------------------------------------------------------
const resourceChips = document.querySelector("[data-chips-for='resources']");

if (resourceChips) {
  const cards = [...document.querySelectorAll(".res-card")];
  initChips(resourceChips, (value) => {
    cards.forEach((card) => {
      card.hidden = value !== "All" && card.dataset.category !== value;
    });
  });
}

// Contact form --------------------------------------------------------------
// Without a data-endpoint the form just shows the thank-you message. Set
// data-endpoint on the <form> (e.g. a Formspree or Netlify URL) to send it.
document.querySelectorAll(".contact-form").forEach((form) => {
  const card = form.parentElement;
  const success = card.querySelector(".form-success");
  const error = form.querySelector(".form-error");
  const submit = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    error.hidden = true;

    const endpoint = form.dataset.endpoint;
    if (endpoint) {
      submit.disabled = true;
      try {
        const response = await fetch(endpoint, {
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
    success.hidden = false;
  });

  success.querySelector(".form-success__again").addEventListener("click", () => {
    success.hidden = true;
    form.hidden = false;
    form.querySelector("input")?.focus();
  });
});
