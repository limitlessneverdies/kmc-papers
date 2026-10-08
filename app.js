(()=>{
const D=window.KMC,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],app=$('#app');
const ORDER=['Physics','Chemistry','Mathematics','Computer Science','English','Nepali','Social Studies','Mixed'];
const items=D.items,byId=Object.fromEntries(items.map(i=>[i.id,i]));
const terms=D.terms.filter(t=>items.some(i=>i.term===t.id));
const subjects=ORDER.filter(s=>items.some(i=>i.subject===s));
const tOf=id=>D.terms.find(t=>t.id===id)||{name:''};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const img=(id,n)=>`p/${id}/${String(n).padStart(3,'0')}.webp`;
const np=i=>i.pages.length+(i.pages.length===1?' page':' pages');
const subjLabel=s=>s==='Mixed'?'Multiple subjects':s;
const sortSub=(a,b)=>ORDER.indexOf(a.subject)-ORDER.indexOf(b.subject);
const totalPages=items.reduce((a,i)=>a+i.pages.length,0);
let query='';

function card(i,showTerm){const tn=tOf(i.term).name;let t=i.title.replace(' \u00b7 '+tn,'');const bits=[];if(showTerm)bits.push(tn);else if(!t.startsWith(i.subject.split(' ')[0])&&i.subject!=='Mixed')bits.push(i.subject);if(i.year&&!t.includes(i.year)&&!tn.includes(i.year))bits.push(i.year);bits.push(np(i));
 return `<a class="c" href="#/p/${i.id}"><div class="c-img"><img loading="lazy" src="t/${i.id}.webp" alt=""></div><div class="c-t">${esc(t)}</div><div class="c-m">${esc(bits.join(' · '))}</div></a>`}
function match(i){const w=query.toLowerCase().split(/\s+/).filter(Boolean);const hay=(i.title+' '+i.subject+' '+(i.note||'')+' '+(i.year||'')+' '+tOf(i.term).name).toLowerCase();return w.every(x=>hay.includes(x))}

function side(active){const cnt=f=>items.filter(f).length;
 return `<aside class="side"><h6>Collections</h6><ul><li><a href="#/" class="${active==='all'?'on':''}">All papers<span>${items.length}</span></a></li>${terms.map(t=>`<li><a href="#/t/${t.id}" class="${active==='t:'+t.id?'on':''}">${esc(t.name)}<span>${cnt(i=>i.term===t.id)}</span></a></li>`).join('')}</ul>
 <h6>Subjects</h6><ul>${subjects.map(s=>`<li><a href="#/s/${encodeURIComponent(s)}" class="${active==='s:'+s?'on':''}">${esc(subjLabel(s))}<span>${cnt(i=>i.subject===s)}</span></a></li>`).join('')}</ul></aside>`}
function mob(active){return `<nav class="mob"><a href="#/" class="${active==='all'?'on':''}">All</a>${terms.map(t=>`<a href="#/t/${t.id}" class="${active==='t:'+t.id?'on':''}">${esc(t.name)}</a>`).join('')}${subjects.filter(s=>s!=='Mixed').map(s=>`<a href="#/s/${encodeURIComponent(s)}" class="${active==='s:'+s?'on':''}">${esc(s)}</a>`).join('')}</nav>`}

function groupHTML(title,desc,list,link,showTerm){if(!list.length)return '';
 return `<section class="group"><div class="gh"><div><h2>${esc(title)}</h2>${desc?`<p>${esc(desc)}</p>`:''}</div>${link?`<a class="all" href="${link}">View ${list.length} →</a>`:`<span class="c-m">${list.length} papers</span>`}</div><div class="cards">${list.map(i=>card(i,showTerm)).join('')}</div></section>`}

function browse(active){
 let body='';
 if(active==='all'){body=terms.map(t=>groupHTML(t.name,t.desc,items.filter(i=>i.term===t.id&&match(i)).sort(sortSub),'#/t/'+t.id,false)).join('')}
 else if(active.startsWith('t:')){const t=tOf(active.slice(2));const list=items.filter(i=>i.term===t.id&&match(i)).sort(sortSub);
  body=subjects.map(s=>groupHTML(subjLabel(s),'',list.filter(i=>i.subject===s),null,false)).join('')}
 else {const s=active.slice(2);const list=items.filter(i=>i.subject===s&&match(i));body=terms.map(t=>groupHTML(t.name,'',list.filter(i=>i.term===t.id),null,false)).join('')}
 if(!body)body=`<p class="none">No papers match “${esc(query)}”.</p>`;
 let head;
 if(active==='all')head=`<section class="intro"><div><h1>Class XI question papers</h1><p>Question papers from KMC (Kathmandu Model Secondary School), Class XI Science. First term, past years, pre-term sets and weekly tests, sorted by term and subject.</p></div><div class="facts"><div><b>${items.length}</b>papers</div><div><b>${totalPages}</b>pages</div><div><b>${subjects.filter(s=>s!=='Mixed').length}</b>subjects</div></div></section>`;
 else if(active.startsWith('t:')){const t=tOf(active.slice(2));head=`<div class="crumb"><a href="#/">All papers</a><span>/</span><span>Collection</span></div><section class="intro" style="padding-top:14px"><div><h1>${esc(t.name)}</h1><p>${esc(t.desc)}</p></div></section>`}
 else {const s=active.slice(2);head=`<div class="crumb"><a href="#/">All papers</a><span>/</span><span>Subject</span></div><section class="intro" style="padding-top:14px"><div><h1>${esc(subjLabel(s))}</h1><p>Every ${esc(s==='Mixed'?'multi-subject':s)} paper in the archive, grouped by collection.</p></div></section>`}
 app.innerHTML=head+mob(active)+`<div class="layout">${side(active)}<div id="res">${body}</div></div>`;
}

let cur=null;
function paper(id){const i=byId[id];if(!i){location.hash='#/';return}cur=i;
 const sib=items.filter(x=>x.term===i.term).sort(sortSub),k=sib.indexOf(i),prev=sib[k-1],next=sib[k+1];
 const rel=items.filter(x=>x.id!==i.id&&x.subject===i.subject&&i.subject!=='Mixed').slice(0,6);
 const kb=i.pdfKB>1024?(i.pdfKB/1024).toFixed(1)+' MB':i.pdfKB+' KB';
 app.innerHTML=`<div class="crumb"><a href="#/">All papers</a><span>/</span><a href="#/t/${i.term}">${esc(tOf(i.term).name)}</a><span>/</span><a href="#/s/${encodeURIComponent(i.subject)}">${esc(subjLabel(i.subject))}</a></div>
 <div class="ph"><div><h1>${esc(i.title)}</h1><div class="c-m">${esc([subjLabel(i.subject),i.year,np(i),i.note].filter(Boolean).join(' · '))}</div></div>
 <div class="acts"><a class="btn dark" href="dl/${i.id}.pdf" download="KMC ${esc(i.title).replace(/[·\/]/g,'-')}.pdf"><svg viewBox="0 0 24 24"><path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/></svg>Download PDF <small>${kb}</small></a><button class="btn" id="share">Copy link</button></div></div>
 <div class="reader"><nav class="rail">${i.pages.map((p,n)=>`<a href="#" data-n="${n}"><img loading="lazy" src="${img(i.id,n+1)}" width="${p[0]}" height="${p[1]}" alt="">${n+1}</a>`).join('')}</nav>
 <div><div class="pages">${i.pages.map((p,n)=>`<figure class="pg" id="pg${n+1}" data-n="${n}"><img loading="${n<2?'eager':'lazy'}" src="${img(i.id,n+1)}" width="${p[0]}" height="${p[1]}" alt="${esc(i.title)}, page ${n+1}"><figcaption><span>Page ${n+1} of ${i.pages.length}</span><button data-open="${n}">View full size</button></figcaption></figure>`).join('')}</div>
 <div class="next">${prev?`<a href="#/p/${prev.id}"><small>← Previous</small><b>${esc(prev.title)}</b></a>`:'<span></span>'}${next?`<a class="r" href="#/p/${next.id}"><small>Next →</small><b>${esc(next.title)}</b></a>`:''}</div></div></div>
 ${rel.length?`<div class="more">${groupHTML('More '+i.subject,'',rel,'#/s/'+encodeURIComponent(i.subject),true)}</div>`:''}`;
 $('#share').onclick=()=>{(navigator.clipboard?navigator.clipboard.writeText(location.href):Promise.reject()).then(()=>toast('Link copied'),()=>toast(location.href))};
 $$('.pg img').forEach(el=>el.onclick=()=>openLB(+el.parentNode.dataset.n));
 $$('[data-open]').forEach(b=>b.onclick=()=>openLB(+b.dataset.open));
 $$('.rail a').forEach(a=>a.onclick=e=>{e.preventDefault();$('#pg'+(+a.dataset.n+1)).scrollIntoView({behavior:'smooth'})});
 const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){const n=en.target.dataset.n;$$('.rail a').forEach(a=>a.classList.toggle('on',a.dataset.n===n))}}),{rootMargin:'-40% 0px -55% 0px'});
 $$('.pg').forEach(el=>io.observe(el));
}

