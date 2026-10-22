const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
const D={home:['হোম','Home'],acc:['আয়-ব্যয়','Income/Expense'],tx:['লেনদেন','Transactions'],sales:['বিক্রি','Sales'],due:['বাকি','Due'],stock:['স্টক','Stock'],
income:['আয়','Income'],expense:['ব্যয়','Expense'],profit:['লাভ/ব্যালেন্স','Balance'],amount:['টাকা','Amount'],note:['বিবরণ','Note'],date:['তারিখ','Date'],
save:['সেভ','Save'],customer:['কাস্টমার','Customer'],phone:['মোবাইল','Phone'],paid:['জমা','Paid'],dueamt:['বাকি','Due'],total:['মোট','Total'],service:['সেবা','Service'],
item:['পণ্য','Item'],qty:['পরিমাণ','Qty'],price:['দাম','Price'],addrow:['+ পণ্য যোগ','+ Add item'],report:['📄 রিপোর্ট','📄 Report'],receipt:['রশিদ','Receipt'],
download:['PNG ডাউনলোড','Download PNG'],share:['শেয়ার','Share'],close:['বন্ধ','Close'],collect:['বাকি আদায়','Collect due'],name:['নাম','Name'],buy:['ক্রয় দাম','Buy'],
sell:['বিক্রয় দাম','Sell'],value:['স্টক মূল্য','Stock value'],from:['থেকে','From'],to:['পর্যন্ত','To'],nodata:['কোনো তথ্য নেই','No data'],low:['কম স্টক','Low stock'],
type:['ধরন','Type'],sure:['মুছে ফেলবেন?','Delete?'],stmt:['হিসাব','Statement'],items:['পণ্যসমূহ','Items'],addr:['গামারুয়া দক্ষিণপাড়া, তাকওয়া মসজিদ সংলগ্ন, আরই মাদ্রাসার পূর্ব দিকে','Gamarua Dakshinpara, beside Takwa Mosque, east of RE Madrasa'],
tt:['মোট লেনদেন','Total'],collected:['আদায়','Collected'],edit:['পরিমাণ বদল','Change qty'],paidhint:['খালি = সম্পূর্ণ জমা','Empty = fully paid'],thanks:['ধন্যবাদ','Thank you'],pick:['-- বাছাই করুন --','-- Select --']};
let lang=localStorage.lang||'bn',cur='home',F={from:'',to:''};
const t=k=>D[k]?D[k][lang=='bn'?0:1]:k;
const S={acc:[],tx:[],sales:[],col:[],prod:[]},C=Object.keys(S);
const M=n=>'৳'+(Math.round((+n||0)*100)/100).toLocaleString('en-IN');
const today=()=>new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,10);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const sum=(a,k)=>a.reduce((s,x)=>s+(+x[k]||0),0);
const inR=r=>(!F.from||r.date>=F.from)&&(!F.to||r.date<=F.to);
const flt=c=>S[c].filter(inR).sort((a,b)=>(b.date||'').localeCompare(a.date||'')||b.ts-a.ts);
const cfg=window.FIREBASE_CONFIG,cloud=!!(cfg&&cfg.apiKey&&cfg.projectId);let fdb;
const save=c=>localStorage['d_'+c]=JSON.stringify(S[c]);
const add=(c,o)=>{o.ts=Date.now();if(cloud)fdb.collection(c).add(o);else{o.id=o.ts+Math.random().toString(36).slice(2,6);S[c].push(o);save(c);render()}};
const del=(c,id)=>{if(cloud)fdb.collection(c).doc(id).delete();else{S[c]=S[c].filter(x=>x.id!=id);save(c);render()}};
const upd=(c,id,o)=>{if(cloud)fdb.collection(c).doc(id).update(o);else{Object.assign(S[c].find(x=>x.id==id),o);save(c);render()}};
const key=(n,p)=>(n||'').trim().toLowerCase()+'|'+(p||'').trim();
function dueList(){const m={},g=(n,p)=>m[key(n,p)]??={k:key(n,p),name:(n||'').trim(),phone:p||'',bal:0,rows:[]};
 const a=(n,p,date,label,tot,paid)=>{if(!(n||'').trim())return;const e=g(n,p);e.rows.push([date,label,M(tot),M(paid),M(tot-paid)]);e.bal+=tot-paid};
 S.tx.forEach(x=>a(x.customer,x.phone,x.date,x.service+(x.note?' - '+x.note:''),x.amount,x.paid));
 S.sales.forEach(x=>a(x.customer,x.phone,x.date,x.items.map(i=>i.name).join(', '),x.total,x.paid));
 S.col.forEach(x=>{const e=g(x.customer,x.phone);e.rows.push([x.date,t('collected'),M(0),M(x.amount),M(-x.amount)]);e.bal-=x.amount});
 return Object.values(m).sort((a,b)=>b.bal-a.bal)}
