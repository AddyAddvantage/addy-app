/* ==========================================================
   ADDY - APP
   UI state, screen routing, event handlers.
   Requires: logic.js loaded before this file.
   ========================================================== */

const WORKER_URL = 'https://addy-calculator.michelle-1db.workers.dev';

async function api(goal, inputs) {
  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal, inputs }),
    });
    if (!res.ok) throw new Error('API error ' + res.status);
    const data = await res.json();
    return data.result;
  } catch (e) {
    console.warn('Addy calc unavailable:', e.message);
    return null;
  }
}

let goal=null;

// [extracted to logic.js: f]
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.getElementById(id).classList.add('active');window.scrollTo({top:0,behavior:'smooth'});}
function syncSubWidth(){
  var heading = document.querySelector('.goals-heading');
  var sub = document.querySelector('.goals-sub');
  if(!heading || !sub) return;
  var w = heading.getBoundingClientRect().width;
  sub.style.width = w + 'px';
}
if(document.fonts){document.fonts.ready.then(syncSubWidth);}else{window.addEventListener('load',syncSubWidth);}
window.addEventListener('resize',syncSubWidth);
function selectGoal(key){goal=key;toGate();}
function pick(el,key){document.querySelectorAll('.goal-card').forEach(c=>c.classList.remove('sel'));el.classList.add('sel');goal=key;document.getElementById('btn-g').disabled=false;}
function toGate(){
  if(!goal)return;
  if(goal==='cash'){
    show('s-cash');
    document.getElementById('c-rev').value='';
    document.getElementById('c-dso').value='';
    var t=document.getElementById('cash-thinking');if(t){t.style.display='none';t.classList.remove('visible');}
    var p2=document.getElementById('cash-phase2');if(p2)p2.classList.remove('visible');
    var p3=document.getElementById('cash-phase3');if(p3)p3.classList.remove('visible');
    cashFieldFocus('c-rev','c-rev-err');cashFieldFocus('c-dso','c-dso-err');
    setTimeout(function(){var r=document.getElementById('c-rev');if(r)r.focus();},300);
  }
  else if(goal==='grow'){show('s-grow');setTimeout(function(){var g=document.getElementById('g-nc');if(g)g.focus();},300);}
  else{show('s-exit');setTimeout(function(){var el=document.getElementById('e-pro');if(el)el.focus();},300);}
}
function toggleDsoDrop(){
  var opts=document.getElementById('c-dso-options');
  var trigger=document.getElementById('c-dso-trigger');
  var isOpen=opts.classList.contains('open');
  opts.classList.toggle('open',!isOpen);
  trigger.classList.toggle('open',!isOpen);
  if(!isOpen){
    setTimeout(function(){
      var r=opts.getBoundingClientRect();
      if(r.bottom>window.innerHeight-24){
        window.scrollBy({top:r.bottom-window.innerHeight+40,behavior:'smooth'});
      }
    },60);
  }
}
function selectDso(val,label){
  document.getElementById('c-dso').value=val;
  var disp=document.getElementById('c-dso-display');
  disp.textContent=label||val;
  disp.classList.remove('cs-display-empty');
  document.querySelectorAll('#c-dso-options .custom-sel-option').forEach(function(o){o.classList.remove('selected');});
  event.target.classList.add('selected');
  document.getElementById('c-dso-options').classList.remove('open');
  document.getElementById('c-dso-trigger').classList.remove('open');
  cashFieldFocus('c-dso','c-dso-err');
}
document.addEventListener('click',function(e){
  var wrap=document.getElementById('c-dso-wrap');
  if(wrap&&!wrap.contains(e.target)){
    var opts=document.getElementById('c-dso-options');if(opts)opts.classList.remove('open');
    var t=document.getElementById('c-dso-trigger');if(t)t.classList.remove('open');
  }
});
function selectDepLever(idx){
  document.getElementById('e-di').value=idx;
  for(var i=0;i<3;i++){
    var btn=document.getElementById('dep-btn-'+i);
    if(btn){
      if(i===idx){btn.style.border='2px solid #6abf7a';btn.style.background='#edf7f0';btn.style.color='#2d3f38';btn.style.fontWeight='600';}
      else{btn.style.border='2px solid #e5e7eb';btn.style.background='#f9fafb';btn.style.color='#6b7280';btn.style.fontWeight='';}
    }
  }
  calcExit();
}
function toggleDepDrop(){
  var opts=document.getElementById('e-dep-options');
  var trigger=document.getElementById('e-dep-trigger');
  var isOpen=opts.classList.contains('open');
  opts.classList.toggle('open',!isOpen);
  trigger.classList.toggle('open',!isOpen);
}
function selectDep(val,label){
  document.getElementById('e-dep').value=val;
  document.getElementById('e-dep-display').textContent=label;
  document.querySelectorAll('.custom-sel-option').forEach(function(o){o.classList.remove('selected');});
  event.target.classList.add('selected');
  document.getElementById('e-dep-options').classList.remove('open');
  document.getElementById('e-dep-trigger').classList.remove('open');
  calcExit();
}
document.addEventListener('click',function(e){
  var wrap=document.getElementById('e-dep-wrap');
  if(wrap&&!wrap.contains(e.target)){
    document.getElementById('e-dep-options').classList.remove('open');
    var t=document.getElementById('e-dep-trigger');if(t)t.classList.remove('open');
  }
});
function openPrivacy(e){e.preventDefault();document.getElementById('priv-modal-overlay').classList.add('open');}
function closePrivacy(){document.getElementById('priv-modal-overlay').classList.remove('open');}
function openTerms(e){e.preventDefault();document.getElementById('terms-modal-overlay').classList.add('open');}
function closeTerms(){document.getElementById('terms-modal-overlay').classList.remove('open');}
function toggleTip(ev,id){ev.stopPropagation();document.querySelectorAll('.tooltip-box').forEach(t=>{if(t.id!==id)t.classList.remove('open');});document.getElementById(id).classList.toggle('open');}
function closeTip(id){document.getElementById(id).classList.remove('open');}
document.addEventListener('click',function(ev){if(!ev.target.classList.contains('info-btn'))document.querySelectorAll('.tooltip-box').forEach(t=>t.classList.remove('open'));});
function acts(list){return list.map((a,i)=>`<div class="ai"><div class="an ${['a1','a2','a3'][i]}">${i+1}</div><div><div class="at">${a.t}</div>${a.s?`<div class="am" style="font-size:11px;color:#6b7280;margin-top:3px;">${a.s}</div>`:''}</div></div>`).join('');}

