// ===== APP.JS - Global Navigation & Menu =====

document.addEventListener("DOMContentLoaded", () => {
  initializeMenu();
  setActiveNav();
});

// Initialize Mobile Menu
function initializeMenu() {
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");

  if (!menuBtn || !mobileNav) return;

  menuBtn.addEventListener("click", () => {
    mobileNav.classList.toggle("open");
  });

  // Close menu when clicking on a link
  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
    });
  });
}

// Set Active Navigation Link
function setActiveNav() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll("nav a[href]");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const isActive =
      (currentPage === "index.html" && href === "index.html") ||
      (currentPage === href) ||
      (currentPage === "" && href === "index.html");

    if (isActive) {
      link.style.opacity = "0.5";
      link.style.pointerEvents = "none";
    }
  });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});
