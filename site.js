/* GameCamp client-side: auth (localStorage + SHA-256), toast, clipboard, header user. Demo only: no backend. */
(()=>{
const LS={get:(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set:(k,v)=>localStorage.setItem(k,JSON.stringify(v)),del:k=>localStorage.removeItem(k)};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function sha(s){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
const salt=()=>[...crypto.getRandomValues(new Uint8Array(16))].map(x=>x.toString(16).padStart(2,'0')).join('');
const users=()=>LS.get('gc_users',{});
const user=()=>{const u=LS.get('gc_session',null);return u&&users()[u.toLowerCase()]?users()[u.toLowerCase()]:null};
let tt;function toast(m){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';t.setAttribute('role','status');document.body.append(t)}t.textContent=m;t.classList.toggle('err',/yanlış|kifayət|boş ola|dəstəklənmir|olmalı|xəta/i.test(m));t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),2600)}
async function copy(txt,msg){try{await navigator.clipboard.writeText(txt)}catch(e){const a=document.createElement('textarea');a.value=txt;a.style.position='fixed';a.style.opacity=0;document.body.append(a);a.select();try{document.execCommand('copy')}catch(_){}a.remove()}toast(msg||'Kopyalandı')}
// modal
const sc=document.createElement('div');sc.className='mscrim';sc.innerHTML=`<div class="modal" role="dialog" aria-modal="true" aria-labelledby="mh">
<button class="mx" type="button" aria-label="Bağla">${ic('plus',18).replace('<svg','<svg style="transform:rotate(45deg)"')}</button>
<div class="kick">${ic('user',14)}GameCamp hesabı</div><h2 id="mh">Daxil ol</h2><p class="mp" id="mpx">Çata yazmaq, izləmək və hədiyyə göndərmək üçün hesabına daxil ol.</p>
<div class="mtabs"><button type="button" data-m="login" class="on">Daxil ol</button><button type="button" data-m="reg">Qeydiyyat</button></div>
<form novalidate id="af"><div class="fr"><label for="au">İstifadəçi adı</label><input id="au" autocomplete="username" maxlength="20"></div>
<div class="fe"><label for="ae">E-poçt</label><input id="ae" type="email" autocomplete="email" maxlength="80"></div>
<label for="ap">Şifrə</label><input id="ap" type="password" autocomplete="current-password" maxlength="64">
<div class="merr" id="aerr" role="alert"></div><button class="btn p" id="asb" type="submit">Daxil ol</button>
<p class="mnote">Demo rejimi: hesab yalnız bu brauzerdə saxlanılır, şifrə SHA-256 ilə heşlənir. Serverə heç nə göndərilmir.</p></form></div>`;
let mode='login',after=null;
function setMode(m){mode=m;const r=m=='reg';sc.querySelectorAll('.mtabs button').forEach(b=>b.classList.toggle('on',b.dataset.m==m));
 sc.querySelector('#mh').textContent=r?'Qeydiyyat':'Daxil ol';sc.querySelector('#asb').textContent=r?'Hesab yarat':'Daxil ol';
 sc.querySelector('.fe').style.display=r?'':'none';sc.querySelector('.fr label').textContent=r?'İstifadəçi adı':'İstifadəçi adı və ya e-poçt';
 sc.querySelector('#ap').autocomplete=r?'new-password':'current-password';sc.querySelector('#aerr').textContent='';sc.querySelectorAll('input').forEach(i=>i.classList.remove('bad'))}
function openAuth(m,cb,why){after=cb||null;setMode(m||'login');sc.querySelector('#mpx').textContent=why||'Çata yazmaq, izləmək və hədiyyə göndərmək üçün hesabına daxil ol.';sc.classList.add('on');setTimeout(()=>sc.querySelector('#au').focus(),50)}
const close=()=>{sc.classList.remove('on')};
sc.querySelector('.mx').onclick=close;sc.onclick=e=>{if(e.target==sc)close()};addEventListener('keydown',e=>{if(e.key=='Escape')close()});
sc.querySelectorAll('.mtabs button').forEach(b=>b.onclick=()=>setMode(b.dataset.m));sc.querySelectorAll('input').forEach(i=>i.oninput=()=>{i.classList.remove('bad');sc.querySelector('#aerr').textContent=''});
sc.querySelector('#af').onsubmit=async e=>{e.preventDefault();const $$=i=>sc.querySelector(i),u=$$('#au').value.trim(),em=$$('#ae').value.trim(),p=$$('#ap').value,err=$$('#aerr');
 sc.querySelectorAll('input').forEach(i=>i.classList.remove('bad'));const bad=(i,m)=>{$$(i).classList.add('bad');$$(i).focus();err.textContent=m};const U=users();
 if(mode=='reg'){
  if(!/^[A-Za-z0-9_.əöüğışçƏÖÜĞIŞÇİ]{3,20}$/.test(u))return bad('#au','İstifadəçi adı 3-20 simvol olmalıdır (hərf, rəqəm, _ və .).');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em))return bad('#ae','Düzgün e-poçt ünvanı daxil et.');
  if(p.length<6||!/\d/.test(p)||!/[^\d]/.test(p))return bad('#ap','Şifrə ən azı 6 simvol olmalı, hərf və rəqəm içərməlidir.');
  if(U[u.toLowerCase()])return bad('#au','Bu istifadəçi adı artıq mövcuddur.');
  if(Object.values(U).some(x=>x.email.toLowerCase()==em.toLowerCase()))return bad('#ae','Bu e-poçt ilə hesab artıq var.');
  const s=salt();U[u.toLowerCase()]={name:u,email:em,salt:s,hash:await sha(s+':'+p),created:Date.now()};LS.set('gc_users',U);LS.set('gc_session',u.toLowerCase());
  toast('Xoş gəldin, '+u+'! Hesab yaradıldı.');
 }else{
  if(!u)return bad('#au','İstifadəçi adı və ya e-poçt daxil et.');if(!p)return bad('#ap','Şifrəni daxil et.');
  const a=U[u.toLowerCase()]||Object.values(U).find(x=>x.email.toLowerCase()==u.toLowerCase());
  if(!a||await sha(a.salt+':'+p)!==a.hash)return bad('#ap','İstifadəçi adı və ya şifrə yanlışdır.');
  LS.set('gc_session',a.name.toLowerCase());toast('Xoş gəldin, '+a.name+'!');
 }
 $$('#af').reset();close();render();if(after){const f=after;after=null;try{f()}catch(_){}}document.dispatchEvent(new Event('gc-auth'))};
function logout(){LS.del('gc_session');render();document.dispatchEvent(new Event('gc-auth'));toast('Hesabdan çıxış edildi')}
function render(){document.querySelectorAll('[data-auth]').forEach(b=>{const u=user();let w=b.parentElement.classList.contains('uwrap')?b.parentElement:null;
 if(!w){w=document.createElement('span');w.className='uwrap';b.before(w);w.append(b);const m=document.createElement('div');m.className='umenu';w.append(m)}
 const m=w.querySelector('.umenu');b.classList.add('ua');b.setAttribute('href','#');b.setAttribute('role','button');
 if(u){b.classList.add('in');b.innerHTML=`<span class="uav">${esc(u.name[0].toUpperCase())}</span><span class="ut">${esc(u.name)}</span>`;b.setAttribute('aria-label','Hesab menyusu: '+u.name);
  m.innerHTML=`<div class="uh"><b>${esc(u.name)}</b><small>${esc(u.email)}</small></div><a href="dashboard.html">${ic('radio',16)}Yayıncı paneli</a><a href="info.html?p=followed">${ic('heart',16)}İzlədiklərim</a><button type="button" data-out>${ic('back',16)}Çıxış</button>`;
  m.querySelector('[data-out]').onclick=()=>{m.classList.remove('open');logout()}}
 else{b.classList.remove('in');b.innerHTML=ic('user')+'<span class="ut">Daxil ol</span>';b.setAttribute('aria-label','Daxil ol');m.classList.remove('open');m.innerHTML=''}
 b.onclick=e=>{e.preventDefault();if(user())m.classList.toggle('open');else openAuth('login')}})}
document.addEventListener('click',e=>{if(!e.target.closest('.uwrap'))document.querySelectorAll('.umenu.open').forEach(m=>m.classList.remove('open'))});
function need(cb,why){if(user())return cb(),true;openAuth('login',cb,why);return false}
const ukey=k=>'gc_'+k+'_'+(user()?user().name.toLowerCase():'guest');
window.GC={LS,esc,toast,copy,user,openAuth,need,logout,render,ukey};
document.addEventListener('DOMContentLoaded',()=>{document.body.append(sc);render()});
if(document.readyState!='loading'){document.body.append(sc);render()}
// dead '#' links -> in-site pages
document.addEventListener('click',e=>{const a=e.target.closest('a[href="#"]');if(a&&!a.hasAttribute('data-auth')&&!a.dataset.js){e.preventDefault();location.href='info.html?p=soon'}});
})();
