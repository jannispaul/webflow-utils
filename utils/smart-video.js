// Videos need to have data-src attribute to work
// Optional:
// autoplay for smart autoplay, otherwise only lazy loading
// data-breakpount -> on script tag, if you want to load video on mobile
// data-src-mobile -> if you want to load a different video on mobile (max-width: 768px)
// data-poster-mobile -> if you want to use a different poster on mobile
// replay attribute to replay the video when it comes into view
// Wait for load event
document.addEventListener("DOMContentLoaded", function () {
  // Get all videos with source data-src (relies on css )
  let lazyVideos = Array.from(document.querySelectorAll("video:has(source[data-src])"));
  let autoPlayVideos = Array.from(document.querySelectorAll("video[autoplay]"));
  let allVideos = lazyVideos.concat(autoPlayVideos);
  let isMobile;
  // Get all script elements with data-smart-video
  let currentScriptTag = document.querySelector("script[data-smart-video]");
  // Set the breakpointWidth based on the data-breakpoint attribute or fallback
  let mobileWidth = currentScriptTag?.dataset.breakpoint || 767;

  function checkForMobile() {
    return window.matchMedia(`(max-width:${mobileWidth}px)`).matches;
  }
  isMobile = checkForMobile();

  // Make sure intersection observer is available
  if ("IntersectionObserver" in window) {
    // Set up intersection observer for lazy load videos
    let lazyLoadObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((video) => {
          if (video.isIntersecting) {
            console.log("intersecting", video.target);
            if (!video.target.hasAttribute("loaded")) {
              setSource(video.target);
            }
            // Unobserve the video if it doesn't have the 'replay' attribute
          } else if (video.target.hasAttribute("loaded")) {
            lazyLoadObserver.unobserve(video.target);
          }
        });
      },
      // Load videos 200px before they enter the viewport
      { rootMargin: "0px 0px 200px 0px" }
    );

    // Set up intersection observer for autoplay and pause videos
    let playbackObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((video) => {
        if (video.isIntersecting) {
          // Only play if the video was loaded before
          // if (video.target.hasAttribute("loaded")) {
          console.log("intersecting", video.target);
          video.target.play().catch((error) => {
            if (error.name === "NotAllowedError") {
              disableVideo(video.target);
            }
          });
          // }
        } else {
          console.log("not intersecting", video.target);
          video.target.pause();
          if (video.target.hasAttribute("replay")) {
            video.target.currentTime = 0;
          }
        }
      });
    });

    // If low power mode is active disable autoplay and unobserve videos
    function disableVideo(video) {
      console.log("Low power mode: video autoplay deactivated");
      video.removeAttribute("autoplay");
      video.controls = true;
      video.controls = false;
      playbackObserver.unobserve(video);
    }

    allVideos.forEach((video) => {
      console.log("auto play", video);
      // check if source has data-src
      setPosterSource(video);
      // if video is not loaded and source has data-src create lazy loading observer
      if (!video.hasAttribute("loaded") && Array.from(video.children).some((source) => source.hasAttribute("data-src"))) {
        console.log("observing", video);
        lazyLoadObserver.observe(video);
      }
      if (video.hasAttribute("autoplay")) {
        // Oberse only autoplay videos for play and pause
        playbackObserver.observe(video);
      }
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

  function setPosterSource(video) {
    console.log("set poster source");
    isMobile && video.dataset.posterMobile && video.setAttribute("poster", video.dataset.posterMobile);
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

// TODO remove observer from videos without loop or replay attribute
// Currently those get replayed when they come into view

// TODO add attribute to disable things individually (e.g. autoplay)
