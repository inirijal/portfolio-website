/**
 * Main JavaScript File
 * Portfolio: Muhammad Rizal Ahnaf
 */

// 1. Tailwind Configuration (loaded before DOM render)
if (typeof tailwind !== "undefined") {
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          brand: {
            black: "#090909",
            dark: "#111111",
            card: "#141414",
            border: "#222222",
            red: "#FF2A2A",
            redHover: "#E01E1E",
            muted: "#8E8E93",
          },
        },
        fontFamily: {
          heading: ["Syne", "sans-serif"],
          sans: ["Inter", "sans-serif"],
        },
      },
    },
  };
}

document.addEventListener("DOMContentLoaded", () => {
  // 2. Initialize Lucide Icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // 3. Mobile Navigation Menu Toggle
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuIcon = document.getElementById("mobile-menu-icon");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("menu-open");
      if (isOpen) {
        mobileMenu.classList.remove("menu-open");
        mobileMenu.classList.add("menu-closed");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
        if (mobileMenuIcon) {
          mobileMenuIcon.setAttribute("data-lucide", "menu");
          lucide.createIcons();
        }
      } else {
        mobileMenu.classList.remove("menu-closed");
        mobileMenu.classList.add("menu-open");
        mobileMenuBtn.setAttribute("aria-expanded", "true");
        if (mobileMenuIcon) {
          mobileMenuIcon.setAttribute("data-lucide", "x");
          lucide.createIcons();
        }
      }
    });

    // Close menu when a link inside mobile menu is clicked
    const mobileLinks = mobileMenu.querySelectorAll("a");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("menu-open");
        mobileMenu.classList.add("menu-closed");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
        if (mobileMenuIcon) {
          mobileMenuIcon.setAttribute("data-lucide", "menu");
          lucide.createIcons();
        }
      });
    });
  }

  // 4. Project Filter Functionality
  const filterBtns = document.querySelectorAll(".project-filter-btn");
  const projectItems = document.querySelectorAll(".project-item");

  if (filterBtns.length > 0 && projectItems.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");

        // Update active class on filter buttons
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // Show / hide project items with animation
        projectItems.forEach((item) => {
          const category = item.getAttribute("data-category");
          if (filter === "all" || category === filter) {
            item.classList.remove("hidden-card");
          } else {
            item.classList.add("hidden-card");
          }
        });
      });
    });
  }

  // 5. Scroll Spy: Highlight Active Nav Link
  const sections = document.querySelectorAll("section[id]");
  const desktopNavLinks = document.querySelectorAll(".desktop-nav-link");

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        desktopNavLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
            link.classList.remove("text-neutral-400");
            link.classList.add("text-white");
          } else {
            link.classList.remove("active");
            link.classList.add("text-neutral-400");
            link.classList.remove("text-white");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", highlightNavOnScroll);
  highlightNavOnScroll();

  // 6. Smooth Scroll for Back To Top
  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // 7. Quick Copy Feedback (Email, Phone)
  const copyElements = document.querySelectorAll("[data-copy-text]");
  const toast = document.getElementById("toast-notification");
  const toastMessage = document.getElementById("toast-message");
  let toastTimeout;

  function showToast(message) {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = message;

    toast.classList.remove("toast-hidden");
    toast.classList.add("toast-visible");

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("toast-visible");
      toast.classList.add("toast-hidden");
    }, 3500);
  }

  copyElements.forEach((el) => {
    el.addEventListener("click", (e) => {
      const textToCopy = el.getAttribute("data-copy-text");
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
        }).catch(() => {
          showToast("Copied to clipboard!");
        });
      }
    });
  });

  // 8. Interactive Contact Form Submission (Sends to Gmail)
  const contactForm = document.getElementById("portfolio-contact-form");
  const submitBtn = document.getElementById("contact-submit-btn");
  const submitBtnText = document.getElementById("submit-btn-text");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      const nameInput = document.getElementById("contact-name");
      const emailInput = document.getElementById("contact-email");
      const messageInput = document.getElementById("contact-message");

      const name = nameInput ? nameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      const message = messageInput ? messageInput.value.trim() : "";

      if (!name || !email || !message) {
        e.preventDefault();
        showToast("Mohon lengkapi semua kolom formulir.");
        return;
      }

      // If opening directly via local file:// protocol, allow native POST submit to avoid browser CORS block
      if (window.location.protocol === "file:") {
        if (submitBtn) submitBtn.disabled = true;
        if (submitBtnText) submitBtnText.textContent = "MENGIRIM KE GMAIL...";
        return; // Allow default form submission
      }

      e.preventDefault();

      // Show sending state
      if (submitBtn) submitBtn.disabled = true;
      if (submitBtnText) submitBtnText.textContent = "MENGIRIM KE GMAIL...";

      fetch("https://formsubmit.co/ajax/mrijalahnaf65@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          Nama: name,
          Email: email,
          Pesan: message,
          _subject: `Pesan Baru Portofolio dari ${name}`,
          _template: "table",
          _captcha: "false",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          contactForm.reset();
          if (submitBtn) submitBtn.disabled = false;
          if (submitBtnText) submitBtnText.textContent = "KIRIM PESAN SEKARANG";
          showToast(`Pesan berhasil dikirim! Silakan periksa inbox/spam Gmail.`);
        })
        .catch((error) => {
          console.warn("AJAX gagal (misal CORS/koneksi), menggunakan submit native:", error);
          contactForm.submit();
        });
    });
  }
});
