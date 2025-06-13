// Marquee effect
// This script creates a marquee effect for lists of items. Marquees are "infinitly" moving lists.
// The marquee effect can be implemented using CSS animations only.
// However, this solution uses JavaScript to create a more robust and flexible solution, that uses CSS under the hood but handles issues that can arise, espacially in Safari like:
// - Faulty calculation of the width of the list due to lazy loaded images or unset widths, which can cause jumping and lagging.
// - Flickering items
// It duplicates the items in the list to create the illusion of infinity

// Required attribute:
// data-marquee-element="list"

// Optional attributes:
// - data-marquee-speed: speed of the marquee (default is 40)
// - data-marquee-speed-tablet: speed of the marquee on tablet 991px and down
// - data-marquee-speed-landscape: speed of the marquee on landscape 767px and down
// - data-marquee-speed-mobile: speed of the marquee on mobile 479px and down
// - data-marquee-hover: pause on hover (default is false)
// - data-marquee-direction: "reverse" (default is normal)

// Marquee effect
document.addEventListener("DOMContentLoaded", () => {
  const marquees = document.querySelectorAll("[data-marquee-element='list']");

  marquees.forEach((marqueeList, index) => {
    if (marqueeList.dataset.marqueeInitialized === "true") return;
    marqueeList.dataset.marqueeInitialized = "true";

    const pauseOnHover = marqueeList.dataset.marqueeHover === "pause";
    const direction = marqueeList.dataset.marqueeDirection === "reverse" ? "reverse" : "normal";
    const wrapper = marqueeList.parentElement;

    // Apply wrapper styles
    wrapper.style.overflow = "hidden";
    wrapper.style.position = "relative";

    // Setup marquee list styles
    marqueeList.style.display = "flex";
    marqueeList.style.flexWrap = "nowrap";
    marqueeList.style.willChange = "transform";

    // Apply safe styles to children
    Array.from(marqueeList.children).forEach((child) => {
      child.style.flex = "0 0 auto";
      child.style.minWidth = "0";
      child.style.boxSizing = "border-box";
    });

    // Duplicate children
    const children = Array.from(marqueeList.children);
    children.forEach((child) => {
      const clone = child.cloneNode(true);
      marqueeList.appendChild(clone);
    });

    if (pauseOnHover) {
      wrapper.addEventListener("mouseenter", () => {
        marqueeList.style.animationPlayState = "paused";
      });
      wrapper.addEventListener("mouseleave", () => {
        marqueeList.style.animationPlayState = "running";
      });
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const images = marqueeList.querySelectorAll("img[loading='lazy']");
        if (images.length === 0) {
          activateMarquee();
        } else {
          let loaded = 0;
          images.forEach((img) => {
            img.removeAttribute("loading");
            img.style.willChange = "transform";
            img.style.transform = "translate3D(0,0,0)";
            img.addEventListener("load", onImageLoad, { once: true });
            if (img.complete) img.dispatchEvent(new Event("load"));
          });

          function onImageLoad() {
            loaded++;
            if (loaded === images.length) activateMarquee();
          }
        }

        observer.unobserve(entry.target);
      });
    });

    observer.observe(wrapper);

    function getResponsiveSpeed(el) {
      const w = window.innerWidth;
      if (w <= 479 && el.dataset.marqueeSpeedMobile) return parseFloat(el.dataset.marqueeSpeedMobile);
      if (w <= 767 && el.dataset.marqueeSpeedLandscape) return parseFloat(el.dataset.marqueeSpeedLandscape);
      if (w <= 991 && el.dataset.marqueeSpeedTablet) return parseFloat(el.dataset.marqueeSpeedTablet);
      return parseFloat(el.dataset.marqueeSpeed || "40");
    }

    function activateMarquee() {
      let speed = getResponsiveSpeed(marqueeList);
      marqueeList.style.animation = "none";
      void marqueeList.offsetWidth; // trigger reflow

      const firstClone = marqueeList.children[marqueeList.children.length / 2];
      const scrollWidth = firstClone.offsetLeft;

      const animName = `marquee-scroll-${index}-${scrollWidth}-${speed}`;
      const existingStyle = document.getElementById(`style-${animName}`);
      if (existingStyle) existingStyle.remove();

      const style = document.createElement("style");
      style.id = `style-${animName}`;
      style.textContent = `
          @keyframes ${animName} {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-${scrollWidth}px, 0, 0); }
          }
        `;
      document.head.appendChild(style);

      marqueeList.style.animation = `${animName} ${speed}s linear infinite ${direction}`;
    }

    window.addEventListener("resize", () => {
      marqueeList.dataset.marqueeInitialized = "false";
      marqueeList.style.animation = "none";
      void marqueeList.offsetWidth;
      marqueeList.dataset.marqueeInitialized = "true";
      activateMarquee();
    });
  });
});
