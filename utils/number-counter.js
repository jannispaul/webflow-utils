// Script to create number counter
// Attributes:
// data-counter-element="counter" -> put counter element
// data-counter-start="100" -> start value
// data-counter-end="200" -> end value
// data-counter-duration="1000" -> duration in miliseconds
// data-counter-threshold="25" -> element visible when 25% of viewport height from top
// data-counter-locale="en-US" -> locale for number formatting

"use strict";
(() => {
  // --- Helper Functions ---

  /**
   * Parses a number from a string, returning a default value if invalid.
   * @param {string | null} value - The string to parse.
   * @param {number | null} defaultValue - The default value to return if parsing fails.
   * @returns {number | null} The parsed number or the default.
   */
  function parseNumber(value, defaultValue) {
    if (!value) return defaultValue != null ? defaultValue : null;
    const parsed = Number(value);
    return isNaN(parsed) ? defaultValue || null : parsed;
  }

  /**
   * Parses the initial number from an element's text content.
   * @param {HTMLElement} element - The element to read text content from.
   * @returns {number | null} The parsed number or null if invalid.
   */
  const parseInitialNumberFromText = (element) => {
    const { textContent } = element;
    if (!textContent) return null;
    const parsed = Number(textContent);
    return isNaN(parsed) ? null : parsed;
  };

  /**
   * Formats a number according to a specified locale or as a plain string.
   * @param {number} number - The number to format.
   * @param {string | boolean | undefined} locale - The locale string, `true` for auto, or `undefined`.
   * @returns {string} The formatted number string.
   */
  const formatNumber = (number, locale) => {
    if (typeof locale === "string") {
      return number.toLocaleString(locale);
    } else if (locale === true) {
      return number.toLocaleString(); // Auto-detect locale
    }
    return number.toString();
  };

  /**
   * Sets accessibility attributes for the counting element.
   * @param {HTMLElement} element - The element to modify.
   * @param {number} startValue - The starting value for the description.
   * @param {number} endValue - The ending value for the description.
   */
  const setAccessibilityAttributes = (element, startValue, endValue) => {
    const ROLE_ATTRIBUTE = "role";
    const ARIA_ROLEDESCRIPTION = "aria-roledescription";
    const ARIA_DESCRIPTION = "aria-description";

    element.setAttribute(ROLE_ATTRIBUTE, "marquee");
    const description = `Number count animation from ${startValue} to ${endValue}`;
    element.hasAttribute(ARIA_ROLEDESCRIPTION) || element.setAttribute(ARIA_ROLEDESCRIPTION, description);
    element.hasAttribute(ARIA_DESCRIPTION) || element.setAttribute(ARIA_DESCRIPTION, description);
  };

  /**
   * Animates a number from a start value to an end value over a duration.
   * @param {HTMLElement} element - The element whose text content will be animated.
   * @param {number} startValue - The starting number for the animation.
   * @param {number} endValue - The target ending number for the animation.
   * @param {number} durationMs - The duration of the animation in milliseconds.
   * @param {string | boolean | undefined} locale - The locale for number formatting.
   */
  const animateNumber = (element, startValue, endValue, durationMs, locale) => {
    let startTime = null;

    const animationFrameCallback = (currentTime) => {
      startTime === null && (startTime = currentTime);
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const currentValue = startValue + (endValue - startValue) * progress;

      element.textContent = formatNumber(Math.floor(currentValue), locale);

      if (progress < 1) {
        requestAnimationFrame(animationFrameCallback);
      } else {
        element.textContent = formatNumber(endValue, locale); // Ensure final value is exactly endValue
      }
    };
    requestAnimationFrame(animationFrameCallback);
  };

  /**
   * A basic debounce function to limit function calls.
   * @param {Function} func - The function to debounce.
   * @param {number} delay - The debounce delay in milliseconds.
   * @param {object} [options] - Options object.
   * @param {boolean} [options.leading=true] - Whether to invoke the function on the leading edge.
   * @param {boolean} [options.trailing=!leading] - Whether to invoke the function on the trailing edge.
   * @returns {Function} The debounced function.
   */
  const debounce = (func, delay, options = {}) => {
    let timeoutId = null;
    let lastArgs = null;
    let { leading = true, trailing = !leading } = options;

    const throttledFunc = () => {
      timeoutId && (clearTimeout(timeoutId), (timeoutId = null));
    };

    const flushFunc = () => {
      const args = lastArgs;
      throttledFunc();
      args && args();
    };

    const wrapper = function (...args) {
      const isLeadingCall = leading && !timeoutId;
      lastArgs = () => func.apply(this, args);

      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          timeoutId = null;
          if (trailing) lastArgs();
        }, delay);
      }

      if (isLeadingCall) {
        lastArgs();
      }
    };
    wrapper.cancel = throttledFunc;
    wrapper.flush = flushFunc;
    return wrapper;
  };

  /**
   * Sets up an Intersection Observer to trigger a callback when an element
   * enters the viewport based on a threshold.
   * @param {HTMLElement} element - The element to observe.
   * @param {number} thresholdPercentage - The percentage of the element visible to trigger the callback (0-100).
   * @param {Function} animationStartCallback - The function to call when the element is in view.
   * @returns {Function} A cleanup function to disconnect observers.
   */
  const setupInViewAnimation = (element, thresholdPercentage, animationStartCallback) => {
    const isElementInView = (elementTop) => window.innerHeight * (1 - thresholdPercentage / 100) - elementTop >= 0;

    const throttledScrollCheck = debounce(async () => {
      const { top: elementTop } = element.getBoundingClientRect();
      if (isElementInView(elementTop)) {
        cleanupObservers();
        animationStartCallback();
      }
    }, 100);

    const intersectionObserver = new IntersectionObserver((entries) => {
      for (const { isIntersecting, intersectionRect } of entries) {
        // Add/remove scroll listener based on intersection status
        if (isIntersecting) {
          window.addEventListener("scroll", throttledScrollCheck);
          // Also check immediately if already in view when it starts intersecting
          if (isElementInView(intersectionRect.top)) {
            animationStartCallback();
            cleanupObservers(); // Cleanup immediately if it already met the condition
          }
        } else {
          window.removeEventListener("scroll", throttledScrollCheck);
        }
      }
    });

    const cleanupObservers = () => {
      intersectionObserver.disconnect();
      window.removeEventListener("scroll", throttledScrollCheck);
    };

    intersectionObserver.observe(element);
    return cleanupObservers;
  };

  // --- Main Counter Logic ---

  // Custom data attribute prefix for the counter elements
  const DATA_COUNTER_PREFIX = "data-counter";
  const DATA_INITIALIZED_ATTRIBUTE = `${DATA_COUNTER_PREFIX}-initialized`; // e.g., data-counter-initialized

  // Default values
  const DEFAULT_START_VALUE = 0;
  const DEFAULT_DURATION_MS = 1000; // 1 second
  const DEFAULT_THRESHOLD_PERCENTAGE = 25; // Element visible when 25% of viewport height from top

  /**
   * Processes a single counter element found on the page.
   * It extracts configuration from data attributes, sets the initial value,
   * and sets up the in-view animation.
   * @param {HTMLElement} element - The counter element to process.
   * @returns {Function} A cleanup function for the observers.
   */
  const initializeCounterElement = (element) => {
    // --- Safeguard: Check if element has already been initialized ---
    if (element.hasAttribute(DATA_INITIALIZED_ATTRIBUTE)) {
      // console.warn("Element already initialized, skipping:", element); // For debugging
      return () => {}; // Return a no-op cleanup function
    }

    // Get values from data attributes
    const startValueAttr = element.getAttribute(`${DATA_COUNTER_PREFIX}-start`);
    const endValueAttr = element.getAttribute(`${DATA_COUNTER_PREFIX}-end`);
    const durationAttr = element.getAttribute(`${DATA_COUNTER_PREFIX}-duration`);
    const thresholdAttr = element.getAttribute(`${DATA_COUNTER_PREFIX}-threshold`);
    const localeAttr = element.getAttribute(`${DATA_COUNTER_PREFIX}-locale`);

    // Determine the end value (default to current text content if no attribute)
    const endValue = parseNumber(endValueAttr, parseInitialNumberFromText(element));

    // If no valid end value can be determined, skip this element
    if (endValue === null || typeof endValue !== "number") {
      console.warn("Counter element found without a valid 'end' value. Skipping.", element);
      element.setAttribute(DATA_INITIALIZED_ATTRIBUTE, "error"); // Mark as attempted but failed
      return () => {}; // Return a no-op cleanup
    }

    // Parse other values with defaults
    const startValue = parseNumber(startValueAttr, DEFAULT_START_VALUE);
    const durationMs = parseNumber(durationAttr, DEFAULT_DURATION_MS);
    const thresholdPercentage = parseNumber(thresholdAttr, DEFAULT_THRESHOLD_PERCENTAGE);

    // Determine locale for formatting
    const locale = localeAttr === "auto" ? true : localeAttr || undefined;

    // Set the initial display value immediately
    element.textContent = formatNumber(startValue, locale);

    // Set accessibility attributes
    setAccessibilityAttributes(element, startValue, endValue);

    // Set up the in-view animation trigger
    const cleanupFunction = setupInViewAnimation(element, thresholdPercentage, () => {
      animateNumber(element, startValue, endValue, durationMs, locale);
    });

    // --- Mark element as initialized after successful setup ---
    element.setAttribute(DATA_INITIALIZED_ATTRIBUTE, "true");

    // Return the cleanup function
    return cleanupFunction;
  };

  /**
   * Finds all counter elements on the page and initializes them.
   * This is the entry point of the script.
   */
  const initCounters = () => {
    // Find all elements with the main counter attribute (e.g., data-counter="number")
    // Note: If you want to identify elements by a different specific attribute (e.g., data-counter-element="number"),
    // adjust this selector accordingly. For simplicity, I'm assuming a generic `data-counter` presence.
    // If you had data-counter="my-counter", you'd change the selector.
    const counterElements = document.querySelectorAll(`[${DATA_COUNTER_PREFIX}-element="number"]:not([${DATA_INITIALIZED_ATTRIBUTE}])`);

    const cleanupFunctions = [];

    counterElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        // Ensure it's an HTMLElement
        const cleanup = initializeCounterElement(element);
        cleanupFunctions.push(cleanup);
      }
    });

    // Optionally, if you want a global cleanup mechanism for the entire script:
    window.addEventListener("beforeunload", () => {
      cleanupFunctions.forEach((cleanup) => cleanup());
    });
  };

  // Run the initialization when the DOM is ready
  document.addEventListener("DOMContentLoaded", initCounters);
})();
