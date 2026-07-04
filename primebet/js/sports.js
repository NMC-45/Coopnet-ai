/* =====================================================================
   sports.js — Sports book page
   Renders fixtures grouped by sport with filter tabs and live scores.
   Depends on PrimeBet (ticker.js) being loaded first.
   ===================================================================== */

(function () {
  let DATA = null;
  let activeSport = 'all';

  function statusHtml(f) {
    if (f.status === 'live') {
      const min = f.minute != null ? `${f.minute}'` : 'LIVE';
      return `<span class="status-live"><span class="dot"></span>${min}</span>`;
    }
    return `<span>${PrimeBet.fmtTime(f.start)}</span>`;
  }

  function oddsHtml(f) {
    const cols = [
      { k: '1', v: f.odds.home },
      { k: 'X', v: f.odds.draw },
      { k: '2', v: f.odds.away },
    ].filter((c) => c.v != null);

    return `<div class="odds-row">${cols
      .map(
        (c) => `<button class="odd-btn" type="button" aria-label="Back ${c.k} at ${c.v.toFixed(2)}">
          <span class="k">${c.k}</span><span class="v">${c.v.toFixed(2)}</span>
        </button>`
      )
      .join('')}</div>`;
  }

  function matchCard(f) {
    return `<article class="match-card" data-id="${f.id}">
      <div class="match-card__meta">
        <span class="league">${f.icon} ${f.league}</span>
        ${statusHtml(f)}
      </div>
      <div class="match-card__teams">
        <div class="row"><span class="n">${f.home}</span><span class="s">${f.status === 'live' ? f.score.home : ''}</span></div>
        <div class="row"><span class="n">${f.away}</span><span class="s">${f.status === 'live' ? f.score.away : ''}</span></div>
      </div>
      <div class="match-card__odds">${oddsHtml(f)}</div>
    </article>`;
  }

  function render() {
    const list = document.getElementById('matchList');
    if (!list || !DATA) return;

    let fixtures = PrimeBet.allFixtures(DATA);
    if (activeSport !== 'all') {
      fixtures = fixtures.filter((f) => f.sport.toLowerCase() === activeSport);
    }

    // Live matches first, then by start time.
    fixtures.sort((a, b) => {
      if (a.status !== b.status) return a.status === 'live' ? -1 : 1;
      return new Date(a.start) - new Date(b.start);
    });

    list.innerHTML = fixtures.length
      ? fixtures.map(matchCard).join('')
      : '<p class="text-dim">No fixtures available for this sport right now.</p>';
  }

  function buildTabs() {
    const tabs = document.getElementById('sportsTabs');
    if (!tabs || !DATA) return;

    const sports = [{ name: 'All', key: 'all', icon: '🎯' }].concat(
      DATA.sports.map((s) => ({ name: s.name, key: s.name.toLowerCase(), icon: s.icon }))
    );

    tabs.innerHTML = sports
      .map(
        (s) =>
          `<button class="sport-tab ${s.key === activeSport ? 'active' : ''}" data-key="${s.key}">
            <span>${s.icon}</span>${s.name}
          </button>`
      )
      .join('');

    tabs.querySelectorAll('.sport-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeSport = btn.dataset.key;
        tabs.querySelectorAll('.sport-tab').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        render();
      });
    });
  }

  // Nudge live odds every few seconds for a live feel.
  function startLiveDrift() {
    setInterval(() => {
      if (!DATA) return;
      DATA.sports.forEach((s) =>
        s.fixtures.forEach((f) => {
          if (f.status === 'live') {
            f.odds.home = PrimeBet.drift(f.odds.home);
            f.odds.draw = PrimeBet.drift(f.odds.draw);
            f.odds.away = PrimeBet.drift(f.odds.away);
          }
        })
      );
      render();
    }, 5000);
  }

  async function init() {
    DATA = await PrimeBet.loadFixtures();
    buildTabs();
    render();
    startLiveDrift();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
