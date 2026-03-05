gsap.registerPlugin(ScrollTrigger);

const sections = [
  { parent: ".approaches-section", children: ".word" },
  { parent: ".disrupt-title", children: ".inner-content" },
  { parent: ".faq-wrapper", children: ".u-font-bold" },
  { parent: ".cta-title-wrapper", children: ".stagger-words" },
];

sections.forEach((section) => {
  const container = document.querySelector(section.parent);

  if (container) {
    gsap.from(section.children, {
      scrollTrigger: {
        trigger: section.parent,
        start: "top 95%",
        end: "top 20%",
        scrub: 1.2,
      },
      y: 20,
      opacity: 0,
      filter: "blur(40px)",
      rotationX: -15,
      transformOrigin: "50% 50% -50",
      // stagger: 0.99,
      duration: 2,
      ease: "power3.out",
      immediateRender: false,
    });
  }
});

// disrupt para
// First, break the text into words/spans
function splitParagraphText() {
  const paragraph = document.querySelector(".type-in");
  if (!paragraph || paragraph.dataset.split === "true") return;

  const text = paragraph.innerText;
  const words = text.split(" ");

  let clutter = "";
  words.forEach((word) => {
    clutter += `<span class="word">${word}&nbsp;</span>`;
  });
  paragraph.innerHTML = clutter;
  paragraph.dataset.split = "true";
}
splitParagraphText();
// Second, animate from Left to Right
gsap.from(".type-in .word", {
  scrollTrigger: {
    trigger: ".type-in",
    start: "top 90%",
    end: "top 40%",
    scrub: 1,
  },
  x: 50,
  opacity: 0,
  stagger: 0.05,
  ease: "power2.out",
});

// ************ swiper slider ***********
if (window.Swiper && document.querySelector(".testimonial-swiper")) {
  const swiper = new Swiper(".testimonial-swiper", {
    slidesPerView: 2,
    spaceBetween: 90,
    loop: true,

    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },

    navigation: {
      nextEl: ".slider-arrow",
      // prevEl: '.swiper-button-prev',
    },

    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
    },
  });
}
// ************ swiper slider ***********

// ************ Marquee ***********
if (document.querySelector(".ticker-scroller")) {
  gsap.to(".ticker-scroller", {
    xPercent: -50,
    ease: "none",
    duration: 10,
    repeat: -1,
    modifiers: {
      xPercent: gsap.utils.unitize((x) => parseFloat(x) % 50),
    },
  });
}

// ************ Accordian ***********
gsap.registerPlugin(ScrollTrigger);
const accordionItems = document.querySelectorAll(".accordion-item");
accordionItems.forEach((item) => {
  const trigger = item.querySelector(".accordion-item-trigger");
  const content = item.querySelector(".accordion-item-content");
  const arrow = item.querySelector(".accordion-arrow");

  // FORCE CLOSED ON LOAD
  gsap.set(content, { height: 0 });
  gsap.set(arrow, { rotate: 0 });

  let isOpen = false;

  trigger.addEventListener("click", () => {
    // CLOSE ALL OTHERS
    accordionItems.forEach((other) => {
      if (other !== item) {
        gsap.to(other.querySelector(".accordion-item-content"), {
          height: 0,
          duration: 0.4,
          ease: "power2.inOut",
        });
        gsap.to(other.querySelector(".accordion-arrow"), {
          rotate: 0,
          duration: 0.3,
        });
        other.isOpen = false;
      }
    });

    // TOGGLE CURRENT
    if (!isOpen) {
      gsap.to(content, {
        height: content.scrollHeight,
        duration: 0.4,
        ease: "power2.inOut",
      });
      gsap.to(arrow, {
        rotate: 180,
        duration: 0.3,
      });
    } else {
      gsap.to(content, {
        height: 0,
        duration: 0.4,
        ease: "power2.inOut",
      });
      gsap.to(arrow, {
        rotate: 0,
        duration: 0.3,
      });
    }

    isOpen = !isOpen;
    item.isOpen = isOpen;
  });

  // SCROLL ANIMATION (works independently)
  gsap.from(item, {
    opacity: 0,
    y: 40,
    duration: 0.6,
    ease: "power2.out",
    scrollTrigger: {
      trigger: item,
      start: "top 85%",
    },
  });
});

// ************ Accordian ***********

// *************  website code ***********
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
// end 

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

document.addEventListener("DOMContentLoaded", () => {
  if (typeof SplitType === "undefined") return;

  // Split text into words
  const h1El = document.querySelector(".text-h1-xl");
  const xlEl = document.querySelector(".text-xl");
  if (!h1El || !xlEl) return;

  const splitH1 = new SplitType(h1El, { types: "words" });
  const splitXL = new SplitType(xlEl, { types: "words" });

  // Create GSAP timeline
  const tl = gsap.timeline();

  // Animate h1 words
  tl.from(splitH1.words, {
    y: -100, // drop in from below
    opacity: 0,
    duration: 1,
    ease: "back.inOut",
    stagger: 0.1, // each word one after the other
  });

  tl.from(
    splitXL.words,
    {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "back.inOut",
      stagger: 0.1,
    },
    "+=0.3",
  );
});

