/* ==========================================================
   ADDY - BUSINESS LOGIC
   Pure calculation functions. No DOM references.
   Safe to move server-side without touching UI code.
   ========================================================== */

function calcCash(){
  const rev=parseFloat(document.getElementById('c-rev').value)||0;
  const dso=parseFloat(document.getElementById('c-dso').value)||0;
  const revC=rev||500000;const dsoC=dso||45;
  const tgt=parseFloat(document.getElementById('c-sl').value)||30;
  const exp=revC*0.65/12;
  document.getElementById('c-td').textContent=Math.round(tgt)+' days';
  updateSliderTicks('c-sl',[0,30,60,90]);
  const trapped=(revC/365)*dsoC,tt=(revC/365)*tgt,freed=trapped-tt;
  const run=exp>0?trapped/exp:0,nrun=exp>0?tt/exp:0;
  const danger=dsoC>0;
  document.getElementById('cash-ins').innerHTML=`<div class="ib ${danger?'danger':'sage'}"><div class="irow"><div class="ival">${f(trapped)}</div><div class="ilbl">you've earned... but can't use. This is why your cash feels tight.</div></div></div>`;
  document.getElementById('c-fr').textContent=f(Math.abs(freed));
  document.getElementById('c-fr').className='rv '+(freed>=0?'c-sage':'c-danger');
  document.getElementById('c-fn').textContent=tgt<dsoC?'back in your bank account':'still not in your bank account';
  document.getElementById('c-fn').className='rn '+(tgt<dsoC?'c-sage':'c-danger');
  const mo=revC/12;
  var cAcEl=document.getElementById('c-ac');
  if(cAcEl&&!cAcEl._shown){cAcEl.innerHTML='';}
}

function calcGrow(){
  const c=parseInt(document.getElementById('g-nc').value)||12;
  const p=parseFloat(document.getElementById('g-ap').value)||850;
  const pi=parseInt(document.getElementById('g-pi').value)||0;
  const ni=parseInt(document.getElementById('g-ni').value)||0;
  document.getElementById('g-pd').textContent=pi+'%';
  document.getElementById('g-cd').textContent=ni;
  updateSliderTicks('g-ni',[0,10,20,30]);
  const cur=c*p,np=p*(1+pi/100),gp=c*(np-p),gc=ni*p,gt=gp+gc,nw=cur+gt;
  const lo=p<500;
  document.getElementById('grow-ins').innerHTML=`<div class="ib ${lo?'warn':'forest'}"><div class="irow" style="align-items:flex-end;"><div style="display:flex;flex-direction:column;"><div style="font-size:11px;color:#6b7280;margin-bottom:2px;">Current</div><div class="ival">${f(cur)}</div></div><div class="ilbl" style="margin-top:0;padding-bottom:12px;">per year from ${c} jobs at ${f(p)} each.</div></div></div>`;
  document.getElementById('g-nr').textContent=f(nw);
  document.getElementById('g-ns').textContent=gt>0?`+${f(gt)} per year`:'adjust levers above';
  document.getElementById('g-gp').textContent=f(gp);
  var gpWrap=document.getElementById('g-gp-wrap');
  if(gpWrap){
    var leftPct=(pi/50)*100;
    var cw=gpWrap.parentElement.offsetWidth||300;
    var lw=gpWrap.offsetWidth||140;
    var leftPx=(leftPct/100)*cw;
    var clampedPx=Math.max(lw/2,Math.min(leftPx,cw-lw/2));
    gpWrap.style.left=(clampedPx/cw*100)+'%';
  }
  document.getElementById('g-gc').textContent=f(gc);
  var gcWrap=document.getElementById('g-gc-wrap');
  if(gcWrap){
    var leftPct2=(ni/30)*100;
    var cw2=gcWrap.parentElement.offsetWidth||300;
    var lw2=gcWrap.offsetWidth||140;
    var leftPx2=(leftPct2/100)*cw2;
    var clampedPx2=Math.max(lw2/2,Math.min(leftPx2,cw2-lw2/2));
    gcWrap.style.left=(clampedPx2/cw2*100)+'%';
  }
  let bd='';
  if(pi===0&&ni===0)bd='Move the levers above to model how price increases and new clients impact your annual revenue.';
  else if(pi>0&&ni===0)bd=`A ${pi}% price increase on your ${c} existing clients adds ${f(gp)}/year — with no extra work finding new clients.`;
  var gAcEl=document.getElementById('g-ac');
  if(gAcEl&&!gAcEl._shown){gAcEl.innerHTML='';}
}

function calcExit(){
  const rev=800000;
  const profit=parseFloat(document.getElementById('e-pro').value)||500000;
  const years=parseInt(document.getElementById('e-yr').value)||8;
  const dep=document.getElementById('e-dep').value;
  const pi=parseInt(document.getElementById('e-pi').value)||0;
  const di=parseInt(document.getElementById('e-di').value)||1;
  document.getElementById('e-pd').textContent=pi+'%';
  const depMult={high:2,med:3,low:4};
  const baseMult=depMult[dep];
  const yearBonus=years>=10?0.5:years>=5?0.25:0;
  const currentMult=Math.min(baseMult+yearBonus,5);
  const diMults=[2,3,4];
  const newDepMult=diMults[di];
  const profitNew=profit*(1+pi/100);
  const multBonus=pi>=20?0.5:pi>=10?0.25:0;
  const newMult=Math.min(newDepMult+yearBonus+multBonus,6);
  const curVal=profit*currentMult,newVal=profitNew*newMult,uplift=newVal-curVal;
  const margin=profit/rev*100;
  const isDanger=margin<10;
  document.getElementById('exit-ins').innerHTML=`<div class="ib ${isDanger?'danger':'sage'}"><div class="irow"><div class="ival">${f(curVal)}</div><div class="ilbl">Estimated current value.</div></div></div>`;
  document.getElementById('e-nv').textContent=f(newVal);
  document.getElementById('e-ns').textContent=`+${f(uplift)} uplift`;
  let bd='';
  if(pi===0&&di===1)bd='Adjust the sliders to see how improving profitability and reducing owner dependency impacts what a buyer would pay.';
  else if(pi>0&&di===1)bd=`A ${pi}% profit improvement adds ${f(profitNew-profit)}/year and increases your valuation by ${f(uplift)}. Every dollar of extra profit is worth ${newMult.toFixed(1)} dollars in exit value.`;
  else if(pi===0)bd=`Reducing owner dependency moves your multiple from ${currentMult.toFixed(1)}x to ${newMult.toFixed(1)}x. Buyers pay more for businesses that run without the owner.`;
  const checks=[
    {l:'Profit improvement',ok:pi>=10},
    {l:'Business runs without owner',ok:dep==='low'||di===2},
    {l:'3+ years trading history',ok:years>=3}
  ];
  document.getElementById('e-rd').innerHTML=checks.map(ch=>`<div class="ritem"><div class="rdot" style="background:${ch.ok?'#7a9485':'#c0392b'};"></div><div class="rtxt">${ch.l}</div><div class="rs" style="color:${ch.ok?'#4a6b58':'#7a2a1a'};">${ch.ok?'Good':'This is holding your value back'}</div></div>`).join('');
}

function f(n){const a=Math.abs(n),s=n<0?'-$':'$';if(a>=1000000)return s+(Math.round(a/100000)/10).toFixed(1)+'M';if(a>=1000)return s+(Math.round(a/100)/10).toFixed(1)+'K';return s+Math.round(a);}
