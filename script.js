
const KEY='meteor350-v1-data';
const APP_VERSION='Main Version 6';
const initial={settings:{bikeName:'Royal Enfield Meteor 350',variant:'Fireball · Stellar Blue',odo:17109.8,intervalKm:3500,intervalMonths:4},fuel:[],services:[],parts:[],documents:[],expenses:[],notices:[{id:crypto.randomUUID(),title:'Confirm next service date',priority:'Important',date:'2026-11-29',body:'App screenshot showed 29 November 2026; verify against actual service records because earlier workshop odometer entries may be incorrect.',created:new Date().toISOString()},{id:crypto.randomUUID(),title:'Personal service interval',priority:'Normal',body:'Plan service every 3,500 km or 4 months, whichever comes first. Track separately from official maintenance schedule.',created:new Date().toISOString()}],catalogues:[]};
let data;

try{data=JSON.parse(localStorage.getItem(KEY))||initial}catch(e){data=initial}
(function importV4FuelOnce(){
 const marker='meteor350-v4-fuel-import-2026';
 if(localStorage.getItem(marker))return;
 const imported=[
 ['2025-09-19',12986,5,620,'Shell - Madurai - Shell','95-E10','First full fill-up'],
 ['2025-10-09',13399.7,11.81,1200,'Bharat Petroleum - Pykara','95-E10','Check mileage properly'],
 ['2025-11-18',13922,8.32,850,'KB Fuels - Madurai','Not specified',''],
 ['2025-12-16',14077.3,6.93,700,'KB Fuels - Madurai','95-E10',''],
 ['2025-12-26',14307,9.45,1020.60,'KB Fuels - Madurai','95-E20',''],
 ['2026-01-25',14514.6,10,1027,'KB Fuels - Madurai','98+','Sirumalai Ride'],
 ['2026-02-25',14837.1,4.91,530,'KB Fuels - Madurai','98+',''],
 ['2026-03-13',15010,11.25,1215,'KB Fuels - Madurai','95+','Odometer needs confirmation'],
 ['2026-04-19',15449.7,8.85,900,'Madurai - KR','95+',''],
 ['2026-06-05',15929.1,9.49,1030,'Madurai - KR','95+',''],
 ['2026-07-15',16213.5,8.29,900,'Not visible in screenshot','95+',''],
 ['2026-09-02',16638.3,10.57,1240.39,'Not visible in screenshot','95+',''],
 ['2026-10-17',17041.1,11.84,1389.42,'KB Fuels - Madurai','Premium 91','']
 ];
 data.fuel=data.fuel||[];
 imported.forEach((r,i)=>{
  if(data.fuel.some(x=>x.importBatch==='v4-screenshot-import'&&x.date===r[0]))return;
  data.fuel.push({id:'v4fuel-'+i,date:r[0],odo:String(r[1]),fillType:'Imported — verify full/partial',litres:String(r[2]),price:(r[3]/r[2]).toFixed(2),total:r[3],bunk:r[4],fuelType:r[5],notes:r[6],importBatch:'v4-screenshot-import',verification:r[0]==='2026-03-13'?'Needs odometer confirmation':'Transcribed from screenshot'});
 });
 localStorage.setItem(marker,'1');
 try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){console.warn('Fuel import saved only for this session; storage may be full.',e)}
})();

