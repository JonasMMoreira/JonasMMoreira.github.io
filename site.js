const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealItems.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

const nav = document.getElementById("nav");

if (nav) {
  const syncNavState = () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  };

  syncNavState();
  window.addEventListener("scroll", syncNavState, { passive: true });
}

const hamburger = document.getElementById("hamburger");
const drawer = document.getElementById("navDrawer");

if (hamburger && drawer) {
  const drawerInner = drawer.querySelector(".nav-drawer-inner");
  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ].join(", ");
  let previousFocus = null;

  const getFocusableItems = () => {
    const scope = drawerInner || drawer;
    return Array.from(scope.querySelectorAll(focusableSelector)).filter(
      (element) => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true",
    );
  };

  const openDrawer = () => {
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    drawer.classList.add("open");
    hamburger.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    drawer.setAttribute("aria-hidden", "false");
    drawer.setAttribute("aria-modal", "true");
    document.body.style.overflow = "hidden";

    const firstFocusable = getFocusableItems()[0];
    window.setTimeout(() => {
      (firstFocusable || drawerInner || drawer).focus();
    }, 20);
  };

  const closeDrawer = ({ restoreFocus = true } = {}) => {
    drawer.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    drawer.setAttribute("aria-hidden", "true");
    drawer.removeAttribute("aria-modal");
    document.body.style.overflow = "";

    if (restoreFocus && previousFocus) {
      previousFocus.focus();
    }
  };

  if (drawerInner && !drawerInner.hasAttribute("tabindex")) {
    drawerInner.setAttribute("tabindex", "-1");
  }

  hamburger.addEventListener("click", () => {
    drawer.classList.contains("open") ? closeDrawer() : openDrawer();
  });

  drawer.addEventListener("click", (event) => {
    if (event.target === drawer) {
      closeDrawer();
    }
  });

  drawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeDrawer({ restoreFocus: false }));
  });

  document.addEventListener("keydown", (event) => {
    if (!drawer.classList.contains("open")) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeDrawer();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableItems = getFocusableItems();

    if (!focusableItems.length) {
      return;
    }

    const firstItem = focusableItems[0];
    const lastItem = focusableItems[focusableItems.length - 1];

    if (event.shiftKey && document.activeElement === firstItem) {
      event.preventDefault();
      lastItem.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastItem) {
      event.preventDefault();
      firstItem.focus();
    }
  });
}

const pricingData = window.JM_PRICING_DATA;
const whatsappNumber = "5579991373093";

const onlyDigits = (value) => value.replace(/\D/g, "");

const formatPhone = (value) => {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length > 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (digits.length > 2) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  return digits;
};

const fieldValue = (form, name) => {
  const field = form.elements[name];
  return field ? field.value.trim() : "";
};

const setFieldState = (form, name, message) => {
  const field = form.elements[name];
  const error = form.querySelector(`[data-error-for="${name}"]`);

  if (!field) {
    return;
  }

  const hasError = Boolean(message);
  field.classList.toggle("error", hasError);
  field.setAttribute("aria-invalid", hasError ? "true" : "false");

  if (error) {
    if (message) {
      error.textContent = message;
    }
    error.classList.toggle("show", hasError);
  }
};

const hydrateServiceSelects = () => {
  if (!pricingData?.groups?.length) {
    return;
  }

  const groupedOptions = pricingData.groups.reduce((map, entry) => {
    const area = entry.sheet;
    const label = entry.group?.trim();

    if (!label) {
      return map;
    }

    if (!map.has(area)) {
      map.set(area, new Set());
    }

    map.get(area).add(label);
    return map;
  }, new Map());

  document.querySelectorAll("[data-service-select]").forEach((select) => {
    if (!(select instanceof HTMLSelectElement)) {
      return;
    }

    const currentValue = select.value.trim();
    select.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Selecione uma área ou categoria...";
    select.appendChild(placeholder);

    Array.from(groupedOptions.entries())
      .sort((a, b) => a[0].localeCompare(b[0], "pt-BR"))
      .forEach(([area, groups]) => {
        const optgroup = document.createElement("optgroup");
        optgroup.label = area;

        Array.from(groups)
          .sort((a, b) => a.localeCompare(b, "pt-BR"))
          .forEach((group) => {
            const option = document.createElement("option");
            option.value = `${area} · ${group}`;
            option.textContent = group;
            optgroup.appendChild(option);
          });

        select.appendChild(optgroup);
      });

    const guidanceOption = document.createElement("option");
    guidanceOption.value = "Ainda não sei / preciso de orientação";
    guidanceOption.textContent = "Ainda não sei / preciso de orientação";
    select.appendChild(guidanceOption);

    if (currentValue) {
      const matchingOption = Array.from(select.options).find((option) => option.value === currentValue);

      if (matchingOption) {
        select.value = currentValue;
      } else {
        const customOption = document.createElement("option");
        customOption.value = currentValue;
        customOption.textContent = currentValue;
        customOption.selected = true;
        select.appendChild(customOption);
      }
    }
  });
};

