const navRoots = document.querySelectorAll("[data-nav-root]");

navRoots.forEach((root) => {
  const navToggle = root.querySelector("[data-nav-toggle]");
  const navOverlay = root.querySelector("[data-nav-overlay]");
  const navPanel = root.querySelector("[data-nav-panel]");
  const navIcons = navToggle ? navToggle.querySelectorAll("[data-nav-icon]") : [];

  if (!navToggle || !navOverlay || !navPanel) {
    return;
  }

  let isOpen = false;
  let lastFocused = null;
  let closeTimer = null;

  const focusableSelector = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

  const setScrollLock = (locked) => {
    document.body.classList.toggle("overflow-hidden", locked);
  };

  const announceNavState = (open) => {
    document.body.classList.toggle("nav-overlay-open", open);
    window.dispatchEvent(new CustomEvent("nav:overlay", { detail: { open } }));
  };

  const setIconState = (open) => {
    if (!navIcons || navIcons.length < 2) {
      return;
    }

    const [openIcon, closeIcon] = navIcons;
    openIcon.classList.toggle("opacity-0", open);
    openIcon.classList.toggle("scale-95", open);
    closeIcon.classList.toggle("opacity-0", !open);
    closeIcon.classList.toggle("scale-95", !open);
  };

  const openMenu = () => {
    if (isOpen) {
      return;
    }

    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }

    isOpen = true;
    lastFocused = document.activeElement;
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Sluit menu");
    navOverlay.hidden = false;
    navOverlay.setAttribute("aria-hidden", "false");
    navOverlay.classList.remove("pointer-events-none");
    setIconState(true);
    announceNavState(true);

    requestAnimationFrame(() => {
      navOverlay.classList.remove("opacity-0");
      navOverlay.classList.add("opacity-100");
      navPanel.classList.remove("-translate-x-full");
      navPanel.classList.add("translate-x-0");
    });

    setScrollLock(true);

    const focusables = navOverlay.querySelectorAll(focusableSelector);
    if (focusables.length > 0) {
      focusables[0].focus();
    }
  };

  const closeMenu = () => {
    if (!isOpen) {
      return;
    }

    isOpen = false;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    navOverlay.classList.remove("opacity-100");
    navOverlay.classList.add("opacity-0");
    navPanel.classList.remove("translate-x-0");
    navPanel.classList.add("-translate-x-full");
    setIconState(false);
    announceNavState(false);
    setScrollLock(false);

    if (closeTimer) {
      clearTimeout(closeTimer);
    }

    closeTimer = window.setTimeout(() => {
      navOverlay.hidden = true;
      navOverlay.setAttribute("aria-hidden", "true");
      navOverlay.classList.add("pointer-events-none");
      closeTimer = null;
    }, 220);

    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  };

  navToggle.addEventListener("click", () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navOverlay.addEventListener("click", (event) => {
    if (event.target.closest("[data-nav-close]")) {
      closeMenu();
    }
  });

  navOverlay.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) {
      closeMenu();
    }
  });
});
