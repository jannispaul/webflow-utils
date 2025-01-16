document.addEventListener("DOMContentLoaded",async function(){let d=document.querySelectorAll("[data-dialog]:not([data-dialog='close'])"),c=document.querySelectorAll("[data-dialog-trigger]");function s(t){let e=document.createElement("dialog");e.append(t),e.setAttribute("data-dialog",t.getAttribute("data-dialog")),t.removeAttribute("data-dialog"),Array.from(t.attributes).filter(o=>o.name.startsWith("data-dialog-")).forEach(o=>{e.setAttribute(o.name,o.value),t.removeAttribute(o.name)}),document.body.append(e)}async function g(){return d.forEach(t=>{s(t)}),Promise.resolve()}await g().then(()=>{u()});function u(){document.querySelectorAll("dialog[data-dialog]").forEach(e=>{e.hasAttribute("data-dialog-delay")&&m(e);const o=e.getAttribute("data-dialog"),a=document.querySelector(`[data-dialog-scroll="${o}"]`);a&&f(e,a),e.hasAttribute("data-dialog-exit-intent")&&p(e)})}function m(t){const e=t.getAttribute("data-dialog"),o=parseInt(t.getAttribute("data-dialog-delay"))*1e3,a=r(t);n(e,a)&&setTimeout(()=>{n(e,a)&&i(t)},o)}function r(t){return{day:86400,week:604800,month:2592e3}[t.getAttribute("data-dialog-cooldown")]||parseInt(t.getAttribute("data-dialog-cooldown"))*1e3||0}function f(t,e){const o=t.getAttribute("data-dialog"),a=r(t),l=new IntersectionObserver(A=>{A.forEach(w=>{w.isIntersecting&&n(o,a)&&(i(t),l.unobserve(e))})},{threshold:.5});l.observe(e)}function p(t){const e=t.getAttribute("data-dialog"),o=r(t);document.addEventListener("mouseout",function(a){a.clientY<=0&&n(e,o)&&i(t)})}function n(t,e){const o=localStorage.getItem(`${t}_last_open`);return o?Date.now()-parseInt(o)>=e:!0}function b(){const t=document.querySelectorAll("dialog");for(const e of t)if(e.open)return!0;return!1}function i(t){if(b())return;const e=t.getAttribute("data-dialog");t.addEventListener("click",o=>{(o.target===t||o.target.closest("[data-dialog='close']"))&&t.close()}),t.showModal(),localStorage.setItem(`${e}_last_open`,Date.now().toString())}c.forEach(t=>{t.addEventListener("click",()=>{const e=t.getAttribute("data-dialog-trigger"),o=document.querySelector(`[data-dialog="${e}"]`);o&&i(o)})});function y(){let t=document.createElement("style");t.innerHTML=`
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
    `,document.head.appendChild(t)}y()});
