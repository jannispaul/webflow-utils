// Attribute based animated details element
// Code source: https://css-tricks.com/how-to-animate-the-details-element-using-waapi/

// Required attributes
// Use html native details and summary element
// data-accordion-element="accordion" -> put details element
// data-accordion-element="content" -> put content element

// Optional attributes
// data-accordion-duration="600" -> duration in miliseconds
// data-accordion-easing="cubic-bezier(0.37, 0, 0.63, 1)" -> custom easing. Default ease: https://easings.net/#easeInOutQuad

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

    // Add open class if accordion is open
    if (this.el.open) {
      this.el.classList.add("open");
    }
  }

  // Function called when user clicks on the summary
  onClick(e) {
    // Stop default behaviour from the browser
    e.preventDefault();
    // Add an overflow on the <details> to avoid content overflowing
    this.el.style.overflow = "hidden";
    // Check if the element is being closed or is already closed
    if (this.isClosing || !this.el.open) {
      this.closeOtherAccordionsInGroup();
      this.open();
      // Check if the element is being openned or is already open
    } else if (this.isExpanding || this.el.open) {
      this.shrink();
    }
  }
  // Function to close all other accordions in the same group
  closeOtherAccordionsInGroup() {
    // Get all accordions in the same group
    const accordionsInGroup = document.querySelectorAll(`[data-accordion-group="${this.group}"][open]`);

    // Close all accordions in the group except the current one
    accordionsInGroup.forEach((accordion) => {
      if (accordion !== this.el) {
        const accordionInstance = new Accordion(accordion);
        accordionInstance.shrink();
      }
    });
  }
  // Function called to close the content with an animation
  shrink() {
    // Set the element as "being closed"
    this.isClosing = true;
    this.el.classList.remove("open");
    // Add an overflow on the <details> to avoid content overflowing
    this.el.style.overflow = "hidden";

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
    // Set open class
    this.el.classList.add("open");
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
