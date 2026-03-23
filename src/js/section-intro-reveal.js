(function () {
  const intros = document.querySelectorAll('[data-section-intro]');
  if (!intros.length) return;

  const reducedMotionQuery =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');

  const revealIntro = intro => {
    intro.dataset.introState = 'visible';
  };

  if (reducedMotionQuery && reducedMotionQuery.matches) {
    intros.forEach(revealIntro);
    return;
  }

  if (!('IntersectionObserver' in window)) {
    intros.forEach(revealIntro);
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        revealIntro(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -8% 0px',
    }
  );

  intros.forEach(intro => observer.observe(intro));
})();
