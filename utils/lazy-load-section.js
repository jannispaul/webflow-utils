document.addEventListener("DOMContentLoaded", function () {
  // Get all lazy wrappers
  // Wrappers need to have data-element="lazy-wrapper" attribute
  // Useful for sliders / Marquee / etc.

  // Images inside will be loaded when the wrapper appears in viewport
  const lazyWrappers = document.querySelectorAll('[data-element="lazy-wrapper"]');

  if (!lazyWrappers) return;

  const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const wrapper = entry.target;
        const images = wrapper.querySelectorAll("img[loading='lazy']");

        if (images.length === 0) {
          // Emit event immediately if no images are present
          wrapper.dispatchEvent(new CustomEvent("lazyImagesLoaded", { bubbles: true }));
        } else {
          let loadedCount = 0;

          images.forEach((img) => {
            img.removeAttribute("loading");

            // Listen for the load event on each image
            img.addEventListener("load", () => {
              loadedCount++;
              if (loadedCount === images.length) {
                // Emit custom event when all images are loaded
                wrapper.dispatchEvent(new CustomEvent("lazyImagesLoaded", { bubbles: true }));
              }
            });

            // Handle cached images that may already be loaded
            if (img.complete) {
              img.dispatchEvent(new Event("load"));
            }
          });
        }

        intersectionObserver.unobserve(wrapper);
      }
    });
  });

  lazyWrappers.forEach((wrapper) => {
    intersectionObserver.observe(wrapper);
  });

  document.addEventListener("lazyImagesLoaded", (event) => {
    event.target.classList.add("loaded");
    // console.log("All images in a lazy wrapper have loaded:", event.target);
  });
});
