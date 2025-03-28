// Attribute based animated details element
// Code source: https://css-tricks.com/how-to-animate-the-details-element-using-waapi/

// Required attributes
// Use html native details and summary element
// data-accordion-element="accordion" -> put details element
// data-accordion-element="content" -> put content element

// Optional attributes
// data-accordion-duration="600" -> duration in miliseconds
// data-accordion-easing="cubic-bezier(0.37, 0, 0.63, 1)" -> custom easing. Default ease: https://easings.net/#easeInOutQuad

<details data-accordion-duration="500" class="accordion_details" style="" open="">
  <summary class="accordion_summary">
    <div>This is some text inside of a div block.</div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="100%">
      <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
    </svg>
  </summary>
  <div data-accordion-element="content" class="accordion_content">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.</p>
  </div>
</details>;
class Accordion {
  // The default constructor for each accordion
  constructor(el) {
    // Store the <details> element
    this.el = el;
    // Store the <summary> element
    this.summary = el.querySelector("summary");
    // Store the <div class="content"> element
    this.content = el.querySelector("[data-accordion-element='content']");
    // Store transition duraton
    this.duration = parseInt(this.el.dataset.accordionDuration) || 400;
    this.easing = this.el.dataset.accordionEasing || "cubic-bezier(0.45, 0, 0.55, 1)";
    this.group = this.el.dataset.accordionGroup;

    // Store the animation object (so we can cancel it, if needed)
    this.animation = null;
    // Store if the element is closing
    this.isClosing = false;
    // Store if the element is expanding
    this.isExpanding = false;
    // Detect user clicks on the summary element
    this.summary.addEventListener("click", (e) => this.onClick(e));
  }

  // Function called when user clicks on the summary
  onClick(e) {
    // Stop default behaviour from the browser
    e.preventDefault();
    // Add an overflow on the <details> to avoid content overflowing
    this.el.style.overflow = "hidden";
    // Check if the element is being closed or is already closed
    if (this.isClosing || !this.el.open) {
      this.open();
      // Check if the element is being openned or is already open
    } else if (this.isExpanding || this.el.open) {
      this.shrink();
    }
  }

  // Function called to close the content with an animation
  shrink() {
    // Set the element as "being closed"
    this.isClosing = true;

    // Store the current height of the element
    const startHeight = `${this.el.offsetHeight}px`;
    // Calculate the height of the summary
    const endHeight = `${this.summary.offsetHeight}px`;

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }

    // Start a WAAPI animation
    this.animation = this.el.animate(
      {
        // Set the keyframes from the startHeight to endHeight
        height: [startHeight, endHeight],
      },
      {
        // If the duration is too slow or fast, you can change it here
        duration: this.duration,
        // You can also change the ease of the animation
        easing: this.easing,
      }
    );

    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(false);
    // If the animation is cancelled, isClosing variable is set to false
    this.animation.oncancel = () => (this.isClosing = false);
  }

  // Function called to open the element after click
  open() {
    // Apply a fixed height on the element
    this.el.style.height = `${this.el.offsetHeight}px`;
    // Force the [open] attribute on the details element
    this.el.open = true;
    // Wait for the next frame to call the expand function
    window.requestAnimationFrame(() => this.expand());
  }

  // Function called to expand the content with an animation
  expand() {
    // Set the element as "being expanding"
    this.isExpanding = true;
    // Get the current fixed height of the element
    const startHeight = `${this.el.offsetHeight}px`;
    // Calculate the open height of the element (summary height + content height)
    const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }

    // Start a WAAPI animation
    this.animation = this.el.animate(
      {
        // Set the keyframes from the startHeight to endHeight
        height: [startHeight, endHeight],
      },
      {
        // If the duration is too slow of fast, you can change it here
        duration: this.duration,
        // You can also change the ease of the animation
        easing: this.easing,
      }
    );
    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(true);
    // If the animation is cancelled, isExpanding variable is set to false
    this.animation.oncancel = () => (this.isExpanding = false);
  }

  // Callback when the shrink or expand animations are done
  onAnimationFinish(open) {
    // Set the open attribute based on the parameter
    this.el.open = open;
    // Clear the stored animation
    this.animation = null;
    // Reset isClosing & isExpanding
    this.isClosing = false;
    this.isExpanding = false;
    // Remove the overflow hidden and the fixed height
    this.el.style.height = this.el.style.overflow = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-accordion-element='accordion']").forEach((el) => {
    new Accordion(el);
  });
});
