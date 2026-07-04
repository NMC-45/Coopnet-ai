/* =====================================================================
   promos.js — Promotions page
   Renders promo cards and drives live countdown timers.
   ===================================================================== */

(function () {
  const PROMOS = [
    {
      tag: 'Welcome Offer',
      title: 'Bet $10, Get $30',
      body: 'New players get $30 in free bets after placing your first $10 wager on any sport. No complicated rollover.',
      cta: 'Claim Bonus',
      terms: '18+. New customers only. Min stake $10 at odds 1.50+. Free bets valid 7 days.',
      endsInHours: 72,
    },
    {
      tag: 'Acca Boost',
      title: 'Up to 70% Extra',
      body: 'Add more legs, win more. Get a profit boost of up to 70% on football accumulators with 4+ selections.',
      cta: 'Build Acca',
      terms: '18+. Applies to pre-match football accas. Boost scales with number of legs.',
      endsInHours: 168,
    },
    {
      tag: 'Weekend Special',
      title: 'Risk-Free $25',
      body: 'Place a live in-play bet this weekend. If it loses, we refund your stake up to $25 as a free bet.',
      cta: 'Bet Live',
      terms: '18+. One qualifying live bet per customer per weekend. Refund as free bet.',
      endsInHours: 48,
    },
    {
      tag: 'Loyalty',
      title: 'Odds Boost Daily',
      body: 'Every day we hand-pick a fixture and supercharge the odds. Check back each morning for the daily price boost.',
      cta: 'See Today’s Boost',
      terms: '18+. One boosted market per day. Max stake applies. See market for details.',
      endsInHours: 12,
    },
  ];

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function countdownHtml(id) {
    return `<div class="countdown" id="${id}">
      <div class="unit"><b data-d>--</b><span>days</span></div>
      <div class="unit"><b data-h>--</b><span>hrs</span></div>
      <div class="unit"><b data-m>--</b><span>min</span></div>
      <div class="unit"><b data-s>--</b><span>sec</span></div>
    </div>`;
  }

  function render() {
    const grid = document.getElementById('promoGrid');
    if (!grid) return;

    grid.innerHTML = PROMOS.map((p, i) => {
      const cdId = `cd-${i}`;
      return `<article class="promo-card">
        <div class="promo-card__banner">
          <div class="tag">${p.tag}</div>
          <h3>${p.title}</h3>
        </div>
        <div class="promo-card__body">
          <p>${p.body}</p>
          ${countdownHtml(cdId)}
          <button class="btn btn-primary" type="button">${p.cta}</button>
          <p class="promo-card__terms">${p.terms}</p>
        </div>
      </article>`;
    }).join('');

    startCountdowns();
  }

  function startCountdowns() {
    const now = Date.now();
    const targets = PROMOS.map((p, i) => ({
      el: document.getElementById(`cd-${i}`),
      end: now + p.endsInHours * 3600 * 1000,
    }));

    function tick() {
      const t = Date.now();
      targets.forEach(({ el, end }) => {
        if (!el) return;
        let diff = Math.max(0, Math.floor((end - t) / 1000));
        const d = Math.floor(diff / 86400); diff -= d * 86400;
        const h = Math.floor(diff / 3600); diff -= h * 3600;
        const m = Math.floor(diff / 60); const s = diff - m * 60;
        el.querySelector('[data-d]').textContent = pad(d);
        el.querySelector('[data-h]').textContent = pad(h);
        el.querySelector('[data-m]').textContent = pad(m);
        el.querySelector('[data-s]').textContent = pad(s);
      });
    }

    tick();
    setInterval(tick, 1000);
  }

  document.addEventListener('DOMContentLoaded', render);
})();
