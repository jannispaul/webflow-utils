const l=t=>{const e=`; ${document.cookie}`.split(`; ${t}=`);if(e.length===2)return e.pop().split(";").shift()},i=()=>navigator.language.toLowerCase().split("-")[0],a=t=>{const r=document.querySelector(`link[rel="alternate"][hreflang="${t}"]`);if(!r)return null;const e=new URL(r.href),o=new URL(window.location.href);return e.search=o.search,e.hash=o.hash,e.toString()};if(!window.location.href.includes("webflow.io")){const t=document.documentElement.lang.toLowerCase(),r=l("preferredLang"),e=i(),o=r||e;if(o!==t){const n=a(o)||a("en");n&&n!==window.location.href&&(window.location.href=n)}document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll("a[hreflang]").forEach(n=>{n.addEventListener("click",()=>{const c=n.getAttribute("hreflang");document.cookie=`preferredLang=${c};path=/;max-age=31536000;SameSite=Strict`})})})}
