document.addEventListener("DOMContentLoaded",function(){let a=[].slice.call(document.querySelectorAll("video:has(source[data-src])"));if("IntersectionObserver"in window){let s=new IntersectionObserver((t,n)=>{t.forEach(e=>{if(e.isIntersecting){if(!e.target.hasAttribute("loaded")){for(let r of e.target.children)r.tagName==="SOURCE"&&(r.src=r.dataset.src);e.target.load(),e.target.setAttribute("loaded",!0)}e.target.hasAttribute("replay")?e.target.currentTime=0:s.unobserve(e.target)}})});if(!a)return;a.forEach(function(t){s.observe(t)})}});
