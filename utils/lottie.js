// Import the dotLottie web component from the latest package
// Docs: https://developers.lottiefiles.com/docs/dotlottie-player/dotlottie-wc/
// This is not documented anywhere:
// To get the dotlottie instance select the dotlottie-wc element and access the dotLottie property

import lottiefilesdotlottieWc from "https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-wc@0.6.4/+esm";

//www.npmjs.com/package/@lottiefiles/dotlottie-wc
document.addEventListener("DOMContentLoaded", async () => {
  // Map to store DotLottie instances for each element
  const lottieInstances = new Map();
  const componentSelector = "dotlottie-wc";

  // Helper to convert data attribute strings to appropriate types
  const parseLottieAttribute = (element, attrName, defaultValue, type) => {
    // First check for the attribute directly (for non-"data-" prefixed attributes)
    let value = element.getAttribute(attrName);
    if (value === null) {
      // Then check for the data attribute version
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

  // 1. Language-based source update for ALL Lottie elements
  const language = document.querySelector("html").lang || "en";
  const allLottieDivElements = document.querySelectorAll('div[data-animation-type="lottie"]');

  allLottieDivElements.forEach((element) => {
    const langSrc = element.getAttribute(`data-src-${language}`);
    if (langSrc) {
      element.setAttribute("data-src", langSrc); // Update the main data-src
    }
  });

  // Get all lazy load lottie elements
  const lazyLotties = [...document.querySelectorAll('div[data-loading="lazy"][data-animation-type="lottie"]')];

  // Get non-lazy lotties (should load immediately)
  const eagerLotties = [...allLottieDivElements].filter((el) => !el.hasAttribute("data-loading") || el.dataset.loading !== "lazy");

  // Helper to check if the DotLottie instance has been created and loaded
  //   const checkLoaded = (lottieEl) => {
  //     const player = lottieEl.querySelector(componentSelector);
  //     return player && player.load && player.load.fulfilled;
  //   };

  // Function to set up a lottie element with a dotlottie-player component
  async function setupLottieElement(lottieEl) {
    if (lottieEl.querySelector(componentSelector)) {
      // Already set up
      return lottieEl.querySelector(componentSelector);
    }

    const path = lottieEl.dataset.src;
    if (!path) {
      console.warn("No 'data-src' found for lottie element:", lottieEl);
      return null;
    }

    // Read all properties from data attributes
    const autoplay = parseLottieAttribute(lottieEl, "data-autoplay", false, "boolean");
    const loop = parseLottieAttribute(lottieEl, "data-loop", false, "boolean");
    const speed = parseLottieAttribute(lottieEl, "data-speed", 1, "number");
    const direction = parseLottieAttribute(lottieEl, "data-direction", 1, "number");
    const renderer = parseLottieAttribute(lottieEl, "data-renderer", "svg", "string");
    const playOnce = parseLottieAttribute(lottieEl, "data-play-once", false, "boolean");
    const fit = parseLottieAttribute(lottieEl, "data-fit", "contain", "string");
    const align = parseLottieAttribute(lottieEl, "data-align", "center", "string");

    // Remove any placeholder img that Webflow might inject
    const placeholderImg = lottieEl.querySelector("img");
    if (placeholderImg) placeholderImg.remove();

    // Create dotlottie-player element
    const player = document.createElement(componentSelector);
    player.src = path;
    player.autoplay = false; // We'll control playback with the IntersectionObserver
    player.loop = playOnce ? false : loop;
    player.speed = speed;
    player.direction = direction;
    player.renderer = renderer;
    player.style.width = "100%";
    player.style.height = "100%";

    // Set layout fit
    // player.setLayout({
    //   fit: "cover", // Change 'contain' to your desired fit value (e.g., 'cover', 'fill', etc.)
    // });

    // Store this configuration
    player.setAttribute("fit", fit);
    player.setAttribute("align", align);
    player.setAttribute("data-play-once", playOnce);
    player.setAttribute("data-should-autoplay", autoplay);

    // Add the player to the container
    lottieEl.appendChild(player);

    // Wait for the player to be ready
    await new Promise((resolve) => {
      if (player.load && player.load.fulfilled) {
        resolve();
      } else {
        player.addEventListener("ready", resolve, { once: true });
      }
    });

    // Add complete event listener for playOnce logic
    if (playOnce) {
      player.addEventListener("complete", () => {
        player.pause();
        // Optionally reset to first frame
        player.seek("0%");
      });
    }

    // Store reference
    lottieInstances.set(lottieEl, player);

    return player;
  }

  // Handle visibility control of a lottie element
  function handleLottieVisibility(lottieWrap, isVisible) {
    const lottieEl = lottieWrap.querySelector(componentSelector);
    if (!lottieEl) return;
    const lottiePlayer = lottieEl.dotLottie;

    const playOnce = lottieEl.getAttribute("data-play-once") === "true";
    const shouldAutoplay = lottieEl.getAttribute("data-should-autoplay") === "true";
    if (isVisible) {
      // Only play if it should autoplay or was explicitly set to autoplay
      if (shouldAutoplay) {
        // If this animation is set to play once and has completed, reset it
        if (playOnce && lottiePlayer.isStopped) {
          lottiePlayer.setFrame("0");
        }
        lottiePlayer.play();
        console.log("Lottie", lottieEl, lottiePlayer, lottiePlayer.isStopped);
        lottiePlayer.addEventListener("load", () => {
          console.log("Lottie loaded:", lottieEl, lottiePlayer);
          lottiePlayer.play();
        });
      }
    } else {
      // Only pause if it's playing and not set to play once
      // (if it's playing once, let it finish)
      if (lottiePlayer.isPlaying && !playOnce) {
        lottiePlayer.pause();
      }
    }
  }

  // Set up eager loading lottie elements right away
  eagerLotties.forEach(async (lottieWrap) => {
    const lottieEl = await setupLottieElement(lottieWrap);
    // Auto play if element is visible and has autoplay enabled
    if (lottieEl && lottieEl.getAttribute("data-should-autoplay") === "true") {
      const rect = lottieWrap.getBoundingClientRect();
      const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0;
      if (isVisible) {
        lottieEl.dotLottie.play();
      }
    }
  });

  // Set up intersection observers
  // Observer for when elements are in the viewport - for playback
  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        handleLottieVisibility(entry.target, entry.isIntersecting);
      });
    },
    { threshold: 0.1 } // Play when at least 10% visible
  );

  if (lazyLotties.length > 0) {
    // Observer for when elements are near the viewport - for loading
    const lazyLoadObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            const lottieEl = entry.target;
            await setupLottieElement(lottieEl);
            observer.unobserve(lottieEl); // Stop observing for loading

            // Once loaded, start observing for visibility/playback
            visibilityObserver.observe(lottieEl);
          }
        });
      },
      { rootMargin: "1250px" } // Load when 1250px away from viewport
    );

    // Start observing all lazy lottie elements for loading
    lazyLotties.forEach((lottieEl) => {
      lazyLoadObserver.observe(lottieEl);
    });
  }

  // Also observe eager lotties for visibility changes
  eagerLotties.forEach((lottieEl) => {
    visibilityObserver.observe(lottieEl);
  });

  // --- New Logic for handling display: none elements ---
  const allObservableLotties = [...allLottieDivElements]; // Combine eager and lazy lotties for mutation observing

  allObservableLotties.forEach((lottieWrap) => {
    const mutationObserver = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "attributes" && mutation.attributeName === "style") {
          const currentDisplay = window.getComputedStyle(lottieWrap).display;

          // If the element was hidden and is now visible
          if (currentDisplay !== "none" && mutation.oldValue && mutation.oldValue.includes("display: none")) {
            // Re-check visibility and potentially play
            const lottieEL = lottieInstances.get(lottieWrap);
            if (lottieEL && lottieEL.getAttribute("data-should-autoplay") === "true") {
              const rect = lottieWrap.getBoundingClientRect();
              const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0;
              if (isVisible) {
                lottieEL.dotLottie.play();
              }
            }
            // Ensure the IntersectionObserver is already watching this element
            // This is handled by observing all lotties (eagerly or after lazy load)
            // However, if the element was display:none from the start, the IntersectionObserver
            // might not have fired yet. A quick re-observation might be useful here if needed,
            // but the current setup should eventually catch it.
          }
        }
      }
    });

    // Start observing the style attribute for changes
    mutationObserver.observe(lottieWrap, { attributes: true, attributeFilter: ["style"], attributeOldValue: true });
  });
});
