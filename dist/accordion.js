class s{constructor(i){this.el=i,this.summary=i.querySelector("summary"),this.content=i.querySelector("[data-accordion-element='content']"),this.duration=parseInt(this.el.dataset.accordionDuration)||400,this.easing=this.el.dataset.accordionEasing||"cubic-bezier(0.45, 0, 0.55, 1)",this.group=this.el.dataset.accordionGroup,this.animation=null,this.isClosing=!1,this.isExpanding=!1,this.summary.addEventListener("click",t=>this.onClick(t)),this.el.open&&this.el.classList.add("open")}onClick(i){i.preventDefault(),this.el.style.overflow="hidden",this.isClosing||!this.el.open?(this.closeOtherAccordionsInGroup(),this.open()):(this.isExpanding||this.el.open)&&this.shrink()}closeOtherAccordionsInGroup(){document.querySelectorAll(`[data-accordion-group="${this.group}"][open]`).forEach(t=>{t!==this.el&&new s(t).shrink()})}shrink(){this.isClosing=!0,this.el.classList.remove("open"),this.el.style.overflow="hidden";const i=`${this.el.offsetHeight}px`,t=`${this.summary.offsetHeight}px`;this.animation&&this.animation.cancel(),this.animation=this.el.animate({height:[i,t]},{duration:this.duration,easing:this.easing}),this.animation.onfinish=()=>this.onAnimationFinish(!1),this.animation.oncancel=()=>this.isClosing=!1}open(){this.el.style.height=`${this.el.offsetHeight}px`,this.el.open=!0,window.requestAnimationFrame(()=>this.expand())}expand(){this.isExpanding=!0,this.el.classList.add("open");const i=`${this.el.offsetHeight}px`,t=`${this.summary.offsetHeight+this.content.offsetHeight}px`;this.animation&&this.animation.cancel(),this.animation=this.el.animate({height:[i,t]},{duration:this.duration,easing:this.easing}),this.animation.onfinish=()=>this.onAnimationFinish(!0),this.animation.oncancel=()=>this.isExpanding=!1}onAnimationFinish(i){this.el.open=i,this.animation=null,this.isClosing=!1,this.isExpanding=!1,this.el.style.height=this.el.style.overflow=""}}document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll("[data-accordion-element='accordion']").forEach(n=>{new s(n)})});
