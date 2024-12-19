document.addEventListener("DOMContentLoaded",async function(){let l=document.querySelectorAll("[data-dialog]:not([data-dialog='close'])"),d=document.querySelectorAll("[data-dialog-trigger]");function i(t){let e=document.createElement("dialog");e.append(t),e.setAttribute("data-dialog",t.getAttribute("data-dialog")),t.removeAttribute("data-dialog"),t.getAttribute("data-dialog-delay")&&(e.setAttribute("data-dialog-delay",t.getAttribute("data-dialog-delay")),t.removeAttribute("data-dialog-delay")),document.body.append(e)}async function n(){return l.forEach(t=>{i(t)}),Promise.resolve()}await n().then(()=>{r()});function r(){document.querySelectorAll("[data-dialog-delay]").forEach(e=>{s(e)})}function s(t){let e=t.getAttribute("data-dialog"),o=parseInt(t.getAttribute("data-dialog-delay"))*1e3;sessionStorage.getItem(e)!=="opened"&&setTimeout(()=>{a(t)},o)}function g(){const t=document.querySelectorAll("dialog");for(const e of t)if(e.open)return!0;return!1}function a(t){if(g())return;let e=t.getAttribute("data-dialog");t.addEventListener("click",o=>{(o.target===t||o.target.closest("[data-dialog='close']"))&&t.close()}),t.showModal(),sessionStorage.setItem(e,"opened")}d.forEach(t=>{t.addEventListener("click",()=>{let e=t.getAttribute("data-dialog-trigger"),o=document.querySelector(`[data-dialog="${e}"]`);o&&a(o)})});function c(){let t=document.createElement("style");t.innerHTML=`
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
      `,document.head.appendChild(t)}c()});
