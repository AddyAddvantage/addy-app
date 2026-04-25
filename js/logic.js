/* ==========================================================
   ADDY - LOGIC
   Calculation functions live in the Cloudflare Worker:
   https://addy-calculator.michelle-1db.workers.dev
   ========================================================== */

function f(n){const a=Math.abs(n),s=n<0?'-$':'$';if(a>=1000000)return s+(Math.round(a/100000)/10).toFixed(1)+'M';if(a>=1000)return s+(Math.round(a/100)/10).toFixed(1)+'K';return s+Math.round(a);}
