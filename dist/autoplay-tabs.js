document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll("[data-tabs-element='tabs']").forEach(r=>{let n=Array.from(r.children),l=parseInt(r.getAttribute("data-tabs-duration"))||5e3,i,o,a=!1,c=0,s=r.querySelector("[data-tabs-element='progress']"),d="horizontal";s&&s.parentElement.clientHeight>s.parentElement.clientWidth&&(d="vertical");const m=d==="horizontal"?[{width:"0%"},{width:"100%"}]:[{height:"0%"},{height:"100%"}];navigator.userAgent.includes("Safari")&&n.forEach(e=>e.focus=function(){const t=window.scrollX,b=window.scrollY,f=()=>{setTimeout(()=>window.scrollTo(t,b),1),e.removeEventListener("focus",f)};e.addEventListener("focus",f),HTMLElement.prototype.focus.apply(this,arguments)}),new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting?(u(n[c]),a=!0):(a=!1,clearTimeout(i))})}).observe(r);function h(e){clearTimeout(i),i=setTimeout(()=>{if(!a)return;let t=e.nextSibling;u(t)},l)}function u(e){e?e.click():n[0].click()}function g(e){o&&o.cancel();let t=e.querySelector("[data-tabs-element='progress']");t&&(o=t.animate(m,{duration:l,fill:"forwards"}))}function v(e){c=n.indexOf(e),g(e),h(e)}n.forEach(e=>e.addEventListener("focus",()=>v(e)))})});
