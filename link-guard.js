(function () {
  "use strict";

  var FALLBACK_404 = "/404.html";

  function isIgnoredHref(href) {
    return (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:")
    );
  }

  function isSameOrigin(url) {
    return url.origin === window.location.origin;
  }

  async function targetExists(url) {
    try {
      var response = await fetch(url.href, {
        method: "HEAD",
        cache: "no-store",
        redirect: "follow",
      });
      if (response.ok) return true;
      if (response.status !== 405 && response.status !== 501) return false;
    } catch (_) {
      return false;
    }

    try {
      var fallbackResponse = await fetch(url.href, {
        method: "GET",
        cache: "no-store",
        redirect: "follow",
      });
      return fallbackResponse.ok;
    } catch (_) {
      return false;
    }
  }

  function goTo404() {
    window.location.href = new URL(FALLBACK_404, window.location.origin).href;
  }

  document.addEventListener(
    "click",
    async function (event) {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      var clickable = event.target.closest("a[href], [data-url]");
      if (!clickable) return;

      var href = clickable.matches("a[href]")
        ? clickable.getAttribute("href")
        : clickable.getAttribute("data-url");

      if (isIgnoredHref(href)) return;
      if (clickable.getAttribute("target") === "_blank") return;

      var url;
      try {
        url = new URL(href, window.location.href);
      } catch (_) {
        event.preventDefault();
        event.stopImmediatePropagation();
        goTo404();
        return;
      }

      if (!isSameOrigin(url)) return;

      if (url.pathname === window.location.pathname && url.hash) return;

      var exists = await targetExists(url);
      if (exists) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      goTo404();
    },
    true,
  );
})();