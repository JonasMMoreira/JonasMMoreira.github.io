const catalogData = window.PRICING_DATA;

if (catalogData) {
  const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: catalogData.meta?.currency || "BRL",
  });

  const accentInsensitive = (value) =>
    (value || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const formatMoney = (value) =>
    typeof value === "number" ? currencyFormatter.format(value) : value;

  const formatPriceLine = (item) => {
    if (typeof item.jmPrice === "number") {
      return item.unit ? `${formatMoney(item.jmPrice)} / ${item.unit}` : formatMoney(item.jmPrice);
    }

    return item.jmPrice || "Sob consulta";
  };

  const formatReferenceLine = (item) => {
    if (typeof item.referencePrice === "number") {
      return item.unit
        ? `Referência: ${formatMoney(item.referencePrice)} / ${item.unit}`
        : `Referência: ${formatMoney(item.referencePrice)}`;
    }

    return item.referencePrice ? `Referência: ${item.referencePrice}` : "Sem referência direta";
  };

  const buildWhatsappLink = (item) => {
    const message = [
      "Olá, JM Edificações! Tenho interesse em um serviço da tabela de preços.",
      "",
      `Serviço: ${item.description}`,
      `Área: ${item.sheet}`,
      item.group ? `Categoria: ${item.group}` : null,
      `Preço informado: ${formatPriceLine(item)}`,
      "",
      "Gostaria de confirmar os detalhes e entender o próximo passo.",
    ]
      .filter(Boolean)
      .join("\n");

    return `https://wa.me/5579991373093?text=${encodeURIComponent(message)}`;
  };

  const modeLabels = {
    fixed: "Preço fechado",
    consult: "Sob consulta",
    formula: "Regra especial",
  };

  const comparisonLabels = {
    below: "Abaixo da referência",
    equal: "Na referência",
    above: "Acima da referência",
    none: "Sem comparativo",
  };

  const sorters = {
    relevancia: (a, b) => {
      const aPrice = typeof a.jmPrice === "number" ? a.jmPrice : Number.POSITIVE_INFINITY;
      const bPrice = typeof b.jmPrice === "number" ? b.jmPrice : Number.POSITIVE_INFINITY;
      return aPrice - bPrice || a.description.localeCompare(b.description, "pt-BR");
    },
    maior: (a, b) => {
      const aPrice = typeof a.jmPrice === "number" ? a.jmPrice : Number.NEGATIVE_INFINITY;
      const bPrice = typeof b.jmPrice === "number" ? b.jmPrice : Number.NEGATIVE_INFINITY;
      return bPrice - aPrice || a.description.localeCompare(b.description, "pt-BR");
    },
    az: (a, b) => a.description.localeCompare(b.description, "pt-BR"),
    area: (a, b) =>
      a.sheet.localeCompare(b.sheet, "pt-BR") ||
      (a.group || "").localeCompare(b.group || "", "pt-BR") ||
      a.description.localeCompare(b.description, "pt-BR"),
  };

  const page = {
    search: document.querySelector("[data-pricing-search]"),
    area: document.querySelector("[data-pricing-area]"),
    category: document.querySelector("[data-pricing-category]"),
    mode: document.querySelector("[data-pricing-mode]"),
    comparison: document.querySelector("[data-pricing-comparison]"),
    sort: document.querySelector("[data-pricing-sort]"),
    clear: document.querySelector("[data-pricing-clear]"),
    chips: document.querySelector("[data-pricing-chips]"),
    count: document.querySelector("[data-pricing-count]"),
    hint: document.querySelector("[data-pricing-hint]"),
    results: document.querySelector("[data-pricing-results]"),
    empty: document.querySelector("[data-pricing-empty]"),
    lastUpdated: document.querySelector("[data-pricing-updated]"),
    statTotals: document.querySelectorAll("[data-stat-total]"),
    statAreas: document.querySelector("[data-stat-areas]"),
    statMin: document.querySelector("[data-stat-min]"),
    statConsult: document.querySelector("[data-stat-consult]"),
  };

  if (
    page.search &&
    page.area &&
    page.category &&
    page.mode &&
    page.comparison &&
    page.sort &&
    page.clear &&
    page.chips &&
    page.results
  ) {
    const allItems = catalogData.items.map((item) => ({
      ...item,
      searchable: accentInsensitive(item.searchIndex),
    }));

    const urlParams = new URLSearchParams(window.location.search);
    const state = {
      query: urlParams.get("busca") || "",
      area: urlParams.get("area") || "all",
      category: urlParams.get("categoria") || "all",
      mode: urlParams.get("modo") || "all",
      comparison: urlParams.get("comparacao") || "all",
      sort: urlParams.get("ordem") || "relevancia",
    };

    const syncUrl = () => {
      const params = new URLSearchParams();
      if (state.query) params.set("busca", state.query);
      if (state.area !== "all") params.set("area", state.area);
      if (state.category !== "all") params.set("categoria", state.category);
      if (state.mode !== "all") params.set("modo", state.mode);
      if (state.comparison !== "all") params.set("comparacao", state.comparison);
      if (state.sort !== "relevancia") params.set("ordem", state.sort);
      const next = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
      window.history.replaceState({}, "", next);
    };

    const fillSelect = (select, options, selectedValue) => {
      select.innerHTML = "";
      options.forEach((option) => {
        const element = document.createElement("option");
        element.value = option.value;
        element.textContent = option.label;
        select.appendChild(element);
      });
      select.value = options.some((option) => option.value === selectedValue) ? selectedValue : options[0]?.value || "all";
    };

    const updateCategoryOptions = () => {
      const scopedItems = state.area === "all" ? allItems : allItems.filter((item) => item.sheetSlug === state.area);
      const categories = Array.from(
        new Map(
          scopedItems
            .filter((item) => item.groupSlug)
            .map((item) => [item.groupSlug, { value: item.groupSlug, label: item.group }]),
        ).values(),
      ).sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));

      fillSelect(
        page.category,
        [{ value: "all", label: "Todas as categorias" }, ...categories],
        state.category,
      );

      if (!categories.some((category) => category.value === state.category)) {
        state.category = "all";
        page.category.value = "all";
      }
    };

    const renderChips = () => {
      page.chips.innerHTML = "";
      const options = [
        { value: "all", label: "Todas as áreas" },
        ...catalogData.areas.map((area) => ({
          value: allItems.find((item) => item.sheet === area)?.sheetSlug || "",
          label: area,
        })),
      ];

      options.forEach((option) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `filter-chip${state.area === option.value ? " active" : ""}`;
        button.textContent = option.label;
        button.addEventListener("click", () => {
          state.area = option.value;
          updateCategoryOptions();
          render();
        });
        page.chips.appendChild(button);
      });
    };

    const filterItems = () => {
      const query = accentInsensitive(state.query);

      return allItems
        .filter((item) => !query || item.searchable.includes(query))
        .filter((item) => state.area === "all" || item.sheetSlug === state.area)
        .filter((item) => state.category === "all" || item.groupSlug === state.category)
        .filter((item) => state.mode === "all" || item.priceMode === state.mode)
        .filter((item) => state.comparison === "all" || item.comparison === state.comparison)
        .sort(sorters[state.sort] || sorters.relevancia);
    };

    const updateStats = (items) => {
      const numeric = items.filter((item) => typeof item.jmPrice === "number").map((item) => item.jmPrice);
      const areas = new Set(items.map((item) => item.sheet));
      const consult = items.filter((item) => item.priceMode === "consult").length;

      page.statTotals.forEach((element) => {
        element.textContent = items.length.toString();
      });
      page.statAreas.textContent = areas.size.toString();
      page.statMin.textContent = numeric.length ? formatMoney(Math.min(...numeric)) : "Sob consulta";
      page.statConsult.textContent = consult.toString();
    };

    const renderResults = (items) => {
      page.results.innerHTML = "";

      items.forEach((item) => {
        const article = document.createElement("article");
        article.className = "price-card";
        article.innerHTML = `
          <div class="price-card-head">
            <div>
              <div class="price-card-overline">${item.sheet}</div>
              <h3>${item.description}</h3>
              <p>${item.group || "Serviço catalogado"}${item.groupNote ? ` · ${item.groupNote}` : ""}</p>
            </div>
            <div class="price-card-price">
              <strong>${formatPriceLine(item)}</strong>
              <span>${modeLabels[item.priceMode]}</span>
            </div>
          </div>
          <div class="price-badges">
            <span class="price-badge">${comparisonLabels[item.comparison]}</span>
            ${item.unit ? `<span class="price-badge subtle">Unidade: ${item.unit}</span>` : ""}
            <span class="price-badge subtle">Item ${item.itemNumber}</span>
          </div>
          <div class="price-card-footer">
            <div class="price-reference">${formatReferenceLine(item)}</div>
            <a class="btn-gold price-card-cta" href="${buildWhatsappLink(item)}" target="_blank" rel="noopener">Solicitar este serviço</a>
          </div>
        `;
        page.results.appendChild(article);
      });

      const hasItems = items.length > 0;
      page.empty.hidden = hasItems;
      page.results.hidden = !hasItems;
    };

    const render = () => {
      page.search.value = state.query;
      page.area.value = state.area;
      page.mode.value = state.mode;
      page.comparison.value = state.comparison;
      page.sort.value = state.sort;

      renderChips();
      syncUrl();

      const items = filterItems();
      updateStats(items);
      renderResults(items);

      page.count.textContent = `${items.length} serviço${items.length === 1 ? "" : "s"} encontrado${items.length === 1 ? "" : "s"}`;
      page.hint.textContent =
        state.query || state.area !== "all" || state.category !== "all" || state.mode !== "all" || state.comparison !== "all"
          ? "Filtros ativos aplicados na tabela."
          : "Busque por ambiente, tipo de serviço, área técnica ou unidade de cobrança.";
    };

    fillSelect(
      page.area,
      [{ value: "all", label: "Todas as áreas" }].concat(
        catalogData.areas.map((area) => ({
          value: allItems.find((item) => item.sheet === area)?.sheetSlug || "",
          label: area,
        })),
      ),
      state.area,
    );

    fillSelect(
      page.mode,
      [
        { value: "all", label: "Todos os formatos de preço" },
        { value: "fixed", label: "Preço fechado" },
        { value: "consult", label: "Sob consulta" },
        { value: "formula", label: "Regra especial" },
      ],
      state.mode,
    );

    fillSelect(
      page.comparison,
      [
        { value: "all", label: "Toda comparação" },
        { value: "below", label: "Abaixo da referência" },
        { value: "equal", label: "Na referência" },
        { value: "above", label: "Acima da referência" },
        { value: "none", label: "Sem comparativo" },
      ],
      state.comparison,
    );

    fillSelect(
      page.sort,
      [
        { value: "relevancia", label: "Ordenar por menor preço" },
        { value: "maior", label: "Ordenar por maior preço" },
        { value: "az", label: "Ordenar por nome" },
        { value: "area", label: "Ordenar por área" },
      ],
      state.sort,
    );

    updateCategoryOptions();
    if (page.lastUpdated) {
      page.lastUpdated.textContent = new Date(catalogData.meta.sourceModifiedAt).toLocaleDateString("pt-BR");
    }

    page.search.addEventListener("input", (event) => {
      state.query = event.target.value;
      render();
    });

    page.area.addEventListener("change", (event) => {
      state.area = event.target.value;
      updateCategoryOptions();
      render();
    });

    page.category.addEventListener("change", (event) => {
      state.category = event.target.value;
      render();
    });

    page.mode.addEventListener("change", (event) => {
      state.mode = event.target.value;
      render();
    });

    page.comparison.addEventListener("change", (event) => {
      state.comparison = event.target.value;
      render();
    });

    page.sort.addEventListener("change", (event) => {
      state.sort = event.target.value;
      render();
    });

    page.clear.addEventListener("click", () => {
      state.query = "";
      state.area = "all";
      state.category = "all";
      state.mode = "all";
      state.comparison = "all";
      state.sort = "relevancia";
      updateCategoryOptions();
      render();
    });

    render();
  }
}
