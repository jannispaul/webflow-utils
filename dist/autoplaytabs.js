document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll("[data-tabs-element='tabs']").forEach(r=>{let n=Array.from(r.children),s=parseInt(r.getAttribute("data-tabs-duration"))||5e3,l,i,o=!1,c=0,a=r.querySelector("[data-tabs-element='progress']"),d="horizontal";a&&a.parentElement.clientHeight>a.parentElement.clientWidth&&(d="vertical");const h=d==="horizontal"?[{width:"0%"},{width:"100%"}]:[{height:"0%"},{height:"100%"}];navigator.userAgent.includes("Safari")&&n.forEach(e=>e.focus=function(){const t=window.scrollX,E=window.scrollY,m=()=>{setTimeout(()=>window.scrollTo(t,E),1),e.removeEventListener("focus",m)};e.addEventListener("focus",m),HTMLElement.prototype.focus.apply(this,arguments)}),new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting?(f(n[c]),o=!0):(o=!1,clearTimeout(l))})}).observe(r);function v(e){l=setTimeout(()=>{if(!o)return;let t=e.nextSibling;f(t)},s)}function f(e){e?e.click():n[0].click()}function g(e){i&&i.cancel();let t=e.querySelector("[data-tabs-element='progress']");t&&(i=t.animate(h,{duration:s,fill:"forwards"}))}function u(e){c=n.indexOf(e),g(e),v(e)}n.forEach(e=>e.addEventListener("focus",()=>u(e))),n.forEach(e=>e.addEventListener("click",()=>u(e)))})});
