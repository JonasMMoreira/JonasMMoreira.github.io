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

const hamburger = document.getElementById("hamburger");
const drawer = document.getElementById("navDrawer");

if (hamburger && drawer) {
  const openDrawer = () => {
    drawer.classList.add("open");
    hamburger.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    drawer.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  hamburger.addEventListener("click", () => {
    drawer.classList.contains("open") ? closeDrawer() : openDrawer();
  });

  drawer.addEventListener("click", (event) => {
    if (event.target === drawer) {
      closeDrawer();
    }
  });

  drawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDrawer();
    }
  });
}

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
