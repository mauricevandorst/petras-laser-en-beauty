(() => {
  const imageWrap = document.querySelector("[data-about-image-wrap]");
  const image = document.querySelector("[data-about-image]");
  if (!imageWrap || !image) return;

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) return;
  if (!("IntersectionObserver" in window)) return;

  const supportsElementAnimation =
    typeof Element !== "undefined" && typeof Element.prototype.animate === "function";

  imageWrap.style.opacity = "0";
  imageWrap.style.transform = "translateY(22px)";
  image.style.transform = "scale(1.04)";
  image.style.filter = "blur(6px)";
  imageWrap.style.willChange = "opacity, transform";
  image.style.willChange = "transform, filter";

  let hasRevealed = false;

  const finish = () => {
    imageWrap.style.opacity = "1";
    imageWrap.style.transform = "translateY(0)";
    image.style.transform = "scale(1)";
    image.style.filter = "blur(0px)";
    imageWrap.style.willChange = "";
    image.style.willChange = "";
  };

  const reveal = () => {
    if (hasRevealed) return;
    hasRevealed = true;

    if (!supportsElementAnimation) {
      finish();
      return;
    }

    const wrapAnimation = imageWrap.animate(
      [
        { opacity: 0, transform: "translateY(22px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      {
        duration: 760,
        easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        fill: "both",
      }
    );

    const imageAnimation = image.animate(
      [
        { transform: "scale(1.04)", filter: "blur(6px)" },
        { transform: "scale(1)", filter: "blur(0px)" },
      ],
      {
        duration: 940,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        delay: 80,
        fill: "both",
      }
    );

    Promise.all([
      wrapAnimation.finished.catch(() => undefined),
      imageAnimation.finished.catch(() => undefined),
    ]).finally(finish);
  };

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        reveal();
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.28,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  observer.observe(imageWrap);
})();
