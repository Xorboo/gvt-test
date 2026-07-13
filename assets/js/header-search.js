(function () {
  const box = document.getElementById("header-search");
  if (!box) return;
  const toggle = document.getElementById("header-search-toggle");
  const input = document.getElementById("header-search-input");
  const list = document.getElementById("header-search-results");
  let fuse;

  async function loadIndex() {
    if (fuse) return;
    const data = await (await fetch(box.dataset.index)).json();
    fuse = new Fuse(data, JSON.parse(box.dataset.fuseopts));
  }

  function close() {
    box.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    list.innerHTML = "";
    input.value = "";
  }

  toggle.addEventListener("click", (e) => {
    e.preventDefault();
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
    for (const { item } of fuse.search(q).slice(0, 8)) {
      const a = document.createElement("a");
      a.href = item.permalink;
      a.textContent = item.title;
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
