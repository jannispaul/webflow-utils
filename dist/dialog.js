var S=r=>{throw TypeError(r)};var y=(r,e,t)=>e.has(r)||S("Cannot "+t);var n=(r,e,t)=>(y(r,e,"read from private field"),t?t.call(r):e.get(r)),d=(r,e,t)=>e.has(r)?S("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(r):e.set(r,t),h=(r,e,t,i)=>(y(r,e,"write to private field"),i?i.call(r,t):e.set(r,t),t),c=(r,e,t)=>(y(r,e,"access private method"),t);var l,p,f,D,g,o,A,b,w,m,O,v,$,L,C,N,R,k;const a=class a{constructor(){d(this,o);d(this,f);d(this,D);d(this,g,null);h(this,f,document.querySelectorAll(`[${n(a,l).ID}]`)),h(this,D,document.querySelectorAll(`[${n(a,l).TRIGGER}]`)),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",this.init.bind(this)):this.init(),c(this,o,k).call(this)}static get ATTRIBUTES(){return n(this,l)}async init(){await c(this,o,b).call(this);const e=document.querySelectorAll(`dialog[${n(a,l).ID}]`);c(this,o,R).call(this,e),c(this,o,v).call(this,e),c(this,o,N).call(this),window.dispatchEvent(new CustomEvent("dialogs-created"))}openDialog(e){if(c(this,o,O).call(this))return;h(this,g,document.activeElement);const t=e.getAttribute(n(a,l).ID);e.showModal(),document.body.style.overflow="hidden",sessionStorage.setItem(`${t}_has_opened`,"true"),e.hasAttribute(n(a,l).COOLDOWN)&&localStorage.setItem(`${t}_last_open`,Date.now().toString()),window.dispatchEvent(new CustomEvent("dialog-opened",{detail:{element:e}}))}closeDialog(e){const t=document.querySelector(`dialog[${a.ATTRIBUTES.ID}="${e}"]`);return t?(t.close(),!0):!1}closeAllDialogs(){document.querySelectorAll("dialog[open]").forEach(e=>e.close())}};l=new WeakMap,p=new WeakMap,f=new WeakMap,D=new WeakMap,g=new WeakMap,o=new WeakSet,A=function(e){let t=document.createElement("dialog");const i=e.getAttribute(n(a,l).ID);t.append(e),t.setAttribute(n(a,l).ID,i),e.removeAttribute(n(a,l).ID),[...e.attributes].filter(s=>s.name.startsWith("data-dialog-")).forEach(s=>{t.setAttribute(s.name,s.value),e.removeAttribute(s.name)}),document.body.append(t)},b=async function(){return n(this,f).forEach(e=>c(this,o,A).call(this,e)),Promise.resolve()},w=function(e){const t=e.getAttribute(n(a,l).COOLDOWN);if(!t)return 0;if(n(a,p)[t])return n(a,p)[t]*1e3;const i=parseInt(t);return isNaN(i)?0:i*1e3},m=function(e,t){if(sessionStorage.getItem(`${e}_has_opened`))return!1;const s=localStorage.getItem(`${e}_last_open`);if(!s)return!0;const E=Date.now()-parseInt(s)>=t;return E},O=function(){return!!document.querySelector("dialog[open]")},v=function(e){e.forEach(t=>{const i=t.getAttribute(n(a,l).ID),s=c(this,o,w).call(this,t);if(!i)return;t.hasAttribute(n(a,l).DELAY)&&c(this,o,$).call(this,t,i,s);const u=document.querySelector(`[${n(a,l).SCROLL}="${i}"]`);u&&c(this,o,L).call(this,t,u,i,s),t.hasAttribute(n(a,l).EXIT_INTENT)&&c(this,o,C).call(this,t,i,s)})},$=function(e,t,i){const s=parseInt(e.getAttribute(n(a,l).DELAY))*1e3;c(this,o,m).call(this,t,i)&&setTimeout(()=>{c(this,o,m).call(this,t,i)&&this.openDialog(e)},s)},L=function(e,t,i,s){const u=new IntersectionObserver(E=>{E.forEach(q=>{q.isIntersecting&&c(this,o,m).call(this,i,s)&&(this.openDialog(e),u.unobserve(t))})},{threshold:.5});u.observe(t)},C=function(e,t,i){document.addEventListener("mouseout",s=>{!s.relatedTarget&&s.clientY<=5&&c(this,o,m).call(this,t,i)&&this.openDialog(e)})},N=function(){n(this,D).forEach(e=>{e.addEventListener("click",t=>{t.preventDefault();const i=e.getAttribute(n(a,l).TRIGGER),s=document.querySelector(`dialog[${n(a,l).ID}="${i}"]`);s&&this.openDialog(s)})})},R=function(e){e.forEach(t=>{t.addEventListener("click",i=>{(i.target===t||i.target.closest(`[${n(a,l).CLOSE}]`))&&t.close()}),t.addEventListener("close",()=>{n(this,g)&&(n(this,g).focus(),h(this,g,null)),document.body.style.overflow="",window.dispatchEvent(new CustomEvent("dialog-closed",{detail:{element:t}}))})})},k=function(){let e=document.createElement("style");e.innerHTML=`
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
        `,document.head.appendChild(e)},d(a,l,{ID:"data-dialog-id",TRIGGER:"data-dialog-trigger",DELAY:"data-dialog-delay",EXIT_INTENT:"data-dialog-exit-intent",SCROLL:"data-dialog-scroll",COOLDOWN:"data-dialog-cooldown",CLOSE:"data-dialog-close"}),d(a,p,{day:86400,week:604800,month:2592e3});let T=a;const I=new T;window.dialogs={open:r=>{const e=document.querySelector(`dialog[${T.ATTRIBUTES.ID}="${r}"]`);return e?(I.openDialog(e),!0):!1},close:r=>I.closeDialog(r),closeAll:()=>I.closeAllDialogs()};
