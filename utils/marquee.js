// Marquee effect for long lists of items
// This script creates a marquee effect for long lists of items.
// It duplicates the items to create an infinite scrolling effect.
// Required attribute: data-marquee-element="list"
// Optional attributes:
// - data-marquee-speed: speed of the marquee (default is 40)
// - data-marquee-hover: pause on hover (default is false)

document.addEventListener("DOMContentLoaded", () => {
  const marquees = document.querySelectorAll("[data-marquee-element='list']");

  marquees.forEach((marqueeList) => {
    const speed = marqueeList.dataset.marqueeSpeed || "40";
    const pauseOnHover = marqueeList.dataset.marqueeHover === "pause";
    const wrapper = marqueeList.parentElement;

    // Ensure wrapper has required styles
    wrapper.style.overflow = "hidden";
    wrapper.style.position = "relative";

    // Ensure marqueeList is one long horizontal line
    marqueeList.style.display = "flex";
    marqueeList.style.flexWrap = "nowrap";
    marqueeList.style.willChange = "transform";
    marqueeList.style.animation = `marquee-scroll ${speed}s linear infinite`;

    // Duplicate only the children
    const children = Array.from(marqueeList.children);
    children.forEach((child) => {
      const clone = child.cloneNode(true);
      marqueeList.appendChild(clone);
    });

    // Pause on hover if needed
    if (pauseOnHover) {
      wrapper.addEventListener("mouseenter", () => {
        marqueeList.style.animationPlayState = "paused";
      });
      wrapper.addEventListener("mouseleave", () => {
        marqueeList.style.animationPlayState = "running";
      });
    }

    // Inject keyframes once
    if (!document.getElementById("marquee-style")) {
      const style = document.createElement("style");
      style.id = "marquee-style";
      style.innerHTML = `
        @keyframes marquee-scroll {
          0%   { transform: translate3D(0,0,0); }
          100% { transform: translate3D(-50%,0,0); }
        }
      `;
      document.head.appendChild(style);
    }

    // Handle lazy image loading
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const images = marqueeList.querySelectorAll("img[loading='lazy']");
        if (images.length === 0) {
          activateMarquee();
        } else {
          let loadedCount = 0;
          images.forEach((img) => {
            img.removeAttribute("loading");
            // on img set translate3D(0,0,0) to avoid flickering
            img.style.willChange = "transform";
            img.style.transform = "translate3D(0,0,0)";
            img.addEventListener("load", onImageLoad, { once: true });
            if (img.complete) img.dispatchEvent(new Event("load"));
          });

          function onImageLoad() {
            loadedCount++;
            if (loadedCount === images.length) activateMarquee();
          }
        }

        observer.unobserve(entry.target);
      });
    });

    observer.observe(wrapper);

    function activateMarquee() {
      // Restart animation (in case of layout shift)
      marqueeList.style.animation = "none";
      void marqueeList.offsetWidth; // trigger reflow
      marqueeList.style.animation = `marquee-scroll ${speed}s linear infinite`;
    }
  });
});
