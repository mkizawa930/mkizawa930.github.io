(() => {
  const searchInput = document.querySelector("[data-blog-search]");
  const cards = Array.from(document.querySelectorAll("[data-post-card]"));

  if (!searchInput || cards.length === 0) return;

  const tagButtons = Array.from(document.querySelectorAll("[data-tag-filter]"));
  const clearButton = document.querySelector("[data-filter-clear]");
  const resultCount = document.querySelector("[data-result-count]");
  const emptyState = document.querySelector("[data-empty-state]");

  const normalize = (value) =>
    String(value ?? "")
      .normalize("NFKC")
      .toLocaleLowerCase("ja")
      .trim();

  const readUrlState = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      query: params.get("q") ?? "",
      tag: params.get("tag") ?? "",
    };
  };

  let selectedTag = "";

  const updateUrl = (query, tag) => {
    const url = new URL(window.location.href);

    if (query) url.searchParams.set("q", query);
    else url.searchParams.delete("q");

    if (tag) url.searchParams.set("tag", tag);
    else url.searchParams.delete("tag");

    window.history.replaceState({}, "", url);
  };

  const updateTagButtons = () => {
    const normalizedSelectedTag = normalize(selectedTag);

    tagButtons.forEach((button) => {
      const isSelected = normalize(button.dataset.tagFilter) === normalizedSelectedTag;
      button.setAttribute("aria-pressed", String(isSelected));
    });
  };

  const applyFilters = ({ updateHistory = true } = {}) => {
    const rawQuery = searchInput.value.trim();
    const query = normalize(rawQuery);
    const normalizedTag = normalize(selectedTag);
    let visibleCount = 0;

    cards.forEach((card) => {
      const searchableText = normalize(card.dataset.search);
      const tags = String(card.dataset.postTags ?? "")
        .split("|")
        .map(normalize)
        .filter(Boolean);
      const matchesQuery = !query || searchableText.includes(query);
      const matchesTag = !normalizedTag || tags.includes(normalizedTag);
      const isVisible = matchesQuery && matchesTag;

      card.hidden = !isVisible;
      card.style.display = isVisible ? "" : "none";
      if (isVisible) visibleCount += 1;
    });

    if (resultCount) resultCount.textContent = String(visibleCount);
    if (emptyState) emptyState.hidden = visibleCount !== 0;
    if (clearButton) clearButton.disabled = !rawQuery && !selectedTag;

    updateTagButtons();
    if (updateHistory) updateUrl(rawQuery, selectedTag);
  };

  const restoreUrlState = () => {
    const state = readUrlState();
    searchInput.value = state.query;
    selectedTag = state.tag;
    applyFilters({ updateHistory: false });
  };

  searchInput.addEventListener("input", () => applyFilters());

  tagButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedTag = button.dataset.tagFilter ?? "";
      applyFilters();
    });
  });

  clearButton?.addEventListener("click", () => {
    searchInput.value = "";
    selectedTag = "";
    applyFilters();
    searchInput.focus();
  });

  window.addEventListener("popstate", restoreUrlState);
  restoreUrlState();
})();
