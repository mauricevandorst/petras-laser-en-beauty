const tabSets = document.querySelectorAll("[data-tabs]");

tabSets.forEach((tabSet) => {
  const tabs = tabSet.querySelectorAll("[data-tab]");
  const panels = tabSet.querySelectorAll("[data-tab-panel]");

  function activateTab(targetId) {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.tab === targetId;
      tab.setAttribute("aria-selected", String(isActive));
      tab.classList.toggle("bg-neutral-900", isActive);
      tab.classList.toggle("text-white", isActive);
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.tabPanel === targetId;
      panel.toggleAttribute("hidden", !isActive);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activateTab(tab.dataset.tab);
    });
  });

  if (tabs.length > 0) {
    activateTab(tabs[0].dataset.tab);
  }
});
