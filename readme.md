# Webflow utils

This is a collection of scripts that I use to enhance my workflow with webflow. They are copy and paste drop-ins that can be configurerd with attributes.

## Smart Video

**Features**

- Autoplay and autopause (applies to all autoplay html5 videos)
- Lazy load html5 video.
- Repsonsive video source and poster
- Replay video on enter viewport
- Low power mode disable video playback (on Safari)

**Required attributes:**

- `autoplay` on video

**Optional attributes:**

- `data-src` on source instead of `src` to lazy load video
- `data-src-mobile` on source to load a different video on mobile (max-width: 768px)
- `data-smart-video` & `data-breakpoint` both on script to change breakpoint (default: 768px)
- `data-poster-mobile` on video to use a different poster on mobile (max-width: 768px)
- `replay` on video to replay the video from the beginning when it enters the viewport

**Example**

```html
<script defer src="https://cdn.jsdelivr.net/gh/jannispaul/webflow-utils@v1.0.0/dist/smart-video.js" data-smart-video data-breakpoint="991"></script>

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

**Required attributes:**
`data-dialog-id="dialog-name"` on dialog content, with a unique name

**Optional attributes:**

- `data-dialog-close` for close button inside the dialog, to close the parent dialog on click.
- `data-dialog-trigger="dialog-name"` to open dialog. e.g. Button click
- `data-dialog-dealy="delay-time"` to automatically open dialog after delay set in seconds. Opens once per session. Set on dialog element.
- `data-dialog-exit-intent` to automatically open the dialog on exit intent. Set on the dialog element
- `data-dialog-scroll="dialog-name"` to automatically open the dialog when an element gets scrolled into the viewport. Set on the trigger element.
- `data-dialog-cooldown="cooldown-time"` Time between dialog triggers in seconds, or as `day, week, month`. Set on dialog element.

**Events:**

- `dialogsCreated` is dispatched when all dialogs have been created and are ready to use
- `dialogOpened` is dispatched when a dialog is opened. event.detail.element = dialog element

```javascript
window.addEventListener("dialogsCreated", getDialogs);

window.addEventListener("dialogOpened", (event) => {
  console.log("open", event.detail.element);
});
```

**Styles**
The Dialog element itself can by styled like any normal element. To customize the backdrop color and opacity use CSS

```css
::backdrop {
  background: rgba(0, 0, 0, 0.5);
}
```

**Example**

```html
<script defer src="https://cdn.jsdelivr.net/gh/jannispaul/webflow-utils@latest/dist/dialog.js"></script>

<div data-dialog-id="newsletter" data-dialog-delay="10" data-dialog-exit-intent data-dialog-cooldown="week">
  <h2>Dialog content</h2>
  <button data-dialog-close>Close</button>
</div>

<button data-dialog-trigger="newsletter">Open Newsletter Dialog</button>
<div data-dialog-scroll="newsletter">Scroll Trigger</div>
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
`data-tabs-element="tabs"` put on the webflow tabs menu element (not the tabs wrapper).

**Optional attributes:**

- `data-tabs-element="progress"` to define an animated progress bar. Depending on the size of the parent it automatically decides if horizontal or vertical and scales from 0% to 100% width/height
- `data-tabs-duration="5"` duration to automatically go to the next tab in miliseconds

```html
<script defer src="https://cdn.jsdelivr.net/gh/jannispaul/webflow-utils@latest/dist/autoplay-tabs.js"></script>
```

## Format Number

Script to format numbers with thousand separators / decimals according to locale. Default to "en-US"

**Required attributes:**
`data-number="number"`

**Optional attributes:**
`data-locale="en-US"` to change locale.

```html
<script defer src="https://cdn.jsdelivr.net/gh/jannispaul/webflow-utils@latest/dist/format-number.js"></script>
```

## Auto redirect

This script redirects users (routing) to the appropriate language version of a website based on their browser language and the rel="alternate" hreflang attributes. If a user manually selects a language using a language switch (hreflang), their preference is stored in a cookie `preferredLang` to ensure consistency across visits. The script runs early by being placed in the <head> before anything else. Defaults to English if no other language can be found.

## Accordion

Accordion script to animate native `details` elements. The script uses `data-accordion-duration` and `data-accordion-easing` attributes to control the animation duration and easing function. Uses `.open` class when open since `open` attribute is only added when fully closed.

**Required attributes:**

- `data-accordion-element="accordion"` put on the accordion element
- `data-accordion-element="content"` put on the content element (after the summary element)

**Optional attributes:**

- `data-accordion-duration="400"` put on the accordion element for custom duration.
- `data-accordion-easing="cubic-bezier(0.45, 0, 0.55, 1)"` put on the accordion element to add custom easing. Default ease: https://easings.net/#easeInOutQuad
- `data-accordion-group="group-name"` to group accordion elements together and have only one open at a time

Use `open` attribute to show content by default
Dont set margin bewteen summary and content elements, padding or border on details element as it will lead to jumps. Instead of border use box-shadow or outline.

Can also be invoked with javascript

```javascript
document.querySelectorAll("details").forEach((el) => {
  new Accordion(el);
});
```

Example html:

```html
<script defer src="https://cdn.jsdelivr.net/gh/jannispaul/webflow-utils@latest/dist/accordion.js"></script>
<details data-accordion-duration="500" class="accordion_details" open="">
  <summary class="accordion_summary">
    <div>This is the summary.</div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="100%">
      <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
    </svg>
  </summary>
  <div data-accordion-element="content" class="accordion_content">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.</p>
  </div>
</details>
```

Code adapted from: https://css-tricks.com/how-to-animate-the-details-element-using-waapi/

## Deprecated

## Low Power Mode Video

Removes the play button on Safari from autoplay videos. Does not require any attributes.

```html
<script defer src="https://cdn.jsdelivr.net/gh/jannispaul/webflow-utils@latest/dist/video-low-power-mode.js"></script>
```
