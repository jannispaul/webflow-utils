// Docs: https://developers.lottiefiles.com/docs/dotlottie-player/dotlottie-web/events/
// Events demo: https://codepen.io/lottiefiles/pen/dyrRKwg
import { DotLottie } from "https://esm.sh/@lottiefiles/dotlottie-web";

document.addEventListener("DOMContentLoaded", async () => {
  const lottieInstances = new Map();

  const parseLottieAttribute = (element, attrName, defaultValue, type) => {
    let value = element.getAttribute(attrName);
    if (value === null) {
      const dataAttrName = attrName.replace(/^data-/, "");
      value = element.dataset[dataAttrName];
    }
    if (value === undefined || value === null) return defaultValue;

    switch (type) {
      case "boolean":
        return value === "true" || value === "1" || value === "";
      case "number":
        return parseFloat(value);
      case "string":
      default:
        return value;
    }
  };

  const language = document.querySelector("html").lang || "en";
  const allLottieDivElements = document.querySelectorAll('div[data-animation="lottie"]');

  // Set language-specific src attribute if available
  allLottieDivElements.forEach((element) => {
    const langSrc = element.getAttribute(`data-src-${language}`);
    if (langSrc) element.setAttribute("data-src", langSrc);
  });

  async function setupLottieElement(container) {
    if (lottieInstances.has(container)) return lottieInstances.get(container);

    const path = container.dataset.src;
    if (!path) {
      console.warn("No 'data-src' found:", container);
      return null;
    }

    const autoplay = parseLottieAttribute(container, "data-autoplay", false, "boolean");
    const loop = parseLottieAttribute(container, "data-loop", false, "boolean");
    const speed = parseLottieAttribute(container, "data-speed", 1, "number");
    const direction = parseLottieAttribute(container, "data-direction", 1, "number");
    const playOnce = parseLottieAttribute(container, "data-play-once", false, "boolean");
    const fit = parseLottieAttribute(container, "data-fit", "contain", "string");
    const alignX = parseLottieAttribute(container, "data-align-x", 0.5, "number");
    const alignY = parseLottieAttribute(container, "data-align-y", 0.5, "number");

    const placeholderImg = container.querySelector("img");
    if (placeholderImg) placeholderImg.remove();

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);

    try {
      const instance = new DotLottie({
        canvas,
        src: path,
        autoplay,
        speed,
        mode: direction === -1 ? "reverse" : "normal",
        loop: true, // --> Needs to be set to true to replay a lottie even though its not an actual loop
        layout: { fit: fit, align: [alignX, alignY] },
      });

      // Wait for multiple ready states
      await new Promise((resolve) => {
        instance.addEventListener("load", resolve, { once: true });
      });

      instance.customSettings = {
        shouldAutoplay: autoplay,
        playOnce,
        hasCompleted: false,
        isReady: true,
      };

      if (playOnce) {
        instance.addEventListener("complete", () => {
          instance.customSettings.hasCompleted = true;
          console.log("stopping", container);
          instance.pause();
          instance.stop();
        });
      }

      lottieInstances.set(container, instance);
      return instance;
    } catch (err) {
      console.error("Failed to initialize DotLottie:", { path, err });
      return null;
    }
  }

  function handleVisibility(container, isVisible) {
    const instance = lottieInstances.get(container);
    if (!instance) return;

    // Add readiness check
    if (!instance.isLoaded) {
      console.log("Animation not fully loaded yet", container);
      return;
    }

    const { shouldAutoplay, playOnce, hasCompleted } = instance.customSettings;

    if (isVisible && shouldAutoplay) {
      instance.setLoop(false);

      if ((playOnce && hasCompleted) || instance.isPlaying) return;

      // Add small delay to ensure DOM is stable
      requestAnimationFrame(() => {
        instance.stop();
        instance.unfreeze();
        instance.play();

        console.log("play", container);
      });
    } else {
      if (!playOnce || (playOnce && !hasCompleted)) {
        instance.pause();
        console.log("pause", container);
      }
    }
  }

  // Setup all instances eagerly
  await Promise.all([...allLottieDivElements].map((el) => setupLottieElement(el)));

  // Create observer to play/pause on visibility
  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        // Add delay to ensure layout is stable

        handleVisibility(target, isIntersecting);
      });
    },
    {
      threshold: 0.1,
      // Add root margin for earlier detection
      rootMargin: "100px",
    }
  );

  document.addEventListener(
    "click",
    (e) => {
      if (!e.target.closest(".w-tabs")) return;
      const el = e.target.closest(".w-tabs");
      console.log(el);

      //   requestAnimationFrame(() => {
      el.querySelectorAll(`div[data-animation="lottie"]`).forEach((lottieContainer) => {
        const isVisible = lottieContainer.offsetParent !== null;
        // console.log("check visibility", lottieContainer, isVisible);
        handleVisibility(lottieContainer, isVisible);
      });
      //   });
    },
    true
  );

  allLottieDivElements.forEach((el) => {
    visibilityObserver.observe(el);
  });
});
