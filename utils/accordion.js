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
  constructor(el) {
    this.el = el;
    this.summary = el.querySelector("summary");
    this.content = el.querySelector("[data-accordion-element='content']");

    // Standard animation settings
    this.duration = parseInt(this.el.dataset.accordionDuration) || 400;
    this.easing = this.el.dataset.accordionEasing || "cubic-bezier(0.45, 0, 0.55, 1)";
    this.group = this.el.dataset.accordionGroup;

    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;

    // ACCESSIBILITY: Check for reduced motion preference
    this.mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    this.summary.addEventListener("click", (e) => this.onClick(e));

    if (this.el.open) {
      this.el.classList.add("open");
    }
  }

  onClick(e) {
    e.preventDefault();
    this.el.style.overflow = "hidden";

    if (this.isClosing || !this.el.open) {
      this.closeOtherAccordionsInGroup();
      this.open();
    } else if (this.isExpanding || this.el.open) {
      this.shrink();
    }
  }

  closeOtherAccordionsInGroup() {
    if (!this.group) return;

    const accordionsInGroup = document.querySelectorAll(
      `[data-accordion-group="${this.group}"][open]`
    );

    accordionsInGroup.forEach((accordion) => {
      if (accordion !== this.el) {
        // We create a temporary instance just to close it cleanly
        // This ensures the "Instant Close" logic below runs for these too
        new Accordion(accordion).shrink();
      }
    });
  }

  shrink() {
    this.isClosing = true;
    this.el.classList.remove("open");
    
    // ACCESSIBILITY: Instant close if reduced motion is preferred
    if (this.mediaQuery.matches) {
      this.el.removeAttribute("open"); // Native close
      this.onAnimationFinish(false);   // Run cleanup
      return;
    }

    this.el.style.overflow = "hidden";
    const startHeight = `${this.el.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight}px`;

    if (this.animation) {
      this.animation.cancel();
    }
    // Start a WAAPI animation
    this.animation = this.el.animate(
      { height: [startHeight, endHeight] },
      { duration: this.duration, easing: this.easing }
    );

    this.animation.onfinish = () => this.onAnimationFinish(false);
    this.animation.oncancel = () => (this.isClosing = false);
  }

  open() {
    this.el.style.height = `${this.el.offsetHeight}px`;
    this.el.open = true;
    window.requestAnimationFrame(() => this.expand());
  }

  expand() {
    this.isExpanding = true;
    this.el.classList.add("open");

    // ACCESSIBILITY: Instant open if reduced motion is preferred
    if (this.mediaQuery.matches) {
        // Height is already calculated in open(), so we just finish immediately
        this.onAnimationFinish(true);
        return;
    }

    const startHeight = `${this.el.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

    if (this.animation) {
      this.animation.cancel();
    }
    // Start a WAAPI animation
    this.animation = this.el.animate(
      { height: [startHeight, endHeight] },
      { duration: this.duration, easing: this.easing }
    );

    this.animation.onfinish = () => this.onAnimationFinish(true);
    this.animation.oncancel = () => (this.isExpanding = false);
  }

  onAnimationFinish(open) {
    this.el.open = open;
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.el.style.height = "";
    this.el.style.overflow = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-accordion-element='accordion']").forEach((el) => {
    new Accordion(el);
  });
});