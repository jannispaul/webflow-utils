// Script to create number counter
// Based on finsweet number counter but improved with decimal support, easing options, and setting start value on initialization. Preventing flickering.
// Attributes:
// data-counter-element="counter" -> put counter element
// data-counter-start="100" -> start value
// data-counter-end="200" -> end value
// data-counter-duration="1000" -> duration in miliseconds
// data-counter-threshold="25" -> element visible when 25% of viewport height from top
// data-counter-locale="en-US" -> locale for number formatting
// data-counter-decimals="0" -> number of decimals
// data-counter-ease="easeOutExpo" -> easing function

"use strict";

(() => {
    // Configuration and Attribute Keys
    const ATTR_PREFIX = "data-counter";
    const ATTRIBUTES = {
        element:    `[${ATTR_PREFIX}-element="number"]`,
        start:      `${ATTR_PREFIX}-start`,
        end:        `${ATTR_PREFIX}-end`,
        duration:   `${ATTR_PREFIX}-duration`,
        threshold:  `${ATTR_PREFIX}-threshold`,
        locale:     `${ATTR_PREFIX}-locale`,
        decimals:   `${ATTR_PREFIX}-decimals`,
        ease:       `${ATTR_PREFIX}-ease` // New Attribute
    };

    const DEFAULTS = {
        start: 0,
        duration: 2000, // Increased slightly as easing looks better with more time
        threshold: 25, 
        decimals: 0,
        ease: "easeOutExpo" // Defaulting to a snappy "pop" effect
    };

    /**
     * Easing Functions Dictionary
     * t = time (0 to 1)
     */
    const EASING_FUNCTIONS = {
        linear: t => t,
        // Slows down at the end (Standard)
        easeOut: t => t * (2 - t), 
        // Slows down significantly at the end (Smooth)
        easeOutCubic: t => (--t) * t * t + 1,
        // Starts fast, snaps into place (Very professional feel)
        easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
        // Slow start, fast middle, slow end
        easeInOut: t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    };

    const isNumeric = (val) => typeof val === 'number' && !isNaN(val);

    const parseAttr = (element, attr, fallback) => {
        const value = element.getAttribute(attr);
        if (!value) return fallback;
        const num = parseFloat(value);
        return isNumeric(num) ? num : fallback;
    };

    const formatNumber = (value, locale, decimalPlaces) => {
        const options = {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces
        };
        const localeString = (locale && locale !== "auto") ? locale : undefined;
        return value.toLocaleString(localeString, options);
    };

    /**
     * The Main Animation Loop
     */
    const animateCount = (element, start, end, duration, locale, decimals, easeName) => {
        let startTime = null;

        // Select easing function, fallback to linear if name not found
        const easeFunc = EASING_FUNCTIONS[easeName] || EASING_FUNCTIONS[DEFAULTS.ease];

        const step = (currentTime) => {
            if (!startTime) startTime = currentTime;
            
            const rawProgress = Math.min((currentTime - startTime) / duration, 1);
            
            // Apply Easing
            const easedProgress = easeFunc(rawProgress);
            
            const currentValue = start + (end - start) * easedProgress;

            element.textContent = formatNumber(currentValue, locale, decimals);

            if (rawProgress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = formatNumber(end, locale, decimals);
            }
        };

        requestAnimationFrame(step);
    };

    const createTrigger = (element, start, end, duration, threshold, locale, decimals, ease) => {
        const observerThreshold = threshold / 100;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(element, start, end, duration, locale, decimals, ease);
                    observer.unobserve(element);
                }
            });
        }, { threshold: observerThreshold });

        observer.observe(element);
    };

    const initInstance = (element) => {
        const endStr = element.textContent;
        const endVal = parseAttr(element, ATTRIBUTES.end, parseFloat(endStr) || 0);
        const startVal = parseAttr(element, ATTRIBUTES.start, DEFAULTS.start);
        const durationVal = parseAttr(element, ATTRIBUTES.duration, DEFAULTS.duration);
        const thresholdVal = parseAttr(element, ATTRIBUTES.threshold, DEFAULTS.threshold);
        const decimalVal = parseAttr(element, ATTRIBUTES.decimals, DEFAULTS.decimals);
        const localeVal = element.getAttribute(ATTRIBUTES.locale) || "auto";
        
        // Get Ease option or default
        const easeVal = element.getAttribute(ATTRIBUTES.ease) || DEFAULTS.ease;

        // Immediate Init
        element.textContent = formatNumber(startVal, localeVal, decimalVal);

        // Scroll Trigger
        createTrigger(element, startVal, endVal, durationVal, thresholdVal, localeVal, decimalVal, easeVal);
    };

    const init = () => {
        const elements = document.querySelectorAll(ATTRIBUTES.element);
        elements.forEach(initInstance);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    

    // Expose reinitialize function
    window.reinitNumberCounter = function(element) {
        if (element && element.nodeType === 1) {
            // Reinitialize a specific element
            initInstance(element);
        } else {
            // Reinitialize all counters
            init();
        }
    };

})();