/* lightbox */
const lb=$('#lb'),lbi=$('#lbi'),lbs=$('#lbs');let lk=0,rot=0;
function openLB(n){lk=n;lb.hidden=false;document.body.style.overflow='hidden';show()}
function show(){rot=0;lbi.style.transform='';lbs.classList.remove('z');lbi.src=img(cur.id,lk+1);$('#lbc').textContent=`${cur.title} · page ${lk+1} of ${cur.pages.length}`;$('#lbo').href=img(cur.id,lk+1);$('#lbp').style.visibility=lk>0?'visible':'hidden';$('#lbn').style.visibility=lk<cur.pages.length-1?'visible':'hidden'}
function closeLB(){lb.hidden=true;document.body.style.overflow=''}
function step(d){const n=lk+d;if(n>=0&&n<cur.pages.length){lk=n;show()}}
$('#lbx').onclick=closeLB;$('#lbp').onclick=()=>step(-1);$('#lbn').onclick=()=>step(1);
$('#lbr').onclick=()=>{rot=(rot+90)%360;lbs.classList.remove('z');lbi.style.transform=rot?`rotate(${rot}deg)`:'';const side=rot%180;lbi.style.maxWidth=side?'calc(100vh - 90px)':'';lbi.style.maxHeight=side?'calc(100vw - 140px)':''};
lbi.onclick=e=>{e.stopPropagation();if(rot)return;const r=lbi.getBoundingClientRect(),fx=(e.clientX-r.left)/r.width,fy=(e.clientY-r.top)/r.height;lbs.classList.toggle('z');if(lbs.classList.contains('z'))requestAnimationFrame(()=>{lbs.scrollLeft=fx*lbs.scrollWidth-lbs.clientWidth/2;lbs.scrollTop=fy*lbs.scrollHeight-lbs.clientHeight/2})};
lbs.onclick=e=>{if(e.target===lbs)closeLB()};
let tx=null;lb.addEventListener('touchstart',e=>{tx=e.touches.length===1?e.touches[0].clientX:null},{passive:true});
lb.addEventListener('touchend',e=>{if(tx===null||lbs.classList.contains('z'))return;const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>60)step(dx<0?1:-1);tx=null});

