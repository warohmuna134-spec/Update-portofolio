// ============================================================
// Kizen Noch — Portfolio interactions
// ============================================================

(function () {
  "use strict";

  const root = document.body;
  const toggleBtn = document.getElementById("themeToggle");
  const STORAGE_KEY = "kizen-noch-theme";

  // ---------- Loading screen ----------
  const loader = document.getElementById("loader");

  function hideLoader() {
    if (!loader) return;
    loader.classList.add("is-hidden");
    loader.addEventListener(
      "transitionend",
      function () {
        loader.setAttribute("aria-hidden", "true");
      },
      { once: true }
    );
  }

  if (loader) {
    if (document.readyState === "complete") {
      setTimeout(hideLoader, 1300);
    } else {
      window.addEventListener("load", function () {
        setTimeout(hideLoader, 1300);
      });
    }
  }

  // ---------- Background music: Copines ----------
  const bgMusic = document.getElementById("bgMusic");
  const musicPlayer = document.getElementById("musicPlayer");
  const musicToggle = document.getElementById("musicToggle");
  const musicStop = document.getElementById("musicStop");

  function setMusicPlaying(isPlaying) {
    if (!musicPlayer) return;
    musicPlayer.setAttribute("data-playing", isPlaying ? "true" : "false");
    if (musicToggle) {
      musicToggle.setAttribute(
        "aria-label",
        isPlaying ? "Jeda musik" : "Putar musik"
      );
    }
  }

  function attemptAutoplay() {
    if (!bgMusic) return;
    const playPromise = bgMusic.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise
        .then(function () {
          setMusicPlaying(true);
        })
        .catch(function () {
          // Autoplay diblokir browser — mainkan begitu ada interaksi pertama
          setMusicPlaying(false);
          function startOnFirstInteraction() {
            bgMusic
              .play()
              .then(function () {
                setMusicPlaying(true);
              })
              .catch(function () {});
          }
          document.addEventListener("click", startOnFirstInteraction, {
            once: true,
          });
          document.addEventListener("touchstart", startOnFirstInteraction, {
            once: true,
          });
        });
    }
  }

  if (bgMusic) {
    if (document.readyState === "complete") {
      attemptAutoplay();
    } else {
      window.addEventListener("load", attemptAutoplay);
    }
  }

  if (musicToggle && bgMusic) {
    musicToggle.addEventListener("click", function () {
      if (bgMusic.paused) {
        bgMusic
          .play()
          .then(function () {
            setMusicPlaying(true);
          })
          .catch(function () {});
      } else {
        bgMusic.pause();
        setMusicPlaying(false);
      }
    });
  }

  if (musicStop && bgMusic) {
    musicStop.addEventListener("click", function () {
      bgMusic.pause();
      bgMusic.currentTime = 0;
      setMusicPlaying(false);
    });
  }

  // ---------- Theme: init from storage or system preference ----------
  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  applyTheme(getPreferredTheme());

  toggleBtn.addEventListener("click", function () {
    const current = root.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });

  // ---------- Scroll reveal ----------
  const revealEls = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            setTimeout(function () {
              entry.target.classList.add("is-visible");
            }, i * 90);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // ---------- Footer year ----------
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Smooth active-link state on nav (optional nicety) ----------
  const sections = document.querySelectorAll("main > section[id]");
  const navLinks = document.querySelectorAll(".nav a");

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          const id = entry.target.getAttribute("id");
          const link = document.querySelector('.nav a[href="#' + id + '"]');
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) { l.style.color = ""; });
            link.style.color = "var(--text)";
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    sections.forEach(function (s) { navObserver.observe(s); });
  }
})();
