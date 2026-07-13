(function () {
  const box = document.getElementById("header-search");
  if (!box) return;
  const toggle = document.getElementById("header-search-toggle");
  const input = document.getElementById("header-search-input");
  const list = document.getElementById("header-search-results");
  let fuse;

  // fold diacritics so e.g. "fabuly" matches "fabuły" (ł doesn't NFD-decompose)
  const fold = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ł/g, "l").replace(/Ł/g, "L");

  async function loadIndex() {
    if (fuse) return;
    const data = await (await fetch(box.dataset.index)).json();
    const opts = JSON.parse(box.dataset.fuseopts);
    opts.getFn = (obj, path) => {
      const value = Fuse.config.getFn(obj, path);
      return typeof value === "string" ? fold(value) : value;
    };
    fuse = new Fuse(data, opts);
  }

  function close() {
    box.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    list.innerHTML = "";
    input.value = "";
  }

  toggle.addEventListener("click", () => {
    if (box.classList.contains("open")) {
      close();
      return;
    }
    box.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    input.focus();
    loadIndex();
  });

  input.addEventListener("input", () => {
    list.innerHTML = "";
    const q = input.value.trim();
    if (!fuse || q.length < 2) return;
    for (const { item } of fuse.search(fold(q)).slice(0, 8)) {
      const a = document.createElement("a");
      a.href = item.permalink;
      const line = document.createElement("div");
      if (item.event) {
        const ev = document.createElement("span");
        ev.className = "result-event";
        ev.textContent = item.event;
        line.appendChild(ev);
      }
      line.appendChild(document.createTextNode(item.title));
      a.appendChild(line);
      if (item.speaker) {
        const sp = document.createElement("div");
        sp.className = "result-speaker";
        sp.textContent = item.speaker;
        a.appendChild(sp);
      }
      const li = document.createElement("li");
      li.appendChild(a);
      list.appendChild(li);
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
    if (e.key === "Enter") {
      const first = list.querySelector("a");
      if (first) location.href = first.href;
    }
  });

  document.addEventListener("click", (e) => {
    if (!box.contains(e.target)) close();
  });
})();
