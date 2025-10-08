var b=a=>{throw TypeError(a)};var f=(a,t,e)=>t.has(a)||b("Cannot "+e);var n=(a,t,e)=>(f(a,t,"read from private field"),e?e.call(a):t.get(a)),d=(a,t,e)=>t.has(a)?b("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(a):t.set(a,e),h=(a,t,e,o)=>(f(a,t,"write to private field"),o?o.call(a,e):t.set(a,e),e),c=(a,t,e)=>(f(a,t,"access private method"),e);var r,p,D,E,u,i,w,A,T,m,v,S,O,L,C,$,N,R;const s=class s{constructor(){d(this,i);d(this,D);d(this,E);d(this,u,null);h(this,D,document.querySelectorAll(`[${n(s,r).ID}]`)),h(this,E,document.querySelectorAll(`[${n(s,r).TRIGGER}]`)),document.addEventListener("DOMContentLoaded",this.init.bind(this)),c(this,i,R).call(this)}async init(){await c(this,i,A).call(this);const t=document.querySelectorAll(`dialog[${n(s,r).ID}]`);c(this,i,N).call(this,t),c(this,i,S).call(this,t),c(this,i,$).call(this),window.dispatchEvent(new CustomEvent("dialogs-created"))}openDialog(t){if(c(this,i,v).call(this))return;h(this,u,document.activeElement);const e=t.getAttribute(n(s,r).ID);t.showModal(),document.body.style.overflow="hidden",t.hasAttribute(n(s,r).COOLDOWN)&&localStorage.setItem(`${e}_last_open`,Date.now().toString()),window.dispatchEvent(new CustomEvent("dialog-opened",{detail:{element:t}}))}closeDialog(t){const e=document.querySelector(`dialog[${n(s,r).ID}="${t}"]`);return e?(e.close(),!0):!1}closeAllDialogs(){document.querySelectorAll("dialog[open]").forEach(t=>t.close())}};r=new WeakMap,p=new WeakMap,D=new WeakMap,E=new WeakMap,u=new WeakMap,i=new WeakSet,w=function(t){let e=document.createElement("dialog");const o=t.getAttribute(n(s,r).ID);e.append(t),e.setAttribute(n(s,r).ID,o),t.removeAttribute(n(s,r).ID),[...t.attributes].filter(l=>l.name.startsWith("data-dialog-")).forEach(l=>{e.setAttribute(l.name,l.value),t.removeAttribute(l.name)}),document.body.append(e)},A=async function(){return n(this,D).forEach(t=>{c(this,i,w).call(this,t)}),Promise.resolve()},T=function(t){const e=t.getAttribute(n(s,r).COOLDOWN);if(!e)return 0;if(n(s,p)[e])return n(s,p)[e]*1e3;const o=parseInt(e);return isNaN(o)?0:o*1e3},m=function(t,e){const o=localStorage.getItem(`${t}_last_open`);return o?Date.now()-parseInt(o)>=e:!0},v=function(){return!!document.querySelector("dialog[open]")},S=function(t){t.forEach(e=>{const o=e.getAttribute(n(s,r).ID),l=c(this,i,T).call(this,e);e.hasAttribute(n(s,r).DELAY)&&c(this,i,O).call(this,e,o,l);const g=document.querySelector(`[${n(s,r).SCROLL}="${o}"]`);g&&c(this,i,L).call(this,e,g,o,l),e.hasAttribute(n(s,r).EXIT_INTENT)&&c(this,i,C).call(this,e,o,l)})},O=function(t,e,o){const l=parseInt(t.getAttribute(n(s,r).DELAY))*1e3;c(this,i,m).call(this,e,o)&&setTimeout(()=>{c(this,i,m).call(this,e,o)&&this.openDialog(t)},l)},L=function(t,e,o,l){const g=new IntersectionObserver(q=>{q.forEach(k=>{k.isIntersecting&&c(this,i,m).call(this,o,l)&&(this.openDialog(t),g.unobserve(e))})},{threshold:.5});g.observe(e)},C=function(t,e,o){document.addEventListener("mouseout",l=>{l.clientY<=0&&c(this,i,m).call(this,e,o)&&this.openDialog(t)})},$=function(){n(this,E).forEach(t=>{t.addEventListener("click",()=>{const e=t.getAttribute(n(s,r).TRIGGER),o=document.querySelector(`dialog[${n(s,r).ID}="${e}"]`);o&&this.openDialog(o)})})},N=function(t){t.forEach(e=>{e.addEventListener("click",o=>{(o.target===e||o.target.closest(`[${n(s,r).CLOSE}]`))&&e.close()}),e.addEventListener("close",()=>{n(this,u)&&(n(this,u).focus(),h(this,u,null)),document.body.style.overflow="",window.dispatchEvent(new CustomEvent("dialog-closed",{detail:{element:e}}))})})},R=function(){let t=document.createElement("style");t.innerHTML=`
  
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
      `,document.head.appendChild(t)},d(s,r,{ID:"data-dialog-id",TRIGGER:"data-dialog-trigger",DELAY:"data-dialog-delay",EXIT_INTENT:"data-dialog-exit-intent",SCROLL:"data-dialog-scroll",COOLDOWN:"data-dialog-cooldown",CLOSE:"data-dialog-close"}),d(s,p,{day:86400,week:604800,month:2592e3});let y=s;const I=new y;window.dialogs={open:a=>{const t=document.querySelector(`dialog[${y.ATTRIBUTES.ID}="${a}"]`);return t?(I.openDialog(t),!0):!1},close:a=>I.closeDialog(a),closeAll:()=>I.closeAllDialogs()};