function save(){localStorage.setItem(KEY,JSON.stringify(data));renderAll()}
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function money(n){return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(Number(n)||0)}
function datefmt(s){if(!s)return '—';let d=new Date(s+'T00:00:00');return isNaN(d)?esc(s):d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
function toast(s){let t=document.getElementById('toast');t.textContent=s;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)}
function id(){return crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random()}
function istHour(){const parts=new Intl.DateTimeFormat('en-IN',{timeZone:'Asia/Kolkata',hour:'2-digit',hourCycle:'h23'}).formatToParts(new Date());return Number(parts.find(p=>p.type==='hour')?.value||0)}
function dashboardGreeting(){const h=istHour();return h>=5&&h<12?'Good morning, Jayaraman.':h>=12&&h<17?'Good afternoon, Jayaraman.':'Good evening, Jayaraman.'}
function updateClock(){const d=new Date();const timeText=new Intl.DateTimeFormat('en-IN',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true}).format(d);const dateText=new Intl.DateTimeFormat('en-IN',{timeZone:'Asia/Kolkata',weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(d)+' · Madurai';document.getElementById('time').textContent=timeText;document.getElementById('date').textContent=dateText;if(document.getElementById('splashTime'))document.getElementById('splashTime').textContent=timeText;if(document.getElementById('splashDate'))document.getElementById('splashDate').textContent=dateText;const active=document.querySelector('.view.active');if(active?.id==='dashboard')document.getElementById('pageTitle').textContent=dashboardGreeting()}
updateClock();setInterval(updateClock,1000);
const titles={dashboard:'',fuel:'Fuel & mileage',services:'Service history',parts:'Part-number cross-reference',documents:'Documents & renewals',expenses:'Expenses',notices:'Noticing board',settings:'Settings & backup',admin:'Admin portal'};
function go(view){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===view));document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===view));document.getElementById('pageTitle').textContent=view==='dashboard'?dashboardGreeting():(titles[view]||'Meteor Garage');window.scrollTo({top:0,behavior:'smooth'})}
document.getElementById('nav').addEventListener('click',e=>{let b=e.target.closest('[data-view]');if(b)go(b.dataset.view)});
document.addEventListener('click',e=>{let b=e.target.closest('[data-go]');if(b)go(b.dataset.go)});
function formObj(form){return Object.fromEntries(new FormData(form).entries())}
function table(headers,rows){if(!rows.length)return '<div class="empty">Nothing recorded yet.</div>';return '<div class="table-wrap"><table><thead><tr>'+headers.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>'+rows.join('')+'</tbody></table></div>'}
function renderFuel(){document.getElementById('fuelTable').innerHTML=table(['Date','Odometer','Fill','Litres','Total'],data.fuel.slice().reverse().map(x=>`<tr><td>${datefmt(x.date)}</td><td>${Number(x.odo).toLocaleString('en-IN')} km</td><td><span class="tag">${esc(x.fillType)}</span></td><td>${esc(x.litres)} L</td><td>${money(x.total)}</td></tr>`))}
function renderServices(){
 const q=(document.getElementById('serviceSearch')?.value||'').toLowerCase().trim();
 const f=document.getElementById('serviceFilter')?.value||'all';
 const records=data.services.slice().filter(x=>{
   const blob=[x.date,x.number,x.workshop,x.invoice,x.sourceReference,x.work,...(x.items||[]).flatMap(i=>[i.name,i.partNumber,i.category])].join(' ').toLowerCase();
   return (!q||blob.includes(q))&&(f==='all'||(x.verification||'Needs review')===f);
 }).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
 const el=document.getElementById('serviceTable');
 if(!records.length){el.innerHTML='<div class="empty">No matching service records yet. Add a new bill below or restore your previous backup.</div>';return;}
 el.innerHTML=records.map(x=>{
   const items=Array.isArray(x.items)?x.items:[];
   const lines=items.length?table(['Type','Part number','Description','Qty','Rate','Amount'],items.map(i=>`<tr><td>${esc(i.category||'Part')}</td><td>${esc(i.partNumber||'—')}</td><td>${esc(i.name||'—')}</td><td>${esc(i.qty??1)}</td><td>${money(i.rate||0)}</td><td>${money(i.amount??((Number(i.qty)||1)*(Number(i.rate)||0)))}</td></tr>`)):'<div class="empty">No itemised lines stored for this record. Review the attached source bill.</div>';
   const bill=x.bill?.dataUrl?`<a class="btn small" href="${x.bill.dataUrl}" download="${esc(x.bill.name||'service-bill')}">Open saved bill</a>`:(x.bill?.name?`<span class="muted">Attached file: ${esc(x.bill.name)}</span>`:'<span class="muted">No bill file attached</span>');
   return `<details class="service-record"><summary><span><b>${datefmt(x.date)} · ${esc(x.number||'Service')}</b><small>${esc(x.workshop||'Workshop not entered')} · Odometer: ${x.odoDoc!==''&&x.odoDoc!=null?esc(x.odoDoc)+' km':'Not recorded'}</small><small>Invoice/job card: ${esc(x.invoice||'—')} · ${esc(x.verification||'Needs review')}</small></span><span class="service-total">${money(x.total)}</span></summary><div class="service-record-body"><div class="service-metrics"><div><small>Parts</small><b>${money(x.partsSubtotal||0)}</b></div><div><small>Labour</small><b>${money(x.labourSubtotal||0)}</b></div><div><small>Tax</small><b>${money(x.tax||0)}</b></div><div><small>Discount</small><b>${money(x.discount||0)}</b></div></div><h4>Itemised bill lines</h4>${lines}<h4>Work, findings and notes</h4><p>${esc(x.work||'No notes recorded.')}</p><p><b>Source:</b> ${esc(x.sourceReference||'Not specified')} · <b>Status:</b> ${esc(x.status||'Needs review')}</p><div class="form-actions">${bill}<button class="btn small" data-edit-service="${esc(x.id)}">Edit in admin JSON</button><button class="btn small danger" data-delete-service="${esc(x.id)}">Delete record</button></div></div></details>`;
 }).join('');
}
const legacyNotes=[
 {date:'28 Nov 2023',workshop:'GG Motors, Madurai',odo:'485 km',details:'Parts/consumables ₹1,903; labour ₹1,600; separate tax invoice ₹1,770.',note:'Relationship between the separate amounts needs checking against original documents.'},
 {date:'14 Oct 2024',workshop:'G.G. Motors, Madurai',odo:'7,262 km',details:'Job card RJC0033999HI05687; brake-pad kit KAB00082/B ₹270; labour ₹53.10; wheel turning ₹885; previously documented combined amount ₹1,208.10.',note:'Verify tax and invoice line items against the original bill.'},
 {date:'2 Dec 2024',workshop:'Star Auto Spares & Works',odo:'7,917 km',details:'Invoice 1213; job card E6419; documented total ₹3,896.',note:'Individual parts and labour lines not fully recovered in the current transcription.'},
 {date:'23 Dec 2024',workshop:'Repair record',odo:'Not recorded',details:'Invoice 1307; clutch lever and labour ₹310; engine guard mount KXA00149 ₹1,000.',note:'Confirm whether the listed amounts belong to one invoice or separate entries.'},
 {date:'24 Jan 2025',workshop:'Chain adjustment',odo:'Not recorded',details:'Labour code GELA014; 0.40 hours at ₹375/hour = ₹150; GST ₹27; total ₹177.',note:'Verify against source invoice before marking complete.'}
];
function renderLegacyNotes(){const el=document.getElementById('legacyServiceNotes');if(!el)return;el.innerHTML=legacyNotes.map(n=>`<div class="legacy-note"><b>${esc(n.date)} · ${esc(n.workshop)}</b><small>${esc(n.odo)} · TRANSCRIPTION NEEDS SOURCE REVIEW</small><p>${esc(n.details)}</p><p class="muted">${esc(n.note)}</p></div>`).join('')+'<div class="notice">These notes are a recovery checklist only; they are not automatically added to service totals or treated as verified saved service records. The original bills are required to complete all item lines accurately.</div>'}
function addServiceLine(category='Part',values={}){const host=document.getElementById('serviceItems');if(!host)return;const row=document.createElement('div');row.className='service-item-row';row.innerHTML=`<select aria-label="Line category" class="line-category"><option ${category==='Part'?'selected':''}>Part</option><option ${category==='Consumable'?'selected':''}>Consumable</option><option ${category==='Labour'?'selected':''}>Labour</option><option ${category==='Other'?'selected':''}>Other</option></select><input class="line-part" placeholder="OEM part no. (if any)" value="${esc(values.partNumber||'')}"><input class="line-name" placeholder="Description" value="${esc(values.name||'')}"><input class="line-qty" type="number" min="0" step=".01" value="${values.qty??1}" aria-label="Quantity"><input class="line-rate" type="number" min="0" step=".01" value="${values.rate??0}" aria-label="Unit rate ₹"><output class="line-amount">₹0</output><button type="button" class="btn small danger line-remove" aria-label="Remove bill line">×</button>`;host.appendChild(row);row.querySelectorAll('input,select').forEach(i=>i.addEventListener('input',calcServiceTotals));calcServiceTotals();}
function calcServiceTotals(){const rows=[...document.querySelectorAll('.service-item-row')];let parts=0,labour=0;rows.forEach(r=>{const qty=Math.max(0,Number(r.querySelector('.line-qty').value)||0),rate=Math.max(0,Number(r.querySelector('.line-rate').value)||0),amount=qty*rate;r.querySelector('.line-amount').textContent=money(amount);if(r.querySelector('.line-category').value==='Labour')labour+=amount;else if(['Part','Consumable'].includes(r.querySelector('.line-category').value))parts+=amount;});const other=Math.max(0,Number(document.getElementById('otherCharges')?.value)||0),discount=Math.max(0,Number(document.getElementById('serviceDiscount')?.value)||0),tax=Math.max(0,Number(document.getElementById('serviceTax')?.value)||0),taxable=Math.max(0,parts+labour+other-discount),calculated=taxable+tax;document.getElementById('partsSubtotal').value=parts.toFixed(2);document.getElementById('labourSubtotal').value=labour.toFixed(2);document.getElementById('serviceTaxable').value=taxable.toFixed(2);const total=document.getElementById('serviceTotal'),check=document.getElementById('serviceTotalCheck');if(!total.dataset.userEdited||!total.value)total.value=calculated.toFixed(2);const diff=Math.abs((Number(total.value)||0)-calculated);check.className='tag '+(diff<0.02?'good':'warn');check.textContent=diff<0.02?'Matches calculated total':`Difference ${money(diff)} — check bill`;}
function getServiceItems(){return [...document.querySelectorAll('.service-item-row')].map(r=>{const qty=Number(r.querySelector('.line-qty').value)||0,rate=Number(r.querySelector('.line-rate').value)||0;return {category:r.querySelector('.line-category').value,partNumber:r.querySelector('.line-part').value.trim(),name:r.querySelector('.line-name').value.trim(),qty,rate,amount:Math.round(qty*rate*100)/100};}).filter(x=>x.name||x.partNumber||x.rate>0)}
function renderDocs(){document.getElementById('documentsTable').innerHTML=table(['Type','Number / provider','Expiry','Status'],data.documents.slice().reverse().map(x=>{let days=x.end?Math.ceil((new Date(x.end+'T00:00:00')-new Date(new Date().toDateString()))/86400000):null;let st=days===null?'No expiry':days<0?'Expired':days<=30?'Due soon':'Valid';return `<tr><td>${esc(x.type)}</td><td>${esc(x.number||x.provider||'—')}</td><td>${datefmt(x.end)}</td><td><span class="tag ${st==='Valid'?'good':st==='Expired'?'bad':st==='Due soon'?'warn':''}">${st}</span></td></tr>`}))}
function renderExpenses(){document.getElementById('expensesTable').innerHTML=table(['Date','Category','Description','Amount'],data.expenses.slice().reverse().map(x=>`<tr><td>${datefmt(x.date)}</td><td>${esc(x.category)}</td><td>${esc(x.description)}</td><td>${money(x.amount)}</td></tr>`))}
function renderNotices(target='noticeList'){let el=document.getElementById(target);if(!el)return;let arr=data.notices.slice().sort((a,b)=>Number(!!b.pinned)-Number(!!a.pinned)||(b.created||'').localeCompare(a.created||''));el.innerHTML=arr.length?arr.map(n=>`<div class="notice-item"><b>${n.pinned?'📌 ':''}${esc(n.title)} <span class="tag ${n.priority==='Urgent'?'bad':n.priority==='Important'?'warn':''}">${esc(n.priority)}</span></b><small>${n.date?datefmt(n.date)+' · ':''}${new Date(n.created||Date.now()).toLocaleDateString('en-IN')}</small><div style="margin-top:6px;font-size:13px">${esc(n.body)}</div>${adminSession?`<div style="margin-top:8px"><button class="btn small" data-edit-notice="${n.id}">Edit</button> <button class="btn small danger" data-delete-notice="${n.id}">Delete</button></div>`:''}</div>`).join(''):'<div class="empty">No notices yet.</div>';if(target==='adminNoticeList')el.innerHTML=arr.length?arr.map(n=>`<div class="file-item"><div><strong>${n.pinned?'📌 ':''}${esc(n.title)}</strong><span>${esc(n.priority)} · ${n.date?datefmt(n.date):'No date'}</span></div><div><button class="btn small" data-edit-notice="${n.id}">Edit</button> <button class="btn small" data-toggle-pin="${n.id}">${n.pinned?'Unpin':'Pin'}</button> <button class="btn small danger" data-delete-notice="${n.id}">Delete</button></div></div>`).join(''):'<div class="empty">No notices yet.</div>'}
let cataloguePages=[];
function normPartText(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'')}
function editDistance(a,b){let row=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){let next=[i];for(let j=1;j<=b.length;j++)next[j]=Math.min(next[j-1]+1,row[j]+1,row[j-1]+(a[i-1]===b[j-1]?0:1));row=next;}return row[b.length]}
function escapeRx(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
function extractPartCandidates(text){
 const lines=String(text||'').split(/\n+/).map(s=>s.replace(/\s+/g,' ').trim()).filter(Boolean);
 const out=[];
 // Catalogue OCR commonly places an identifier before a hyphen and a part description.
 const re=/\b([A-Z0-9]{4,}(?:\s*\/\s*[A-Z0-9]{1,4})?)\s*[-–:]\s*([^-\n]{2,100})/gi;
 for(const line of lines){
   let m; while((m=re.exec(line))!==null){
     const code=m[1].replace(/\s+/g,'');
     const desc=m[2].trim();
     if(/[A-Z]/i.test(code)||/\d/.test(code)){
       if(!out.some(x=>normPartText(x.number)===normPartText(code)))out.push({number:code,name:desc});
     }
   }
 }
 return out;
}
function renderParts(){
 const q=(document.getElementById('partSearch')?.value||'').trim();
 const src=document.getElementById('partSource')?.value||'all';
 const nq=normPartText(q);
 const manual=data.parts.filter(p=>(src==='all'||p.source===src||(src==='manual'&&p.source==='Manual / service bill'))&&(!q||[p.number,p.name,p.description].join(' ').toLowerCase().includes(q.toLowerCase())));
 let rows=[];
 if(q&&src!=='manual'&&nq){
   for(const pg of cataloguePages){
     if(src!=='all'&&pg.source!==src)continue;
     for(const candidate of extractPartCandidates(pg.text)){
       const cn=normPartText(candidate.number);
       // For part-number-like queries, only surface candidates that match the identifier itself.
       // Do not show an entire OCR page containing many unrelated part numbers.
       const exact=cn===nq;
       const partial=(nq.length>=5&&(cn.includes(nq)||nq.includes(cn)));
       const near=(nq.length>=6&&!exact&&!partial&&Math.abs(cn.length-nq.length)<=2&&editDistance(cn,nq)<=2);
       if(exact||partial||near){
         rows.push({number:candidate.number,name:candidate.name,source:pg.source,page:pg.page,status:exact?'Exact OCR text match':partial?'Partial identifier match':'Possible OCR near-match',rank:exact?0:partial?1:2});
       }
     }
   }
 }
 rows.sort((a,b)=>a.rank-b.rank||a.source.localeCompare(b.source)||a.page-b.page);
 // Deduplicate the same code/source/page and never print the full OCR page with all its unrelated codes.
 const seen=new Set(); rows=rows.filter(r=>{const k=[normPartText(r.number),r.source,r.page].join('|');if(seen.has(k))return false;seen.add(k);return true});
 const manualHtml=manual.map(p=>`<tr><td><strong>${esc(p.number)}</strong></td><td>${esc(p.name)}</td><td>${esc(p.source)}</td><td>Manual entry</td><td><span class="tag warn">Verify source</span></td></tr>`).join('');
 const ocrHtml=rows.slice(0,50).map(r=>`<tr><td><strong>${esc(r.number)}</strong></td><td>${esc(r.name||'Description not reliably separated by OCR')}</td><td>${esc(r.source)}</td><td>Page ${r.page}</td><td><span class="tag ${r.rank===0?'good':'warn'}">${esc(r.status)}</span></td></tr>`).join('');
 let result='';
 if(q&&src!=='manual'){
   result+=`<h3 style="margin:12px 0">Catalogue results</h3>`;
   result+=ocrHtml?`<div class="table-wrap"><table><thead><tr><th>Part number</th><th>Part name / OCR description</th><th>Catalogue</th><th>Page</th><th>Match status</th></tr></thead><tbody>${ocrHtml}</tbody></table></div>`:`<div class="empty">No part-number identifier match found for “${esc(q)}”. Try the exact number as printed in the catalogue. No unrelated page numbers are shown.</div>`;
   if(rows.length>50)result+=`<p class="muted">Showing first 50 matching entries out of ${rows.length}.</p>`;
 }
 if(manual.length){
   result+='<h3 style="margin:18px 0 10px">Saved manual entries</h3>';
   result+=`<div class="table-wrap"><table><thead><tr><th>Part number</th><th>Part name</th><th>Source</th><th>Record type</th><th>Action</th></tr></thead><tbody>${manual.map(p=>`<tr><td><strong>${esc(p.number)}</strong></td><td>${esc(p.name)}</td><td>${esc(p.source)}</td><td>Manual entry</td><td><button class="btn small danger" data-delete-part="${p.id}">Delete</button></td></tr>`).join('')}</tbody></table></div>`;
 }
 if(!q)result='<div class="empty">Type a part number to see only matching part-number entries. Results are shown in separate columns; unrelated numbers from the same PDF page are not displayed.</div>';
 if(q&&src==='manual'&&!manual.length)result='<div class="empty">No saved manual entry matches this search.</div>';
 document.getElementById('partsResults').innerHTML=result;
}
fetch('./parts-index.json').then(r=>{if(!r.ok)throw Error('index unavailable');return r.json()}).then(j=>{cataloguePages=j.pages||[];renderParts()}).catch(()=>{document.getElementById('partsResults').innerHTML='<div class="empty">Catalogue text index could not be loaded. Ensure parts-index.json is uploaded beside index.html in the GitHub repository.</div>'});
function renderCatalogues(){document.getElementById('catalogueFiles').innerHTML=data.catalogues.length?data.catalogues.slice().reverse().map(c=>`<div class="file-item"><div><strong>${esc(c.label)}</strong><span>${esc(c.name)} · ${new Date(c.added).toLocaleDateString('en-IN')} · ${Math.round(c.size/1024)} KB</span></div><button class="btn small danger" data-delete-catalogue="${c.id}">Remove</button></div>`).join(''):'<div class="empty">No catalogue files saved in this browser yet. The two source PDFs were shared in the conversation; add them here if you want local browser copies.</div>'}
function renderRecent(){let arr=[...data.fuel.map(x=>({...x,kind:'Fuel',label:(x.bunk||x.fuelType||'Fuel fill-up'),amount:x.total})),...data.services.map(x=>({...x,kind:'Service',label:x.number+' service',amount:x.total}))].sort((a,b)=>(b.date||'').localeCompare(a.date||'')).slice(0,5);document.getElementById('recentActivity').innerHTML=arr.length?table(['Date','Type','Details','Amount'],arr.map(x=>`<tr><td>${datefmt(x.date)}</td><td>${x.kind}</td><td>${esc(x.label)}</td><td>${money(x.amount)}</td></tr>`)):'<div class="empty">No records yet. Use the quick actions to start your log.</div>'}

function renderV4Insights(){
 const entries=data.fuel||[];
 const litres=entries.reduce((s,x)=>s+(Number(x.litres)||0),0);
 const spend=entries.reduce((s,x)=>s+(Number(x.total)||((Number(x.litres)||0)*(Number(x.price)||0))),0);
 const c=document.getElementById('v4FuelCount'),l=document.getElementById('v4FuelLitres'),a=document.getElementById('v4FuelSpend');
 if(c)c.textContent=entries.length;if(l)l.textContent=litres.toFixed(2)+' L';if(a)a.textContent=money(spend);
}

function renderAll(){document.getElementById('statOdo').innerHTML=Number(data.settings.odo||0).toLocaleString('en-IN')+' <small style="font-size:14px">km</small>';document.getElementById('statFuel').textContent=data.fuel.length;document.getElementById('statServices').textContent=data.services.length;let total=data.expenses.filter(x=>!x.sourceService&&!x.sourceFuel).reduce((s,x)=>s+Number(x.amount||0),0)+data.fuel.reduce((s,x)=>s+Number(x.total||0),0)+data.services.reduce((s,x)=>s+Number(x.total||0),0);document.getElementById('statExpenses').textContent=money(total);renderFuel();renderServices();renderLegacyNotes();renderDocs();renderExpenses();renderNotices();renderNotices('dashboardNotices');renderParts();renderCatalogues();renderRecent();renderV4Insights()}
function attachFile(file,record){if(!file)return Promise.resolve(null);return new Promise(resolve=>{let reader=new FileReader();reader.onload=()=>resolve({name:file.name,type:file.type,size:file.size,dataUrl:reader.result});reader.onerror=()=>resolve({name:file.name,type:file.type,size:file.size});reader.readAsDataURL(file)})}
document.getElementById('fuelForm').addEventListener('submit',async e=>{e.preventDefault();let f=e.currentTarget,o=formObj(f),file=f.elements.photo.files[0];o.id=id();o.total=Number(o.litres)*Number(o.price);o.photo=await attachFile(file);data.fuel.push(o);data.expenses.push({id:id(),date:o.date,category:'Fuel',amount:o.total,odo:o.odo,description:`${o.litres} L · ${o.bunk||o.fuelType||'Fuel fill-up'}`,sourceFuel:o.id});save();f.reset();toast('Fuel entry saved locally.')});
document.getElementById('serviceForm').addEventListener('submit',async e=>{e.preventDefault();let f=e.currentTarget,o=formObj(f);o.id=id();o.items=getServiceItems();['total','odoDoc','odoVerified','partsSubtotal','labourSubtotal','otherCharges','discount','taxable','tax'].forEach(k=>o[k]=o[k]===''?0:Number(o[k]||0));o.bill=await attachFile(f.elements.bill.files[0]);o.createdAt=new Date().toISOString();data.services.push(o);if(o.total>0)data.expenses.push({id:id(),date:o.date,category:'Service',amount:o.total,odo:o.odoVerified||o.odoDoc,description:`${o.number} service · ${o.workshop||'Workshop'}`,sourceService:o.id});save();f.reset();document.getElementById('serviceItems').innerHTML='';document.getElementById('serviceTotal').dataset.userEdited='';addServiceLine();calcServiceTotals();toast('Itemised service record saved locally. Verify it against the original bill.');});
document.getElementById('addServiceItem').addEventListener('click',()=>addServiceLine('Part'));
document.getElementById('addLabourItem').addEventListener('click',()=>addServiceLine('Labour'));
document.getElementById('serviceItems').addEventListener('click',e=>{const b=e.target.closest('.line-remove');if(b){b.closest('.service-item-row').remove();calcServiceTotals();}});
['otherCharges','serviceDiscount','serviceTax'].forEach(idName=>document.getElementById(idName).addEventListener('input',calcServiceTotals));
document.getElementById('serviceTotal').addEventListener('input',e=>{e.target.dataset.userEdited='1';calcServiceTotals()});
document.getElementById('serviceForm').addEventListener('reset',()=>setTimeout(()=>{document.getElementById('serviceItems').innerHTML='';document.getElementById('serviceTotal').dataset.userEdited='';addServiceLine();calcServiceTotals()},0));
document.getElementById('serviceSearch').addEventListener('input',renderServices);document.getElementById('serviceFilter').addEventListener('change',renderServices);
document.addEventListener('click',e=>{const d=e.target.closest('[data-delete-service]');if(d&&confirm('Delete this service record? The linked expense entry will also be removed. Export a backup first.')){const rid=d.dataset.deleteService;data.services=data.services.filter(x=>x.id!==rid);data.expenses=data.expenses.filter(x=>x.sourceService!==rid);save();toast('Service record deleted.')}const edit=e.target.closest('[data-edit-service]');if(edit){go('admin');document.getElementById('adminCollection').value='services';refreshAdminEditor();document.getElementById('adminRecord').value=edit.dataset.editService;document.getElementById('adminRecord').dispatchEvent(new Event('change'));toast('Service selected in Admin JSON editor. Review carefully before saving.')}});
document.getElementById('partForm').addEventListener('submit',e=>{e.preventDefault();let o=formObj(e.currentTarget);o.id=id();o.price=o.price?Number(o.price):'';data.parts.push(o);save();e.currentTarget.reset();toast('Part entry saved; verify against its source PDF.')});
document.getElementById('docForm').addEventListener('submit',async e=>{e.preventDefault();let f=e.currentTarget,o=formObj(f);o.id=id();o.amount=Number(o.amount||0);o.file=await attachFile(f.elements.file.files[0]);data.documents.push(o);save();f.reset();toast('Document record saved locally.')});
document.getElementById('expenseForm').addEventListener('submit',e=>{e.preventDefault();let o=formObj(e.currentTarget);o.id=id();o.amount=Number(o.amount);data.expenses.push(o);save();e.currentTarget.reset();toast('Expense saved.')});
document.getElementById('settingsForm').addEventListener('submit',e=>{e.preventDefault();let o=formObj(e.currentTarget);o.odo=Number(o.odo);o.intervalKm=Number(o.intervalKm);o.intervalMonths=Number(o.intervalMonths);data.settings={...data.settings,...o};save();toast('Settings saved.')});
document.getElementById('partSearch').addEventListener('input',renderParts);document.getElementById('partSource').addEventListener('change',renderParts);
document.addEventListener('click',e=>{let p=e.target.closest('[data-delete-part]');if(p&&confirm('Delete this catalogue entry?')){data.parts=data.parts.filter(x=>x.id!==p.dataset.deletePart);save()}let c=e.target.closest('[data-delete-catalogue]');if(c&&confirm('Remove this catalogue file from the index?')){data.catalogues=data.catalogues.filter(x=>x.id!==c.dataset.deleteCatalogue);save()}});
document.getElementById('catalogueForm').addEventListener('submit',async e=>{e.preventDefault();let f=e.currentTarget,file=f.elements.file.files[0];if(!file)return;let meta={id:id(),label:f.elements.label.value,name:file.name,size:file.size,type:file.type,added:new Date().toISOString()};try{await storeBlob(meta.id,file)}catch(err){toast('Browser storage could not save the PDF. Try a smaller file or another browser.');return}data.catalogues.push(meta);save();f.reset();toast('Catalogue file stored in this browser.')});
const DB='meteor350-v1-files';
function storeBlob(key,file){return new Promise((resolve,reject)=>{let req=indexedDB.open(DB,1);req.onupgradeneeded=()=>req.result.createObjectStore('files');req.onerror=()=>reject(req.error);req.onsuccess=()=>{let tx=req.result.transaction('files','readwrite');tx.objectStore('files').put(file,key);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)}})}
function download(name,content,type){let a=document.createElement('a'),url=URL.createObjectURL(new Blob([content],{type}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500)}
document.getElementById('exportBtn').addEventListener('click',()=>download('meteor350-backup-'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(data,null,2),'application/json'));
document.getElementById('importFile').addEventListener('change',async e=>{let file=e.target.files[0];if(!file)return;try{let incoming=JSON.parse(await file.text());if(!incoming||!Array.isArray(incoming.fuel)||!Array.isArray(incoming.services))throw Error('Invalid backup');if(confirm('Replace current structured records with this backup? Export your current data first if needed.')){data={...initial,...incoming,settings:{...initial.settings,...incoming.settings}};save();toast('Backup imported.')}}catch(err){toast('Could not import: invalid JSON backup.')}e.target.value=''});
document.getElementById('clearBtn').addEventListener('click',()=>{if(confirm('Delete all structured records from this browser? Export a backup first.')){data={...initial,settings:{...data.settings},notices:[]};save();toast('Structured records cleared. Uploaded files may still remain in browser storage.')}});

// Main Version 5 audio: browser-safe, user-initiated playback of the three supplied recordings.
const loadingScreen=document.getElementById('loadingScreen');
const loadingStatus=document.getElementById('loadingStatus');
const loadingProgress=document.getElementById('loadingProgress');
let loadingTimer=null, loadingAudioOn=false, audioSequenceIndex=0, audioSequenceActive=false;
const rideAudioFiles=[
 'assets/audio/engine-start.mp3',
 'assets/audio/power-throttle.mp3',
 'assets/audio/pump-start.mp3'
];
const rideAudio=rideAudioFiles.map(src=>{const a=new Audio(src);a.preload='auto';a.volume=.82;return a});
function updateSoundButton(on){
 const b=document.getElementById('loadingSound');
 if(b){b.textContent=on?'🔊 Sound on':'🔇 Sound off';b.setAttribute('aria-pressed',String(on))}
}
function stopLoadingSound(){
 audioSequenceActive=false;loadingAudioOn=false;
 rideAudio.forEach(a=>{a.onended=null;a.onerror=null;a.pause();try{a.currentTime=0}catch(e){}});
 updateSoundButton(false);
}
function playNextRideSound(){
 if(!audioSequenceActive)return;
 if(audioSequenceIndex>=rideAudio.length){audioSequenceActive=false;loadingAudioOn=false;updateSoundButton(false);return}
 const current=rideAudio[audioSequenceIndex++];
 current.onended=()=>playNextRideSound();
 current.onerror=()=>{current.onended=null;current.onerror=null;audioSequenceActive=false;loadingAudioOn=false;updateSoundButton(false);toast('Audio file not found. Confirm the exact assets/audio/*.mp3 paths in GitHub.')};
 const p=current.play();
 if(p&&typeof p.catch==='function')p.catch(()=>{stopLoadingSound();toast('Audio was blocked. Tap Sound on again and check device media volume.')});
}
function startLoadingSound(){
 if(audioSequenceActive)return;
 stopLoadingSound();audioSequenceActive=true;loadingAudioOn=true;audioSequenceIndex=0;updateSoundButton(true);playNextRideSound();
}
function finishLoading(){if(!loadingScreen)return;if(loadingTimer){clearTimeout(loadingTimer);loadingTimer=null}stopLoadingSound();loadingScreen.classList.add('loading-finished');setTimeout(()=>{loadingScreen.remove();if(document.getElementById('welcomeSplash'))setTimeout(()=>{if(document.getElementById('welcomeSplash'))dismissWelcome()},6500)},800)}
function dismissWelcome(){const s=document.getElementById('welcomeSplash');if(s){s.classList.add('hidden-splash');setTimeout(()=>s.remove(),900)}}
document.getElementById('skipLoading').addEventListener('click',finishLoading);
document.getElementById('loadingSound').addEventListener('click',()=>loadingAudioOn?stopLoadingSound():startLoadingSound());
const loadingMessages=['Ignition on…','Rolling through Madurai…','Passing the temple lights…','Braking gently…','Parked. Welcome, rider.'];let loadingMessageIndex=0;const loadingMessageTimer=setInterval(()=>{if(!document.getElementById('loadingScreen')){clearInterval(loadingMessageTimer);return}loadingMessageIndex=Math.min(loadingMessages.length-1,loadingMessageIndex+1);if(loadingStatus)loadingStatus.textContent=loadingMessages[loadingMessageIndex]},1350);
loadingTimer=setTimeout(finishLoading,7200);
document.getElementById('enterGarage').addEventListener('click',dismissWelcome);document.getElementById('skipWelcome').addEventListener('click',dismissWelcome);

// Local-only admin account/session. This gates the UI on this browser; it is not secure server authentication.
let adminSession=false, adminSetupMode=true;
const ADMIN_KEY='meteor350-admin-local-v1';
async function digestPassword(password,salt){const bytes=new TextEncoder().encode(salt+':'+password);const hash=await crypto.subtle.digest('SHA-256',bytes);return Array.from(new Uint8Array(hash)).map(x=>x.toString(16).padStart(2,'0')).join('')}
function adminAccount(){try{return JSON.parse(localStorage.getItem(ADMIN_KEY))}catch(e){return null}}
function setAdminMode(setup){adminSetupMode=setup;document.getElementById('adminAuthTitle').textContent=setup?'Create local admin account':'Admin sign in';document.getElementById('adminAuthSubmit').textContent=setup?'Create admin account':'Sign in';document.getElementById('adminConfirmField').classList.toggle('hidden',!setup);document.getElementById('toggleAdminMode').textContent=setup?'I already have an account':'First time? Create account';document.querySelector('#adminAuthForm [name=password]').autocomplete=setup?'new-password':'current-password'}
function updateAdminUI(){document.getElementById('adminAuth').classList.toggle('hidden',adminSession);document.getElementById('adminWorkspace').classList.toggle('hidden',!adminSession);document.getElementById('adminBadge').textContent=adminSession?'Unlocked · local session':'Locked';document.getElementById('adminBadge').classList.toggle('tag',adminSession);renderNotices();renderNotices('dashboardNotices');renderNotices('adminNoticeList');if(adminSession)refreshAdminEditor()}
setAdminMode(!adminAccount());
document.getElementById('toggleAdminMode').addEventListener('click',()=>setAdminMode(!adminSetupMode));
document.getElementById('adminAuthForm').addEventListener('submit',async e=>{e.preventDefault();const f=e.currentTarget,u=f.elements.username.value.trim(),p=f.elements.password.value,cf=f.elements.confirm.value;const existing=adminAccount();if(adminSetupMode){if(p.length<8){toast('Use at least 8 characters for the admin password.');return}if(p!==cf){toast('Passwords do not match.');return}const salt=id();localStorage.setItem(ADMIN_KEY,JSON.stringify({username:u,salt,hash:await digestPassword(p,salt)}));adminSession=true;toast('Local admin account created. Remember this password; it cannot be recovered here.')}else{if(!existing||u!==existing.username||await digestPassword(p,existing.salt)!==existing.hash){toast('Incorrect admin username or password.');return}adminSession=true;toast('Admin signed in on this browser.')}f.reset();updateAdminUI();});
document.getElementById('adminLogout').addEventListener('click',()=>{adminSession=false;updateAdminUI();toast('Admin logged out.')});
function recordLabel(x){return [x.date,x.number,x.title,x.name,x.bunk,x.category,x.description,x.type,x.invoice].filter(Boolean).join(' · ').slice(0,110)||x.id||'Record'}
function refreshAdminEditor(){if(!adminSession)return;const coll=document.getElementById('adminCollection').value,sel=document.getElementById('adminRecord');let arr=coll==='settings'?[{...data.settings,__settingsRecord:true}]:Array.isArray(data[coll])?data[coll]:[];sel.innerHTML=arr.length?arr.map((x,i)=>`<option value="${esc(x.id||'__settings__')}">${esc(recordLabel(x))}</option>`).join(''):'<option value="">No records in this collection</option>';const item=arr[0];document.getElementById('adminJson').value=item?JSON.stringify(item,null,2):'';document.getElementById('adminDeleteRecord').disabled=!item||coll==='settings';document.getElementById('adminCounts').innerHTML=['fuel','services','parts','documents','expenses','notices'].map(k=>`<div class="file-item"><strong>${({fuel:'Fuel logs',services:'Service logs',parts:'Manual parts',documents:'Documents',expenses:'Expenses',notices:'Notices'})[k]}</strong><span>${data[k].length} records</span></div>`).join('');renderNotices('adminNoticeList')}
document.getElementById('adminCollection').addEventListener('change',refreshAdminEditor);
document.getElementById('adminRecord').addEventListener('change',()=>{if(!adminSession)return;const coll=document.getElementById('adminCollection').value,idv=document.getElementById('adminRecord').value;const arr=coll==='settings'?[{...data.settings,__settingsRecord:true}]:data[coll]||[];const item=arr.find(x=>(x.id||'__settings__')===idv)||arr[0];document.getElementById('adminJson').value=item?JSON.stringify(item,null,2):'';document.getElementById('adminDeleteRecord').disabled=!item||coll==='settings'});
document.getElementById('adminSaveRecord').addEventListener('click',()=>{if(!adminSession){toast('Admin sign-in required.');return}const coll=document.getElementById('adminCollection').value;let obj;try{obj=JSON.parse(document.getElementById('adminJson').value)}catch(e){toast('Invalid JSON. Fix the syntax before saving.');return}if(coll==='settings'){delete obj.__settingsRecord;data.settings={...data.settings,...obj}}else{if(!obj||typeof obj!=='object'||!obj.id){toast('Record must be an object with its existing id.');return}const arr=data[coll],idx=arr.findIndex(x=>x.id===document.getElementById('adminRecord').value);if(idx<0){toast('Select an existing record to edit.');return}arr[idx]=obj}save();refreshAdminEditor();toast('Record edits saved.')});
document.getElementById('adminDeleteRecord').addEventListener('click',()=>{if(!adminSession)return;const coll=document.getElementById('adminCollection').value,idv=document.getElementById('adminRecord').value;if(coll==='settings'||!idv)return;if(confirm('Permanently delete this selected '+coll+' record?')){data[coll]=data[coll].filter(x=>x.id!==idv);save();refreshAdminEditor();toast('Selected record deleted.')}});
document.getElementById('adminExport').addEventListener('click',()=>{if(adminSession)download('meteor350-admin-backup-'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(data,null,2),'application/json')});
document.getElementById('adminDeleteAll').addEventListener('click',()=>{if(!adminSession)return;if(confirm('Delete all fuel, service, manual part, document and expense logs? Notices and settings will be kept. Export a backup first.')){data.fuel=[];data.services=[];data.parts=[];data.documents=[];data.expenses=[];save();refreshAdminEditor();toast('All logs cleared; notices and settings retained.')}});
document.getElementById('adminWipeAll').addEventListener('click',()=>{if(!adminSession)return;if(confirm('Delete ALL structured records including every notice? This cannot be undone without a backup.')){data.fuel=[];data.services=[];data.parts=[];data.documents=[];data.expenses=[];data.notices=[];save();refreshAdminEditor();toast('All structured records and notices deleted.')}});
function editNotice(idv){if(!adminSession){toast('Only admin can manage the noticing board.');return}const n=data.notices.find(x=>x.id===idv);if(!n)return;const f=document.getElementById('adminNoticeForm');for(const k of ['id','title','priority','date','body'])if(f.elements[k])f.elements[k].value=n[k]||'';f.elements.pinned.value=String(!!n.pinned);document.getElementById('adminNoticeSave').textContent='Save notice changes';go('admin')}
document.getElementById('adminNoticeForm').addEventListener('submit',e=>{e.preventDefault();if(!adminSession){toast('Admin sign-in required.');return}const f=e.currentTarget,o=formObj(f);o.pinned=o.pinned==='true';if(o.id){const idx=data.notices.findIndex(n=>n.id===o.id);if(idx>=0)data.notices[idx]={...data.notices[idx],...o,updated:new Date().toISOString()}}else{o.id=id();o.created=new Date().toISOString();data.notices.push(o)}save();f.reset();f.elements.id.value='';document.getElementById('adminNoticeSave').textContent='Publish notice';toast('Noticing board updated.');updateAdminUI()});
document.getElementById('adminNoticeReset').addEventListener('click',()=>{setTimeout(()=>{document.getElementById('adminNoticeForm').elements.id.value='';document.getElementById('adminNoticeSave').textContent='Publish notice'},0)});
document.addEventListener('click',e=>{const edit=e.target.closest('[data-edit-notice]');if(edit){editNotice(edit.dataset.editNotice);return}const pin=e.target.closest('[data-toggle-pin]');if(pin&&adminSession){const n=data.notices.find(x=>x.id===pin.dataset.togglePin);if(n)n.pinned=!n.pinned;save();updateAdminUI();return}const del=e.target.closest('[data-delete-notice]');if(del){if(!adminSession){toast('Only admin can delete notices.');return}if(confirm('Delete this notice?')){data.notices=data.notices.filter(n=>n.id!==del.dataset.deleteNotice);save();updateAdminUI()}return}});

function initForms(){document.querySelectorAll('input[type=date]').forEach(i=>{if(!i.value)i.value=new Date().toISOString().slice(0,10)});let f=document.getElementById('settingsForm');for(let [k,v] of Object.entries(data.settings||{})){if(f.elements[k])f.elements[k].value=v}}
initForms();addServiceLine();renderAll();updateAdminUI();
