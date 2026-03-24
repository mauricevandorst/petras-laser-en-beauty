const toggleButtons = document.querySelectorAll("[data-treatment-toggle-button]");

const expandedText = "Bekijk minder";
const collapsedText = "Bekijk meer";
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const collapsedOffsetY = "-4px";
const expandDurationMs = 240;
const fadeDurationMs = 180;

function setCollapsedState(target) {
  target.style.display = "none";
  target.style.height = "0px";
  target.style.opacity = "0";
  target.style.transform = `translateY(${collapsedOffsetY})`;
  target.style.pointerEvents = "none";
}

function setExpandedState(target) {
  target.style.display = "block";
  target.style.height = "auto";
  target.style.opacity = "1";
  target.style.transform = "translateY(0)";
  target.style.pointerEvents = "auto";
}

function animateExpand(target) {
  target.style.display = "block";
  target.style.height = "0px";
  target.style.opacity = "0";
  target.style.transform = `translateY(${collapsedOffsetY})`;
  target.style.pointerEvents = "none";

  // Force reflow to start from collapsed visual state.
  void target.offsetHeight;

  const endHeight = target.scrollHeight;

  target.style.willChange = "height, opacity, transform";
  target.style.transition = `height ${expandDurationMs}ms ease, opacity ${fadeDurationMs}ms ease, transform ${expandDurationMs}ms ease`;

  requestAnimationFrame(() => {
    target.style.height = `${endHeight}px`;
    target.style.opacity = "1";
    target.style.transform = "translateY(0)";
    target.style.pointerEvents = "auto";
  });

  window.setTimeout(() => {
    target.style.height = "auto";
    target.style.willChange = "";
  }, expandDurationMs + 20);
}

function animateCollapse(target) {
  const startHeight = target.scrollHeight;

  target.style.willChange = "height, opacity, transform";
  target.style.transition = `height ${expandDurationMs}ms ease, opacity ${fadeDurationMs}ms ease, transform ${expandDurationMs}ms ease`;
  target.style.height = `${startHeight}px`;

  // Force reflow so the browser picks up the start height before collapsing.
  void target.offsetHeight;

  target.style.height = "0px";
  target.style.opacity = "0";
  target.style.transform = `translateY(${collapsedOffsetY})`;
  target.style.pointerEvents = "none";

  window.setTimeout(() => {
    target.style.display = "none";
    target.style.willChange = "";
  }, expandDurationMs + 20);
}

for (const button of toggleButtons) {
  const targetId = button.getAttribute("data-treatment-target");
  if (!targetId) continue;

  const target = document.getElementById(targetId);
  if (!target) continue;

  const label = button.querySelector("[data-treatment-toggle-label]");
  const sign = button.querySelector("[data-treatment-toggle-sign]");
  let isAnimating = false;

  // Start hidden but animatable (instead of display: none).
  target.classList.remove("hidden");
  target.style.overflow = "hidden";

  if (prefersReducedMotion) {
    setCollapsedState(target);
  } else {
    setCollapsedState(target);
  }

  button.addEventListener("click", () => {
    if (isAnimating) return;

    const isExpanded = button.getAttribute("aria-expanded") === "true";
    const nextExpanded = !isExpanded;

    button.setAttribute("aria-expanded", String(nextExpanded));

    if (label) {
      label.textContent = nextExpanded ? expandedText : collapsedText;
    }

    if (sign) {
      sign.textContent = nextExpanded ? "-" : "+";
    }

    if (prefersReducedMotion) {
      if (nextExpanded) {
        setExpandedState(target);
      } else {
        setCollapsedState(target);
      }
      return;
    }

    isAnimating = true;

    if (nextExpanded) {
      animateExpand(target);
    } else {
      animateCollapse(target);
    }

    window.setTimeout(() => {
      isAnimating = false;
    }, expandDurationMs + 40);
  });
}
