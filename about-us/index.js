document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.querySelector(".burger");
  const nav = document.querySelector(".nav");
  let isOpen = false;

  const timeline = gsap.timeline({ paused: true });
  timeline.set(".block-overlay", { display: "block" });

  // Animate burger pseudo-elements by targeting the CSS variable
  timeline.to(
    ".burger",
    {
      "--burger-color": "#000000",
      duration: 0.4,
      ease: "power2.out",
    },
    "<",
  );
  // Overlay blocks animation
  timeline.to(".block", {
    duration: 0.9,
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    stagger: 0.06,
    ease: "power2.inOut",
  });

  // Menu items fade in
  timeline.to(
    ".block-menu-title, .block-menu-item",
    {
      duration: 0.25,
      opacity: 1,
      stagger: 0.04,
    },
    "-=0.4",
  );

  // Toggle logic
  toggleButton.addEventListener("click", function () {
    toggleButton.classList.toggle("active");
    nav?.classList.toggle("is-active");

    if (isOpen) {
      // close menu
      timeline.reverse();
      document.body.classList.remove("no-scroll");
      document.body.classList.remove("menu-open");
      toggleButton.setAttribute("aria-expanded", "false");
    } else {
      // open menu
      timeline.play();
      document.body.classList.add("no-scroll");
      document.body.classList.add("menu-open");
      toggleButton.setAttribute("aria-expanded", "true");
    }
    isOpen = !isOpen;
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Ensure grid is visible on page load
  gsap.set(".load_grid", { display: "grid" });
  gsap.set(".load_grid-item", { opacity: 1 });

  // Animate the grid away to reveal the page
  gsap.to(".load_grid-item", {
    opacity: 0,
    duration: 0.2,
    stagger: { amount: 0.5, from: "random" },
    onComplete: () => {
      gsap.set(".load_grid", { display: "none" });
    },
  });

  // Handle link clicks
  $("a").on("click", function (e) {
    if (
      $(this).prop("hostname") === window.location.host &&
      $(this).attr("href").indexOf("#") === -1 &&
      $(this).attr("target") !== "_blank"
    ) {
      e.preventDefault();
      let destination = $(this).attr("href");

      // Bring grid back and animate it in to cover page
      gsap.set(".load_grid", { display: "grid" });
      gsap.fromTo(
        ".load_grid-item",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.2,
          stagger: { amount: 0.5, from: "random" },
          onComplete: () => {
            window.location = destination;
          },
        },
      );
    }
  });

  // Fix back/forward cache issue
  window.onpageshow = function (event) {
    if (event.persisted) {
      window.location.reload();
    }
  };
});

document.addEventListener("DOMContentLoaded", () => {
  // Target all Webflow "button-like" elements
  document.querySelectorAll("[data-url]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const url = el.getAttribute("data-url");
      if (!url) return;

      // ⌘ (Mac) or Ctrl (Win) + click → open in new tab
      if (e.metaKey || e.ctrlKey) {
        window.open(url, "_blank");
      }
      // Middle mouse click → open in new tab
      else if (e.button === 1) {
        window.open(url, "_blank");
      }
      // Normal click → same tab
      else {
        window.location.href = url;
      }
    });
  });
});

const swiperEl = document.querySelector(".believe-swiper");

if (swiperEl) {
  const believeSwiper = new Swiper(swiperEl, {
    slidesPerView: 1, // Default for mobile
    spaceBetween: 24,
    grabCursor: true,
    loop: true,
    speed: 600,
    breakpoints: {
      640: { slidesPerView: 2 },
      992: { slidesPerView: 3 }
    }
  });

  // External Arrow Control
  const rightArrow = document.querySelector(".slider-arrow");
  if (rightArrow) {
    rightArrow.addEventListener("click", (e) => {
      e.preventDefault();
      believeSwiper.slideNext();
    });
  }
}

// Prevent horizontal scroll from triggering browser back/forward
if (swiperEl) {
  swiperEl.addEventListener(
    "wheel",
    (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        // Only prevent if horizontal movement
        e.preventDefault();
      }
    },
    { passive: false },
  ); // passive: false is REQUIRED for preventDefault
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined") return;
  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const splitWords = (el) => {
    if (typeof SplitText !== "undefined") {
      return new SplitText(el, { type: "words" });
    }
    if (typeof SplitType !== "undefined") {
      return new SplitType(el, { types: "words" });
    }
    return null;
  };

  // Hero heading: animate on load
  gsap.utils.toArray(".stagger-on-load").forEach((el) => {
    const split = splitWords(el);
    const targets = split?.words || [el];
    gsap.from(targets, {
      y: 24,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.05,
    });
  });

  // Section headings: animate on scroll
  gsap.utils
    .toArray(".stagger-words, .bio-name, .b-slider-title .text-h4")
    .forEach((el) => {
      const split = splitWords(el);
      const targets = split?.words || [el];
      gsap.from(targets, {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.04,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
    });
});

gsap.registerPlugin(ScrollTrigger);
gsap.to(".ticker-scroller", {
  xPercent: -50,
  repeat: -1,
  duration: 20,
  ease: "none",
  modifiers: {
    xPercent: gsap.utils.unitize((x) => parseFloat(x) % 50),
  },
});
