// Script to create dialogs on website
// Docs for dialog: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
// Attributes needed:
// data-dialog="dialog-name"
// data-dialog="close" to close parent dialog

// Option attributes:
// data-dialog-trigger="trigger-name"
// data-dialog-dealy="delay-time"

document.addEventListener("DOMContentLoaded", function () {
  // (() => {
  console.log("Dialog script loaded");
  // Get all dialog elements, not close elements
  let dialogContentElements = document.querySelectorAll("[data-dialog]:not([data-dialog='close'])");
  // Get all close dialog elements
  // let closeDialogElements = document.querySelectorAll("[data-dialog='close']");
  // Get all trigger dialog elements
  let triggerDialogElements = document.querySelectorAll("[data-dialog-trigger]");

  // Create dialog from element and append it to body
  function createDialog(element) {
    let dialog = document.createElement("dialog");
    // Add element to dialog
    dialog.append(element);
    // Set dialog name
    dialog.setAttribute("data-dialog", element.getAttribute("data-dialog"));
    element.removeAttribute("data-dialog");
    // Set dialog delay if set
    if (element.getAttribute("data-dialog-delay")) {
      dialog.setAttribute("data-dialog-delay", element.getAttribute("data-dialog-delay"));
      element.removeAttribute("data-dialog-delay");
    }
    //   dialog.innerHTML = element.innerHTML;
    document.body.append(dialog);
    console.log("appending dialog", dialog, document.body.contains(dialog));
  }

  async function addDialogs() {
    // Create Dialogs from dialog content elements
    dialogContentElements.forEach((element) => {
      createDialog(element);
    });
    console.log("add dialogs");
    return Promise.resolve();
  }
  addDialogs().then(() => {
    setTimeout(() => {
      addAutoOpen();
    }, 100);
  });

  function addAutoOpen() {
    let dialogs = document.querySelectorAll("[data-dialog-delay]");
    console.log("add auto open", dialogs);
    dialogs.forEach((dialog) => {
      autoOpenDialog(dialog);
    });
  }

  // Function to set auto open on dialog
  function autoOpenDialog(dialog) {
    console.log("auto open", dialog, document.body.contains(dialog));
    //attributes are on the child element
    let dialogName = dialog.getAttribute("data-dialog");
    let dialogDelayInSeconds = parseInt(dialog.getAttribute("data-dialog-delay")) * 1000;

    // Check if dialog has been opened before
    if (sessionStorage.getItem(dialogName) === "opened") {
      return;
    }
    // Open diaload after delay
    setTimeout(() => {
      openDialog(dialog);
    }, dialogDelayInSeconds);
  }
  // Function to check if any dialog is open
  function isDialogOpen() {
    // Check if any dialog element is open
    const dialogs = document.querySelectorAll("dialog");
    for (const dialog of dialogs) {
      if (dialog.open) {
        return true;
      }
    }
    return false;
  }

  // Function to open dialog and write to session storage that it has been opened
  function openDialog(dialog) {
    console.log(dialog);
    if (isDialogOpen()) return;
    let dialogName = dialog.getAttribute("data-dialog");

    // Listen for click events
    dialog.addEventListener("click", (e) => {
      console.log(e);
      // Close dialog if click on backdrop
      if (e.target === dialog) {
        dialog.close();
        // Close dialog on close button click
      } else if (e.target.closest("[data-dialog='close']")) {
        dialog.close();
      }
    });

    dialog.showModal();
    sessionStorage.setItem(dialogName, "opened");
  }

  // Function to listen to trigger dialog elements
  triggerDialogElements.forEach((element) => {
    element.addEventListener("click", () => {
      let dialogName = element.getAttribute("data-dialog-trigger");
      let dialog = document.querySelector(`[data-dialog="${dialogName}"]`);
      if (!dialog) return;
      openDialog(dialog);
    });
  });

  // Create style for dialog in head of document:
  // No border, background transparent
  // Animation for fade in and backdrop fade in
  function createDialogStyle() {
    let style = document.createElement("style");
    style.innerHTML = `
      dialog {border: none; background: transparent; padding:0;}
      /* Animation for dialog */
      dialog {
        opacity: 0;
        transition: opacity 0.4s, display 0.4s allow-discrete, overlay 0.4s allow-discrete, transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        transform: translateY(2rem);
      }
      ::backdrop{ 
        opacity: 0;
        transition: opacity 0.4s, display 0.4s allow-discrete, overlay 0.4s allow-discrete;
      }
      dialog[open] {opacity: 1;transform: translateY(0rem);}
      dialog[open]::backdrop {opacity: 0.6;}
      @starting-style {
        dialog[open], dialog[open]::backdrop {
          opacity: 0;
          transform: translateY(2rem);
        ｝
      } 
      `;
    document.head.appendChild(style);
  }
  createDialogStyle();
  // })();
});
