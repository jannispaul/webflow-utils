// Script to create dialogs on website
// Docs for dialog: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog

class DialogManager {
  // --- Constants and Configuration ---
  static #ATTRIBUTES = {
      ID: "data-dialog-id",
      TRIGGER: "data-dialog-trigger",
      DELAY: "data-dialog-delay",
      EXIT_INTENT: "data-dialog-exit-intent",
      SCROLL: "data-dialog-scroll",
      COOLDOWN: "data-dialog-cooldown",
      CLOSE: "data-dialog-close",
  };

  // Cooldown times in seconds, used for string lookup
  static #COOLDOWN_SECONDS = {
      day: 86400,
      week: 604800,
      month: 2592000,
  };

  // --- State and Initialization ---
  #dialogContentElements;
  #triggerDialogElements;
  #lastFocusedElement = null; // New: Store the element that triggered the dialog

  constructor() {
      this.#dialogContentElements = document.querySelectorAll(`[${DialogManager.#ATTRIBUTES.ID}]`);
      this.#triggerDialogElements = document.querySelectorAll(`[${DialogManager.#ATTRIBUTES.TRIGGER}]`);

      document.addEventListener("DOMContentLoaded", this.init.bind(this));
      this.#createDialogStyle();
      console.log("Dialog script initialized");
  }

  async init() {
      await this.#addDialogs();

      const dialogs = document.querySelectorAll(`dialog[${DialogManager.#ATTRIBUTES.ID}]`);

      this.#initializeDialogCloseHandlers(dialogs);
      this.#initializeAllTriggers(dialogs);
      this.#initializeClickTriggers();

      window.dispatchEvent(new CustomEvent("dialogs-created"));
      console.log("Dialogs ready.");
  }

  // --- Dialog Creation and Structure ---

  #createDialog(element) {
      let dialog = document.createElement("dialog");
      const dialogId = element.getAttribute(DialogManager.#ATTRIBUTES.ID);

      dialog.append(element);
      
      dialog.setAttribute(DialogManager.#ATTRIBUTES.ID, dialogId);
      element.removeAttribute(DialogManager.#ATTRIBUTES.ID);

      // Transfer all data-dialog-* attributes from content element to the <dialog>
      [...element.attributes]
          .filter((attr) => attr.name.startsWith("data-dialog-"))
          .forEach((attr) => {
              dialog.setAttribute(attr.name, attr.value);
              element.removeAttribute(attr.name);
          });

      document.body.append(dialog);
  }

  async #addDialogs() {
      this.#dialogContentElements.forEach((element) => {
          this.#createDialog(element);
      });
      return Promise.resolve();
  }

  // --- Helper Functions ---

  #getCoolDownTime(dialog) {
      const cooldownAttr = dialog.getAttribute(DialogManager.#ATTRIBUTES.COOLDOWN);
      if (!cooldownAttr) return 0;

      if (DialogManager.#COOLDOWN_SECONDS[cooldownAttr]) {
          return DialogManager.#COOLDOWN_SECONDS[cooldownAttr] * 1000;
      }

      const seconds = parseInt(cooldownAttr);
      return isNaN(seconds) ? 0 : seconds * 1000;
  }

  #canTriggerDialog(dialogName, cooldown) {
      const lastOpenTime = localStorage.getItem(`${dialogName}_last_open`);
      if (!lastOpenTime) return true;

      const timeSinceLastOpen = Date.now() - parseInt(lastOpenTime);
      return timeSinceLastOpen >= cooldown;
  }

  #isDialogOpen() {
      return !!document.querySelector("dialog[open]");
  }

  // --- Trigger Initialization (unchanged) ---

  #initializeAllTriggers(dialogs) {
      dialogs.forEach((dialog) => {
          const dialogName = dialog.getAttribute(DialogManager.#ATTRIBUTES.ID);
          const cooldown = this.#getCoolDownTime(dialog);

          if (dialog.hasAttribute(DialogManager.#ATTRIBUTES.DELAY)) {
              this.#initializeTimeTrigger(dialog, dialogName, cooldown);
          }
          const scrollTrigger = document.querySelector(`[${DialogManager.#ATTRIBUTES.SCROLL}="${dialogName}"]`);
          if (scrollTrigger) {
              this.#initializeScrollTrigger(dialog, scrollTrigger, dialogName, cooldown);
          }
          if (dialog.hasAttribute(DialogManager.#ATTRIBUTES.EXIT_INTENT)) {
              this.#initializeExitIntentTrigger(dialog, dialogName, cooldown);
          }
      });
  }

  #initializeTimeTrigger(dialog, dialogName, cooldown) {
      const delay = parseInt(dialog.getAttribute(DialogManager.#ATTRIBUTES.DELAY)) * 1000;

      if (this.#canTriggerDialog(dialogName, cooldown)) {
          setTimeout(() => {
              this.#canTriggerDialog(dialogName, cooldown) && this.openDialog(dialog);
          }, delay);
      }
  }

  #initializeScrollTrigger(dialog, triggerElement, dialogName, cooldown) {
      const observer = new IntersectionObserver(
          (entries) => {
              entries.forEach((entry) => {
                  if (entry.isIntersecting && this.#canTriggerDialog(dialogName, cooldown)) {
                      this.openDialog(dialog);
                      observer.unobserve(triggerElement);
                  }
              });
          },
          { threshold: 0.5 }
      );
      observer.observe(triggerElement);
  }

  #initializeExitIntentTrigger(dialog, dialogName, cooldown) {
      document.addEventListener("mouseout", (e) => {
          if (e.clientY <= 0 && this.#canTriggerDialog(dialogName, cooldown)) {
              this.openDialog(dialog);
          }
      });
  }

  #initializeClickTriggers() {
      this.#triggerDialogElements.forEach((element) => {
          element.addEventListener("click", () => {
              const dialogName = element.getAttribute(DialogManager.#ATTRIBUTES.TRIGGER);
              const dialog = document.querySelector(`dialog[${DialogManager.#ATTRIBUTES.ID}="${dialogName}"]`);
              if (!dialog) return;
              this.openDialog(dialog);
          });
      });
  }

  // --- Dialog Open/Close Logic ---

  #initializeDialogCloseHandlers(dialogs) {
      dialogs.forEach(dialog => {
          dialog.addEventListener("click", (e) => {
              if (e.target === dialog || e.target.closest(`[${DialogManager.#ATTRIBUTES.CLOSE}]`)) {
                  // Check for target before calling close, allows animation reverse if needed
                  dialog.close();
              }
          });
          
          dialog.addEventListener("close", () => {
              // Restore focus for A11Y
              if (this.#lastFocusedElement) {
                  this.#lastFocusedElement.focus();
                  this.#lastFocusedElement = null;
              }
              document.body.style.overflow = '';
              window.dispatchEvent(new CustomEvent("dialog-closed", { detail: { element: dialog } }));
          });
      });
  }

  // Public method, accessible via window.dialogs.open(name)
  openDialog(dialog) {
      if (this.#isDialogOpen()) return;

      // Save the currently focused element (the element that triggered the dialog)
      this.#lastFocusedElement = document.activeElement;
      
      const dialogName = dialog.getAttribute(DialogManager.#ATTRIBUTES.ID);

      dialog.showModal();
      document.body.style.overflow = 'hidden';
      
      // Only set opened flag if dialog has cooldown attribute
      if (dialog.hasAttribute(DialogManager.#ATTRIBUTES.COOLDOWN)) {
          localStorage.setItem(`${dialogName}_last_open`, Date.now().toString());
      }
      
      window.dispatchEvent(new CustomEvent("dialog-opened", { detail: { element: dialog } }));
  }

  // Public method to close dialog by name (for external API)
  closeDialog(dialogName) {
      const dialog = document.querySelector(`dialog[${DialogManager.#ATTRIBUTES.ID}="${dialogName}"]`);
      if (dialog) {
          dialog.close();
          return true;
      }
      return false;
  }

  // Public method to close all open dialogs
  closeAllDialogs() {
      document.querySelectorAll("dialog[open]").forEach(d => d.close());
  }

  // --- Styling (unchanged) ---

  #createDialogStyle() {
      let style = document.createElement("style");
      style.innerHTML = `
  
          dialog {
              border: none;
              background: transparent;
              padding: 0;
              opacity: 0;
              transition: opacity 0.4s, display 0.4s allow-discrete, overlay 0.4s allow-discrete, transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
              transform: translateY(2rem);
          }
          ::backdrop{ 
              opacity: 0;
              transition: opacity 0.4s, display 0.4s allow-discrete, overlay 0.4s allow-discrete;
          }
          dialog[open] {
              opacity: 1;
              transform: translateY(0rem);
          }
          dialog[open]::backdrop {
              opacity: 1;
          }
          @starting-style {
              dialog[open], dialog[open]::backdrop {
              opacity: 0;
              transform: translateY(2rem);
              }
          } 
      `;
      document.head.appendChild(style);
  }
}

// Instantiate the manager
const managerInstance = new DialogManager();

// Expose a public API under window.dialogs
window.dialogs = {
  /**
   * Programmatically opens a dialog by its data-dialog-id.
   * @param {string} dialogName The value of the data-dialog-id attribute.
   * @returns {boolean} True if the dialog was found and opened (or was already open), false otherwise.
   */
  open: (dialogName) => {
      const dialog = document.querySelector(`dialog[${DialogManager.ATTRIBUTES.ID}="${dialogName}"]`);
      if (dialog) {
          managerInstance.openDialog(dialog);
          return true;
      }
      return false;
  },
  /**
   * Programmatically closes a dialog by its data-dialog-id.
   * @param {string} dialogName The value of the data-dialog-id attribute.
   * @returns {boolean} True if the dialog was found and closed, false otherwise.
   */
  close: (dialogName) => managerInstance.closeDialog(dialogName),
  
  /**
   * Closes all currently open dialogs.
   */
  closeAll: () => managerInstance.closeAllDialogs(),
};