function cashFieldValidate(inputId,errId){
  var el=document.getElementById(inputId);
  var err=document.getElementById(errId);
  var wrapper=el.closest('.ir')||document.getElementById(inputId+'-trigger');
  if(el.validity&&el.validity.badInput){
    if(wrapper)wrapper.classList.add('input-error');
    if(err){err.textContent='Numbers only';err.classList.add('show');}
    return false;
  }else if(el.value===''||(inputId!=='c-dso'&&parseFloat(el.value)<=0)){
    if(wrapper)wrapper.classList.add('input-error');
    if(err){err.textContent='Please complete';err.classList.add('show');}
    return false;
  }else{
    if(wrapper)wrapper.classList.remove('input-error');
    if(err){err.classList.remove('show');}
    return true;
  }
}
function cashFieldFocus(inputId,errId){
  var el=document.getElementById(inputId);
  var err=document.getElementById(errId);
  if(!el)return;
  var wrapper=el.closest('.ir')||document.getElementById(inputId+'-trigger');
  if(wrapper)wrapper.classList.remove('input-error');
  if(err)err.classList.remove('show');
}
document.addEventListener('DOMContentLoaded',function(){
  var rev=document.getElementById('c-rev');
  var dso=document.getElementById('c-dso');
  if(rev){
    rev.addEventListener('input',function(){
      if(rev.validity&&rev.validity.badInput){cashFieldValidate('c-rev','c-rev-err');}
      else if(rev.value&&parseFloat(rev.value)>0){cashFieldFocus('c-rev','c-rev-err');}
    });
    rev.addEventListener('blur',function(){
      if(rev.value&&parseFloat(rev.value)>0){
        cashFieldFocus('c-rev','c-rev-err');
        if(dso)dso.focus();
      }else{
        cashFieldValidate('c-rev','c-rev-err');
      }
    });
  }
  if(dso){
    dso.addEventListener('input',function(){
      if(dso.validity&&dso.validity.badInput){cashFieldValidate('c-dso','c-dso-err');}
      else if(dso.value&&parseFloat(dso.value)>0){cashFieldFocus('c-dso','c-dso-err');}
    });
    dso.addEventListener('blur',function(){cashFieldValidate('c-dso','c-dso-err');});
  }
  var gnc=document.getElementById('g-nc');
  var gap=document.getElementById('g-ap');
  if(gnc){
    gnc.addEventListener('input',function(){
      if(gnc.validity&&gnc.validity.badInput){cashFieldValidate('g-nc','g-nc-err');}
      else if(gnc.value&&parseFloat(gnc.value)>0){cashFieldFocus('g-nc','g-nc-err');}
    });
    gnc.addEventListener('blur',function(){cashFieldValidate('g-nc','g-nc-err');});
  }
  if(gap){
    gap.addEventListener('input',function(){
      if(gap.validity&&gap.validity.badInput){cashFieldValidate('g-ap','g-ap-err');}
      else if(gap.value&&parseFloat(gap.value)>0){cashFieldFocus('g-ap','g-ap-err');}
    });
    gap.addEventListener('blur',function(){cashFieldValidate('g-ap','g-ap-err');});
  }
  ['e-pro','e-yr'].forEach(function(id){
    var el=document.getElementById(id);
    var errId=id+'-err';
    if(el){
      el.addEventListener('input',function(){
        if(el.validity&&el.validity.badInput){cashFieldValidate(id,errId);}
        else if(el.value&&parseFloat(el.value)>0){cashFieldFocus(id,errId);}
      });
      el.addEventListener('blur',function(){cashFieldValidate(id,errId);});
    }
  });
});
function cashStartOver(){
  document.getElementById('c-rev').value='';
  document.getElementById('c-dso').value='';
  cashFieldFocus('c-rev','c-rev-err');
  cashFieldFocus('c-dso','c-dso-err');
  var t=document.getElementById('cash-thinking');if(t){t.style.display='none';t.classList.remove('visible');}
  var overlay=document.getElementById('card-thinking-overlay');if(overlay){overlay.classList.remove('visible');}
  var cardInner=document.getElementById('cash-card-inner');
  var sum=document.getElementById('cash-input-summary');
  var chat2=document.getElementById('v2-cash-chat-2');if(chat2)chat2.remove();
  if(sum&&sum.classList.contains('vis')){
    sum.classList.remove('vis');
    setTimeout(function(){
      sum.style.display='none';
      if(cardInner){cardInner.style.opacity='0';cardInner.style.display='';requestAnimationFrame(function(){requestAnimationFrame(function(){cardInner.style.opacity='1';});});}
    },350);
  } else {
    if(cardInner){cardInner.style.display='';cardInner.style.opacity='1';}
  }
  var doneDot=document.querySelector('#s-cash .dot.done:last-child');if(doneDot){doneDot.classList.remove('done');doneDot.classList.add('active');}
  var p2=document.getElementById('cash-phase2');if(p2)p2.classList.remove('visible');
  var p3=document.getElementById('cash-phase3');if(p3)p3.classList.remove('visible');
  var cAcEl=document.getElementById('c-ac');if(cAcEl){cAcEl.innerHTML='';cAcEl._shown=false;}
  var cAcBtn=document.getElementById('c-ac-btn');if(cAcBtn)cAcBtn.style.display='';
  var cAcThink=document.getElementById('c-ac-thinking');if(cAcThink)cAcThink.style.display='none';
  window.scrollTo({top:0,behavior:'smooth'});
  setTimeout(function(){var r=document.getElementById('c-rev');if(r)r.focus();},400);
}
function startCash(){
  var rev=parseFloat(document.getElementById('c-rev').value)||0;
  var dso=parseFloat(document.getElementById('c-dso').value)||0;
  var revOk=cashFieldValidate('c-rev','c-rev-err');
  var dsoOk=cashFieldValidate('c-dso','c-dso-err');
  if(!revOk||!dsoOk){if(!revOk)document.getElementById('c-rev').focus();else document.getElementById('c-dso').focus();return;}
  var cardInner=document.getElementById('cash-card-inner');
  var overlay=document.getElementById('card-thinking-overlay');
  var fill=document.getElementById('thinking-fill');
  var p2=document.getElementById('cash-phase2');
  var p3=document.getElementById('cash-phase3');
  if(p2)p2.classList.remove('visible');
  if(p3)p3.classList.remove('visible');
  if(cardInner)cardInner.style.display='none';
  if(fill){fill.style.animation='none';fill.offsetHeight;fill.style.animation='';}
  if(overlay)overlay.classList.add('visible');
  calcCash();
  setTimeout(function(){
    if(overlay){overlay.classList.remove('visible');overlay.style.display='';}
    var sum=document.getElementById('cash-input-summary');
    var revV=document.getElementById('c-rev').value;
    var dsoV=document.getElementById('c-dso').value;
    if(sum&&revV){
      var sr=document.getElementById('c-sum-rev');
      var sd=document.getElementById('c-sum-dso');
      if(sr)sr.textContent='$'+parseFloat(revV).toLocaleString();
      if(sd)sd.innerHTML='Currently <span class="sum-num">'+dsoV+'</span> days to get paid';
      sum.style.display='flex';
      requestAnimationFrame(function(){requestAnimationFrame(function(){sum.classList.add('vis');});});
    }
    if(p2)p2.classList.add('visible');
    var activeDot=document.querySelector('#s-cash .dot.active');
    if(activeDot){activeDot.classList.remove('active');activeDot.classList.add('done');}
  },4000);
}
function updateSliderTicks(sliderId,tickVals){
  var sl=document.getElementById(sliderId);
  if(!sl)return;
  var val=parseFloat(sl.value);
  var tickDiv=sl.nextElementSibling;
  if(!tickDiv||!tickDiv.classList.contains('sl'))return;
  var spans=tickDiv.querySelectorAll('span');
  spans.forEach(function(sp,i){sp.classList.toggle('sl-active',tickVals[i]!==undefined&&val===tickVals[i]);});
}

async function calcCash(){
  const rev=parseFloat(document.getElementById('c-rev').value)||0;
  const dso=parseFloat(document.getElementById('c-dso').value)||0;
  const tgt=parseFloat(document.getElementById('c-sl').value)||30;
  const r=await api('cash',{rev,dso,tgt});
  if(!r) return;
  document.getElementById('c-td').textContent=Math.round(r.tgt)+' days';
  updateSliderTicks('c-sl',[0,30,60,90]);
  document.getElementById('cash-ins').innerHTML=`<div class="ib ${r.danger?'danger':'sage'}"><div class="irow"><div class="ival">${f(r.trapped)}</div><div class="ilbl">you've earned... but can't use. This is why your cash feels tight.</div></div></div>`;
  // red/green state handled in CSS via .c-sage / .c-danger classes (:has rules)
  document.getElementById('c-fr').textContent=f(Math.abs(r.freed));
  document.getElementById('c-fr').className='rv '+(r.freed>=0?'c-sage':'c-danger');
  document.getElementById('c-fn').textContent=r.tgtLessThanDso?'back in your bank account':'still not in your bank account';
  document.getElementById('c-fn').className='rn '+(r.tgtLessThanDso?'c-sage':'c-danger');
  var cAcEl=document.getElementById('c-ac');if(cAcEl&&!cAcEl._shown){cAcEl.innerHTML='';}
}
function renderCashActions(){
  document.getElementById('c-ac').innerHTML=acts([
    {t:'Send payment reminders before invoices are due.',s:'A reminder 7 days before the due date can speed up payments.'},
    {t:'Ask for a deposit on new jobs.',s:'Even 30% upfront reduces pressure on your cash.'},
    {t:'Offer a small incentive for early payment.',s:'A small discount can help you get paid sooner.'}
  ]);
}
function showCashActions(){
  var btn=document.getElementById('c-ac-btn');
  var thinking=document.getElementById('c-ac-thinking');
  var fill=document.getElementById('c-ac-fill');
  var ac=document.getElementById('c-ac');
  if(btn)btn.style.display='none';
  ac.innerHTML='';
  if(fill){fill.style.animation='none';fill.offsetHeight;fill.style.animation='';}
  if(thinking)thinking.style.display='block';
  setTimeout(function(){
    if(thinking)thinking.style.display='none';
    if(btn)btn.style.display='';
    ac._shown=true;
    renderCashActions();
  },4000);
}

