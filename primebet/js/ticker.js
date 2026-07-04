/* =====================================================================
   ticker.js — Live odds ticker + shared helpers
   Loads data/fixtures.json and renders a scrolling live ticker.
   Also provides small utilities reused across pages.
   ===================================================================== */

const PrimeBet = (() => {
  const DATA_URL = resolveDataUrl();

  // Resolve fixtures.json relative to site root regardless of page depth.
  function resolveDataUrl() {
    return 'data/fixtures.json';
  }

  async function loadFixtures() {
    try {
      const res = await fetch(DATA_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } catch (err) {
      console.error('[PrimeBet] Failed to load fixtures:', err);
      return { sports: [], updated: null };
    }
  }

  function allFixtures(data) {
    return (data.sports || []).flatMap((s) =>
      (s.fixtures || []).map((f) => ({ ...f, sport: s.name, icon: s.icon }))
    );
  }

  function fmtTime(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Simulate small live odds drift so the page feels alive between refreshes.
  function drift(odd) {
    if (odd == null) return null;
    const delta = (Math.random() - 0.5) * 0.06;
    return Math.max(1.01, +(odd + delta).toFixed(2));
  }

  function renderTicker(data) {
    const track = document.getElementById('tickerTrack');
    if (!track) return;

    const items = allFixtures(data)
      .map((f) => {
        const live = f.status === 'live';
        const score = live ? ` <b>${f.score.home}-${f.score.away}</b>` : '';
        const price = f.odds.home != null ? `<span class="odd">${f.odds.home.toFixed(2)}</span>` : '';
        return `<span class="ticker__item">${f.icon} <b>${f.home}</b> v <b>${f.away}</b>${score} ${price}</span>`;
      })
      .join('');

    // Duplicate content so the CSS marquee loop is seamless.
    track.innerHTML = items + items;
  }

  async function initTicker() {
    const data = await loadFixtures();
    renderTicker(data);
    updateStamp(data.updated);
  }

  function updateStamp(iso) {
    const el = document.getElementById('lastUpdated');
    if (el && iso) {
      el.textContent = 'Odds updated ' + new Date(iso).toLocaleString();
    }
  }

  // Mobile nav toggle (used on every page).
  function initNav() {
    const toggle = document.querySelector('.nav__toggle');
    const nav = document.querySelector('.nav');
    if (toggle && nav) {
      toggle.addEventListener('click', () => nav.classList.toggle('open'));
    }
  }

  // Set current year in footers.
  function initYear() {
    document.querySelectorAll('[data-year]').forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initYear();
    initTicker();
  });

  return { loadFixtures, allFixtures, fmtTime, drift };
})();
