document.addEventListener("DOMContentLoaded",function(){let d=document.querySelectorAll("[data-dialog]:not([data-dialog='close'])"),i=document.querySelectorAll("[data-dialog-trigger]");function l(e){let o=document.createElement("dialog");o.append(e),o.setAttribute("data-dialog",e.getAttribute("data-dialog")),e.removeAttribute("data-dialog"),e.getAttribute("data-dialog-delay")&&(o.setAttribute("data-dialog-delay",e.getAttribute("data-dialog-delay")),e.removeAttribute("data-dialog-delay")),document.body.append(o)}async function n(){return d.forEach(e=>{l(e)}),Promise.resolve()}n().then(()=>{setTimeout(()=>{r()},100)});function r(){document.querySelectorAll("[data-dialog-delay]").forEach(o=>{g(o)})}function g(e){let o=e.getAttribute("data-dialog"),t=parseInt(e.getAttribute("data-dialog-delay"))*1e3;sessionStorage.getItem(o)!=="opened"&&setTimeout(()=>{a(e)},t)}function c(){const e=document.querySelectorAll("dialog");for(const o of e)if(o.open)return!0;return!1}function a(e){if(c())return;let o=e.getAttribute("data-dialog");e.addEventListener("click",t=>{(t.target===e||t.target.closest("[data-dialog='close']"))&&e.close()}),e.showModal(),sessionStorage.setItem(o,"opened")}i.forEach(e=>{e.addEventListener("click",()=>{let o=e.getAttribute("data-dialog-trigger"),t=document.querySelector(`[data-dialog="${o}"]`);t&&a(t)})});function s(){let e=document.createElement("style");e.innerHTML=`
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
      `,document.head.appendChild(e)}s()});
