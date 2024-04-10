(()=>{let d=document.querySelectorAll("[data-dialog]:not([data-dialog='close'])"),i=document.querySelectorAll("[data-dialog='close']"),l=document.querySelectorAll("[data-dialog-trigger]");function n(e){let t=document.createElement("dialog");t.appendChild(e),t.setAttribute("data-dialog",e.getAttribute("data-dialog")),t.setAttribute("data-dialog-delay",e.getAttribute("data-dialog-delay")),document.body.appendChild(t),t.addEventListener("click",a=>{a.target===t&&t.close()}),e.getAttribute("data-dialog-delay")&&r(t)}d.forEach(e=>{n(e)}),i.forEach(e=>{e.addEventListener("click",()=>{e.closest("dialog").close()})});function r(e){let t=e.getAttribute("data-dialog"),a=parseInt(e.getAttribute("data-dialog-delay"))*1e3;sessionStorage.getItem(t)!=="opened"&&setTimeout(()=>{o(e)},a)}function o(e){let t=e.getAttribute("data-dialog");e.showModal(),sessionStorage.setItem(t,"opened")}l.forEach(e=>{e.addEventListener("click",()=>{let t=e.getAttribute("data-dialog-trigger"),a=document.querySelector(`[data-dialog="${t}"]`);a&&o(a)})});function g(){let e=document.createElement("style");e.innerHTML=`
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
    `,document.head.appendChild(e)}g()})();
