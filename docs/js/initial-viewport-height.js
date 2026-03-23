const initialViewportHeight = window.innerHeight;

if (Number.isFinite(initialViewportHeight) && initialViewportHeight > 0) {
  document.documentElement.style.setProperty(
    "--initial-dvh",
    `${initialViewportHeight}px`
  );
}
