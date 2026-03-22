const isSamePageHashLink = (link) => {
  const href = link.getAttribute("href");
  if (!href) return null;

  if (href.startsWith("#")) {
    return href;
  }

  try {
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return null;
    if (url.pathname !== window.location.pathname) return null;
    return url.hash || null;
  } catch {
    return null;
  }
};

const findAnchorTarget = (hash) => {
  if (!hash || hash === "#") return null;
  const id = decodeURIComponent(hash.slice(1));
  if (!id) return null;

  const byId = document.getElementById(id);
  if (byId) return { target: byId, hash: `#${id}` };

  const byName = document.querySelector(`[name="${CSS.escape(id)}"]`);
  if (byName) return { target: byName, hash: `#${id}` };

  return null;
};

document.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;

  const hash = isSamePageHashLink(link);
  if (!hash) return;

  const result = findAnchorTarget(hash);
  if (!result) return;

  event.preventDefault();
  result.target.scrollIntoView({ behavior: "smooth", block: "start" });
  history.pushState(null, "", result.hash);
});
