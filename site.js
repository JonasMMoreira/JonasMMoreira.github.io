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
