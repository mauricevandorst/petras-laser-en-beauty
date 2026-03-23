const initialViewportHeight =
  (window.initialViewportHeight ||
    window.visualViewport?.height ||
    window.innerHeight) * 0.95;

if (Number.isFinite(initialViewportHeight) && initialViewportHeight > 0) {
  document.documentElement.style.setProperty(
    "--initial-dvh",
    `${initialViewportHeight}px`
  );
}
