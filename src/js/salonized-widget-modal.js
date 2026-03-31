const triggers = document.querySelectorAll("[data-salonized-widget-trigger]");
const modal = document.querySelector("[data-salonized-widget-modal]");

if (triggers.length > 0 && modal) {
  const iframe = modal.querySelector("[data-salonized-widget-iframe]");
  const loader = modal.querySelector("[data-salonized-widget-loader]");
  const closeControls = modal.querySelectorAll("[data-salonized-widget-close]");
  const closeButton = modal.querySelector("button[data-salonized-widget-close]");
  const firstTrigger = triggers[0];
  let lastFocusedElement = null;
  let iframeLoaded = false;

  const showLoader = () => {
    if (loader) loader.classList.remove("hidden");
    if (iframe) iframe.classList.add("hidden");
  };

  const hideLoader = () => {
    if (loader) loader.classList.add("hidden");
    if (iframe) iframe.classList.remove("hidden");
  };

  let loadTimeout = null;

  if (iframe) {
    iframe.addEventListener("load", () => {
      if (iframe.getAttribute("src")) {
        if (loadTimeout) clearTimeout(loadTimeout);
        iframeLoaded = true;
        hideLoader();
      }
    });

    iframe.addEventListener("error", () => {
      if (loadTimeout) clearTimeout(loadTimeout);
      console.error("Salonized iframe failed to load");
      hideLoader();
    });
  }

  const setExpanded = (expanded) => {
    for (const trigger of triggers) {
      trigger.setAttribute("aria-expanded", expanded ? "true" : "false");
    }
  };

  const openModal = (triggerElement) => {
    lastFocusedElement = triggerElement ?? document.activeElement;

    if (iframe && iframe.dataset.src) {
      if (!iframe.getAttribute("src")) {
        showLoader();
        iframe.setAttribute("src", iframe.dataset.src);
        
        // Fallback timeout - hide loader after 8 seconds even if load event doesn't fire
        if (loadTimeout) clearTimeout(loadTimeout);
        loadTimeout = setTimeout(() => {
          hideLoader();
        }, 8000);
      } else if (iframeLoaded) {
        hideLoader();
      } else {
        showLoader();
        
        // Set fallback timeout for reload attempts too
        if (loadTimeout) clearTimeout(loadTimeout);
        loadTimeout = setTimeout(() => {
          hideLoader();
        }, 8000);
      }
    }

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("overflow-hidden");
    setExpanded(true);

    if (closeButton) {
      closeButton.focus();
    }
  };

  const closeModal = () => {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("overflow-hidden");
    setExpanded(false);

    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    } else {
      firstTrigger.focus();
    }
  };

  setExpanded(false);

  for (const trigger of triggers) {
    trigger.addEventListener("click", (event) => {
      if (trigger instanceof HTMLAnchorElement) {
        event.preventDefault();
      }

      openModal(trigger);
    });
  }

  for (const control of closeControls) {
    control.addEventListener("click", closeModal);
  }

  modal.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
}
