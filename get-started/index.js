document.addEventListener("DOMContentLoaded", () => {

  // ---------- MENU ----------
  const btn = document.querySelector(".burger");
  let open = false;

  const tl = gsap.timeline({ paused: true })
    .set(".block-overlay", { display: "block" })
    .to(".logo-link, .tenex-logo-nav", { color: "black", duration: 0.4, ease: "power2.out" })
    .to(".burger", { "--burger-color": "#000000", duration: 0.4, ease: "power2.out" }, "<")
    .to(".block", {
      duration: 0.9,
      clipPath: "polygon(0% 0%,100% 0%,100% 100%,0% 100%)",
      stagger: 0.06,
      ease: "power2.inOut"
    })
    .to(".block-menu-title, .block-menu-item", {
      opacity: 1,
      duration: 0.25,
      stagger: 0.04
    }, "-=0.4");

  btn?.addEventListener("click", () => {
    btn.classList.toggle("active");
    open ? tl.reverse() : tl.play();
    document.body.classList.toggle("no-scroll", !open);
    document.body.classList.toggle("menu-open", !open);
    open = !open;
  });


  // ---------- PAGE LOAD GRID ----------
  gsap.set(".load_grid", { display: "grid" });
  gsap.set(".load_grid-item", { opacity: 1 });

  gsap.to(".load_grid-item", {
    opacity: 0,
    duration: 0.2,
    stagger: { amount: 0.5, from: "random" },
    onComplete: () => gsap.set(".load_grid", { display: "none" })
  });

  $("a").on("click", function (e) {
    const href = $(this).attr("href");

    if (
      this.hostname === location.host &&
      href.indexOf("#") === -1 &&
      $(this).attr("target") !== "_blank"
    ) {
      e.preventDefault();

      gsap.set(".load_grid", { display: "grid" });

      gsap.fromTo(".load_grid-item",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.2,
          stagger: { amount: 0.5, from: "random" },
          onComplete: () => location.href = href
        }
      );
    }
  });

  window.onpageshow = e => e.persisted && location.reload();


  // ---------- DATA URL CLICK ----------
  document.querySelectorAll("[data-url]").forEach(el => {
    el.addEventListener("click", e => {
      const url = el.dataset.url;
      if (!url) return;

      if (e.metaKey || e.ctrlKey || e.button === 1) window.open(url, "_blank");
      else location.href = url;
    });
  });


  // ---------- FORM SELECT ----------
  const select = document.getElementById("hear-about-us");
  const other = document.getElementById("other-selected");

  if (select && other) {
    other.style.display = "none";
    select.addEventListener("change", () => {
      other.style.display = select.value === "Other" ? "block" : "none";
    });
  }


  // ---------- TEXT SPLIT ANIMATION ----------
  const splitH1 = new SplitType(".text-h1-xl", { types: "words" });
  const splitXL = new SplitType(".text-xl", { types: "words" });

  gsap.timeline()
    .from(splitH1.words, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "back.inOut",
      stagger: 0.1
    })
    .from(splitXL.words, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "back.inOut",
      stagger: 0.1
    }, "+=0.3");


  // ---------- SCROLL LOAD ----------
  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".load-in", {
    y: -100,
    opacity: 0,
    stagger: 0.2,
    ease: "none"
  });

});