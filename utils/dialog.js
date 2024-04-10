// Script to create dialogs on website
// Docs for dialog: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
// Attributes needed:
// data-dialog="dialog-name"
// data-dialog="close" to close parent dialog

// Option attributes:
// data-dialog-trigger="trigger-name"
// data-dialog-dealy="delay-time"

(() => {
  console.log("Dialog script loaded");
  // Get all dialog elements, not close elements
  let dialogContentElements = document.querySelectorAll("[data-dialog]:not([data-dialog='close'])");
  // Get all close dialog elements
  let closeDialogElements = document.querySelectorAll("[data-dialog='close']");
  // Get all trigger dialog elements
  let triggerDialogElements = document.querySelectorAll("[data-dialog-trigger]");

  // Create dialog from element and append it to body
  function createDialog(element) {
    let dialog = document.createElement("dialog");
    // Add element to dialog
    dialog.appendChild(element);
    // Set dialog name
    dialog.setAttribute("data-dialog", element.getAttribute("data-dialog"));
    // Set dialog delay
    dialog.setAttribute("data-dialog-delay", element.getAttribute("data-dialog-delay"));
    //   dialog.innerHTML = element.innerHTML;
    document.body.appendChild(dialog);
    // Close dialog if click on backdrop
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) {
        dialog.close();
      }
    });
    // Call autopopen function if dialog has delay set
    if (element.getAttribute("data-dialog-delay")) {
      autoOpenDialog(dialog);
    }
  }

  // Create Dialogs from dialog content elements
  dialogContentElements.forEach((element) => {
    createDialog(element);
  });

  // Close dialog when close dialog element is clicked
  closeDialogElements.forEach((element) => {
    element.addEventListener("click", () => {
      let dialog = element.closest("dialog");
      dialog.close();
    });
  });

  // Function to set auto open on dialog
  function autoOpenDialog(dialog) {
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

  // Function to open dialog and write to session storage that it has been opened
  function openDialog(dialog) {
    let dialogName = dialog.getAttribute("data-dialog");
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
    dialog[open] {animation: fade-in 0.4s ease-out;}
    dialog[open]::backdrop {animation: backdrop-fade-in 0.4s ease-out forwards;}
    
    /* Animation keyframes */
    @keyframes dialog-fade-in {
      0% {opacity: 0;display: none;}
      100% {opacity: 1;display: block;}
    }
    @keyframes backdrop-fade-in {
      0% {background: rgb(0 0 0 / 0%);}
      100% {background: rgb(0 0 0 / 50%);}
    }    
    `;
    document.head.appendChild(style);
  }
  createDialogStyle();
})();
