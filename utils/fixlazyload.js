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
        images.forEach((img) => img.removeAttribute("loading"));
        intersectionObserver.unobserve(wrapper);
      }
    });
  });

  lazyWrappers.forEach((wrapper) => {
    intersectionObserver.observe(wrapper);
  });
});
