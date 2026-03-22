const prijzenMount = document.querySelector("[data-prijzen]");

if (prijzenMount) {
  fetch("/data/prijzen.json")
    .then((response) => response.json())
    .then((data) => {
      // Gebruik textContent om XSS te voorkomen en de data veilig te renderen.
      prijzenMount.innerHTML = "";

      data.groepen.forEach((groep) => {
        const section = document.createElement("section");
        section.className = "rounded-[5px] border border-neutral-200 bg-white p-6 shadow-sm";

        const title = document.createElement("h3");
        title.className = "text-lg font-semibold";
        title.textContent = groep.titel;
        section.appendChild(title);

        const list = document.createElement("ul");
        list.className = "mt-4 space-y-3 text-sm text-neutral-700";

        groep.items.forEach((item) => {
          const li = document.createElement("li");
          const name = document.createElement("span");
          name.className = "font-medium";
          name.textContent = item.naam;

          const price = document.createElement("span");
          price.className = "block text-neutral-500";
          price.textContent = item.prijs;

          li.appendChild(name);
          li.appendChild(price);

          if (item.toelichting) {
            const note = document.createElement("span");
            note.className = "block text-xs text-neutral-500";
            note.textContent = item.toelichting;
            li.appendChild(note);
          }

          list.appendChild(li);
        });

        if (groep.addons && groep.addons.length > 0) {
          const addonsTitle = document.createElement("p");
          addonsTitle.className = "mt-4 text-xs uppercase tracking-[0.2em] text-neutral-400";
          addonsTitle.textContent = "Optionele add-ons";
          section.appendChild(addonsTitle);

          const addons = document.createElement("ul");
          addons.className = "mt-2 space-y-1 text-xs text-neutral-500";

          groep.addons.forEach((addon) => {
            const addonItem = document.createElement("li");
            addonItem.textContent = addon;
            addons.appendChild(addonItem);
          });

          section.appendChild(addons);
        }

        section.appendChild(list);
        prijzenMount.appendChild(section);
      });

      const meta = document.querySelector("[data-prijzen-meta]");
      if (meta && data.labels?.indicatief) {
        meta.textContent = data.labels.indicatief;
      }
    })
    .catch(() => {
      // Bij fouten laten we de statische fallback in de HTML staan.
    });
}
