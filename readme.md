# Webflow utils

This is a collection of scripts that I use to enhance my workflow with webflow. They are copy and paste drop-ins that can be configurerd with attributes.

## Smart Video

**Features**

- Autoplay and autopause (applies to all autoplay html5 videos)
- Lazy load html5 video.
- Repsonsive video source and poster
- Replay video on enter viewport
- Low power mode disable video playback (on Safari)

**Optional attributes:**

- `data-src` on source instead of `src` to lazy load video
- `data-src-mobile` on source to load a different video on mobile (max-width: 768px)
- `data-smart-video` & `data-breakpoint` both on script to change breakpoint (default: 768px)
- `data-poster-mobile` on video to use a different poster on mobile (max-width: 768px)
- `replay` on video to replay the video from the beginning when it enters the viewport

**Example**

```html
<script defer src="https://cdn.jsdelivr.net/gh/jannispaul/webflow-utils@latest/dist/smart-video.js" data-smart-video data-breakpoint="991></script>

<video autoplay muted playsinline replay poster="poster.jpg" data-poster-mobile="mobile-poster.jpg">
  <source data-src="https://www.w3schools.com/tags/mov_bbb.mp4" data-src-mobile="https://www.w3schools.com/tags/mov_bbb.mp4" type="video/mp4" />
</video>
```

## Lazy Load Section

Loads all lazy loaded images inside a wrapper when the wrapper appears in viewport. Useful for sliders/ marquee so the images dont come in with a delay

```html
<script defer src="https://cdn.jsdelivr.net/gh/jannispaul/webflow-utils@latest/dist/lazy-load-section.js"></script>

<section data-element="lazy-wrapper">
  <img loading="lazy" />
  <img loading="lazy" />
</section>
```

## Dialogs

Create html `dialog` from divs with data attributes.

**Required attributes**
`data-dialog="dialog-name"`

**Optional attributes:**

- `data-dialog="close"` for close button inside, to close parent dialog
- `data-dialog-trigger="dialog-name"` to open dialog. e.g. Button click
- `data-dialog-dealy="delay-time"` to automatically open dialog after delay set in seconds. Opens once per session.

**Example**

```html
<script defer src="https://cdn.jsdelivr.net/gh/jannispaul/webflow-utils@latest/dist/dialog.js"></script>

<div data-dialog="newsletter" data-dialog-dealy="10">
  <h2>Dialog content</h2>
</div>

<button data-dialog-trigger="newsletter">Open Newsletter Dialog</button>
```

## Autoplay Webflow Tabs

Script to autoplay webflow tabs. Based on flowbase auto rotation tabs: https://www.flowbase.co/blog/add-auto-rotating-tabs-in-webflow

**Improvements over flowbase script:**

- Configuration with data attributes
- Works with both focus (keyboard) and click (mouse)
- Starts / stops the autoplay when in and out of view. Therefore focus will no be lost from other element
- Progress animtion with js .animate()
- Does not rely on jQuery

**Required attributes:**
`data-tabs-element="tabs"` put on the webflow tabs element (not the tabs wrapper).

**Optional attributes:**

- `data-tabs-element="progress"` to define an animated progress bar. Depending on the size of the parent it automatically decides if horizontal or vertical and scales from 0% to 100% width/height
- `data-tabs-duration="5"` duration to automatically go to the next tab in miliseconds

```html
<script defer src="https://cdn.jsdelivr.net/gh/jannispaul/webflow-utils@latest/dist/autoplay-tabs.js"></script>
```

## Deprecated

## Low Power Mode Video

Removes the play button on Safari from autoplay videos. Does not require any attributes.

```html
<script defer src="https://cdn.jsdelivr.net/gh/jannispaul/webflow-utils@latest/dist/video-low-power-mode.js"></script>
```
