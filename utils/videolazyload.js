// Videos need to have data-source attribute to work
// Optional:
// data-src-mobile -> if you want to load a different video on mobile (max-width: 768px)
// replay attribute to replay the video when it comes into view
// Wait for load event
document.addEventListener("DOMContentLoaded", function () {
  // Get all videos with source data-src (relies on css )
  let lazyVideos = [].slice.call(document.querySelectorAll("video:has(source[data-src])"));
  let isMobile;
  let mobileWidth = 768;
  function checkForMobile() {
    return window.matchMedia(`(max-width:${mobileWidth}px)`).matches;
  }
  isMobile = checkForMobile();
  if ("IntersectionObserver" in window) {
    let lazyVideoObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((video) => {
        if (video.isIntersecting) {
          if (!video.target.hasAttribute("loaded")) {
            setSource(video.target);
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
  function setSource(video) {
    for (let source of video.children) {
      if (source.tagName === "SOURCE") {
        source.src = isMobile && source.dataset.srcMobile ? source.dataset.srcMobile : source.dataset.src;
      }
    }
    video.load();
    video.setAttribute("loaded", true);
  }
  // Resize event listener to change video sources on mobile
  window.addEventListener("resize", () => {
    if (isMobile !== checkForMobile()) {
      isMobile = checkForMobile();
    } else {
      return;
    }
    lazyVideos.forEach(function (lazyVideo) {
      // check if video is already loaded
      if (lazyVideo.hasAttribute("loaded")) {
        setSource(lazyVideo);
      }
    });
  });
});
