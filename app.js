(()=>{
const D=window.KMC, $=s=>document.querySelector(s), app=$('#app');
const COL={'Physics':'#7c6cff','Chemistry':'#22c55e','Mathematics':'#f59e0b','Computer Science':'#38bdf8','English':'#f472b6','Nepali':'#ef4444','Social Studies':'#a3a3a3','Mixed':'#8a8f98'};
const SUBJ=['Physics','Chemistry','Mathematics','Computer Science','English','Nepali','Social Studies','Mixed'];
const items=D.items, byId=Object.fromEntries(items.map(i=>[i.id,i])), terms=D.terms.filter(t=>items.some(i=>i.term===t.id));
const tName=id=>(D.terms.find(t=>t.id===id)||{}).name||'';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const totalPages=items.reduce((a,i)=>a+i.pages.length,0);
const subjects=SUBJ.filter(s=>s!=='Mixed'&&items.some(i=>i.subject===s));
const state={term:'all',subj:'all',q:''};
const img=(id,n)=>`p/${id}/${String(n).padStart(3,'0')}.webp`;
const thumb=id=>`t/${id}.webp`;
const ARROW='<svg viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9"/></svg>';

function card(i){return `<a class="card fade" href="#/p/${i.id}"><div class="thumb"><img loading="lazy" src="${thumb(i.id)}" alt="${esc(i.title)}"><span class="pg">${i.pages.length} ${i.pages.length>1?'pages':'page'}</span></div><div class="card-b"><span class="tag"><i style="background:${COL[i.subject]}"></i>${esc(i.subject)}${i.year?' · '+i.year:''}</span><h4>${esc(i.title)}</h4>${i.note?`<div class="nt">${esc(i.note)}</div>`:''}</div></a>`}

function filtered(){const q=state.q.trim().toLowerCase().split(/\s+/).filter(Boolean);return items.filter(i=>(state.term==='all'||i.term===state.term)&&(state.subj==='all'||i.subject===state.subj)&&q.every(w=>(i.title+' '+i.subject+' '+i.note+' '+i.year+' '+tName(i.term)).toLowerCase().includes(w)))}

function libHTML(){const f=filtered();
 return `<div class="tabs" id="tabs"><button class="tab ${state.term==='all'?'on':''}" data-t="all">All papers</button>${terms.map(t=>`<button class="tab ${state.term===t.id?'on':''}" data-t="${t.id}">${esc(t.name)}</button>`).join('')}</div>
 <div class="subj" id="subj"><button class="chip ${state.subj==='all'?'on':''}" data-s="all">All subjects</button>${SUBJ.filter(s=>items.some(i=>i.subject===s)).map(s=>`<button class="chip ${state.subj===s?'on':''}" data-s="${s}"><i style="background:${COL[s]}"></i>${s}<small>${items.filter(i=>i.subject===s&&(state.term==='all'||i.term===state.term)).length}</small></button>`).join('')}</div>
 ${f.length?`<div class="grid">${f.map(card).join('')}</div>`:`<div class="empty">Nothing matches that. Try another subject or clear the search.</div>`}`}

function bindLib(){const L=$('#lib');if(!L)return;
 L.onclick=e=>{const t=e.target.closest('[data-t]'),s=e.target.closest('[data-s]');if(t){state.term=t.dataset.t}else if(s){state.subj=s.dataset.s}else return;L.innerHTML=libHTML()}}

function stack(ids){return `<div class="stack">${ids.slice(0,3).map(id=>`<img loading="lazy" src="${thumb(id)}" alt="">`).join('')}</div>`}

function home(){
 const sizes=['big','','','wide','',''];
 const bento=terms.map((t,k)=>{const its=items.filter(i=>i.term===t.id);const pg=its.reduce((a,i)=>a+i.pages.length,0);
  return `<a class="tile mask ${sizes[k]||''}" href="#/t/${t.id}"><span class="arrow">${ARROW}</span><div><h3>${esc(t.name)}</h3><p>${esc(t.desc)}</p></div><span class="cnt">${its.length} papers · ${pg} pages</span>${stack(its.map(i=>i.id))}</a>`}).join('');
 app.innerHTML=`<section class="hero fade"><span class="pill"><b>New</b> First Term 2082 papers are up</span>
 <h1>Every KMC Class XI paper. One clean place.</h1>
 <p class="lede">Real question papers from KMC (Kathmandu Model Secondary School), Class XI Science. First term, past years, pre-term sets and weekly tests, sorted by term and subject.</p>
 <div class="cta"><a class="btn pri" href="#/t/first-term-2082">Open First Term 2082</a><a class="btn" href="#lib" id="browse">Browse everything</a></div>
 <div class="stats"><div class="stat"><b>${items.length}</b><span>Papers</span></div><div class="stat"><b>${totalPages}</b><span>Pages</span></div><div class="stat"><b>${subjects.length}</b><span>Subjects</span></div><div class="stat"><b>${terms.length}</b><span>Collections</span></div></div></section>
 <section class="sec"><div class="sec-h"><div><div class="eyebrow">Collections</div><h2>Pick a term</h2></div></div><div class="bento">${bento}</div></section>
 <section class="sec"><div class="sec-h"><div><div class="eyebrow">By subject</div><h2>Jump straight to a subject</h2></div></div><div class="subj">${subjects.map(s=>`<a class="chip" href="#/s/${encodeURIComponent(s)}"><i style="background:${COL[s]}"></i>${s}<small>${items.filter(i=>i.subject===s).length}</small></a>`).join('')}</div></section>
 <section class="sec" id="libsec"><div class="sec-h"><div><div class="eyebrow">Library</div><h2>All papers</h2></div></div><div id="lib">${libHTML()}</div></section>`;
 bindLib();
 $('#browse').onclick=e=>{e.preventDefault();$('#libsec').scrollIntoView({behavior:'smooth'})};
}

function listPage(title,eyebrow,desc,list,crumb){
 app.innerHTML=`<div class="crumb fade"><a href="#/">Home</a><span>/</span><span>${esc(crumb)}</span></div>
 <div class="ph fade"><div><div class="eyebrow">${esc(eyebrow)}</div><h1>${esc(title)}</h1><div class="meta"><span>${esc(desc)}</span></div></div><div class="meta"><span>${list.length} papers</span><span>${list.reduce((a,i)=>a+i.pages.length,0)} pages</span></div></div>
 <div class="grid">${list.map(card).join('')}</div>`}

function termPage(id){const t=D.terms.find(x=>x.id===id);if(!t)return home();
 const list=items.filter(i=>i.term===id).sort((a,b)=>SUBJ.indexOf(a.subject)-SUBJ.indexOf(b.subject));
 listPage(t.name,'Collection',t.desc,list,t.name)}
function subjPage(s){const list=items.filter(i=>i.subject===s).sort((a,b)=>terms.findIndex(t=>t.id===a.term)-terms.findIndex(t=>t.id===b.term));
 listPage(s,'Subject',`Every ${s} paper across all terms.`,list,s)}

let cur=null;
function paper(id){const i=byId[id];if(!i)return home();cur=i;
 const sib=items.filter(x=>x.id!==id&&(x.subject===i.subject||x.term===i.term)).slice(0,8);
 app.innerHTML=`<div class="crumb fade"><a href="#/">Home</a><span>/</span><a href="#/t/${i.term}">${esc(tName(i.term))}</a><span>/</span><span>${esc(i.subject)}</span></div>
 <div class="ph fade"><div><span class="tag"><i style="background:${COL[i.subject]}"></i>${esc(i.subject)}${i.year?' · '+i.year:''}</span><h1>${esc(i.title)}</h1><div class="meta"><span>${i.pages.length} ${i.pages.length>1?'pages':'page'}</span>${i.note?`<span>${esc(i.note)}</span>`:''}</div></div>
 <div class="acts"><a class="btn pri" href="dl/${i.id}.pdf" download><svg viewBox="0 0 24 24"><path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/></svg>Download PDF <span class="muted" style="font-weight:500">${i.pdfKB>1024?(i.pdfKB/1024).toFixed(1)+' MB':i.pdfKB+' KB'}</span></a><button class="btn" id="share"><svg viewBox="0 0 24 24"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>Copy link</button></div></div>
 <div class="viewer"><nav class="rail" id="rail">${i.pages.map((p,k)=>`<a href="#pg${k+1}" data-k="${k}"><img loading="lazy" src="${img(i.id,k+1)}" width="${p[0]}" height="${p[1]}" alt=""><span>${k+1}</span></a>`).join('')}</nav>
 <div class="pages">${i.pages.map((p,k)=>`<figure class="page" id="pg${k+1}" data-k="${k}"><img loading="${k<2?'eager':'lazy'}" src="${img(i.id,k+1)}" width="${p[0]}" height="${p[1]}" alt="${esc(i.title)} page ${k+1}"><span class="n">${k+1} / ${i.pages.length}</span></figure>`).join('')}</div></div>
 ${sib.length?`<section class="more"><div class="sec-h"><div><div class="eyebrow">Keep going</div><h2>Related papers</h2></div></div><div class="grid">${sib.map(card).join('')}</div></section>`:''}`;
 $('#share').onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText(location.href);toast('Link copied')};
 document.querySelectorAll('.page').forEach(el=>el.onclick=()=>openLB(+el.dataset.k));
 $('#rail').onclick=e=>{const a=e.target.closest('a');if(!a)return;e.preventDefault();document.getElementById('pg'+(+a.dataset.k+1)).scrollIntoView({behavior:'smooth'})};
 const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){const k=en.target.dataset.k;document.querySelectorAll('#rail a').forEach(a=>a.classList.toggle('on',a.dataset.k===k))}}),{rootMargin:'-45% 0px -45% 0px'});
 document.querySelectorAll('.page').forEach(el=>io.observe(el));
}

