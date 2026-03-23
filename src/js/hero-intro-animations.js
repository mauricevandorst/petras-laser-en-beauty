(() => {
  const hero = document.querySelector("[data-hero]");
  if (!hero) return;

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) return;

  const supportsElementAnimation =
    typeof Element !== "undefined" && typeof Element.prototype.animate === "function";

  const heroBackground = hero.querySelector("[data-hero-bg]");
  const heroOverlay = hero.querySelector("[data-hero-overlay]");
  const heroContent = hero.querySelector("[data-hero-content]");
  const heroTitle = hero.querySelector("[data-hero-title]");
  const heroTitleAccent = hero.querySelector("[data-hero-title-accent]");
  const heroCopy = hero.querySelector("[data-hero-copy]");
  const heroCtaWrap = hero.querySelector("[data-hero-cta-wrap]");
  const heroCta = hero.querySelector("[data-hero-cta]");
  const heroTrust = hero.querySelector("[data-hero-trust]");
  const heroAvatars = hero.querySelectorAll("[data-hero-avatar]");

  const setStyles = (element, styles) => {
    if (!element) return;
    Object.entries(styles).forEach(([property, value]) => {
      element.style[property] = value;
    });
  };

  const setInitialState = () => {
    setStyles(heroBackground, { opacity: "0.2", transform: "scale(1.08)" });
    setStyles(heroOverlay, { opacity: "0" });
    setStyles(heroContent, { opacity: "0", transform: "translateY(32px)" });
    setStyles(heroTitle, { opacity: "0", transform: "translateY(30px)", filter: "blur(7px)" });
    setStyles(heroTitleAccent, { opacity: "0.2", transform: "translateY(8px)" });
    setStyles(heroCopy, { opacity: "0", transform: "translateY(16px)" });
    setStyles(heroCtaWrap, { opacity: "0", transform: "translateY(14px)" });
    setStyles(heroCta, { opacity: "0", transform: "translateY(8px) scale(0.96)" });
    setStyles(heroTrust, { opacity: "0", transform: "translateY(12px)" });

    heroAvatars.forEach(avatar => {
      setStyles(avatar, { opacity: "0", transform: "translateX(-8px) scale(0.9)" });
    });
  };

  const setFinalState = () => {
    setStyles(heroBackground, { opacity: "1", transform: "scale(1)" });
    setStyles(heroOverlay, { opacity: "1" });
    setStyles(heroContent, { opacity: "1", transform: "translateY(0)" });
    setStyles(heroTitle, { opacity: "1", transform: "translateY(0)", filter: "blur(0px)" });
    setStyles(heroTitleAccent, { opacity: "1", transform: "translateY(0)" });
    setStyles(heroCopy, { opacity: "1", transform: "translateY(0)" });
    setStyles(heroCtaWrap, { opacity: "1", transform: "translateY(0)" });
    setStyles(heroCta, { opacity: "1", transform: "translateY(0) scale(1)" });
    setStyles(heroTrust, { opacity: "1", transform: "translateY(0)" });

    heroAvatars.forEach(avatar => {
      setStyles(avatar, { opacity: "1", transform: "translateX(0) scale(1)" });
    });
  };

  const addWillChange = element => {
    if (!element) return;
    element.style.willChange = "opacity, transform, filter";
  };

  const clearWillChange = element => {
    if (!element) return;
    element.style.willChange = "";
  };

  const animateElement = (element, keyframes, options) => {
    if (!element) return Promise.resolve();

    if (!supportsElementAnimation) {
      const lastFrame = keyframes[keyframes.length - 1];
      Object.keys(lastFrame).forEach(key => {
        if (key === "offset" || key === "easing" || key === "composite") return;
        element.style[key] = lastFrame[key];
      });
      return Promise.resolve();
    }

    const animation = element.animate(keyframes, {
      fill: "both",
      ...options,
    });

    return animation.finished.catch(() => undefined);
  };

  let hasPlayed = false;

  const runIntro = () => {
    if (hasPlayed) return;
    hasPlayed = true;

    [
      heroBackground,
      heroOverlay,
      heroContent,
      heroTitle,
      heroTitleAccent,
      heroCopy,
      heroCtaWrap,
      heroCta,
      heroTrust,
      ...heroAvatars,
    ].forEach(addWillChange);

    const animations = [
      animateElement(
        heroBackground,
        [
          { opacity: 0.2, transform: "scale(1.08)" },
          { opacity: 1, transform: "scale(1)" },
        ],
        { duration: 1400, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" }
      ),
      animateElement(
        heroOverlay,
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 900, easing: "ease-out", delay: 120 }
      ),
      animateElement(
        heroContent,
        [
          { opacity: 0, transform: "translateY(32px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 900, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)", delay: 140 }
      ),
      animateElement(
        heroTitle,
        [
          { opacity: 0, transform: "translateY(30px)", filter: "blur(7px)" },
          { opacity: 1, transform: "translateY(0)", filter: "blur(0px)" },
        ],
        { duration: 950, easing: "cubic-bezier(0.2, 0.75, 0.2, 1)", delay: 220 }
      ),
      animateElement(
        heroTitleAccent,
        [
          { opacity: 0.2, transform: "translateY(8px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 700, easing: "ease-out", delay: 430 }
      ),
      animateElement(
        heroCopy,
        [
          { opacity: 0, transform: "translateY(16px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 720, easing: "ease-out", delay: 510 }
      ),
      animateElement(
        heroCtaWrap,
        [
          { opacity: 0, transform: "translateY(14px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 620, easing: "ease-out", delay: 600 }
      ),
      animateElement(
        heroCta,
        [
          { opacity: 0, transform: "translateY(8px) scale(0.96)" },
          { opacity: 1, transform: "translateY(0) scale(1)" },
        ],
        { duration: 560, easing: "cubic-bezier(0.18, 0.89, 0.32, 1.28)", delay: 620 }
      ),
      animateElement(
        heroTrust,
        [
          { opacity: 0, transform: "translateY(12px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 620, easing: "ease-out", delay: 700 }
      ),
      ...Array.from(heroAvatars).map((avatar, index) =>
        animateElement(
          avatar,
          [
            { opacity: 0, transform: "translateX(-8px) scale(0.9)" },
            { opacity: 1, transform: "translateX(0) scale(1)" },
          ],
          {
            duration: 360,
            easing: "cubic-bezier(0.33, 1, 0.68, 1)",
            delay: 760 + index * 70,
          }
        )
      ),
    ];

    Promise.all(animations).finally(() => {
      setFinalState();
      [
        heroBackground,
        heroOverlay,
        heroContent,
        heroTitle,
        heroTitleAccent,
        heroCopy,
        heroCtaWrap,
        heroCta,
        heroTrust,
        ...heroAvatars,
      ].forEach(clearWillChange);
    });
  };

  setInitialState();

  const startIntro = () => window.requestAnimationFrame(runIntro);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startIntro, { once: true });
  } else {
    startIntro();
  }
})();