const validateBudgetForm = (form) => {
  const requiredFields = [
    ["nome", "Por favor, informe seu nome."],
    ["telefone", "Informe um telefone com DDD."],
    ["servico", "Selecione o tipo de serviço."],
    ["mensagem", "Descreva brevemente o que você precisa."],
  ];
  let firstInvalid = null;

  requiredFields.forEach(([name, message]) => {
    const value = fieldValue(form, name);
    const isValid = name === "telefone" ? onlyDigits(value).length >= 10 : Boolean(value);
    setFieldState(form, name, isValid ? "" : message);

    if (!isValid && !firstInvalid) {
      firstInvalid = form.elements[name];
    }
  });

  const email = fieldValue(form, "email");
  const isEmailValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  setFieldState(form, "email", isEmailValid ? "" : "Por favor, informe um e-mail válido.");

  if (!isEmailValid && !firstInvalid) {
    firstInvalid = form.elements.email;
  }

  return { valid: !firstInvalid, firstInvalid };
};

const buildBudgetMessage = (form) => {
  const lines = [
    "Olá, JM Edificações! Gostaria de solicitar um orçamento.",
    "",
    `Nome: ${fieldValue(form, "nome")}`,
    `Telefone/WhatsApp: ${fieldValue(form, "telefone")}`,
    fieldValue(form, "email") ? `E-mail: ${fieldValue(form, "email")}` : null,
    `Serviço desejado: ${fieldValue(form, "servico")}`,
    fieldValue(form, "localizacao") ? `Local do atendimento: ${fieldValue(form, "localizacao")}` : null,
    fieldValue(form, "prazo") ? `Prazo desejado: ${fieldValue(form, "prazo")}` : null,
    "",
    `Detalhes: ${fieldValue(form, "mensagem")}`,
    "",
    "Posso enviar fotos ou documentos por aqui, se necessário.",
  ];

  return lines.filter((line) => line !== null).join("\n").replace(/\n{3,}/g, "\n\n");
};

hydrateServiceSelects();

document.querySelectorAll(".js-budget-form").forEach((form) => {
  const phone = form.elements.telefone;

  if (phone) {
    phone.addEventListener("input", () => {
      phone.value = formatPhone(phone.value);
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const validation = validateBudgetForm(form);
    const status = form.querySelector(".form-status");
    const statusText = form.querySelector(".js-form-status-text");
    const fallback = form.querySelector(".js-form-fallback");
    const button = form.querySelector(".form-submit");
    const buttonText = button ? button.querySelector("span") : null;

    if (!validation.valid) {
      validation.firstInvalid.focus();
      if (status) {
        status.classList.remove("show");
      }
      return;
    }

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildBudgetMessage(form))}`;

    if (fallback) {
      fallback.href = whatsappUrl;
      fallback.classList.add("show");
    }

    if (statusText) {
      statusText.textContent = "Mensagem preparada. O WhatsApp será aberto para concluir o envio. Se não abrir automaticamente, use o link abaixo.";
    }

    if (status) {
      status.classList.add("show");
    }

    if (button) {
      button.disabled = true;
    }

    if (buttonText) {
      buttonText.textContent = "Abrindo WhatsApp...";
    }

    window.open(whatsappUrl, "_blank", "noopener");

    window.setTimeout(() => {
      if (button) {
        button.disabled = false;
      }

      if (buttonText) {
        buttonText.textContent = "Enviar solicitação pelo WhatsApp";
      }
    }, 1400);
  });
});
