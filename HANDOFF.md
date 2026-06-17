# Addy App — Status & Context Handoff

> ⚠️ **This repo is PUBLIC.** Never commit secrets (PATs, API keys, passwords)
> here — they would be exposed instantly. Secrets belong in Cloudflare's
> encrypted environment variables, not in files.

## What This Project Is
**Addy** is a free web app for business owners — a financial clarity tool with
three goal tracks: **Cash flow**, **Grow revenue**, and **Exit/Sell**. The UI is
a conversational, chat-style flow ("FREE VERSION" ribbon, ADDY by Addvantage
Advisory Services branding). It has a companion Framer landing page and is used
for user testing / investor demos.

## Architecture
Frontend and business logic are split so the calculation IP isn't publicly readable:

| Layer | Service | URL |
|-------|---------|-----|
| Frontend (UI) | GitHub Pages | https://addyaddvantage.github.io/addy-app/ |
| Business logic (IP) | Cloudflare Worker | https://addy-calculator.michelle-1db.workers.dev |
| Landing page | Framer | https://www.addvantage.ca/addy |

- **Repo:** https://github.com/AddyAddvantage/addy-app (branch `main`, auto-deploys to Pages in ~1 min on push)
- **Accounts:** GitHub `AddyAddvantage` · Cloudflare + Framer under michelle@addvantage.ca

## File Structure
```
addy-app/
├── index.html          (36 KB)  — app shell, 4 screens: s-goals, s-cash, s-grow, s-exit
├── worker.js           (3.9 KB) — Cloudflare Worker SOURCE (lives in repo)
├── HANDOFF.md          — this file
├── assets/
│   ├── mascot.mp4      (5.8 MB) — animated Addy (VIDEO, not an image)
│   ├── addy.png, addy-character.png
│   ├── bg-pattern.png  (2.1 MB) — current illustrated background
│   └── bg-embed.png, bg-pattern-green.png, bg-pattern-black.png (legacy)
├── css/
│   ├── tokens.css      (0.5 KB) — :root design variables
│   └── styles.css      (42 KB)  — all styles (v3 foundation + v4 flows)
└── js/
    ├── logic.js        (0.4 KB) — ONLY the f() currency formatter
    ├── analytics.js    (3 KB)   — GA4 + Clarity loaders (try/catch wrapped)
    └── app.js          (55 KB)  — all UI, event handlers, Worker API calls
```
Script load order in index.html: `logic.js` → `analytics.js` → `app.js`

## Cloudflare Worker — API Contract (current `worker.js`)
`POST https://addy-calculator.michelle-1db.workers.dev`
Body: `{ goal: 'cash'|'grow'|'exit', inputs: {...} }` → returns `{ result: {...} }`

- **cash** in `{rev, dso, tgt}` → out `{trapped, freed, tgt, tgtLessThanDso, danger}`
  - dso=0 is treated as a real choice = "Due on Receipt", not a missing value
- **grow** in `{c, p, pi, ni}` → out `{cur, nw, gp, gc, gt, lo}`
- **exit** in `{profit, years, dep, pi, di, nothingSelected}` → out `{curVal, newVal, uplift, isDanger, currentMult, newMult, profitNew, checks, nothingSelected}`
  - di = -1 means nothing selected yet; diBonus array `[0.1, 0.5, 1.5]`

### ⚠️ Worker deployment notes
- **CORS is currently wildcard (`Access-Control-Allow-Origin: *`)** — open to any
  origin. Convenient now; tighten to specific domains before public launch.
- **The repo `worker.js` is the source of truth.** If you edit calculations, you
  MUST paste it into the Cloudflare dashboard (Workers & Pages → addy-calculator)
  and click Deploy. Pushing to GitHub does NOT update the Worker.

App-side call pattern (`app.js`): `WORKER_URL` constant → `async function api(goal, inputs)` → `await api('cash'|'grow'|'exit', {...})`.

