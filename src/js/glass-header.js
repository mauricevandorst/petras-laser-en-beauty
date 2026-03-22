const glassHeaders = document.querySelectorAll("[data-nav-glass]");

if (glassHeaders.length > 0) {
  const glassClasses = [
    "bg-white/70",
    "supports-[backdrop-filter]:bg-white/50",
    "backdrop-blur-md",
    "shadow-md",
  ];

  const updateGlass = () => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const isScrolled = window.scrollY > 8;
    const overlayOpen = document.body.classList.contains("nav-overlay-open");

    glassHeaders.forEach((header) => {
      const enableGlass = isMobile && isScrolled && !overlayOpen;
      glassClasses.forEach((className) => {
        header.classList.toggle(className, enableGlass);
      });
    });
  };

  updateGlass();
  window.addEventListener("scroll", updateGlass, { passive: true });
  window.addEventListener("resize", updateGlass);
  window.addEventListener("nav:overlay", updateGlass);
}
