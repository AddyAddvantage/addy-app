/* ============================================================
   ADDY — ANALYTICS
   Replace placeholder IDs before going live.
   Tracks screen views and key user interactions.
   ============================================================ */

// ── Google Analytics 4 ──────────────────────────────────────
// 1. Go to analytics.google.com → Admin → Data Streams
// 2. Replace 'G-XXXXXXXXXX' with your Measurement ID
const GA_ID = 'G-XXXXXXXXXX';

(function loadGA() {
  const s = document.createElement('script');
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  s.async = true;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA_ID);
})();

// ── Microsoft Clarity ────────────────────────────────────────
// 1. Go to clarity.microsoft.com → New Project
// 2. Replace 'XXXXXXXXXX' with your Clarity Project ID
const CLARITY_ID = 'XXXXXXXXXX';

(function loadClarity(c, l, a, r, i, t, y) {
  c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
  t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
  y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
})(window, document, 'clarity', 'script', CLARITY_ID);

// ── Event Helpers ────────────────────────────────────────────
// Call these from app.js at key interaction points.

/**
 * Track which goal track the user selects.
 * @param {'cash'|'grow'|'exit'} goalKey
 */
function trackGoalSelected(goalKey) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'goal_selected', { goal: goalKey });
  }
  if (typeof clarity !== 'undefined') {
    clarity('set', 'goal', goalKey);
  }
}

/**
 * Track when a user submits inputs and triggers a calculation.
 * @param {'cash'|'grow'|'exit'} goalKey
 */
function trackCalculationRun(goalKey) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'calculation_run', { goal: goalKey });
  }
}

/**
 * Track when action recommendations are viewed.
 * @param {'cash'|'grow'|'exit'} goalKey
 */
function trackActionsViewed(goalKey) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'actions_viewed', { goal: goalKey });
  }
}

/**
 * Track screen/step changes for funnel analysis.
 * @param {string} screenId  e.g. 's-goals', 's-cash', 's-grow', 's-exit'
 */
function trackScreenView(screenId) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'screen_view', { screen: screenId });
  }
  if (typeof clarity !== 'undefined') {
    clarity('set', 'screen', screenId);
  }
}
