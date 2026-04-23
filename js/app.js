/* ==========================================================
   ADDY - APP
   UI state, screen routing, event handlers.
   Requires: logic.js loaded before this file.
   ========================================================== */

let goal=null;

// [extracted to logic.js: f]
}
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
  else if(goal==='grow'){show('s-grow');calcGrow();setTimeout(function(){var g=document.getElementById('g-nc');if(g)g.focus();},300);}
  else{show('s-exit');calcExit();setTimeout(function(){var el=document.getElementById('e-pro');if(el)el.focus();},300);}
}
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
  var wrapper=el.closest('.ir');
  if(el.validity&&el.validity.badInput){
    if(wrapper)wrapper.classList.add('input-error');
    if(err){err.textContent='Numbers only';err.classList.add('show');}
    return false;
  }else if(!el.value||parseFloat(el.value)<=0){
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
  var wrapper=el.closest('.ir');
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
  var cardInner=document.getElementById('cash-card-inner');if(cardInner)cardInner.style.display='';
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
  // swap form for thinking overlay inside the card
  if(cardInner)cardInner.style.display='none';
  if(fill){fill.style.animation='none';fill.offsetHeight;fill.style.animation='';}
  if(overlay)overlay.classList.add('visible');
  calcCash();
  setTimeout(function(){
    if(overlay){overlay.classList.remove('visible');overlay.style.display='';}
    if(cardInner)cardInner.style.display='';
    if(p2)p2.classList.add('visible');
    if(p3)p3.classList.add('visible');
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

// [extracted to logic.js: calcCash]
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
    if(cardInner)cardInner.style.display='';
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

// [extracted to logic.js: calcGrow]
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
  var acWasShown=document.getElementById('e-ac').innerHTML.trim()!=='';
  calcExit();
  setTimeout(function(){
    if(overlay){overlay.classList.remove('visible');overlay.style.display='';}
    if(cardInner)cardInner.style.display='';
    if(p2)p2.classList.add('visible');
    if(acWasShown){renderExitActions();}else{document.getElementById('e-ac').innerHTML='';}
    window.scrollTo({top:0,behavior:'smooth'});
  },4000);
}
function exitStartOver(){
  var overlay=document.getElementById('exit-thinking-overlay');
  var cardInner=document.getElementById('exit-card-inner');
  var p2=document.getElementById('exit-phase2');
  if(overlay){overlay.classList.remove('visible');overlay.style.display='';}
  if(cardInner)cardInner.style.display='';
  if(p2)p2.classList.remove('visible');
  document.getElementById('e-pro').value='';
  document.getElementById('e-yr').value='';
  document.getElementById('e-ac').innerHTML='';
  cashFieldFocus('e-pro','e-pro-err');
  cashFieldFocus('e-yr','e-yr-err');
  window.scrollTo({top:0,behavior:'smooth'});
  setTimeout(function(){var el=document.getElementById('e-pro');if(el)el.focus();},300);
}

// [extracted to logic.js: calcExit]
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
  document.getElementById('e-ac').innerHTML=acts(exitActs);
}
calcCash();calcGrow();calcExit();
