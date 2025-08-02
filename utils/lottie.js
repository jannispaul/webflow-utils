// import { DotLottie } from "https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web@0.49.0/+esm";
import { DotLottie } from "https://esm.sh/@lottiefiles/dotlottie-web";

document.addEventListener("DOMContentLoaded", async () => {
  const componentSelector = ".dotlottie-canvas";
  const lottieInstances = new Map();
  const language = document.documentElement.lang || "en";

  const parseAttr = (el, name, def, type = "string") => {
    const val = el.getAttribute(name) ?? el.dataset[name.replace(/^data-/, "")];
    if (val == null) return def;
    if (type === "boolean") return val === "true" || val === "1" || val === "";
    if (type === "number") return parseFloat(val);
    return val;
  };

  const allLottieElements = [...document.querySelectorAll('div[data-animation-type="lottie"]')];

  allLottieElements.forEach((el) => {
    const langSrc = el.getAttribute(`data-src-${language}`);
    if (langSrc) el.setAttribute("data-src", langSrc);
  });

  const [lazyLotties, eagerLotties] = allLottieElements.reduce(([lazy, eager], el) => (el.dataset.loading === "lazy" ? [[...lazy, el], eager] : [lazy, [...eager, el]]), [[], []]);

  const setupLottie = async (container) => {
    if (container.querySelector(componentSelector)) return;

    const path = container.dataset.src;
    if (!path) return console.warn("Missing data-src:", container);

    const autoplay = parseAttr(container, "data-autoplay", false, "boolean");
    const loop = parseAttr(container, "data-loop", false, "boolean");
    const speed = parseAttr(container, "data-speed", 1, "number");
    const direction = parseAttr(container, "data-direction", 1, "number");
    const playOnce = parseAttr(container, "data-play-once", false, "boolean");
    const fit = parseAttr(container, "data-fit", "cover");
    const alignX = parseAttr(container, "data-align-x", "center", "number");
    const alignY = parseAttr(container, "data-align-y", "center", "number");
    const align = [alignX, alignY];

    container.querySelector("img")?.remove();

    const canvas = document.createElement("canvas");
    canvas.className = "dotlottie-canvas";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.dataset.playOnce = playOnce;
    canvas.dataset.autoplay = autoplay;

    canvas.setAttribute("data-play-once", playOnce);
    canvas.setAttribute("data-autoplay", autoplay);
    container.appendChild(canvas);

    try {
      const instance = new DotLottie({
        autoplay: false,
        loop: playOnce ? false : loop,
        canvas,
        src: path,
        layout: {
          fit,
          align,
        },
      });

      //   instance.setLayout({ fit, align });
      if (speed !== 1) instance.setSpeed(speed);
      if (direction === -1) instance.setMode("reverse");

      if (playOnce) {
        instance.addEventListener("complete", () => {
          instance.pause();
          instance.setFrame(0);
        });
      }

      instance.addEventListener("load", () => {
        const isVisible = container.getBoundingClientRect().top <= window.innerHeight;
        if (autoplay && isVisible) instance.play();
      });

      lottieInstances.set(container, instance);
    } catch (err) {
      console.error("Failed to setup lottie:", path, err);
    }
  };

  const handleVisibility = (container, isVisible) => {
    const canvas = container.querySelector(componentSelector);
    const instance = lottieInstances.get(container);
    if (!canvas || !instance) return;

    const autoplay = canvas.getAttribute("data-autoplay") === "true";
    const playOnce = canvas.getAttribute("data-play-once") === "true";

    if (isVisible && autoplay) {
      if (instance.isLoaded) {
        if (playOnce && instance.isPaused) instance.setFrame(0);

        instance.play();
      } else {
        instance.addEventListener(
          "load",
          () => {
            if (playOnce && instance.isPaused) instance.setFrame(0);
            instance.play();
          },
          { once: true }
        );
      }
    } else if (!playOnce && instance.isPlaying) {
      instance.pause();
    }
  };

  const visibilityObserver = new IntersectionObserver((entries) => entries.forEach((e) => handleVisibility(e.target, e.isIntersecting)), { threshold: 0.1 });

  for (const el of eagerLotties) {
    await setupLottie(el);
    visibilityObserver.observe(el);
    handleVisibility(el, el.getBoundingClientRect().top <= window.innerHeight);
  }

  if (lazyLotties.length) {
    const lazyObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(async (e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          await setupLottie(el);
          observer.unobserve(el);
          visibilityObserver.observe(el);
          handleVisibility(el, true);
        });
      },
      { rootMargin: "1250px" }
    );
    lazyLotties.forEach((el) => lazyObserver.observe(el));
  }

  allLottieElements.forEach((el) => {
    new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.attributeName === "style" && m.oldValue?.includes("display: none")) {
          const canvas = el.querySelector(componentSelector);
          const instance = lottieInstances.get(el);
          console.log("mutation triggered", canvas, instance);
          if (canvas?.getAttribute("data-autoplay") === "true" && instance) {
            const visible = el.getBoundingClientRect().top <= window.innerHeight;
            if (visible) instance.play();
          }
        }
      });
    }).observe(el, { attributes: true, attributeFilter: ["style"], attributeOldValue: true });
  });
});
