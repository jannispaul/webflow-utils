document.addEventListener("DOMContentLoaded", function () {
  let i = Array.from(document.querySelectorAll("video:has(source[data-src])")),
    b = Array.from(document.querySelectorAll("video[autoplay]")),
    f = Array.from(document.querySelectorAll("video[replay]")),
    g = [...new Set([...i, ...b, ...f])],
    o,
    s = document.querySelector("script[data-smart-video]"),
    p = (s == null ? void 0 : s.dataset.breakpoint) || 767;
  function l() {
    return window.matchMedia(`(max-width:${p}px)`).matches;
  }
  if (((o = l()), "IntersectionObserver" in window)) {
    let u = function (t) {
      t.removeAttribute("autoplay"), (t.controls = !0), (t.controls = !1), a.unobserve(t);
    };
    var A = u;
    let r = new IntersectionObserver(
        (t, n) => {
          t.forEach((e) => {
            e.isIntersecting && (e.target.hasAttribute("loaded") || c(e.target), !e.target.hasAttribute("loop") && !e.target.hasAttribute("replay") && r.unobserve(e.target));
          });
        },
        { rootMargin: "0px 0px 200px 0px" }
      ),
      a = new IntersectionObserver((t, n) => {
        t.forEach((e) => {
          e.isIntersecting
            ? e.target.play().catch((h) => {
                h.name === "NotAllowedError" && u(e.target);
              })
            : (e.target.pause(), e.target.hasAttribute("replay") && (e.target.currentTime = 0), !e.target.hasAttribute("loop") && !e.target.hasAttribute("replay") && a.unobserve(e.target));
        });
      });
    g.forEach((t) => {
      t.hasAttribute("ignore") || (d(t), !t.hasAttribute("loaded") && Array.from(t.children).some((n) => n.hasAttribute("data-src")) && r.observe(t), (t.hasAttribute("autoplay") || t.hasAttribute("loop") || t.hasAttribute("replay")) && a.observe(t));
    });
  }
  function c(r) {
    for (let a of r.children) a.tagName === "SOURCE" && (a.src = o && a.dataset.srcMobile ? a.dataset.srcMobile : a.dataset.src);
    r.load(), r.setAttribute("loaded", !0);
  }
  function d(r) {
    o && r.dataset.posterMobile && r.setAttribute("poster", r.dataset.posterMobile);
  }
  window.addEventListener("resize", () => {
    if (o !== l()) o = l();
    else return;
    i.forEach(function (r) {
      r.hasAttribute("loaded") && c(r);
    });
  });
});