### Feedback survey endpoint (added)
Same Worker, different body shape: `POST /` with `{ type: 'feedback', data: {...} }` → `{ ok: true }`.
- `data` fields: `track`, `industry`, `pmf_response`, `standout_signals[]`, `desired_features[]`, `open_feedback`, `name`, `email`, `consent` (bool — optional consent checkbox), `completed_at`.
- Stored in **Cloudflare D1** (encrypted at rest, reachable only via the Worker binding). The Worker `fetch` signature is now `fetch(request, env)` and uses `env.DB`.
- **Live as of June 2026.** D1 database created (bound as `DB` on the `addy-calculator` Worker, North American region) and the updated `worker.js` deployed; submissions are confirmed writing to the `feedback` table. The one-time setup steps remain documented in the big comment block in `worker.js` for reference / disaster recovery. If the Worker is ever unreachable, submissions still fail gracefully (user sees the thank-you screen; a `console.warn` is logged).
- Survey UI lives in `app.js` (`buildFeedbackSurvey` / `appendFeedback`, inside the v2 IIFE) and `.fb-*` styles in `styles.css`. It appears at the very end of all three tracks, after the book-a-call CTA, behind a "Share my experience" button.

## ✅ Done
- New HTML migrated (from `addy-full (5).html`) with updated styling + corrected calculations
- v2 conversational chat UI: chips, input summaries, red cash box
- v3 styling foundation restored across all tabs
- v4 conversational flows across all three tracks
- Payment-terms dropdown restored: **Due on Receipt / Net 30 / 60 / 90**
- Fixed duplicate actions card on Grow tab
- CTA box aligned with chat cards on Grow + Exit
- Calculations corrected and matched between `app.js` inputs and `worker.js` logic
  (incl. dso=0 and exit "nothing selected" edge cases)
- Addy mascot circle resolved — 304px circle, `overflow:hidden`, inset sage-dark
  ring (`box-shadow: inset 0 0 0 8px`), video at 81% width, responsive down to 128px
- Logic kept server-side; `logic.js` holds only the display formatter
- Design tokens expanded (added `--line`, `--muted`)
- **Post-diagnostic feedback survey** live across all three tracks — 5-question
  conversational flow + optional contact with consent checkbox, storing to
  Cloudflare D1 (see the feedback endpoint section above)

## 🔧 Still Open / Not Done
- **Privacy Policy needs a legal review** — the modal was updated to disclose
  secure storage of feedback + optional name/email. Have a lawyer review the new
  copy (especially the analytics line) before public launch.
- **Analytics IDs are placeholders** — `GA_ID = 'G-XXXXXXXXXX'` and
  `CLARITY_ID = 'XXXXXXXXXX'` need real values (these are client-side IDs, safe to commit)
- **Worker CORS** still wildcard `*` — lock down before launch
- **Framer landing-page CTAs** — confirm they point to the live app URL (not `#`)
- **Tally.so email gate** — planned, not built (name + email before app access)

## Working Preferences
- **Copy:** Ogilvy-direct meets Don Draper — punchy, benefit-led, no wasted words
- **Design:** Apple-sleek, generous whitespace; sage/forest greens + gold/stone
- **Process:** discuss/align before pushing to production; budget-conscious (free/low-cost tools)
- **Deploy:** `git add . && git commit && git push origin main` for the app;
  **separately** paste `worker.js` into the Cloudflare dashboard for any logic change

## Design Tokens (tokens.css)
```css
--forest:#2d3f38; --sage:#7a9485; --sage-light:#e8ede9; --sage-mid:#b5c9be;
--sage-dark:#4a6b58; --radius:12px; --radius-sm:8px; --warn-bg:#fdf5e8;
--warn-border:#e8c97a; --warn-text:#7a5a1a; --danger-bg:#fdf0ee;
--danger-border:#e8a89a; --danger-text:#7a2a1a; --line:#e5e7eb; --muted:#6b7280;
```
