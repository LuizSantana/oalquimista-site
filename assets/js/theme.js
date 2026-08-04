// Shared interaction layer for the redesigned pages: scroll-reveal, sticky
// nav shadow, FAQ accordion, mobile menu toggle. Vanilla JS, no framework —
// the site has no build step. Runs after DOMContentLoaded (script is `defer`).
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Scroll reveal
  const revealTargets = document.querySelectorAll(".reveal-section");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    revealTargets.forEach((el) => observer.observe(el));
  }

  // Sticky nav shadow on scroll
  const topNav = document.getElementById("top-nav");
  if (topNav) {
    const updateNavShadow = () => topNav.classList.toggle("nav-scrolled", window.scrollY > 20);
    window.addEventListener("scroll", updateNavShadow, { passive: true });
    updateNavShadow();
  }

  // Mobile menu toggle
  const menuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // FAQ accordion — event delegation on any [data-accordion-toggle] button.
  // max-height is measured from the real content (scrollHeight), not a
  // fixed CSS number — a hardcoded cap silently clips any answer taller
  // than it, with no ellipsis or fade, just cut-off text.
  function collapseAccordionItem(item) {
    item.classList.remove("active");
    const content = item.querySelector(".accordion-content");
    if (content) content.style.maxHeight = "";
  }
  function expandAccordionItem(item) {
    item.classList.add("active");
    const content = item.querySelector(".accordion-content");
    if (content) content.style.maxHeight = content.scrollHeight + "px";
  }
  document.querySelectorAll("[data-accordion-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".accordion-item");
      if (!item) return;
      const isOpen = item.classList.contains("active");
      item.parentElement.querySelectorAll(".accordion-item").forEach((other) => {
        if (other !== item) collapseAccordionItem(other);
      });
      if (isOpen) {
        collapseAccordionItem(item);
      } else {
        expandAccordionItem(item);
      }
    });
  });
})();
