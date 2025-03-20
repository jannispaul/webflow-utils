document.addEventListener("DOMContentLoaded",async function(){let l=document.querySelectorAll("[data-dialog-id]"),c=document.querySelectorAll("[data-dialog-trigger]");function s(t){let e=document.createElement("dialog");e.append(t),e.setAttribute("data-dialog-id",t.getAttribute("data-dialog-id")),t.removeAttribute("data-dialog-id"),Array.from(t.attributes).filter(o=>o.name.startsWith("data-dialog-")).forEach(o=>{e.setAttribute(o.name,o.value),t.removeAttribute(o.name)}),document.body.append(e)}async function g(){return l.forEach(t=>{s(t)}),Promise.resolve()}await g().then(()=>{u(),window.dispatchEvent(new CustomEvent("dialogsCreated"))});function u(){document.querySelectorAll("dialog[data-dialog-id]").forEach(e=>{e.hasAttribute("data-dialog-delay")&&m(e);const o=e.getAttribute("data-dialog-id"),a=document.querySelector(`[data-dialog-scroll="${o}"]`);a&&p(e,a),e.hasAttribute("data-dialog-exit-intent")&&f(e)})}function m(t){const e=t.getAttribute("data-dialog-id"),o=parseInt(t.getAttribute("data-dialog-delay"))*1e3,a=r(t);i(e,a)&&setTimeout(()=>{i(e,a)&&n(t)},o)}function r(t){return{day:86400,week:604800,month:2592e3}[t.getAttribute("data-dialog-cooldown")]||parseInt(t.getAttribute("data-dialog-cooldown"))*1e3||0}function p(t,e){const o=t.getAttribute("data-dialog-id"),a=r(t),d=new IntersectionObserver(w=>{w.forEach(A=>{A.isIntersecting&&i(o,a)&&(n(t),d.unobserve(e))})},{threshold:.5});d.observe(e)}function f(t){const e=t.getAttribute("data-dialog-id"),o=r(t);document.addEventListener("mouseout",function(a){a.clientY<=0&&i(e,o)&&n(t)})}function i(t,e){const o=localStorage.getItem(`${t}_last_open`);return o?Date.now()-parseInt(o)>=e:!0}function b(){const t=document.querySelectorAll("dialog");for(const e of t)if(e.open)return!0;return!1}function n(t){if(b())return;const e=t.getAttribute("data-dialog-id");t.addEventListener("click",o=>{(o.target===t||o.target.closest("[data-dialog-close]"))&&t.close()}),t.showModal(),localStorage.setItem(`${e}_last_open`,Date.now().toString()),window.dispatchEvent(new CustomEvent("dialogOpened",{detail:{element:t}}))}c.forEach(t=>{t.addEventListener("click",()=>{const e=t.getAttribute("data-dialog-trigger"),o=document.querySelector(`[data-dialog-id="${e}"]`);o&&n(o)})});function y(){let t=document.createElement("style");t.innerHTML=`
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