function startGrow(){
  var ncOk=cashFieldValidate('g-nc','g-nc-err');
  var apOk=cashFieldValidate('g-ap','g-ap-err');
  if(!ncOk||!apOk){if(!ncOk)document.getElementById('g-nc').focus();else document.getElementById('g-ap').focus();return;}
  var cardInner=document.getElementById('grow-card-inner');
  var overlay=document.getElementById('grow-thinking-overlay');
  var fill=document.getElementById('grow-thinking-fill');
  var p2=document.getElementById('grow-phase2');
  if(p2)p2.classList.remove('visible');
  if(cardInner)cardInner.style.display='none';
  if(fill){fill.style.animation='none';fill.offsetHeight;fill.style.animation='';}
  if(overlay)overlay.classList.add('visible');
  calcGrow();
  setTimeout(function(){
    if(overlay){overlay.classList.remove('visible');overlay.style.display='';}
    if(cardInner)cardInner.style.display='none';
    var sum=document.getElementById('grow-input-summary');
    var ncV=document.getElementById('g-nc').value;
    var apV=document.getElementById('g-ap').value;
    if(sum&&ncV){
      var sNc=document.getElementById('g-sum-nc');
      var sAp=document.getElementById('g-sum-ap');
      if(sNc)sNc.textContent=ncV+' clients';
      if(sAp)sAp.textContent='$'+parseFloat(apV).toLocaleString()+' avg job';
      sum.style.display='flex';
      requestAnimationFrame(function(){requestAnimationFrame(function(){sum.classList.add('vis');});});
    }
    if(p2)p2.classList.add('visible');
    window.scrollTo({top:0,behavior:'smooth'});
  },4000);
}
function growStartOver(){
  var overlay=document.getElementById('grow-thinking-overlay');
  var cardInner=document.getElementById('grow-card-inner');
  var p2=document.getElementById('grow-phase2');
  if(overlay){overlay.classList.remove('visible');overlay.style.display='';}
  if(cardInner)cardInner.style.display='';
  var sum=document.getElementById('grow-input-summary');
  if(sum){sum.classList.remove('vis');sum.style.display='none';}
  if(p2)p2.classList.remove('visible');
  document.getElementById('g-nc').value='';
  document.getElementById('g-ap').value='';
  cashFieldFocus('g-nc','g-nc-err');
  cashFieldFocus('g-ap','g-ap-err');
  var gAcEl=document.getElementById('g-ac');if(gAcEl){gAcEl.innerHTML='';gAcEl._shown=false;}
  var gAcBtn=document.getElementById('g-ac-btn');if(gAcBtn)gAcBtn.style.display='';
  var gAcThink=document.getElementById('g-ac-thinking');if(gAcThink)gAcThink.style.display='none';
  window.scrollTo({top:0,behavior:'smooth'});
  setTimeout(function(){var el=document.getElementById('g-nc');if(el)el.focus();},300);
}

async function calcGrow(){
  const c=parseInt(document.getElementById('g-nc').value)||12;
  const p=parseFloat(document.getElementById('g-ap').value)||850;
  const pi=parseInt(document.getElementById('g-pi').value)||0;
  const ni=parseInt(document.getElementById('g-ni').value)||0;
  var gPd=document.getElementById('g-pd'); if(gPd) gPd.textContent=pi+'%';
  var gCd=document.getElementById('g-cd'); if(gCd) gCd.textContent=ni;
  updateSliderTicks('g-ni',[0,10,20,30]);
  const r=await api('grow',{c,p,pi,ni});
  if(!r) return;
  const gt=r.gp+r.gc;
  document.getElementById('grow-ins').innerHTML=`<div class="ib ${r.lo?'warn':'forest'}"><div class="irow" style="align-items:flex-end;"><div style="display:flex;flex-direction:column;"><div style="font-size:11px;color:#6b7280;margin-bottom:2px;">Current</div><div class="ival">${f(r.cur)}</div></div><div class="ilbl" style="margin-top:0;padding-bottom:12px;">per year from ${c} jobs at ${f(p)} each.</div></div></div>`;
  document.getElementById('g-nr').textContent=f(r.nw);
  document.getElementById('g-ns').textContent=gt>0?`+${f(gt)} per year`:'select an option above';
  var gGp=document.getElementById('g-gp'); if(gGp) gGp.textContent=f(r.gp);
  var gpWrap=document.getElementById('g-gp-wrap');
  if(gpWrap){var leftPct=(pi/50)*100;var cw=gpWrap.parentElement.offsetWidth||300;var lw=gpWrap.offsetWidth||140;var leftPx=(leftPct/100)*cw;var clampedPx=Math.max(lw/2,Math.min(leftPx,cw-lw/2));gpWrap.style.left=(clampedPx/cw*100)+'%';}
  var gGc=document.getElementById('g-gc'); if(gGc) gGc.textContent=f(r.gc);
  var gcWrap=document.getElementById('g-gc-wrap');
  if(gcWrap){var leftPct2=(ni/30)*100;var cw2=gcWrap.parentElement.offsetWidth||300;var lw2=gcWrap.offsetWidth||140;var leftPx2=(leftPct2/100)*cw2;var clampedPx2=Math.max(lw2/2,Math.min(leftPx2,cw2-lw2/2));gcWrap.style.left=(clampedPx2/cw2*100)+'%';}
  // projected box turns green when an uplift is selected
  var gNrEl=document.getElementById('g-nr');
  var projBox=gNrEl?gNrEl.closest('.cb'):null;
  if(projBox){
    projBox.style.background=gt>0?'#d4edda':'#f9fafb';
    projBox.style.border=gt>0?'1px solid #a8d5b5':'0.5px solid #e5e7eb';
    projBox.style.borderRadius='8px';
    projBox.style.padding='12px';
    var ns=document.getElementById('g-ns');
    gNrEl.style.color=gt>0?'#2d6a4f':'#1a1a1a';
    if(ns) ns.style.color=gt>0?'#2d6a4f':'#6b7280';
  }
  var gAcEl=document.getElementById('g-ac');if(gAcEl&&!gAcEl._shown){gAcEl.innerHTML='';}
}
function renderGrowActions(){
  document.getElementById('g-ac').innerHTML=acts([
    {t:'Try a small price increase on your next few jobs.',s:'Even a small increase can make a bigger difference than taking on more work.'},
    {t:'Your highest paying job last month. That\'s the work to go get more of.',s:'More work doesn\'t always mean more profit. The type of work matters.'},
    {t:'Stop underpricing repeat work.',s:'Long term clients often stay at old rates. This adds up over time.'}
  ]);
}
function showGrowActions(){
  var btn=document.getElementById('g-ac-btn');
  var thinking=document.getElementById('g-ac-thinking');
  var fill=document.getElementById('g-ac-fill');
  var ac=document.getElementById('g-ac');
  if(btn)btn.style.display='none';
  ac.innerHTML='';
  if(fill){fill.style.animation='none';fill.offsetHeight;fill.style.animation='';}
  if(thinking)thinking.style.display='block';
  setTimeout(function(){
    if(thinking)thinking.style.display='none';
    if(btn)btn.style.display='';
    ac._shown=true;
    renderGrowActions();
  },4000);
}

function startExit(){
  var proOk=cashFieldValidate('e-pro','e-pro-err');
  var yrOk=cashFieldValidate('e-yr','e-yr-err');
  if(!proOk||!yrOk){if(!proOk)document.getElementById('e-pro').focus();else document.getElementById('e-yr').focus();return;}
  var cardInner=document.getElementById('exit-card-inner');
  var overlay=document.getElementById('exit-thinking-overlay');
  var fill=document.getElementById('exit-thinking-fill');
  var p2=document.getElementById('exit-phase2');
  if(p2)p2.classList.remove('visible');
  if(cardInner)cardInner.style.display='none';
  if(fill){fill.style.animation='none';fill.offsetHeight;fill.style.animation='';}
  if(overlay)overlay.classList.add('visible');
  calcExit();
  setTimeout(function(){
    if(overlay){overlay.classList.remove('visible');overlay.style.display='';}
    var sum=document.getElementById('exit-input-summary');
    var proV=document.getElementById('e-pro').value;
    var yrV=document.getElementById('e-yr').value;
    if(sum&&proV){
      var sPro=document.getElementById('e-sum-pro');
      var sYr=document.getElementById('e-sum-yr');
      if(sPro)sPro.textContent='$'+parseFloat(proV).toLocaleString()+' profit';
      if(sYr)sYr.textContent=yrV+' yrs trading';
      sum.style.display='flex';
      requestAnimationFrame(function(){requestAnimationFrame(function(){sum.classList.add('vis');});});
    }
    if(p2)p2.classList.add('visible');
    window.scrollTo({top:0,behavior:'smooth'});
  },4000);
}
function exitStartOver(){
  var overlay=document.getElementById('exit-thinking-overlay');
  var cardInner=document.getElementById('exit-card-inner');
  var p2=document.getElementById('exit-phase2');
  var sum=document.getElementById('exit-input-summary');
  if(overlay){overlay.classList.remove('visible');overlay.style.display='';}
  if(sum){sum.classList.remove('vis');sum.style.display='none';}
  if(cardInner)cardInner.style.display='';
  if(p2)p2.classList.remove('visible');
  document.getElementById('e-pro').value='';
  document.getElementById('e-yr').value='';
  var eAcEl=document.getElementById('e-ac');if(eAcEl){eAcEl.innerHTML='';eAcEl._shown=false;}
  var eAcBtn=document.getElementById('e-ac-btn');if(eAcBtn)eAcBtn.style.display='';
  var eAcThink=document.getElementById('e-ac-thinking');if(eAcThink)eAcThink.style.display='none';
  cashFieldFocus('e-pro','e-pro-err');
  cashFieldFocus('e-yr','e-yr-err');
  window.scrollTo({top:0,behavior:'smooth'});
  setTimeout(function(){var el=document.getElementById('e-pro');if(el)el.focus();},300);
}