let lk=0;const lb=$('#lb'),lbi=$('#lbi'),lbs=$('#lbs');
function openLB(k){lk=k;lb.hidden=false;document.body.style.overflow='hidden';showLB()}
function showLB(){lbs.classList.remove('z');lbi.src=img(cur.id,lk+1);$('#lbc').textContent=`${cur.title} · ${lk+1}/${cur.pages.length}`;$('#lbo').href=img(cur.id,lk+1);$('#lbp').style.visibility=lk>0?'visible':'hidden';$('#lbn').style.visibility=lk<cur.pages.length-1?'visible':'hidden'}
function closeLB(){lb.hidden=true;document.body.style.overflow=''}
function step(d){const n=lk+d;if(n<0||n>=cur.pages.length)return;lk=n;showLB()}
$('#lbx').onclick=closeLB;$('#lbp').onclick=()=>step(-1);$('#lbn').onclick=()=>step(1);
lbi.onclick=e=>{e.stopPropagation();const r=lbi.getBoundingClientRect(),fx=(e.clientX-r.left)/r.width,fy=(e.clientY-r.top)/r.height;lbs.classList.toggle('z');if(lbs.classList.contains('z')){requestAnimationFrame(()=>{lbs.scrollLeft=fx*lbs.scrollWidth-lbs.clientWidth/2;lbs.scrollTop=fy*lbs.scrollHeight-lbs.clientHeight/2})}};
lbs.onclick=e=>{if(e.target===lbs)closeLB()};
let tx=null;lb.addEventListener('touchstart',e=>{tx=e.touches.length===1?e.touches[0].clientX:null},{passive:true});lb.addEventListener('touchend',e=>{if(tx===null||lbs.classList.contains('z'))return;const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>60)step(dx<0?1:-1);tx=null});

