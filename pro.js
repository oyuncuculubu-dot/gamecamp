/* GameCamp pro layer: header shadow, image fade-in/skeletons, lazy images */
(()=>{const h=document.querySelector('header');const f=()=>h&&h.classList.toggle('is-scrolled',scrollY>8);addEventListener('scroll',f,{passive:true});f();
const prep=img=>{if(img.dataset.pp)return;img.dataset.pp=1;if(img.closest('.gbtn')){const u=()=>img.src='icons3d/gift'+(document.body.classList.contains('talk')?'_a':'')+'.png';u();new MutationObserver(u).observe(document.body,{attributes:true,attributeFilter:['class']});return}if(img.classList.contains('i3')){return}
 const box=img.closest('.th,.fimg,.ph,.cat,.player');if(!img.closest('.fimg,.player')&&!img.hasAttribute('loading'))img.loading='lazy';img.decoding='async';
 const done=()=>{img.classList.add('in');box&&box.classList.remove('sk')};if(img.complete&&img.naturalWidth)done();else{box&&box.classList.add('sk');img.addEventListener('load',done,{once:true});img.addEventListener('error',done,{once:true})}};
const scan=r=>r.querySelectorAll&&r.querySelectorAll('img').forEach(prep);
new MutationObserver(m=>m.forEach(x=>x.addedNodes.forEach(n=>{if(n.tagName=='IMG')prep(n);else scan(n)}))).observe(document.documentElement,{childList:true,subtree:true});
scan(document);
})();
