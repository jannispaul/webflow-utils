// Videos need to have data-src, replay or loop attribute to work
// Optional:
// autoplay for smart autoplay, otherwise only lazy loading
// data-breakpount -> on script tag, if you want to load video on mobile
// data-src-mobile -> if you want to load a different video on mobile (max-width: 768px)
// data-poster-mobile -> if you want to use a different poster on mobile
// ignore -> if you want to ignore this video
// replay attribute to replay the video from the beginning when it comes into view

document.addEventListener("DOMContentLoaded", function () {
  let lazyVideos = Array.from(document.querySelectorAll("video:has(source[data-src])"));
  let autoPlayVideos = Array.from(document.querySelectorAll("video[autoplay]"));
  let replayVideos = Array.from(document.querySelectorAll("video[replay]"));
  let allVideos = [...new Set([...lazyVideos, ...autoPlayVideos, ...replayVideos])]; // Ensure no duplicates
  let isMobile;
  let currentScriptTag = document.querySelector("script[data-smart-video]");
  let mobileWidth = currentScriptTag?.dataset.breakpoint || 767;

  console.log(allVideos);
  /**
   * Check if the current viewport is below the set breakpoint.
   * @returns {boolean} True if the viewport is below the breakpoint, false otherwise.
   */
  function checkForMobile() {
    return window.matchMedia(`(max-width:${mobileWidth}px)`).matches;
  }
  isMobile = checkForMobile();

  /**
   * Intersection Observer to watch videos and set source, set poster source, and playback
   */
  if ("IntersectionObserver" in window) {
    let lazyLoadObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((video) => {
          if (video.isIntersecting) {
            if (!video.target.hasAttribute("loaded")) {
              setSource(video.target);
              console.log("setting source", video.target);
            }
            if (!video.target.hasAttribute("loop") && !video.target.hasAttribute("replay")) {
              lazyLoadObserver.unobserve(video.target);
              console.log("unobserving", video.target);
            }
          }
        });
      },
      { rootMargin: "0px 0px 200px 0px" }
    );

    let playbackObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((video) => {
        if (video.isIntersecting) {
          //   if (video.target.hasAttribute("loaded")) {
          console.log("playing", video.target);
          video.target.play().catch((error) => {
            if (error.name === "NotAllowedError") {
              disableVideo(video.target);
            }
          });
          //   }
        } else {
          console.log("pausing", video.target);
          video.target.pause();
          if (video.target.hasAttribute("replay")) {
            video.target.currentTime = 0;
          }
          if (!video.target.hasAttribute("loop") && !video.target.hasAttribute("replay")) {
            playbackObserver.unobserve(video.target);
          }
        }
      });
    });

    /**
     * Disable video autoplay when NotAllowedError occurs e.g. in low power mode.
     * @param {HTMLVideoElement} video - The video element.
     */
    function disableVideo(video) {
      console.log("Low power mode: video autoplay deactivated");
      video.removeAttribute("autoplay");
      video.controls = true;
      video.controls = false;
      playbackObserver.unobserve(video);
    }

    allVideos.forEach((video) => {
      if (video.hasAttribute("ignore")) {
        return; // Skip videos with 'ignore' attribute
      }

      setPosterSource(video);

      if (!video.hasAttribute("loaded") && Array.from(video.children).some((source) => source.hasAttribute("data-src"))) {
        lazyLoadObserver.observe(video);
      }

      if (video.hasAttribute("autoplay") || video.hasAttribute("loop") || video.hasAttribute("replay")) {
        playbackObserver.observe(video);
      }
    });
  }

  /**
   * Set the source of the video based on mobile or not.
   * @param {HTMLVideoElement} video - The video element.
   */
  function setSource(video) {
    for (let source of video.children) {
      if (source.tagName === "SOURCE") {
        source.src = isMobile && source.dataset.srcMobile ? source.dataset.srcMobile : source.dataset.src;
      }
    }
    video.load();
    video.setAttribute("loaded", true);
  }

  /**
   * Sets the poster of a video to the mobile version if in mobile size.
   * @param {HTMLVideoElement} video - The video element.
   */
  function setPosterSource(video) {
    isMobile && video.dataset.posterMobile && video.setAttribute("poster", video.dataset.posterMobile);
  }

  window.addEventListener("resize", () => {
    if (isMobile !== checkForMobile()) {
      isMobile = checkForMobile();
    } else {
      return;
    }
    lazyVideos.forEach(function (lazyVideo) {
      if (lazyVideo.hasAttribute("loaded")) {
        setSource(lazyVideo);
      }
    });
  });
});
