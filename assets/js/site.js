(() => {
  document.documentElement.classList.add("js");

  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".main-nav");

  if (menuButton && menu) {
    const closeMenu = (returnFocus = false) => {
      menu.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Abrir menú");
      if (returnFocus) menuButton.focus();
    };

    menuButton.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });

    menu.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });
    document.addEventListener("click", (event) => {
      if (!menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.classList.contains("is-open")) closeMenu(true);
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  const progress = document.querySelector(".scroll-progress");
  if (progress) {
    let pending = false;
    const updateProgress = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      const percentage = available > 0 ? (window.scrollY / available) * 100 : 0;
      progress.style.setProperty("--scroll-progress", `${Math.min(100, Math.max(0, percentage))}%`);
      pending = false;
    };
    const queueProgress = () => {
      if (!pending) {
        pending = true;
        requestAnimationFrame(updateProgress);
      }
    };
    window.addEventListener("scroll", queueProgress, { passive: true });
    window.addEventListener("resize", queueProgress);
    queueProgress();
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pointerScene = document.querySelector("[data-pointer-scene]");
  if (pointerScene && !reducedMotion.matches && window.matchMedia("(pointer: fine)").matches) {
    pointerScene.addEventListener("pointermove", (event) => {
      const bounds = pointerScene.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      pointerScene.style.setProperty("--pointer-x", `${(x * 12).toFixed(1)}px`);
      pointerScene.style.setProperty("--pointer-y", `${(y * 12).toFixed(1)}px`);
    });
    pointerScene.addEventListener("pointerleave", () => {
      pointerScene.style.setProperty("--pointer-x", "0px");
      pointerScene.style.setProperty("--pointer-y", "0px");
    });
  }

  const switcher = document.querySelector("[data-case-switcher]");
  if (switcher) {
    const buttons = [...switcher.querySelectorAll("[data-case-button]")];
    const panels = [...switcher.querySelectorAll("[data-case-panel]")];
    const selectCase = (name) => {
      buttons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.caseButton === name));
      });
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.casePanel !== name;
        if (!panel.hidden && !reducedMotion.matches) {
          panel.classList.remove("case-enter");
          void panel.offsetWidth;
          panel.classList.add("case-enter");
        }
      });
    };
    buttons.forEach((button) => button.addEventListener("click", () => selectCase(button.dataset.caseButton)));
    selectCase(buttons[0].dataset.caseButton);
  }
})();