const fld=(n,l,ty='text',x='')=>`<div><label>${t(l)}</label><input name="${n}" type="${ty}" ${x}></div>`;
const dt=()=>fld('date','date','date',`value="${today()}" required`);
const am=(n='amount',l='amount')=>fld(n,l,'number','step="any" min="0" required');
const SV=['bKash','Nagad','Rocket','Upay','MB','Minute','Recharge','Other'];
const sel=(n,l,o)=>`<div><label>${t(l)}</label><select name="${n}">${o}</select></div>`;
const tbl=(h,r)=>r.length?`<div class="tw"><table><thead><tr>${h.map((x,i)=>`<th class="${i>=h.nr?'n':''}">${x}</th>`).join('')}</tr></thead><tbody>${r.join('')}</tbody></table></div>`:`<p>${t('nodata')}</p>`;
const bt=(a,c,id,l,cl='')=>`<button class="${cl}" data-a="${a}" data-c="${c}" data-id="${id}">${l}</button>`;
const fbar=()=>`<div class="bar"><label>${t('from')}<br><input type="date" id="ff" value="${F.from}"></label><label>${t('to')}<br><input type="date" id="ft" value="${F.to}"></label><button data-a="rep" data-c="${cur}">${t('report')}</button></div>`;
const card=(l,v)=>`<div class="card"><small>${l}</small><b>${v}</b></div>`;
const V={
home(){const a=flt('acc'),i=sum(a.filter(x=>x.type=='in'),'amount'),e=sum(a.filter(x=>x.type=='out'),'amount');
 return fbar().replace(/<button.*<\/button>/,'')+`<div class="cards">${card(t('income'),M(i))}${card(t('expense'),M(e))}${card(t('profit'),M(i-e))}${card(t('due'),M(sum(dueList().filter(x=>x.bal>0),'bal')))}${card(t('low'),S.prod.filter(p=>p.qty<=3).length)}</div>`},
acc(){const a=flt('acc'),i=sum(a.filter(x=>x.type=='in'),'amount'),e=sum(a.filter(x=>x.type=='out'),'amount');
 return `<form class="f" data-f="acc">${sel('type','type',`<option value="in">${t('income')}</option><option value="out">${t('expense')}</option>`)}${am()}${fld('note','note')}${dt()}<div><label>&nbsp;</label><button class="pri">${t('save')}</button></div></form>`+fbar()+`<div class="cards">${card(t('income'),M(i))}${card(t('expense'),M(e))}${card(t('profit'),M(i-e))}</div>`+
 tbl(Object.assign([t('date'),t('type'),t('note'),t('amount'),''],{nr:3}),a.map(x=>`<tr><td>${x.date}</td><td class="${x.type=='in'?'ok':'dg'}">${t(x.type=='in'?'income':'expense')}</td><td>${esc(x.note)}</td><td class="n">${M(x.amount)}</td><td>${bt('del','acc',x.id,'🗑','x')}</td></tr>`))},
tx(){const a=flt('tx');
 return `<form class="f" data-f="tx">${sel('service','service',SV.map(s=>`<option>${s}</option>`).join(''))}${fld('customer','customer')}${fld('phone','phone','tel')}${am()}${fld('paid','paid','number','step="any" min="0" placeholder="'+t('paidhint')+'"')}${fld('note','note')}${dt()}<div><label>&nbsp;</label><button class="pri">${t('save')}</button></div></form>`+fbar()+
 `<div class="cards">${card(t('tt'),M(sum(a,'amount')))}${card(t('paid'),M(sum(a,'paid')))}${card(t('dueamt'),M(sum(a,'amount')-sum(a,'paid')))}</div>`+
 tbl(Object.assign([t('date'),t('service'),t('customer'),t('amount'),t('paid'),t('dueamt'),''],{nr:3}),a.map(x=>`<tr><td>${x.date}</td><td>${x.service}</td><td>${esc(x.customer)}</td><td class="n">${M(x.amount)}</td><td class="n">${M(x.paid)}</td><td class="n ${x.amount>x.paid?'dg':''}">${M(x.amount-x.paid)}</td><td>${bt('rcpt','tx',x.id,'🧾')} ${bt('del','tx',x.id,'🗑','x')}</td></tr>`))},
sales(){const a=flt('sales'),row=`<div class="ir"><input name="iname" list="pl" placeholder="${t('item')}" required><input name="iqty" type="number" min="0" step="any" value="1" placeholder="${t('qty')}"><input name="iprice" type="number" min="0" step="any" placeholder="${t('price')}" required></div>`;
 return `<form class="f" data-f="sales">${fld('customer','customer')}${fld('phone','phone','tel')}${dt()}<div class="full" id="rows">${row}</div><datalist id="pl">${S.prod.map(p=>`<option>${esc(p.name)}</option>`).join('')}</datalist><div class="full"><button type="button" data-a="addrow">${t('addrow')}</button></div>${fld('paid','paid','number','step="any" min="0" placeholder="'+t('paidhint')+'"')}<div><label>&nbsp;</label><button class="pri">${t('save')}</button></div></form>`+`<template id="rt">${row}</template>`+fbar()+
 `<div class="cards">${card(t('total'),M(sum(a,'total')))}${card(t('paid'),M(sum(a,'paid')))}${card(t('dueamt'),M(sum(a,'total')-sum(a,'paid')))}</div>`+
 tbl(Object.assign([t('date'),t('customer'),t('items'),t('total'),t('paid'),t('dueamt'),''],{nr:3}),a.map(x=>`<tr><td>${x.date}</td><td>${esc(x.customer)}</td><td>${esc(x.items.map(i=>i.name+'×'+i.qty).join(', '))}</td><td class="n">${M(x.total)}</td><td class="n">${M(x.paid)}</td><td class="n ${x.total>x.paid?'dg':''}">${M(x.total-x.paid)}</td><td>${bt('rcpt','sales',x.id,'🧾')} ${bt('del','sales',x.id,'🗑','x')}</td></tr>`))},
due(){const d=dueList(),o=d.filter(x=>x.bal>0);
 return `<form class="f" data-f="col">${sel('k','customer',`<option value="">${t('pick')}</option>`+o.map(x=>`<option value="${esc(x.k)}">${esc(x.name)} ${esc(x.phone)} (${M(x.bal)})</option>`).join(''))}${am()}${dt()}<div><label>&nbsp;</label><button class="pri">${t('collect')}</button></div></form>`+
 `<div class="bar"><button data-a="rep" data-c="due">${t('report')}</button></div><div class="cards">${card(t('dueamt'),M(sum(o,'bal')))}</div>`+
 tbl(Object.assign([t('customer'),t('phone'),t('dueamt'),''],{nr:2}),o.map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.phone)}</td><td class="n dg">${M(x.bal)}</td><td>${bt('stmt','',x.k,'🧾 '+t('stmt'))}</td></tr>`))},
stock(){const a=[...S.prod].sort((x,y)=>x.name.localeCompare(y.name));
 return `<form class="f" data-f="prod">${fld('name','name','text','required')}${fld('qty','qty','number','step="any" required')}${fld('buy','buy','number','step="any"')}${fld('sell','sell','number','step="any"')}<div><label>&nbsp;</label><button class="pri">${t('save')}</button></div></form>`+
 `<div class="bar"><button data-a="rep" data-c="stock">${t('report')}</button></div><div class="cards">${card(t('value'),M(a.reduce((s,p)=>s+p.qty*(p.buy||0),0)))}${card(t('low'),a.filter(p=>p.qty<=3).length)}</div>`+
 tbl(Object.assign([t('name'),t('qty'),t('buy'),t('sell'),''],{nr:1}),a.map(p=>`<tr class="${p.qty<=3?'lo':''}"><td>${esc(p.name)}</td><td class="n">${p.qty}</td><td class="n">${M(p.buy)}</td><td class="n">${M(p.sell)}</td><td>${bt('qty','prod',p.id,'✏️ '+t('edit'))} ${bt('del','prod',p.id,'🗑','x')}</td></tr>`))}};
function render(){$('#lb').textContent=lang=='bn'?'EN':'বাংলা';$('#ad').textContent=t('addr');document.documentElement.lang=lang;
 $('#nav').innerHTML=['home','acc','tx','sales','due','stock'].map((k,i)=>`<button data-a="tab" data-id="${k}" class="${k==cur?'on':''}">${i?i+'. ':''}${t(k)}</button>`).join('');
 const y=scrollY;$('#app').innerHTML=V[cur]();scrollTo(0,y)}
async function showReport(r){const el=document.createElement('div');el.className='a4';
 el.innerHTML=`<div class="rh"><img src="${LOGO}"><div><h1>মাহমুদ টেলিকম / Mahmud Telecom</h1><p>📞 01846-655270</p><p>📍 ${t('addr')}</p></div></div><h2>${r.title}</h2>${r.cust?`<p>${t('customer')}: <b>${esc(r.cust)}</b></p>`:''}<p>${t('date')}: ${today()}${(F.from||F.to)&&r.rng?` (${F.from||'…'} → ${F.to||'…'})`:''}</p><table><thead><tr>${r.head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${r.rows.map(x=>`<tr>${x.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table><div class="rf">${r.foot.map(f=>`<div><span>${f[0]}</span><b>${f[1]}</b></div>`).join('')}</div><p class="rt">${t('thanks')} — Mahmud Telecom</p>`;
 document.body.appendChild(el);
 if(!window.html2canvas){el.remove();return alert('Internet required for PNG / PNG এর জন্য ইন্টারনেট লাগবে')}
 const cv=await html2canvas(el,{scale:2,backgroundColor:'#fff',onclone:(d,e)=>{e.style.left='0'}});el.remove();
 const blob=await new Promise(r=>cv.toBlob(r,'image/png')),url=URL.createObjectURL(blob),fn='mahmud-telecom-'+today()+'.png';
 const m=$('#modal');m.hidden=false;m.innerHTML=`<div class="mb"><img class="pv" src="${url}"><div class="btns"><button class="pri" id="dl">${t('download')}</button><button id="sh">${t('share')}</button><button id="cl">${t('close')}</button></div></div>`;
 const dl=()=>{const a=document.createElement('a');a.href=url;a.download=fn;a.click()};
 $('#dl').onclick=dl;$('#cl').onclick=()=>m.hidden=true;
 $('#sh').onclick=()=>{const f=new File([blob],fn,{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],title:r.title}).catch(()=>{});else{dl();open('https://wa.me/?text='+encodeURIComponent(r.title+' - Mahmud Telecom'))}}}
function rep(c){const R=x=>x.length;let o;
 if(c=='acc'){const a=flt('acc').reverse(),i=sum(a.filter(x=>x.type=='in'),'amount'),e=sum(a.filter(x=>x.type=='out'),'amount');
  o={title:t('acc'),rng:1,head:[t('date'),t('type'),t('note'),t('amount')],rows:a.map(x=>[x.date,t(x.type=='in'?'income':'expense'),x.note,M(x.amount)]),foot:[[t('income'),M(i)],[t('expense'),M(e)],[t('profit'),M(i-e)]]}}
 else if(c=='tx'){const a=flt('tx').reverse();o={title:t('tx'),rng:1,head:[t('date'),t('service'),t('customer'),t('amount'),t('paid'),t('dueamt')],rows:a.map(x=>[x.date,x.service,x.customer,M(x.amount),M(x.paid),M(x.amount-x.paid)]),foot:[[t('tt'),M(sum(a,'amount'))],[t('paid'),M(sum(a,'paid'))],[t('dueamt'),M(sum(a,'amount')-sum(a,'paid'))]]}}
 else if(c=='sales'){const a=flt('sales').reverse();o={title:t('sales'),rng:1,head:[t('date'),t('customer'),t('items'),t('total'),t('paid'),t('dueamt')],rows:a.map(x=>[x.date,x.customer,x.items.map(i=>i.name+'×'+i.qty).join(', '),M(x.total),M(x.paid),M(x.total-x.paid)]),foot:[[t('total'),M(sum(a,'total'))],[t('paid'),M(sum(a,'paid'))],[t('dueamt'),M(sum(a,'total')-sum(a,'paid'))]]}}
 else if(c=='due'){const d=dueList().filter(x=>x.bal>0);o={title:t('due'),head:[t('customer'),t('phone'),t('dueamt')],rows:d.map(x=>[x.name,x.phone,M(x.bal)]),foot:[[t('dueamt'),M(sum(d,'bal'))]]}}
 else if(c=='stock'){const a=S.prod;o={title:t('stock'),head:[t('name'),t('qty'),t('buy'),t('sell')],rows:a.map(p=>[p.name,p.qty,M(p.buy),M(p.sell)]),foot:[[t('value'),M(a.reduce((s,p)=>s+p.qty*(p.buy||0),0))]]}}
 if(o)showReport(o)}
function rcpt(c,id){const x=S[c].find(y=>y.id==id);if(!x)return;
 if(c=='tx')showReport({title:t('receipt'),cust:x.customer+(x.phone?' ('+x.phone+')':''),head:[t('date'),t('service'),t('note'),t('amount')],rows:[[x.date,x.service,x.note,M(x.amount)]],foot:[[t('amount'),M(x.amount)],[t('paid'),M(x.paid)],[t('dueamt'),M(x.amount-x.paid)]]});
 else showReport({title:t('receipt'),cust:x.customer+(x.phone?' ('+x.phone+')':''),head:[t('item'),t('qty'),t('price'),t('total')],rows:x.items.map(i=>[i.name,i.qty,M(i.price),M(i.qty*i.price)]),foot:[[t('total'),M(x.total)],[t('paid'),M(x.paid)],[t('dueamt'),M(x.total-x.paid)]]})}
const H={
acc:o=>add('acc',{type:o.type,amount:+o.amount,note:o.note,date:o.date}),
tx:o=>add('tx',{service:o.service,customer:o.customer,phone:o.phone,amount:+o.amount,paid:o.paid===''?+o.amount:+o.paid,note:o.note,date:o.date}),
sales(o,f){const fd=new FormData(f),n=fd.getAll('iname'),q=fd.getAll('iqty'),p=fd.getAll('iprice');
 const items=n.map((x,i)=>({name:x.trim(),qty:+q[i],price:+p[i]})).filter(i=>i.name&&i.qty>0);if(!items.length)return;
 const total=items.reduce((s,i)=>s+i.qty*i.price,0);
 items.forEach(i=>{const pr=S.prod.find(x=>x.name.toLowerCase()==i.name.toLowerCase());if(pr)upd('prod',pr.id,{qty:pr.qty-i.qty})});
 add('sales',{customer:o.customer,phone:o.phone,date:o.date,items,total,paid:o.paid===''?total:+o.paid})},
col(o){const e=dueList().find(x=>x.k==o.k);if(e)add('col',{customer:e.name,phone:e.phone,amount:+o.amount,date:o.date})},
prod(o){const n=o.name.trim(),p=S.prod.find(x=>x.name.toLowerCase()==n.toLowerCase());
 if(p)upd('prod',p.id,{qty:p.qty+ +o.qty,buy:+o.buy||p.buy||0,sell:+o.sell||p.sell||0});else add('prod',{name:n,qty:+o.qty,buy:+o.buy||0,sell:+o.sell||0})},
login(o){firebase.auth().signInWithEmailAndPassword(o.email,o.pass).catch(e=>alert(e.message))}};
document.addEventListener('submit',e=>{e.preventDefault();const f=e.target;H[f.dataset.f](Object.fromEntries(new FormData(f)),f);if(f.dataset.f!='login')f.reset()});
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,c=b.dataset.c,id=b.dataset.id;
 if(a=='tab'){cur=id;render()}
 else if(a=='lang'){lang=lang=='bn'?'en':'bn';localStorage.lang=lang;render()}
 else if(a=='logout')firebase.auth().signOut();
 else if(a=='addrow')$('#rows').insertAdjacentHTML('beforeend',$('#rt').innerHTML);
 else if(a=='del'){if(!confirm(t('sure')))return;if(c=='sales'){const s=S.sales.find(x=>x.id==id);s&&s.items.forEach(i=>{const p=S.prod.find(x=>x.name.toLowerCase()==i.name.toLowerCase());if(p)upd('prod',p.id,{qty:p.qty+i.qty})})}del(c,id)}
 else if(a=='rep')rep(c);
 else if(a=='rcpt')rcpt(c,id);
 else if(a=='stmt'){const x=dueList().find(y=>y.k==id);if(x)showReport({title:t('stmt'),cust:x.name+(x.phone?' ('+x.phone+')':''),head:[t('date'),t('note'),t('total'),t('paid'),t('dueamt')],rows:x.rows.sort((p,q)=>p[0].localeCompare(q[0])),foot:[[t('dueamt'),M(x.bal)]]})}
 else if(a=='qty'){const p=S.prod.find(x=>x.id==id),v=prompt(t('qty'),p.qty);if(v!==null&&v!==''&&!isNaN(v))upd('prod',id,{qty:+v})}});
document.addEventListener('change',e=>{if(e.target.id=='ff'){F.from=e.target.value;render()}if(e.target.id=='ft'){F.to=e.target.value;render()}});
document.addEventListener('input',e=>{if(e.target.name=='iname'){const p=S.prod.find(x=>x.name.toLowerCase()==e.target.value.trim().toLowerCase());if(p&&p.sell)e.target.parentElement.querySelector('[name=iprice]').value=p.sell}});
$('#lg0').src=$('#lg1').src=LOGO;
if(cloud){firebase.initializeApp(cfg);fdb=firebase.firestore();let un=[];
 firebase.auth().onAuthStateChanged(u=>{un.forEach(f=>f());un=[];$('#login').hidden=!!u;$('#lo').hidden=!u;
  if(u)un=C.map(c=>fdb.collection(c).onSnapshot(s=>{S[c]=s.docs.map(d=>({...d.data(),id:d.id}));render()}))})}
else C.forEach(c=>S[c]=JSON.parse(localStorage['d_'+c]||'[]'));
render();
