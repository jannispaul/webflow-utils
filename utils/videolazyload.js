(() => {
  // Wait for load event
  document.addEventListener("DOMContentLoaded", function () {
    // Get all videos with source data-src (relies on css )
    let lazyVideos = [].slice.call(document.querySelectorAll("video:has(source[data-src])"));
    if ("IntersectionObserver" in window) {
      let lazyVideoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((video) => {
          if (video.isIntersecting) {
            if (!video.target.hasAttribute("loaded")) {
              for (let source of video.target.children) {
                if (source.tagName === "SOURCE") {
                  source.src = source.dataset.src;
                }
              }
              video.target.load();
              video.target.setAttribute("loaded", true);
            }
            if (video.target.hasAttribute("replay")) {
              video.target.currentTime = 0;
            } else {
              // Unobserve the video if it doesn't have the 'replay' attribute
              lazyVideoObserver.unobserve(video.target);
            }
          }
        });
      });

      if (!lazyVideos) return;
      lazyVideos.forEach(function (lazyVideo) {
        lazyVideoObserver.observe(lazyVideo);
      });
    }
  });
})();
