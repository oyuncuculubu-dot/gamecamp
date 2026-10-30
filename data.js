const D={game:{name:'Oyun',hero:'assets/hero_game.jpg',h:'oyun',
cats:['Hamısı','GTA/RP','CS2','PUBG','Minecraft','Mobil'],
s:[['g2','Faceit 10-cu səviyyə matçları','BakuSniper','CS2',820],['g1','Bakı RP: gecə şəhər həyatı','RashidPlays','GTA/RP',540],['g5','PUBG Mobile turniri seçmələri','MobilAz','Mobil',410],['g7','Polis təqibi — RP server','Tural RP','GTA/RP',380],['g4','Sağ qalma rejimi: 100 gün','BlokUsta','Minecraft',320],['g3','Solo squad — top 1 hədəfi','NigarGG','PUBG',290],['g6','Premier rank — gecə sessiyası','Elvin_CS','CS2',260],['g8','Anbar xəritəsində taktika','Kamil5','CS2',150]],
feat:{id:'g6',img:'hero_game',t:'Rank yolu: Global Elite',who:'GameCamp',cat:'CS2',v:'1.2K',m:'Azərbaycan dili · 3 saatdır yayında'},
neu:[['Aqil','Minecraft','120 izləyici'],['Sevinc','Mobil','95 izləyici'],['Fərid','CS2','80 izləyici'],['Ramil','PUBG','64 izləyici']],
soon:[['Bu gün','21:00','CS2 icma turniri: final','GameCamp'],['Sabah','19:30','GTA RP: yeni server açılışı','RashidPlays'],['Şənbə','18:00','Minecraft tikinti yarışı','BlokUsta']]},
talk:{name:'Söhbət',hero:'assets/hero_talk.jpg',h:'söhbət',
cats:['Hamısı','Gündəlik','Musiqi','Podkast','Sual-Cavab','İdman'],
s:[['t5','Həftənin futbol icmalı','Qol Studiyası','İdman',410],['t1','Gecə söhbəti: günün mövzuları','Kamran','Gündəlik',350],['t2','Akustik axşam — sifarişlə mahnılar','Ruslan Gitara','Musiqi',280],['t6','Bulvar gəzintisi — canlı','Kamran IRL','Gündəlik',230],['t3','Texno Podkast: süni intellekt','Texno Podkast','Podkast',190],['t7','Canlı ifa: sintezator və vokal','Orxan Live','Musiqi',170],['t4','Universitet seçimi — sual-cavab','Leyla','Sual-Cavab',150],['t8','Dostlarla çay söhbəti','Üçümüz','Podkast',120]],
feat:{id:'t3',img:'hero_talk',t:'Bakıda gənc olmaq',who:'GameCamp',cat:'Podkast',v:'860',m:'Qonaqlar: Aysel M., Murad Ə.'},
neu:[['Nərmin','Musiqi','110 izləyici'],['Səid','Podkast','70 izləyici'],['Günay','Gündəlik','58 izləyici'],['Vüqar','İdman','44 izləyici']],
soon:[['Bu gün','22:00','Gecə podkastı: karyera','Texno Podkast'],['Sabah','20:00','Derbi öncəsi canlı müzakirə','Qol Studiyası'],['Cümə','21:30','Akustik gecə: sizin sifarişlər','Ruslan Gitara']]}};
const IC={gamepad:'<line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/>',mic:'<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',radio:'<circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>',play:'<polygon points="6 3 20 12 6 21 6 3" fill="currentColor"/>',eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',user:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',trophy:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',sparkles:'<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>',cal:'<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',arrow:'<path d="M5 12h14M12 5l7 7-7 7"/>',grid:'<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',plus:'<path d="M5 12h14M12 5v14"/>',search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',flame:'<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>'};
Object.assign(IC,{'heart': '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
'share': '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="m16 6-4-4-4 4"/><path d="M12 2v13"/>',
'vol': '<path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>',
'max': '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>',
'gear': '<circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M1 12h4M19 12h4M4.2 19.8 7 17M17 7l2.8-2.8"/>',
'send': '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
'copy': '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
'eyeoff': '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>',
'refresh': '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
'check': '<path d="M20 6 9 17l-5-5"/>',
'chev': '<path d="m6 9 6 6 6-6"/>',
'back': '<path d="m15 18-6-6 6-6"/>',
'pause': '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
'up': '<path d="m18 15-6-6-6 6"/>',
'layout': '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M9 21V9"/>'});
const ic=(n,s=16)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex:none">${IC[n]}</svg>`;
const CI={'Hamısı':'grid','GTA/RP':'car','CS2':'cs2','PUBG':'helmet','Minecraft':'block','Mobil':'phone','Gündəlik':'cup','Musiqi':'headphones','Podkast':'mic','Sual-Cavab':'bubble','İdman':'ball'};
const TH=['grid','star','calendar','bell','eye','s_video','s_camera','s_music','s_game','s_chat'];
const i3=(n,s=24,c='')=>`<img class="i3 ${c}" src="icons3d/${n}${W=='talk'&&TH.includes(n)?'_a':''}.png" width="${s}" height="${s}" alt="">`;
const fmt=n=>n>=1000?(n/1000).toFixed(1)+'K':n;
let W=location.hash=='#talk'?'talk':'game',C='Hamısı';const $=id=>document.getElementById(id);
function boot(render){document.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>{W=b.dataset.w;C='Hamısı';history.replaceState(0,'','#'+W);go()});
function go(){document.body.className=W;document.querySelectorAll('[data-w]').forEach(b=>b.classList.toggle('on',b.dataset.w==W));render(D[W]);chips();if(window.after)after(D[W])}
window.chips=function(){const d=D[W];$('chips').innerHTML=d.cats.map(c=>`<button class="chip${c==C?' on':''}" data-c="${c}">${i3(CI[c],24)}${c}<small>${c=='Hamısı'?d.s.length:d.s.filter(x=>x[3]==c).length}</small></button>`).join('');
$('chips').querySelectorAll('.chip').forEach(b=>b.onclick=()=>{C=b.dataset.c;chips()});const Q=(window.SQ||'').trim().toLocaleLowerCase('az');const L=d.s.filter(x=>(C=='Hamısı'||x[3]==C)&&(!Q||(x[1]+' '+x[2]+' '+x[3]).toLocaleLowerCase('az').includes(Q)));$('cnt').textContent=L.length+' canlı yayın';
$('grid').innerHTML=L.length?L.map(card).join(''):(Q?'<div class="empty">"'+Q.replace(/[<>&"]/g,'')+'" üzrə yayın tapılmadı</div>':'<div class="empty">Bu kateqoriyada hazırda canlı yayın yoxdur</div>')};go()}