async function calcExit(){
  const profit=parseFloat(document.getElementById('e-pro').value)||500000;
  const years=parseInt(document.getElementById('e-yr').value)||8;
  const dep=document.getElementById('e-dep').value;
  const pi=parseInt(document.getElementById('e-pi').value)||0;
  var eDiEl=document.getElementById('e-di');
  const di=eDiEl?parseInt(eDiEl.value):-1;
  var ePd=document.getElementById('e-pd'); if(ePd) ePd.textContent=pi+'%';
  const nothingSelected=(di<0&&pi===0);
  const r=await api('exit',{profit,years,dep,pi,di,nothingSelected});
  if(!r) return;
  document.getElementById('exit-ins').innerHTML=`<div class="ib ${r.isDanger?'danger':'sage'}"><div class="irow"><div class="ival">${f(r.curVal)}</div><div class="ilbl">Estimated current value.</div></div></div>`;
  document.getElementById('e-nv').textContent=f(r.newVal);
  document.getElementById('e-ns').textContent=nothingSelected?'select an option above':'+'+f(r.uplift)+' uplift';
  document.getElementById('e-rd').innerHTML=r.checks.map(ch=>`<div class="ritem"><div class="rdot" style="background:${ch.ok?'#7a9485':'#c0392b'};"></div><div class="rtxt">${ch.l}</div><div class="rs" style="color:${ch.ok?'#4a6b58':'#7a2a1a'};">${ch.ok?'Good':'This is holding your value back'}</div></div>`).join('');
}
function showExitActions(){
  var btn=document.getElementById('e-ac-btn');
  var thinking=document.getElementById('e-ac-thinking');
  var fill=document.getElementById('e-ac-fill');
  var ac=document.getElementById('e-ac');
  if(btn)btn.style.display='none';
  ac.innerHTML='';
  if(fill){fill.style.animation='none';fill.offsetHeight;fill.style.animation='';}
  if(thinking)thinking.style.display='block';
  setTimeout(function(){
    if(thinking)thinking.style.display='none';
    if(btn)btn.style.display='';
    renderExitActions();
  },4000);
}
var _lastProfit=-1,_lastDep=-1,_lastYrs=-1;
function pickNext(opts,last){var idx=opts.length<2?0:(last===-1?Math.floor(Math.random()*opts.length):(last+1)%opts.length);return{idx:idx,item:opts[idx]};}
function renderExitActions(){
  var dep=document.getElementById('e-dep').value;
  var years=parseInt(document.getElementById('e-yr').value)||5;
  var di=parseInt(document.getElementById('e-di').value)||1;
  var exitActs=[];
  var profitOpts=[
    {t:'Raise your prices on your next few jobs.',s:'Even small increases make a big difference to what your business is worth.'},
    {t:'Make sure your pricing covers your real costs.',s:'Labour, materials. Not just what the competitors charge.'}
  ];
  var pr=pickNext(profitOpts,_lastProfit);_lastProfit=pr.idx;exitActs.push(pr.item);
  var depOpts=[
    {t:'Pick one task this month and have someone else handle it.',s:"Buyers don't want a business that only works if you're there."},
    {t:'Step away for a day and see what breaks.',s:'That shows you exactly what depends on you.'}
  ];
  if(dep==='high'||dep==='med'||di<2){var dr=pickNext(depOpts,_lastDep);_lastDep=dr.idx;exitActs.push(dr.item);}
  var yrsOpts=[
    {t:'Get a clear view of your numbers (not just your bank balance).',s:'You should be able to quickly see revenue, costs, profit. This is what buyers look at first.'},
    {t:'Get your numbers clean before anyone looks at them.',s:'Messy numbers = low offers.'}
  ];
  if(years<5){var yr=pickNext(yrsOpts,_lastYrs);_lastYrs=yr.idx;exitActs.push(yr.item);}
  if(exitActs.length<3)exitActs.push({t:'Get your numbers clean and ready for review.',s:'Messy numbers = low offers.'});
  if(exitActs.length<3)exitActs.push({t:'Write down how your business runs. Systems, contacts, pricing.',s:'A business that lives in your head is worth less than one on paper.'});
  document.getElementById('e-ac').innerHTML=acts(exitActs);
}
// calculations run when each flow starts — no page-load API calls needed

/* ============================================================
   ADDY v2 OVERLAY — conversational chat, chips, render fns
   ============================================================ */
