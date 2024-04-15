// Script to autoplay webflow tabs
// Based on flowbase: https://www.flowbase.co/blog/add-auto-rotating-tabs-in-webflow
// Mandatory attributes
// data-tabs-element="tabs"

// Optional attributes
// data-tabs-duration="5000" -> duration in miliseconds, defaults to 5seconds
// data-tabs-element="progress" -> progressbar element

document.addEventListener("DOMContentLoaded", () => {
  // Get all tab wrappers on page
  let tabWrappers = document.querySelectorAll("[data-tabs-element='tabs']");

  // Go through each tab wrapper
  tabWrappers.forEach((tabWrapper) => {
    // Setup: Get tabwrapper, tabs, duration, set animation
    // tabWrapper = tab.querySelector("[data-tabs-element='tabs']");
    let tabs = Array.from(tabWrapper.children);
    let duration = parseInt(tabWrapper.getAttribute("data-tabs-duration")) || 5000;
    let tabTimeout;
    let activeAnimation;
    let isVisible = false;
    let activeIndex = 0;
    let progressBar = tabWrapper.querySelector("[data-tabs-element='progress']");
    let progressAnimationDirection = "horizontal";
    // Check if parent of progressbar height or width is larger
    if (progressBar && progressBar.parentElement.clientHeight > progressBar.parentElement.clientWidth) {
      progressAnimationDirection = "vertical";
    }
    const progressAnimation = progressAnimationDirection === "horizontal" ? [{ width: "0%" }, { width: "100%" }] : [{ height: "0%" }, { height: "100%" }];

    // Fix for Safari
    if (navigator.userAgent.includes("Safari")) {
      tabs.forEach(
        (t) =>
          (t.focus = function () {
            const x = window.scrollX,
              y = window.scrollY;
            const f = () => {
              setTimeout(() => window.scrollTo(x, y), 1);
              t.removeEventListener("focus", f);
            };
            t.addEventListener("focus", f);
            HTMLElement.prototype.focus.apply(this, arguments);
          })
      );
    }

    // Start Tabs when visible and stop them when hidden
    let observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Activate tab (first tab by default)
          activateTab(tabs[activeIndex]);
          isVisible = true;
        } else {
          // Stop auto tab switching
          isVisible = false;
          clearTimeout(tabTimeout);
        }
      });
    });
    observer.observe(tabWrapper);

    // Connect your class names to elements.
    function activateTabAfterDelay(currentTab) {
      clearTimeout(tabTimeout);
      tabTimeout = setTimeout(() => {
        if (!isVisible) return;
        // Get next tab
        let nextTab = currentTab.nextSibling;
        activateTab(nextTab);
        // If there is no next tab go to first tab
      }, duration);
    }
    function activateTab(tab) {
      tab ? tab.click() : tabs[0].click();
      //   activeIndex = tabs.indexOf(tab);
    }

    function startProgressAnimation(tab) {
      // Reset active animation
      activeAnimation && activeAnimation.cancel();
      // Set animation duration of duration in seconds
      let progressBar = tab.querySelector("[data-tabs-element='progress']");
      // If there is a progressbar start animation
      progressBar && (activeAnimation = progressBar.animate(progressAnimation, { duration: duration, fill: "forwards" }));
    }

    // Handle tab click/focus: activate tab and show animation
    function handleEvent(tab) {
      activeIndex = tabs.indexOf(tab);
      console.log(activeIndex, tab, isVisible, tabTimeout);
      startProgressAnimation(tab);
      activateTabAfterDelay(tab);
    }

    // Click of focus to view another tab
    tabs.forEach((tab) => tab.addEventListener("focus", () => handleEvent(tab)));
    tabs.forEach((tab) => tab.addEventListener("click", () => handleEvent(tab)));
  });
});