function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),1800)}

const q=$('#q');let lastBrowse='all';
q.addEventListener('input',()=>{query=q.value;const h=location.hash;if(h.startsWith('#/p/')){location.hash='#/';return}route(true)});
document.addEventListener('keydown',e=>{if(!lb.hidden){if(e.key==='Escape')closeLB();else if(e.key==='ArrowRight')step(1);else if(e.key==='ArrowLeft')step(-1);return}
 if(e.key==='/'&&document.activeElement!==q){e.preventDefault();q.focus()}else if(e.key==='Escape'&&document.activeElement===q){q.value='';query='';q.blur();route(true)}});
$('#theme').onclick=()=>{const dark=getComputedStyle(document.documentElement).colorScheme==='dark';const n=dark?'light':'dark';document.documentElement.dataset.theme=n;localStorage.setItem('kmc-theme',n)};

function route(keep){closeLB();const h=decodeURIComponent(location.hash.slice(1));
 if(h.startsWith('/p/'))paper(h.slice(3));
 else if(h.startsWith('/t/'))browse('t:'+h.slice(3));
 else if(h.startsWith('/s/'))browse('s:'+h.slice(3));
 else browse('all');
 if(!keep)window.scrollTo(0,0)}
window.addEventListener('hashchange',()=>route());
route();
})();
