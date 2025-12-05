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
  
    static get ATTRIBUTES() {
        return this.#ATTRIBUTES;
    }
  
    static #COOLDOWN_SECONDS = {
        day: 86400,
        week: 604800,
        month: 2592000,
    };
  
    // --- State ---
    #dialogContentElements;
    #triggerDialogElements;
    #lastFocusedElement = null;
  
    constructor() {
        this.#dialogContentElements = document.querySelectorAll(`[${DialogManager.#ATTRIBUTES.ID}]`);
        this.#triggerDialogElements = document.querySelectorAll(`[${DialogManager.#ATTRIBUTES.TRIGGER}]`);
  
        // FIX: Ensure init runs even if DOMContentLoaded already fired
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", this.init.bind(this));
        } else {
            this.init();
        }
        
        this.#createDialogStyle();
        console.log("Dialog script initialized");
    }
  
    async init() {
        await this.#addDialogs();
        const dialogs = document.querySelectorAll(`dialog[${DialogManager.#ATTRIBUTES.ID}]`);
  
        this.#initializeDialogCloseHandlers(dialogs);
        this.#initializeAutoTriggers(dialogs);
        this.#initializeClickTriggers();
  
        window.dispatchEvent(new CustomEvent("dialogs-created"));
        console.log("Dialogs ready. Triggers active.");
    }
  
    // --- Dialog Creation ---
  
    #createDialog(element) {
        let dialog = document.createElement("dialog");
        const dialogId = element.getAttribute(DialogManager.#ATTRIBUTES.ID);
        dialog.append(element);
        dialog.setAttribute(DialogManager.#ATTRIBUTES.ID, dialogId);
        element.removeAttribute(DialogManager.#ATTRIBUTES.ID);
  
        [...element.attributes]
            .filter((attr) => attr.name.startsWith("data-dialog-"))
            .forEach((attr) => {
                dialog.setAttribute(attr.name, attr.value);
                element.removeAttribute(attr.name);
            });
  
        document.body.append(dialog);
    }
  
    async #addDialogs() {
        this.#dialogContentElements.forEach((element) => this.#createDialog(element));
        return Promise.resolve();
    }
  
    // --- Logic & Constraints ---
  
    #getCoolDownTime(dialog) {
        const cooldownAttr = dialog.getAttribute(DialogManager.#ATTRIBUTES.COOLDOWN);
        if (!cooldownAttr) return 0;
  
        if (DialogManager.#COOLDOWN_SECONDS[cooldownAttr]) {
            return DialogManager.#COOLDOWN_SECONDS[cooldownAttr] * 1000;
        }
        const seconds = parseInt(cooldownAttr);
        return isNaN(seconds) ? 0 : seconds * 1000;
    }
  
    #shouldAutoTrigger(dialogName, cooldown) {
        // 1. Session Check
        const hasOpenedThisSession = sessionStorage.getItem(`${dialogName}_has_opened`);
        if (hasOpenedThisSession) {
            console.log(`[DialogManager] Blocked auto-open for "${dialogName}": Already opened this session.`);
            return false;
        }
  
        // 2. Cooldown Check
        const lastOpenTime = localStorage.getItem(`${dialogName}_last_open`);
        if (!lastOpenTime) return true;
  
        const timeSinceLastOpen = Date.now() - parseInt(lastOpenTime);
        const isCooldownOver = timeSinceLastOpen >= cooldown;
        
        if (!isCooldownOver) {
             console.log(`[DialogManager] Blocked auto-open for "${dialogName}": In persistent cooldown.`);
        }
  
        return isCooldownOver;
    }
  
    #isDialogOpen() {
        return !!document.querySelector("dialog[open]");
    }
  
    // --- Trigger Initialization ---
  
    #initializeAutoTriggers(dialogs) {
        dialogs.forEach((dialog) => {
            const dialogName = dialog.getAttribute(DialogManager.#ATTRIBUTES.ID);
            const cooldown = this.#getCoolDownTime(dialog);
            
            if (!dialogName) {
                console.error("[DialogManager] Found dialog without an ID attribute. Skipping auto-triggers.", dialog);
                return;
            }
  
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
        console.log(`[DialogManager] Timer set for "${dialogName}": ${delay}ms`);
  
        if (this.#shouldAutoTrigger(dialogName, cooldown)) {
            setTimeout(() => {
                if (this.#shouldAutoTrigger(dialogName, cooldown)) {
                    console.log(`[DialogManager] Triggering Time Open for "${dialogName}"`);
                    this.openDialog(dialog);
                }
            }, delay);
        }
    }
  
    #initializeScrollTrigger(dialog, triggerElement, dialogName, cooldown) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && this.#shouldAutoTrigger(dialogName, cooldown)) {
                        console.log(`[DialogManager] Triggering Scroll Open for "${dialogName}"`);
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
        // Listen to mouse movement over the entire document
        document.addEventListener("mouseout", (e) => {
            // Check 1: Did the mouse leave the document's top edge?
            // Check 2: Was the mouse not moving onto another element within the document?
            if (!e.relatedTarget && e.clientY <= 5) { // Adjusted threshold to 5px for better detection
                if (this.#shouldAutoTrigger(dialogName, cooldown)) {
                    console.log(`[DialogManager] Triggering Exit Intent for "${dialogName}"`);
                    this.openDialog(dialog);
                }
            }
        });
    }
  
    #initializeClickTriggers() {
        this.#triggerDialogElements.forEach((element) => {
            element.addEventListener("click", (e) => {
                e.preventDefault(); 
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
                    dialog.close();
                }
            });
            
            dialog.addEventListener("close", () => {
                if (this.#lastFocusedElement) {
                    this.#lastFocusedElement.focus();
                    this.#lastFocusedElement = null;
                }
                document.body.style.overflow = '';
                window.dispatchEvent(new CustomEvent("dialog-closed", { detail: { element: dialog } }));
            });
        });
    }
  
    openDialog(dialog) {
        if (this.#isDialogOpen()) return;
  
        this.#lastFocusedElement = document.activeElement;
        const dialogName = dialog.getAttribute(DialogManager.#ATTRIBUTES.ID);
  
        dialog.showModal();
        document.body.style.overflow = 'hidden';
        
        sessionStorage.setItem(`${dialogName}_has_opened`, "true");
  
        if (dialog.hasAttribute(DialogManager.#ATTRIBUTES.COOLDOWN)) {
            localStorage.setItem(`${dialogName}_last_open`, Date.now().toString());
        }
        
        window.dispatchEvent(new CustomEvent("dialog-opened", { detail: { element: dialog } }));
    }
  
    closeDialog(dialogName) {
        const dialog = document.querySelector(`dialog[${DialogManager.ATTRIBUTES.ID}="${dialogName}"]`);
        if (dialog) {
            dialog.close();
            return true;
        }
        return false;
    }
  
    closeAllDialogs() {
        document.querySelectorAll("dialog[open]").forEach(d => d.close());
    }
  
    // --- Styling ---
  
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
  
  const managerInstance = new DialogManager();
  
  window.dialogs = {
    open: (dialogName) => {
        const dialog = document.querySelector(`dialog[${DialogManager.ATTRIBUTES.ID}="${dialogName}"]`);
        if (dialog) {
            managerInstance.openDialog(dialog);
            return true;
        }
        return false;
    },
    close: (dialogName) => managerInstance.closeDialog(dialogName),
    closeAll: () => managerInstance.closeAllDialogs(),
  };