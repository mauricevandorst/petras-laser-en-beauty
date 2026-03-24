const TREATMENT_DATA_URL = "./assets/data/treatments.json";
const DEFAULT_DESCRIPTION =
  "Tijdens deze behandeling kijken we naar jouw wensen en stemmen we de behandeling zorgvuldig af op jouw huid en comfort.";

const treatmentSection = document.getElementById("behandelingen");
if (!treatmentSection) {
  // No treatment section on this page.
} else {
  const treatmentLinks = Array.from(treatmentSection.querySelectorAll('a[href="#afspraak"]'));

  if (treatmentLinks.length > 0) {
    const modal = createTreatmentModal();
    document.body.appendChild(modal.root);

    let previousActiveElement = null;
    let closeTimer = null;
    let isClosing = false;
    const treatmentMapPromise = loadTreatmentMap();

    const closeModal = ({ restoreFocus = true } = {}) => {
      if (modal.root.classList.contains("hidden") || isClosing) return;

      isClosing = true;
      const activeElement = document.activeElement;
      if (activeElement instanceof HTMLElement && modal.root.contains(activeElement)) {
        activeElement.blur();
      }
      if (
        restoreFocus &&
        previousActiveElement instanceof HTMLElement &&
        previousActiveElement.isConnected
      ) {
        previousActiveElement.focus({ preventScroll: true });
      }
      modal.root.setAttribute("aria-hidden", "true");
      document.body.classList.remove("overflow-hidden");
      modal.backdrop.classList.remove("opacity-100");
      modal.backdrop.classList.add("opacity-0");
      modal.panel.classList.remove("opacity-100", "translate-y-0", "sm:scale-100");
      modal.panel.classList.add("opacity-0", "translate-y-3", "sm:scale-[0.98]");

      if (closeTimer) window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(() => {
        modal.root.classList.add("hidden");
        isClosing = false;
      }, 220);
    };

    const openModal = (title, description, triggerElement) => {
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }
      isClosing = false;
      previousActiveElement = triggerElement;
      modal.title.textContent = title;
      modal.description.textContent = description;

      modal.root.classList.remove("hidden");
      modal.root.setAttribute("aria-hidden", "false");
      document.body.classList.add("overflow-hidden");

      requestAnimationFrame(() => {
        modal.backdrop.classList.remove("opacity-0");
        modal.backdrop.classList.add("opacity-100");
        modal.panel.classList.remove("opacity-0", "translate-y-3", "sm:scale-[0.98]");
        modal.panel.classList.add("opacity-100", "translate-y-0", "sm:scale-100");
      });

      modal.closeButton.focus();
    };

    modal.closeButton.addEventListener("click", closeModal);
    modal.backdrop.addEventListener("click", closeModal);
    modal.bookingLink.addEventListener("click", () => closeModal({ restoreFocus: false }));
    modal.root.addEventListener("click", (event) => {
      if (event.target instanceof HTMLElement && !event.target.closest("[data-treatment-modal-panel]")) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.root.classList.contains("hidden")) {
        closeModal();
      }
    });

    for (const link of treatmentLinks) {
      link.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const title = getTreatmentTitle(link);
        const treatmentMap = await treatmentMapPromise;
        const description = treatmentMap.get(title) ?? DEFAULT_DESCRIPTION;

        openModal(title, description, link);
      });
    }
  }
}

function getTreatmentTitle(link) {
  const titleElement = link.querySelector("span");
  const rawTitle = titleElement ? titleElement.textContent : link.textContent;
  return normalizeWhitespace(rawTitle);
}

function normalizeWhitespace(value) {
  if (!value) return "";
  return value.replace(/\s+/g, " ").trim();
}

async function loadTreatmentMap() {
  try {
    const response = await fetch(TREATMENT_DATA_URL);
    if (!response.ok) {
      return new Map();
    }

    const payload = await response.json();
    const treatments = Array.isArray(payload?.treatments) ? payload.treatments : [];
    const map = new Map();

    for (const treatment of treatments) {
      const title = normalizeWhitespace(treatment?.title);
      const description = normalizeWhitespace(treatment?.description);
      if (!title || !description) continue;
      map.set(title, description);
    }

    return map;
  } catch {
    return new Map();
  }
}

function createTreatmentModal() {
  const root = document.createElement("div");
  root.className = "fixed inset-0 z-[80] hidden";
  root.setAttribute("aria-hidden", "true");
  root.innerHTML = `
    <div data-treatment-modal-backdrop class="absolute inset-0 bg-black/50 opacity-0 backdrop-blur-[1px] transition-opacity duration-200 ease-out"></div>
    <div class="relative z-10 flex min-h-full items-end justify-center p-4 sm:items-center sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="treatment-modal-title"
        aria-describedby="treatment-modal-description"
        data-treatment-modal-panel
        class="w-full max-w-xl translate-y-3 rounded-[10px] border border-[#edd6c8] bg-[#fffaf7] p-6 opacity-0 shadow-2xl transition-all duration-200 ease-out sm:scale-[0.98] sm:p-8"
      >
        <div class="flex items-start justify-between gap-4">
          <h3 id="treatment-modal-title" class="text-2xl font-semibold text-neutral-900 font-display"></h3>
          <button
            type="button"
            data-treatment-modal-close
            class="inline-flex h-10 w-10 items-center -mt-3 -me-3 justify-center text-neutral-700 transition hover:bg-[#edd6c8] hover:text-neutral-900"
            aria-label="Sluit venster"
          >
            <span aria-hidden="true" class="text-xl leading-none">&times;</span>
          </button>
        </div>
        <p id="treatment-modal-description" class="mt-4 text-sm leading-7 text-neutral-700 sm:text-base"></p>
        <div class="mt-6">
          <a
            href="#afspraak"
            data-treatment-modal-book
            class="inline-flex items-center justify-center rounded-[5px] bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700"
          >
            Ga naar afspraak
          </a>
        </div>
      </div>
    </div>
  `;

  return {
    root,
    backdrop: root.querySelector("[data-treatment-modal-backdrop]"),
    panel: root.querySelector("[data-treatment-modal-panel]"),
    closeButton: root.querySelector("[data-treatment-modal-close]"),
    bookingLink: root.querySelector("[data-treatment-modal-book]"),
    title: root.querySelector("#treatment-modal-title"),
    description: root.querySelector("#treatment-modal-description"),
  };
}
