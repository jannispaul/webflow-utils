document.addEventListener("DOMContentLoaded",function(){let u=Array.from(document.querySelectorAll("video:has(source[data-src])")),d=Array.from(document.querySelectorAll("video[autoplay]")),a,s=document.querySelector("script[data-smart-video]"),b=(s==null?void 0:s.dataset.breakpoint)||768;function n(){return window.matchMedia(`(max-width:${b}px)`).matches}if(a=n(),"IntersectionObserver"in window){let i=function(e){e.removeAttribute("autoplay"),e.controls=!0,e.controls=!1,o.unobserve(e)};var h=i;let t=new IntersectionObserver((e,l)=>{e.forEach(r=>{r.isIntersecting?r.target.hasAttribute("loaded")||c(r.target):r.target.hasAttribute("loaded")&&t.unobserve(r.target)})},{rootMargin:"0px 0px 200px 0px"}),o=new IntersectionObserver((e,l)=>{e.forEach(r=>{r.isIntersecting?r.target.hasAttribute("loaded")&&r.target.play().catch(g=>{g.name==="NotAllowedError"&&i(r.target)}):(r.target.pause(),r.target.hasAttribute("replay")&&(r.target.currentTime=0))})});d.forEach(e=>{f(e),!e.hasAttribute("loaded")&&Array.from(e.children).some(l=>l.hasAttribute("data-src"))&&t.observe(e),o.observe(e)})}function c(t){for(let o of t.children)o.tagName==="SOURCE"&&(o.src=a&&o.dataset.srcMobile?o.dataset.srcMobile:o.dataset.src);t.load(),t.setAttribute("loaded",!0)}function f(t){a&&t.dataset.posterMobile&&t.setAttribute("poster",t.dataset.posterMobile)}window.addEventListener("resize",()=>{if(a!==n())a=n();else return;u.forEach(function(t){t.hasAttribute("loaded")&&c(t)})})});
