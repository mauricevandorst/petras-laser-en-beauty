// ...existing code...
(function () {
  const MARQUEE_BASE_DURATION_SECONDS = 20;
  const MARQUEE_BASE_VIEWPORT_WIDTH = 390;

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function readyMarquee() {
    const marquee = document.querySelector('.marquee');
    if (!marquee) return;

    const trackWrapper = marquee.querySelector('.animate-marquee');
    if (!trackWrapper) return;

    const imgs = marquee.querySelectorAll('img');
    const imgPromises = Array.from(imgs).map(img => new Promise(res => {
      if (img.complete) return res();
      img.addEventListener('load', res, { once: true });
      img.addEventListener('error', res, { once: true });
    }));

    Promise.all(imgPromises).then(() => {
      const lists = marquee.querySelectorAll('ul');
      if (lists.length >= 2) {
        const [trackA, trackB] = lists;
        const viewportWidth = marquee.clientWidth;

        if (viewportWidth > 0) {
          // Ensure track A is at least as wide as the viewport.
          const originalItems = Array.from(trackA.children);
          let safety = 0;
          while (trackA.scrollWidth < viewportWidth && safety < 10) {
            originalItems.forEach(item => {
              trackA.appendChild(item.cloneNode(true));
            });
            safety += 1;
          }
        }

        // Mirror track A into track B so both tracks match exactly.
        trackB.innerHTML = trackA.innerHTML;
        trackB.setAttribute('aria-hidden', 'true');

        // Keep marquee speed consistent across screen sizes by scaling
        // duration with the actual distance traveled (track A width).
        // Tweak this to make the marquee faster/slower.
        // Higher seconds = slower movement.
        const pixelsPerSecond = MARQUEE_BASE_VIEWPORT_WIDTH / MARQUEE_BASE_DURATION_SECONDS;
        const distance = trackA.scrollWidth;
        if (distance > 0) {
          const duration = distance / pixelsPerSecond;
          trackWrapper.style.animationDuration = `${duration.toFixed(2)}s`;
        }
      }

      marquee.classList.add('is-ready');
    });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    readyMarquee();
  } else {
    document.addEventListener('DOMContentLoaded', readyMarquee);
  }
})();
