(() => {
  let autoplayVideos = document.querySelectorAll("video[autoplay]");

  autoplayVideos.forEach((video) => {
    video.play().catch((error) => {
      if (error.name === "NotAllowedError") {
        console.log("Low power mode: video autoplay deactivated");
        video.removeAttribute("autoplay");
        video.controls = true;
        video.controls = false;
      }
    });
  });
})();
