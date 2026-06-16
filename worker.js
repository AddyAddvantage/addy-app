/**
 * ADDY CLOUDFLARE WORKER
 * Deploy at: https://dash.cloudflare.com → Workers & Pages → addy-calculator
 * Paste this entire file into the worker editor and click "Deploy".
 *
 * API:  POST /   body: { goal: 'cash'|'grow'|'exit', inputs: {...} }
 *       Response: { result: {...} }
 */

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    let body;
    try { body = await request.json(); } catch {
      return new Response('Bad JSON', { status: 400 });
    }

    // ── Feedback survey submissions are stored, not calculated ──
    if (body && body.type === 'feedback') {
      try {
        await saveFeedback(body.data || {}, env);
      } catch (e) {
        return new Response('Feedback error: ' + e.message, {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders() },
        });
      }
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders() },
      });
    }

    const { goal, inputs } = body;
    let result;

    try {
      if (goal === 'cash') result = calcCash(inputs);
      else if (goal === 'grow') result = calcGrow(inputs);
      else if (goal === 'exit') result = calcExit(inputs);
      else return new Response('Unknown goal', { status: 400 });
    } catch (e) {
      return new Response('Calc error: ' + e.message, { status: 500 });
    }

    return new Response(JSON.stringify({ result }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  },
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

// ── CASH FLOW ────────────────────────────────────────────────
function calcCash({ rev = 0, dso = 45, tgt = 30 }) {
  const revC = rev || 500000;
  // dso of 0 is a real choice (Due on Receipt) — only fall back when missing
  const dsoC = dso === 0 ? 0 : (dso || 45);
  const trapped = (revC / 365) * dsoC;
  const tt = (revC / 365) * tgt;
  const freed = trapped - tt;
  const tgtLessThanDso = tgt < dsoC;
  const danger = (revC * 0.65 / 12) > 0 && trapped / (revC * 0.65 / 12) > 2;
  return { trapped, freed, tgt, tgtLessThanDso, danger };
}

// ── GROW REVENUE ─────────────────────────────────────────────
function calcGrow({ c = 12, p = 850, pi = 0, ni = 0 }) {
  const cur = c * p;
  const np = p * (1 + pi / 100);
  const gp = c * (np - p);
  const gc = ni * p;
  const gt = gp + gc;
  const nw = cur + gt;
  const lo = p < 500;
  return { cur, nw, gp, gc, gt, lo };
}

// ── EXIT / SELL ───────────────────────────────────────────────
function calcExit({ profit = 500000, years = 8, dep = 'med', pi = 0, di = -1, nothingSelected = false }) {
  const rev = 800000;
  const depMult = { high: 2, med: 3, low: 4 };
  const baseMult = depMult[dep] || 3;
  const yearBonus = years >= 10 ? 0.5 : years >= 5 ? 0.25 : 0;
  const currentMult = Math.min(baseMult + yearBonus, 5);

  // di = -1 means nothing selected yet
  const diBonus = [0.1, 0.5, 1.5];
  const profitNew = profit * (1 + pi / 100);
  const multBonus = pi >= 20 ? 0.5 : pi >= 10 ? 0.25 : 0;
  const nothing = nothingSelected || (di < 0 && pi === 0);
  const depBonusVal = di >= 0 ? diBonus[di] : 0;
  const newMult = Math.min(baseMult + depBonusVal + yearBonus + multBonus, 6);
  const curVal = profit * currentMult;
  const newVal = nothing ? curVal : profitNew * newMult;
  const uplift = newVal - curVal;
  const margin = (profit / rev) * 100;
  const isDanger = margin < 10;

  const checks = [
    { l: 'Profit improvement', ok: pi >= 10 },
    { l: 'Business runs without owner', ok: dep === 'low' || di === 2 },
    { l: '3+ years trading history', ok: years >= 3 },
  ];

  return { curVal, newVal, uplift, isDanger, currentMult, newMult, profitNew, checks, nothingSelected: nothing };
}

// ── FEEDBACK STORAGE ─────────────────────────────────────────
// Stores post-diagnostic survey responses in a Cloudflare D1 database.
//
// ONE-TIME SETUP (Cloudflare dashboard — do this before deploying):
//   1. Workers & Pages → D1 → "Create database"  (e.g. name it "addy-feedback")
//   2. Open the database → Console, and run this SQL once:
//
//        CREATE TABLE IF NOT EXISTS feedback (
//          id INTEGER PRIMARY KEY AUTOINCREMENT,
//          track TEXT,
//          industry TEXT,
//          pmf_response TEXT,
//          standout_signals TEXT,   -- JSON array
//          desired_features TEXT,   -- JSON array
//          open_feedback TEXT,
//          name TEXT,
//          email TEXT,
//          completed_at TEXT,
//          created_at TEXT DEFAULT (datetime('now'))
//        );
//
//   3. Worker (addy-calculator) → Settings → Bindings → add a D1 binding:
//        Variable name = DB   →   the "addy-feedback" database
//   4. Deploy this worker.
//
// SECURITY: D1 is encrypted at rest by Cloudflare and is only reachable
// through this Worker's binding — there is no public database endpoint, and
// no credentials live in this (public) repo. We store only what the user
// volunteers, cap field lengths defensively, and never log raw name/email.
async function saveFeedback(d, env) {
  if (!env || !env.DB) throw new Error('D1 binding "DB" not configured');
  const str = (v, max) => (typeof v === 'string' && v ? v.slice(0, max) : null);
  const arr = (v) =>
    JSON.stringify(Array.isArray(v) ? v.slice(0, 12).map((x) => String(x).slice(0, 80)) : []);

  await env.DB.prepare(
    `INSERT INTO feedback
       (track, industry, pmf_response, standout_signals, desired_features, open_feedback, name, email, completed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      str(d.track, 16),
      str(d.industry, 80),
      str(d.pmf_response, 40),
      arr(d.standout_signals),
      arr(d.desired_features),
      str(d.open_feedback, 4000),
      str(d.name, 200),
      str(d.email, 320),
      str(d.completed_at, 40) || new Date().toISOString()
    )
    .run();
}
