# Webflow utils

This is a collection of scripts that I use to enhance my workflow with webflow. They are copy and paste drop-ins and can be configurerd with attributes.

## Lazy Load Video

Lazy load html5 video. To use:
Instead of `src` use `data-src` in source element

### Optional:

- Add atribute `replay` to replay the video from the beginning when it enters the viewport

### Example

```html
<script defer src="/dist/lazyloadvideo.js"></script>

<video autoplay muted playsinline replay>
  <source data-src="https://res.cloudinary.com/dgvgmpeue/video/upload/c_scale,w_1180/c_crop,g_center,h_506,w_1000/v1705852542/arise-2024.mp4" type="video/mp4" />
</video>
```
