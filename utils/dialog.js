// Script to create dialogs on website
// Docs for dialog: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
// Attributes needed:
// data-dialog="dialog-name"
// data-dialog="close" to close parent dialog

// Optional attributes:
// data-dialog-trigger="trigger-name" on elements that should trigger the dialog on click
// data-dialog-delay="delay-time" Delay trigger time in seconds on the dialog element
// data-dialog-exit-intent Allow dialog to trigger on exit intent on the dialog element
// data-dialog-scroll="dialog-name" on an element to trigger the dialog when element gets scrolled into the viewport
// data-dialog-cooldown="cooldown-time" Cooldown time between dialog triggers in seconds, or as day, week, month. Set on dialog

// Customize backdrop color and opacity with CSS ::backdrop{ background: rgba(0,0,0,0.5); }

// Roadmap
// 1. Prevent open multiple dialogs

document.addEventListener("DOMContentLoaded", async function () {
  console.log("Dialog script loaded");
  let dialogContentElements = document.querySelectorAll("[data-dialog]:not([data-dialog='close'])");
  let triggerDialogElements = document.querySelectorAll("[data-dialog-trigger]");

  // Create dialog from element and append it to body
  function createDialog(element) {
    let dialog = document.createElement("dialog");
    dialog.append(element);
    dialog.setAttribute("data-dialog", element.getAttribute("data-dialog"));
    element.removeAttribute("data-dialog");

    // Transfer all data-dialog-* attributes to dialog element
    Array.from(element.attributes)
      .filter((attr) => attr.name.startsWith("data-dialog-"))
      .forEach((attr) => {
        dialog.setAttribute(attr.name, attr.value);
        element.removeAttribute(attr.name);
      });

    document.body.append(dialog);
    console.log("appending dialog", dialog);
  }

  async function addDialogs() {
    dialogContentElements.forEach((element) => {
      createDialog(element);
    });
    console.log("add dialogs");
    return Promise.resolve();
  }

  await addDialogs().then(() => {
    initializeAllTriggers();
  });

  function initializeAllTriggers() {
    const dialogs = document.querySelectorAll("dialog[data-dialog]");
    dialogs.forEach((dialog) => {
      // Initialize time-based trigger
      if (dialog.hasAttribute("data-dialog-delay")) {
        initializeTimeTrigger(dialog);
      }
      // Initialize scroll trigger
      const dialogName = dialog.getAttribute("data-dialog");
      const scrollTrigger = document.querySelector(`[data-dialog-scroll="${dialogName}"]`);
      if (scrollTrigger) {
        initializeScrollTrigger(dialog, scrollTrigger);
      }
      // Initialize exit intent trigger
      if (dialog.hasAttribute("data-dialog-exit-intent")) {
        initializeExitIntentTrigger(dialog);
      }
    });
  }

  function initializeTimeTrigger(dialog) {
    const dialogName = dialog.getAttribute("data-dialog");
    const delay = parseInt(dialog.getAttribute("data-dialog-delay")) * 1000;
    const cooldown = getCoolDownTime(dialog);

    if (canTriggerDialog(dialogName, cooldown)) {
      setTimeout(() => {
        // Check if dialog has been opened by another trigger
        canTriggerDialog(dialogName, cooldown) && openDialog(dialog);
      }, delay);
    }
  }
  function getCoolDownTime(dialog) {
    // Default cooldown times day, week, month in seconds
    const cooldownTimes = {
      day: 86400,
      week: 604800,
      month: 2592000,
    };

    // Check if cooldown time is set in seconds or as a string (day, week, month)
    const cooldown = cooldownTimes[dialog.getAttribute("data-dialog-cooldown")] || parseInt(dialog.getAttribute("data-dialog-cooldown")) * 1000 || 0;

    return cooldown;
  }

  function initializeScrollTrigger(dialog, triggerElement) {
    const dialogName = dialog.getAttribute("data-dialog");
    const cooldown = getCoolDownTime(dialog);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && canTriggerDialog(dialogName, cooldown)) {
            openDialog(dialog);
            observer.unobserve(triggerElement);
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of element is visible
      }
    );

    observer.observe(triggerElement);
  }

  function initializeExitIntentTrigger(dialog) {
    const dialogName = dialog.getAttribute("data-dialog");

    const cooldown = getCoolDownTime(dialog);

    document.addEventListener("mouseout", function (e) {
      if (e.clientY <= 0 && canTriggerDialog(dialogName, cooldown)) {
        openDialog(dialog);
      }
    });
  }

  function canTriggerDialog(dialogName, cooldown) {
    const lastOpenTime = localStorage.getItem(`${dialogName}_last_open`);
    if (!lastOpenTime) return true;

    const timeSinceLastOpen = Date.now() - parseInt(lastOpenTime);
    return timeSinceLastOpen >= cooldown;
  }

  function isDialogOpen() {
    const dialogs = document.querySelectorAll("dialog");
    for (const dialog of dialogs) {
      if (dialog.open) {
        return true;
      }
    }
    return false;
  }

  function openDialog(dialog) {
    if (isDialogOpen()) return;

    const dialogName = dialog.getAttribute("data-dialog");

    dialog.addEventListener("click", (e) => {
      if (e.target === dialog || e.target.closest("[data-dialog='close']")) {
        dialog.close();
      }
    });

    dialog.showModal();
    localStorage.setItem(`${dialogName}_last_open`, Date.now().toString());
  }

  // Click trigger handlers
  triggerDialogElements.forEach((element) => {
    element.addEventListener("click", () => {
      const dialogName = element.getAttribute("data-dialog-trigger");
      const dialog = document.querySelector(`[data-dialog="${dialogName}"]`);
      if (!dialog) return;
      openDialog(dialog);
    });
  });

  // Create dialog styles
  function createDialogStyle() {
    let style = document.createElement("style");
    style.innerHTML = `
        body:has(dialog[open]) {
            overflow: hidden;
        }
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
  createDialogStyle();
});
