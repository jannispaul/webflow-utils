# Webflow utils

This is a collection of scripts that I use to enhance my workflow with webflow. They are copy and paste drop-ins that can be configurerd with attributes.

## Lazy Load Video

Lazy load html5 video. To use:
Instead of `src` use `data-src` in source element

**Optional:**

- Add attribute `replay` to replay the video from the beginning when it enters the viewport

**Example**

```html
<script defer src="https://cdn.jsdelivr.net/gh/jannispaul/webflow-utils@latest/dist/videolazyload.js"></script>

<video autoplay muted playsinline replay>
  <source data-src="https://www.w3schools.com/tags/mov_bbb.mp4" type="video/mp4" />
</video>
```

## Low Power Mode Video

Removes the play button on Safari from autoplay videos. Does not require any attributes.

```html
<script defer src="https://cdn.jsdelivr.net/gh/jannispaul/webflow-utils@latest/dist/videolowpowermode.js"></script>
```

## Fix Lazy Load

Loads all lazy loaded images inside a wrapper when the wrapper appears in viewport. Useful for sliders/ marquee so the images dont come in with a delay

```html
<script defer src="https://cdn.jsdelivr.net/gh/jannispaul/webflow-utils@latest/dist/fixlazyload.js"></script>

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