(function(){
  if (window.__addyV2Installed) return;
  window.__addyV2Installed = true;

  function $(id){return document.getElementById(id);}
  function el(tag, attrs, children){
    var e=document.createElement(tag);
    if(attrs){for(var k in attrs){if(k==='class')e.className=attrs[k];else if(k==='style')e.style.cssText=attrs[k];else e.setAttribute(k,attrs[k]);}}
    if(children){children.forEach(function(c){e.appendChild(typeof c==='string'?document.createTextNode(c):c);});}
    return e;
  }

  function findMascotSrc(cardId){
    var card=$(cardId);
    if(!card) return null;
    var img=card.querySelector('.card-addy img, [class*="card-addy"] img, img[alt="Addy"]');
    if(img) return img.src;
    var any=card.querySelector('img');
    return any?any.src:null;
  }

  function removeDashes(root){
    if(!root) return;
    var walker=document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var node;
    while((node=walker.nextNode())){
      var t=node.nodeValue;
      if(!t) continue;
      var nt=t
        .replace(/\s?[—–]\s?/g, ' ')
        .replace(/\s+—\s+/g,' ')
        .replace(/([a-zA-Z0-9])\s+-\s+([a-zA-Z0-9])/g,'$1 $2')
        .replace(/\s{2,}/g,' ');
      if(nt!==t) node.nodeValue=nt;
    }
  }

  // ============ CASH: CONVERSATIONAL CHAT ============
  function renderCash(){
    var host=$('cash-ins');
    if(!host) return;
    var phase2=$('cash-phase2');
    if(!phase2) return;
    var existing=$('v2-cash-chat'); if(existing) existing.remove();
    var existing2=$('v2-cash-chat-2'); if(existing2) existing2.remove();
    var val=(host.querySelector('.ival')||{}).textContent||'$0';

    var sliderCard=phase2.querySelector('.card');
    if(sliderCard) sliderCard.style.display='none';

    var wrap=el('div',{id:'v2-cash-chat',class:'v2-chat'});
    var mascot=el('div',{class:'v2-chat-mascot'});
    (function(){var s=document.querySelector('#cash-input-card .card-addy img');if(s)mascot.appendChild(el('img',{src:s.src,alt:'Addy'}));})();
    var stream=el('div',{class:'v2-chat-stream'});
    wrap.appendChild(mascot); wrap.appendChild(stream);
    phase2.insertBefore(wrap, phase2.firstChild);

    var b1=el('div',{class:'v2-bubble v2-first'});
    b1.innerHTML='Okay, I had a look at your numbers. Here is what I found.';
    stream.appendChild(b1);

    setTimeout(function(){
      var b2=el('div',{class:'v2-bubble hero cash-gap-red v2-fade-in v2-mid'});
      b2.innerHTML='<div class="v2-tag">cash gap</div><div class="v2-big">'+val+'</div><div class="v2-cap">is earned but stuck in unpaid invoices. That is why things feel tight.</div>';
      stream.appendChild(b2);

      setTimeout(function(){
        var t1=el('div',{class:'v2-typing',id:'v2-cash-t1'});
        t1.innerHTML='<span></span><span></span><span></span>';
        stream.appendChild(t1);

        setTimeout(function(){
          if(t1.parentNode) t1.remove();
          var b3=el('div',{class:'v2-bubble v2-fade-in v2-last'});
          b3.innerHTML='Want to see what changes if you got paid sooner? Try one of the options below.';
          stream.appendChild(b3);

          setTimeout(function(){
            if(sliderCard){
              sliderCard.style.display='';
              sliderCard.classList.add('v2-fade-in');
              stream.appendChild(sliderCard);
              var shLabel=sliderCard.querySelector('.sh .st');
              if(shLabel && /when.*paid/i.test(shLabel.textContent)) shLabel.textContent='If you got paid in';
            }

            setTimeout(function(){
              var wrap2=el('div',{id:'v2-cash-chat-2',class:'v2-chat'});
              var mascot2=el('div',{class:'v2-chat-mascot'});
              (function(){var s=document.querySelector('#cash-input-card .card-addy img');if(s)mascot2.appendChild(el('img',{src:s.src,alt:'Addy'}));})();
              var stream2=el('div',{class:'v2-chat-stream'});
              wrap2.appendChild(mascot2); wrap2.appendChild(stream2);
              var afterCard=sliderCard?sliderCard.nextSibling:null;
              if(afterCard) phase2.insertBefore(wrap2,afterCard); else phase2.appendChild(wrap2);

              var t2=el('div',{class:'v2-typing',id:'v2-cash-t2'});
              t2.innerHTML='<span></span><span></span><span></span>';
              stream2.appendChild(t2);

              setTimeout(function(){
                if(t2.parentNode) t2.remove();
                var b4=el('div',{class:'v2-bubble v2-fade-in'});
                b4.innerHTML='Would you like 3 simple things to focus on this month, to help turn tight cash into cash flow?';
                var showBtn=document.createElement('button');
                showBtn.id='v2-cash-show-btn';
                showBtn.className='v2-show-btn';
                showBtn.innerHTML='Show me, <span style="color:#6abf7a;">ADDY<span style="color:var(--forest)">!</span></span>';
                showBtn.onclick=function(){
                  showBtn.style.display='none';
                  var t3=el('div',{class:'v2-typing',id:'v2-cash-t3',style:'margin-top:10px;'});
                  t3.innerHTML='<span></span><span></span><span></span>';
                  b4.appendChild(t3);
                  setTimeout(function(){
                    if(t3.parentNode) t3.remove();
                    var p3=document.getElementById('cash-phase3');
                    if(p3) p3.classList.add('visible');
                    renderCashActions();
                    var cAcEl=document.getElementById('c-ac');
                    if(cAcEl) cAcEl._shown=true;
                    appendFeedback(document.querySelector('#s-cash .results-page'),'cash');
                    setTimeout(function(){
                      var ac=document.getElementById('c-ac');
                      if(ac) ac.scrollIntoView({behavior:'smooth',block:'nearest'});
                    },300);
                  },4000);
                };
                b4.appendChild(showBtn);
                stream2.appendChild(b4);
              },1800);
            },800);
          },400);
        },1800);
      },400);
    },300);
  }

  // ============ GROW: SCENARIO TABS + CHAT ============
  function renderGrow(){
    var host=$('grow-ins');
    if(!host) return;
    var phase2=$('grow-phase2');
    if(!phase2) return;
    var mascotSrc=findMascotSrc('grow-input-card');
    var orphanCard=phase2.querySelector('.card[data-v2-tabbed]');
    if(orphanCard){orphanCard.dataset.v2Tabbed='';phase2.appendChild(orphanCard);}
    var orphanAc=phase2.querySelector('.g-ac-card');
    if(orphanAc){orphanAc.style.display='none';phase2.appendChild(orphanAc);}
    var existing=$('v2-grow-chat'); if(existing) existing.remove();
    var existing2=$('v2-grow-chat-2'); if(existing2) existing2.remove();
    var existingCta=phase2.querySelector('.grow-cta-box'); if(existingCta) existingCta.remove();
    var val=(host.querySelector('.ival')||{}).textContent||'$0';

    var chipsCard=phase2.querySelector('.card');
    if(chipsCard) chipsCard.style.display='none';

    var wrap=el('div',{id:'v2-grow-chat',class:'v2-chat'});
    var mascot=el('div',{class:'v2-chat-mascot'});
    if(mascotSrc){var m=el('img',{src:mascotSrc,alt:'Addy'});mascot.appendChild(m);}
    var stream=el('div',{class:'v2-chat-stream'});
    wrap.appendChild(mascot); wrap.appendChild(stream);
    phase2.insertBefore(wrap, phase2.firstChild);

    var b1=el('div',{class:'v2-bubble v2-first'});
    b1.innerHTML='Okay, I had a look at your numbers. Here is what I found.';
    stream.appendChild(b1);

    setTimeout(function(){
      var t1=el('div',{class:'v2-typing',id:'v2-grow-t1'});
      t1.innerHTML='<span></span><span></span><span></span>';
      stream.appendChild(t1);

      setTimeout(function(){
        if(t1.parentNode) t1.remove();
        var b2=el('div',{class:'v2-bubble hero v2-fade-in v2-mid'});
        b2.innerHTML='<div class="v2-tag">your revenue today</div><div class="v2-big">'+val+'</div><div class="v2-cap">per year from the numbers you gave me.</div>';
        stream.appendChild(b2);

        setTimeout(function(){
          var t2=el('div',{class:'v2-typing',id:'v2-grow-t2'});
          t2.innerHTML='<span></span><span></span><span></span>';
          stream.appendChild(t2);

          setTimeout(function(){
            if(t2.parentNode) t2.remove();
            var b3=el('div',{class:'v2-bubble v2-fade-in v2-last'});
            b3.innerHTML='There are two ways to grow from here. Try the options below.';
            stream.appendChild(b3);

            setTimeout(function(){
              if(chipsCard){
                chipsCard.style.display='';
                chipsCard.classList.add('v2-fade-in');
                stream.appendChild(chipsCard);
              }

              setTimeout(function(){
                var wrap2=el('div',{id:'v2-grow-chat-2',class:'v2-chat'});
                var mascot2=el('div',{class:'v2-chat-mascot'});
                if(mascotSrc){var m2=el('img',{src:mascotSrc,alt:'Addy'});mascot2.appendChild(m2);}
                var stream2=el('div',{class:'v2-chat-stream'});
                wrap2.appendChild(mascot2); wrap2.appendChild(stream2);
                phase2.appendChild(wrap2);

                var t3=el('div',{class:'v2-typing',id:'v2-grow-t3'});
                t3.innerHTML='<span></span><span></span><span></span>';
                stream2.appendChild(t3);

                setTimeout(function(){
                  if(t3.parentNode) t3.remove();
                  var b4=el('div',{class:'v2-bubble v2-fade-in'});
                  b4.innerHTML='Would you like 3 simple things to focus on this month to help you grow?';
                  var showBtn=el('button',{class:'v2-show-btn',id:'v2-grow-show-btn',style:'margin-top:10px;'});
                  showBtn.innerHTML='Show me, <span style="color:#6abf7a;">ADDY<span style="color:var(--forest)">!</span></span>';
                  b4.appendChild(showBtn);
                  stream2.appendChild(b4);

                  var ctaBox=document.createElement('div');
                  ctaBox.className='grow-cta-box cta-box';
                  ctaBox.setAttribute('style','display:flex;align-items:flex-end;gap:1.5rem;');
                  ctaBox.innerHTML='<div style="flex:1;text-align:left;"><p>Not sure what your numbers are really telling you?</p><p style="margin-top:0.5rem;">Let\'s walk through yours together. It\'s a FREE 30 minute call.</p><button class="btn" style="margin-top:0.5rem;" onclick="window.open(\'https://www.addvantage.ca/contact\')">Walk me through my numbers.</button><div style="margin-top:0.5rem;"><a href="https://www.addvantage.ca/about" target="_blank" style="font-size:11px;color:#c9a84c;text-decoration:underline;font-weight:600;">Learn more about Michelle</a></div></div>';
                  phase2.appendChild(ctaBox);

                  setTimeout(function(){b4.scrollIntoView({behavior:'smooth',block:'nearest'});},200);
                  showBtn.onclick=function(){
                    showBtn.style.display='none';
                    var t4=el('div',{class:'v2-typing',id:'v2-grow-t4',style:'margin-top:10px;'});
                    t4.innerHTML='<span></span><span></span><span></span>';
                    b4.appendChild(t4);
                    setTimeout(function(){
                      if(t4.parentNode) t4.remove();
                      var acCard=phase2.querySelector('.g-ac-card');
                      if(acCard){
                        acCard.style.display='';
                        acCard.classList.add('v2-fade-in');
                        stream2.appendChild(acCard);
                      }
                      renderGrowActions();
                      var gAcEl=document.getElementById('g-ac');
                      if(gAcEl) gAcEl._shown=true;
                      appendFeedback(phase2,'grow');
                      setTimeout(function(){
                        if(gAcEl) gAcEl.scrollIntoView({behavior:'smooth',block:'nearest'});
                      },300);
                    },4000);
                  };
                },1800);
              },1200);
            },400);
          },1200);
        },600);
      },1000);
    },800);

    // Build chip-based scenario card
    var slidersCard=phase2.querySelector('.card');
    if(!slidersCard || slidersCard.dataset.v2Tabbed) return;
    slidersCard.dataset.v2Tabbed='1';

    var priceSlider=slidersCard.querySelector('#g-pi');
    var volSlider=slidersCard.querySelector('#g-ni');
    var proj=slidersCard.querySelector('.cmp');

    function buildChipRow(label,presets,slider,resetOther){
      var wrap=el('div',{class:'v2-chips-wrap'});
      var lbl=el('div',{class:'v2-chips-label'});
      lbl.textContent=label;
      var row=el('div',{class:'v2-chips'});
      presets.forEach(function(p){
        var b=el('button',{type:'button',class:'v2-chip'});
        b.textContent=p.label;
        b.dataset.val=p.val;
        b.addEventListener('click',function(){
          if(resetOther){resetOther.value=0;}
          slider.value=p.val;
          row.querySelectorAll('.v2-chip').forEach(function(c){c.classList.toggle('on',c===b);});
          if(typeof calcGrow==='function') try{calcGrow();}catch(e){}
        });
        row.appendChild(b);
      });
      wrap.appendChild(lbl);
      wrap.appendChild(row);
      return wrap;
    }

    var priceChips=buildChipRow('Try a price increase...',[
      {val:5,label:'5%'},{val:10,label:'10%'},{val:15,label:'15%'},{val:20,label:'20%'}
    ],priceSlider,volSlider);

    var volChips=buildChipRow('Or take on more jobs...',[
      {val:2,label:'+2 jobs'},{val:5,label:'+5 jobs'},{val:10,label:'+10 jobs'},{val:15,label:'+15 jobs'}
    ],volSlider,priceSlider);

    slidersCard.innerHTML='';
    slidersCard.appendChild(priceChips);
    slidersCard.appendChild(volChips);
    if(proj) slidersCard.appendChild(proj);

    if(priceSlider) slidersCard.appendChild(priceSlider);
    if(volSlider) slidersCard.appendChild(volSlider);
    priceSlider.style.display='none';
    volSlider.style.display='none';
    priceSlider.value=0; volSlider.value=0;
    if(typeof calcGrow==='function') try{calcGrow();}catch(e){}
  }

  // ============ EXIT: CONVERSATIONAL CHAT ============
  function renderExit(){
    var host=$('exit-ins');
    if(!host) return;
    var phase2=$('exit-phase2');
    if(!phase2) return;
    var mascotSrc=findMascotSrc('exit-input-card');

    phase2.querySelectorAll('.card[data-v2-tabbed]').forEach(function(c){c.dataset.v2Tabbed='';phase2.appendChild(c);});
    phase2.querySelectorAll('.e-ac-card,.e-rd-card').forEach(function(c){phase2.appendChild(c);});
    var existing=$('v2-exit-chat'); if(existing) existing.remove();
    var existing2=$('v2-exit-chat-2'); if(existing2) existing2.remove();
    var existingCta=phase2.querySelector('.exit-cta-box'); if(existingCta) existingCta.remove();

    var currentVal=(host.querySelector('.ival')||{}).textContent||'$0';

    var allCards=Array.prototype.slice.call(phase2.querySelectorAll('.card'));
    var chipsCard=allCards[0]||null;
    var rdCard=allCards[1]||null;
    var acCard=allCards[2]||null;
    if(rdCard) rdCard.classList.add('e-rd-card');
    if(acCard) acCard.classList.add('e-ac-card');

    [chipsCard,rdCard,acCard].forEach(function(c){if(c)c.style.display='none';});

    var wrap=el('div',{id:'v2-exit-chat',class:'v2-chat'});
    var mascot=el('div',{class:'v2-chat-mascot'});
    if(mascotSrc){var m=el('img',{src:mascotSrc,alt:'Addy'});mascot.appendChild(m);}
    var stream=el('div',{class:'v2-chat-stream'});
    wrap.appendChild(mascot); wrap.appendChild(stream);
    phase2.insertBefore(wrap, phase2.firstChild);

    var b1=el('div',{class:'v2-bubble v2-first'});
    b1.innerHTML='Okay, I had a look at your numbers. Here is what I found.';
    stream.appendChild(b1);

    setTimeout(function(){
      var t1=el('div',{class:'v2-typing',id:'v2-exit-t1'});
      t1.innerHTML='<span></span><span></span><span></span>';
      stream.appendChild(t1);

      setTimeout(function(){
        if(t1.parentNode) t1.remove();
        var b2=el('div',{class:'v2-bubble hero v2-fade-in v2-mid'});
        b2.innerHTML='<div class="v2-tag">estimated value today</div><div class="v2-big">'+currentVal+'</div><div class="v2-cap">based on your profit and owner dependency.</div>';
        stream.appendChild(b2);

        setTimeout(function(){
          var t2=el('div',{class:'v2-typing',id:'v2-exit-t2'});
          t2.innerHTML='<span></span><span></span><span></span>';
          stream.appendChild(t2);

          setTimeout(function(){
            if(t2.parentNode) t2.remove();
            var b3=el('div',{class:'v2-bubble v2-fade-in v2-last'});
            b3.innerHTML='There are two ways to increase what your business is worth. Try the options below.';
            stream.appendChild(b3);

            setTimeout(function(){
              if(chipsCard){
                chipsCard.style.display='';
                chipsCard.classList.add('v2-fade-in');
                stream.appendChild(chipsCard);
              }
              if(rdCard){
                rdCard.style.display='';
                rdCard.classList.add('v2-fade-in');
                stream.appendChild(rdCard);
              }

              setTimeout(function(){
                var wrap2=el('div',{id:'v2-exit-chat-2',class:'v2-chat'});
                var mascot2=el('div',{class:'v2-chat-mascot'});
                if(mascotSrc){var m2=el('img',{src:mascotSrc,alt:'Addy'});mascot2.appendChild(m2);}
                var stream2=el('div',{class:'v2-chat-stream'});
                wrap2.appendChild(mascot2); wrap2.appendChild(stream2);
                phase2.appendChild(wrap2);

                var t3=el('div',{class:'v2-typing',id:'v2-exit-t3'});
                t3.innerHTML='<span></span><span></span><span></span>';
                stream2.appendChild(t3);

                setTimeout(function(){
                  if(t3.parentNode) t3.remove();
                  var b4=el('div',{class:'v2-bubble v2-fade-in'});
                  b4.innerHTML='Would you like 3 things to focus on this month to make your business more valuable?';
                  var showBtn=el('button',{class:'v2-show-btn',id:'v2-exit-show-btn',style:'margin-top:10px;'});
                  showBtn.innerHTML='Show me, <span style="color:#6abf7a;">ADDY<span style="color:var(--forest)">!</span></span>';
                  b4.appendChild(showBtn);
                  stream2.appendChild(b4);

                  var ctaBox=document.createElement('div');
                  ctaBox.className='exit-cta-box cta-box';
                  ctaBox.setAttribute('style','display:flex;align-items:flex-end;gap:1.5rem;');
                  ctaBox.innerHTML='<div style="flex:1;text-align:left;"><p>Not sure what your numbers are really telling you?</p><p style="margin-top:0.5rem;">Let\'s walk through yours together. It\'s a FREE 30 minute call.</p><button class="btn" style="margin-top:0.5rem;" onclick="window.open(\'https://www.addvantage.ca/contact\')">Walk me through my numbers.</button><div style="margin-top:0.5rem;"><a href="https://www.addvantage.ca/about" target="_blank" style="font-size:11px;color:#c9a84c;text-decoration:underline;font-weight:600;">Learn more about Michelle</a></div></div>';
                  phase2.appendChild(ctaBox);

                  setTimeout(function(){b4.scrollIntoView({behavior:'smooth',block:'nearest'});},200);

                  showBtn.onclick=function(){
                    showBtn.style.display='none';
                    var t4=el('div',{class:'v2-typing',id:'v2-exit-t4',style:'margin-top:10px;'});
                    t4.innerHTML='<span></span><span></span><span></span>';
                    b4.appendChild(t4);
                    setTimeout(function(){
                      if(t4.parentNode) t4.remove();
                      var acCard=phase2.querySelector('.e-ac-card');
                      if(acCard){
                        acCard.style.display='';
                        acCard.classList.add('v2-fade-in');
                        stream2.appendChild(acCard);
                      }
                      renderExitActions();
                      var eAcEl=document.getElementById('e-ac');
                      if(eAcEl){eAcEl._shown=true;}
                      appendFeedback(phase2,'exit');
                      setTimeout(function(){
                        if(eAcEl) eAcEl.scrollIntoView({behavior:'smooth',block:'nearest'});
                      },300);
                    },4000);
                  };
                },1800);
              },1200);
            },400);
          },1200);
        },600);
      },1000);
    },800);

    // Build chip-based scenario card
    var slidersCard=phase2.querySelector('.card');
    if(!slidersCard || slidersCard.dataset.v2Tabbed) return;
    slidersCard.dataset.v2Tabbed='1';

    var piSlider=slidersCard.querySelector('#e-pi');
    var diInput=slidersCard.querySelector('#e-di');
    var proj=slidersCard.querySelector('.cmp');

    function buildExitChipRow(label,presets,onSelect){
      var w=el('div',{class:'v2-chips-wrap'});
      var lbl=el('div',{class:'v2-chips-label'});
      lbl.textContent=label;
      var row=el('div',{class:'v2-chips'});
      row.style.gridTemplateColumns='repeat('+presets.length+',1fr)';
      presets.forEach(function(p){
        var b=el('button',{type:'button',class:'v2-chip'});
        b.textContent=p.label;
        b.dataset.val=String(p.val);
        b.addEventListener('click',function(){
          row.querySelectorAll('.v2-chip').forEach(function(c){c.classList.toggle('on',c===b);});
          onSelect(p.val,row);
          if(typeof calcExit==='function') try{calcExit();}catch(e){}
        });
        row.appendChild(b);
      });
      w.appendChild(lbl);
      w.appendChild(row);
      return w;
    }

    var profitChips=buildExitChipRow('Try a profit improvement...',[
      {val:5,label:'5%'},{val:10,label:'10%'},{val:15,label:'15%'},{val:20,label:'20%'}
    ],function(val){
      if(piSlider) piSlider.value=val;
    });

    var depChips=buildExitChipRow('Or reduce owner dependency...',[
      {val:'high',label:'I am the business'},{val:'med',label:'Somewhat dependent'},{val:'low',label:'Runs without me'}
    ],function(val){
      var depEl=document.getElementById('e-dep');
      var depDisp=document.getElementById('e-dep-display');
      var diEl=document.getElementById('e-di');
      if(depEl) depEl.value=val;
      var labels={high:'High: I am the business',med:'Medium: Somewhat dependent',low:'Low: Runs without me'};
      if(depDisp) depDisp.textContent=labels[val]||val;
      var diMap={high:0,med:1,low:2};
      if(diEl) diEl.value=diMap[val]||0;
    });

    slidersCard.innerHTML='';
    slidersCard.appendChild(profitChips);
    slidersCard.appendChild(depChips);
    if(proj) slidersCard.appendChild(proj);
    if(piSlider){piSlider.style.display='none';slidersCard.appendChild(piSlider);piSlider.value=0;}
    if(diInput){diInput.style.display='none';slidersCard.appendChild(diInput);diInput.value='-1';}
    if(typeof calcExit==='function') try{calcExit();}catch(e){}
  }

  // ============ POST-DIAGNOSTIC FEEDBACK SURVEY ============
  // 5-question conversational survey, shown at the very end of each track.
  // Submissions POST to the Cloudflare Worker, which stores them in D1.
  var FB_TOTAL = 5;
  var FB_INDUSTRIES = ['Trades & construction','Logistics & transport','Professional services','Retail & e-commerce','Manufacturing','Healthcare','Technology','Other'];
  var FB_PMF = [
    {v:'Very disappointed', s:'It genuinely solves something I struggle with'},
    {v:'Somewhat disappointed', s:"It's useful but I could manage without it"},
    {v:'Not disappointed', s:"I haven't found my 'aha' moment yet"}
  ];
  var FB_STANDOUT = ['Easy to understand','Saved me time','Relevant to my business','Gave me useful numbers','Unclear what to do next','Missing info I needed','Too basic for my stage','Hard to navigate'];
  var FB_FEATURES = ['Ongoing cash flow tracking','Benchmarks vs. my industry','Advice, not just data','Accounting software integration','Exit & growth planning','Cleaner reports (for accountant or bank)'];

  function fbOptButton(group, mode, value, isCard){
    var b=el('button',{type:'button',class:isCard?'fb-card-opt':'fb-pill','data-val':value});
    b.addEventListener('click',function(){
      if(mode==='single'){
        group.querySelectorAll('.selected').forEach(function(x){x.classList.remove('selected');});
        b.classList.add('selected');
      } else if(mode==='multi'){
        b.classList.toggle('selected');
      } else if(mode==='multi2'){
        if(b.classList.contains('selected')){ b.classList.remove('selected'); }
        else if(group.querySelectorAll('.selected').length < 2){ b.classList.add('selected'); }
      }
    });
    return b;
  }
  function fbPills(name, mode, values){
    var g=el('div',{class:'fb-options','data-name':name,'data-mode':mode});
    values.forEach(function(v){ var b=fbOptButton(g,mode,v,false); b.textContent=v; g.appendChild(b); });
    return g;
  }
  function fbCards(name, mode, items){
    var g=el('div',{class:'fb-options fb-cards','data-name':name,'data-mode':mode});
    items.forEach(function(it){
      var b=fbOptButton(g,mode,it.v,true);
      var t=el('div',{class:'fb-card-t'}); t.textContent=it.v; b.appendChild(t);
      if(it.s){ var s=el('div',{class:'fb-card-s'}); s.textContent=it.s; b.appendChild(s); }
      g.appendChild(b);
    });
    return g;
  }

  function buildFeedbackSurvey(track){
    var root=el('div',{class:'fb-survey'});
    var head=el('div',{class:'fb-head'});
    head.appendChild(el('h2',null,['How was your experience?']));
    root.appendChild(head);

    var prog=el('div',{class:'fb-progress'});
    var fill=el('div',{class:'fb-progress-fill'});
    prog.appendChild(fill); root.appendChild(prog);

    function makeStep(n, title, sub){
      var sec=el('div',{class:'fb-step'+(n===1?' active':''),'data-step':String(n)});
      sec.appendChild(el('span',{class:'fb-kicker'},['Question '+n+' of '+FB_TOTAL]));
      sec.appendChild(el('h3',null,[title]));
      if(sub) sec.appendChild(el('p',{class:'fb-sub'},[sub]));
      return sec;
    }

    var s1=makeStep(1,'What best describes your industry?','This helps us understand who benefits most from the tool.');
    var gIndustry=fbPills('industry','single',FB_INDUSTRIES); s1.appendChild(gIndustry);

    var s2=makeStep(2,'How would you feel if you could no longer use this tool?',"Be honest. This one really helps us understand where we're at.");
    var gPmf=fbCards('pmf','single',FB_PMF); s2.appendChild(gPmf);

    var s3=makeStep(3,'What stood out, good or bad?','Pick everything that resonates. Both signals matter equally to us.');
    var gStandout=fbPills('standout','multi',FB_STANDOUT); s3.appendChild(gStandout);

    var s4=makeStep(4,'What would make this a must-have for your business?','If we built a deeper version, what would matter most? Pick up to 2.');
    var gFeatures=fbCards('features','multi2',FB_FEATURES.map(function(v){return {v:v};})); s4.appendChild(gFeatures);

    var s5=makeStep(5,'Anything else on your mind?','A feature idea, a frustration, a question. Anything goes.');
    var ta=el('textarea',{class:'fb-textarea',rows:'4',placeholder:'Share whatever is on your mind...'});
    s5.appendChild(ta);
    s5.appendChild(el('div',{class:'fb-divider'}));
    var cFrame=el('div',{class:'fb-contact-frame'});
    cFrame.appendChild(el('div',{class:'fb-contact-title'},['Want a reply? Leave your details.']));
    cFrame.appendChild(el('div',{class:'fb-contact-sub'},["Completely optional. Only here if you'd like us to follow up on something you've shared."]));
    s5.appendChild(cFrame);
    var disc=el('div',{class:'fb-disclaimer'});
    disc.appendChild(el('span',{class:'fb-shield','aria-hidden':'true'},['🛡️']));
    disc.appendChild(el('span',null,["We won't add you to any mailing list or send unsolicited emails. Anything you share is encrypted and stored securely, never sold or shared. If you leave your details, the only reason we'd reach out is to answer a specific question you've raised here."]));
    s5.appendChild(disc);
    var nameLbl=el('label',{class:'fb-label'}); nameLbl.appendChild(document.createTextNode('Name ')); nameLbl.appendChild(el('span',{class:'fb-opt'},['optional'])); s5.appendChild(nameLbl);
    var nameIn=el('input',{type:'text',class:'fb-input',placeholder:'Your name',autocomplete:'name'}); s5.appendChild(nameIn);
    var emailLbl=el('label',{class:'fb-label'}); emailLbl.appendChild(document.createTextNode('Email ')); emailLbl.appendChild(el('span',{class:'fb-opt'},['optional'])); s5.appendChild(emailLbl);
    var emailIn=el('input',{type:'email',class:'fb-input',placeholder:'your@email.com',autocomplete:'email'}); s5.appendChild(emailIn);
    var consentLbl=el('label',{class:'fb-consent'});
    var consentIn=el('input',{type:'checkbox',class:'fb-consent-box'});
    consentLbl.appendChild(consentIn);
    consentLbl.appendChild(el('span',null,["I'm happy for Addvantage to store these details and reply to me about this feedback."]));
    s5.appendChild(consentLbl);

    var steps=[s1,s2,s3,s4,s5];
    var step=1;
    function setActive(n){
      steps[step-1].classList.remove('active');
      step=n;
      steps[step-1].classList.add('active');
      fill.style.width=((step-1)/FB_TOTAL*100)+'%';
      root.scrollIntoView({behavior:'smooth',block:'nearest'});
    }
    steps.forEach(function(sec,i){
      var n=i+1;
      var nav=el('div',{class:'fb-nav'});
      var back=el('button',{type:'button',class:'fb-back'+(n===1?' fb-hidden':'')},['← Back']);
      back.addEventListener('click',function(){ if(step>1) setActive(step-1); });
      nav.appendChild(back);
      if(n<FB_TOTAL){
        var next=el('button',{type:'button',class:'fb-next'},['Next →']);
        next.addEventListener('click',function(){ setActive(step+1); });
        nav.appendChild(next);
      } else {
        var send=el('button',{type:'button',class:'fb-submit'},['Send feedback']);
        send.addEventListener('click',doSubmit);
        nav.appendChild(send);
      }
      sec.appendChild(nav);
      root.appendChild(sec);
    });
    fill.style.width='0%';

    function readGroup(g, multi){
      var sel=[].slice.call(g.querySelectorAll('.selected')).map(function(b){ return b.getAttribute('data-val'); });
      return multi ? sel : (sel[0] || null);
    }
    function collect(){
      return {
        track: track,
        industry: readGroup(gIndustry,false),
        pmf_response: readGroup(gPmf,false),
        standout_signals: readGroup(gStandout,true),
        desired_features: readGroup(gFeatures,true),
        open_feedback: (ta.value||'').trim() || null,
        name: (nameIn.value||'').trim() || null,
        email: (emailIn.value||'').trim() || null,
        consent: !!consentIn.checked,
        completed_at: new Date().toISOString()
      };
    }
    function doSubmit(){
      var payload=collect();
      fill.style.width='100%';
      postFeedback(payload);
      while(root.firstChild) root.removeChild(root.firstChild);
      var ty=el('div',{class:'fb-thanks'});
      ty.appendChild(el('div',{class:'fb-thanks-icon'},['✓']));
      ty.appendChild(el('h2',null,['Thank you, really.']));
      ty.appendChild(el('p',null,['Your feedback goes straight to the team and genuinely shapes what we build next.']));
      root.appendChild(ty);
    }

    return root;
  }

  function postFeedback(payload){
    try{
      fetch(WORKER_URL,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({type:'feedback',data:payload})
      }).then(function(r){ if(!r||!r.ok) console.warn('Feedback save failed:', r&&r.status); })
        .catch(function(e){ console.warn('Feedback save error:', e&&e.message); });
    }catch(e){ console.warn('Feedback save error:', e); }
  }

  // Append the invitation + survey to the very end of a completed track.
  function appendFeedback(container, track){
    if(!container) return;
    var existing=document.getElementById('fb-'+track);
    if(existing) existing.remove();
    var cardId = track==='cash' ? 'cash-input-card' : (track==='grow' ? 'grow-input-card' : 'exit-input-card');
    var mascotSrc=findMascotSrc(cardId);

    var holder=el('div',{id:'fb-'+track,class:'fb-holder v2-fade-in'});
    var chat=el('div',{class:'v2-chat'});
    var mascot=el('div',{class:'v2-chat-mascot'});
    if(mascotSrc) mascot.appendChild(el('img',{src:mascotSrc,alt:'Addy'}));
    var stream=el('div',{class:'v2-chat-stream'});
    chat.appendChild(mascot); chat.appendChild(stream);
    holder.appendChild(chat);
    container.appendChild(holder);

    // Show a typing indicator first, so it feels like Addy is composing the
    // "How did that go?" message (same beat as the other chat bubbles).
    var typing=el('div',{class:'v2-typing'});
    typing.innerHTML='<span></span><span></span><span></span>';
    stream.appendChild(typing);

    setTimeout(function(){
      if(typing.parentNode) typing.remove();
      var bubble=el('div',{class:'v2-bubble v2-first v2-fade-in'});
      bubble.appendChild(el('strong',null,['How did that go?']));
      bubble.appendChild(el('br'));
      bubble.appendChild(document.createTextNode('Please share your experience. It takes about 2 minutes (5 quick questions), and your answers shape what we build next.'));
      stream.appendChild(bubble);
      var startBtn=el('button',{type:'button',class:'v2-show-btn v2-fade-in'},['Share my experience']);
      stream.appendChild(startBtn);
      startBtn.addEventListener('click',function(){
        startBtn.style.display='none';
        var survey=buildFeedbackSurvey(track);
        holder.appendChild(survey);
        setTimeout(function(){ survey.scrollIntoView({behavior:'smooth',block:'nearest'}); },80);
      });
    },2600);
  }

  function patch(fnName, phaseId, renderFn){
    var orig=window[fnName];
    if(typeof orig!=='function') return;
    window[fnName]=function(){
      var r=orig.apply(this,arguments);
      var ph=$(phaseId);
      if(!ph) return r;
      var mo=new MutationObserver(function(){
        if(ph.classList.contains('visible')){
          try{renderFn();}catch(e){console.error(e);}
          mo.disconnect();
        }
      });
      mo.observe(ph,{attributes:true,attributeFilter:['class']});
      if(ph.classList.contains('visible')){ try{renderFn();}catch(e){} }
      return r;
    };
  }

  function tryPatch(){
    patch('startCash','cash-phase2',renderCash);
    patch('startGrow','grow-phase2',renderGrow);
    patch('startExit','exit-phase2',renderExit);
  }

  function scrubDashes(){
    ['s-goals','s-cash','s-grow','s-exit'].forEach(function(id){
      var r=$(id); if(r) removeDashes(r);
    });
  }

  function init(){
    tryPatch();
    scrubDashes();
    if($('cash-phase2') && $('cash-phase2').classList.contains('visible')) renderCash();
    if($('grow-phase2') && $('grow-phase2').classList.contains('visible')) renderGrow();
    if($('exit-phase2') && $('exit-phase2').classList.contains('visible')) renderExit();
  }

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded', init);}
  else{init();}

  document.addEventListener('click', function(){ setTimeout(scrubDashes, 20); }, true);

  var PRESETS=[{days:30,label:'Net 30'},{days:60,label:'Net 60'},{days:90,label:'Net 90'}];
  function installCashChips(){
    var slider=document.getElementById('c-sl');
    var card=slider?slider.closest('.card'):null;
    if(!card) return;
    if(card.querySelector('.v2-chips-wrap')) return;
    var wrap=el('div',{class:'v2-chips-wrap'});
    var lbl=el('div',{class:'v2-chips-label'});
    lbl.textContent='If you got paid in...';
    var row=el('div',{class:'v2-chips'});
    row.style.gridTemplateColumns='repeat(3,1fr)';
    PRESETS.forEach(function(p){
      var b=el('button',{type:'button',class:'v2-chip'});
      b.textContent=p.label;
      b.dataset.days=p.days;
      b.addEventListener('click',function(){setDays(p.days);});
      row.appendChild(b);
    });
    wrap.appendChild(lbl); wrap.appendChild(row);
    var r2=card.querySelector('.r2');
    if(r2) card.insertBefore(wrap,r2); else card.appendChild(wrap);
    if(slider) slider.style.display='none';
    var sh=card.querySelector('.sh');if(sh) sh.style.display='none';
    function setDays(v,fromOther){
      slider.value=v;
      // one calc per click — the slider's oninput attribute calls calcCash
      slider.dispatchEvent(new Event('input',{bubbles:true}));
      row.querySelectorAll('.v2-chip').forEach(function(b){
        b.classList.toggle('on',!fromOther && parseInt(b.dataset.days,10)===v);
      });
    }
    setDays(30);
  }
  function bootCashChips(){
    var ph=document.getElementById('cash-phase2');
    if(!ph) return;
    if(ph.classList.contains('visible')){installCashChips();return;}
    var mo=new MutationObserver(function(){
      if(ph.classList.contains('visible')) installCashChips();
    });
    mo.observe(ph,{attributes:true,attributeFilter:['class']});
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',bootCashChips);}
  else{bootCashChips();}

})();