function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),1600)}

const q=$('#q');
q.oninput=()=>{state.q=q.value;if(!$('#lib')){location.hash='#/';return}$('#lib').innerHTML=libHTML();if(state.q)$('#libsec').scrollIntoView({block:'start'})};
document.addEventListener('keydown',e=>{if(!lb.hidden){if(e.key==='Escape')closeLB();if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1);return}
 if(e.key==='/'&&document.activeElement!==q){e.preventDefault();q.focus()}if(e.key==='Escape'&&document.activeElement===q){q.value='';q.oninput();q.blur()}});

const th=localStorage.getItem('kmc-theme');if(th)document.documentElement.dataset.theme=th;
$('#theme').onclick=()=>{const n=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=n;localStorage.setItem('kmc-theme',n)};

function route(){closeLB();const h=location.hash.slice(1);
 if(h.startsWith('/p/'))paper(h.slice(3));else if(h.startsWith('/t/'))termPage(h.slice(3));else if(h.startsWith('/s/'))subjPage(decodeURIComponent(h.slice(3)));else if(h==='lib'){}else{home();if(state.q)$('#libsec').scrollIntoView()}
 if(!h.startsWith('pg')&&h!=='lib')window.scrollTo(0,0)}
window.addEventListener('hashchange',()=>{const h=location.hash;if(h.startsWith('#pg'))return;route()});
route();
})();
