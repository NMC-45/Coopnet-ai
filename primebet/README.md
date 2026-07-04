# PrimeBet ⚽🏀🎾

A professional, **live** sports-betting demo website — real-time odds, live in-play
scores, promotions with countdown timers, and an auto-refreshing fixtures feed.

> ⚠️ **Demo project.** PrimeBet is not a real bookmaker and takes no real wagers.
> It exists to showcase a modern sportsbook front-end. **18+ — bet responsibly.**

## Pages

| Page | Description |
|------|-------------|
| `index.html`  | Landing page — hero, live spotlight match, live odds ticker, features |
| `sports.html` | Sportsbook — filter by sport, live/upcoming fixtures, drifting live odds |
| `promos.html` | Promotions — offer cards with live countdown timers |

## Structure

```
primebet/
├── index.html                    # Home
├── sports.html                   # Sportsbook
├── promos.html                   # Promotions
├── css/styles.css                # All styles (dark, responsive)
├── js/ticker.js                  # Data loader + live ticker + shared helpers
├── js/sports.js                  # Sportsbook rendering + live odds drift
├── js/promos.js                  # Promo cards + countdown timers
├── data/fixtures.json            # Fixtures + odds feed (consumed by the site)
├── scripts/fetch-fixtures.js     # Regenerates fixtures.json (Node, no deps)
└── scripts/daily-refresh.yml.txt # Daily auto-refresh workflow (see note below)
```

## Run locally

The pages fetch `data/fixtures.json`, so serve over HTTP (not `file://`):

```bash
cd primebet
python3 -m http.server 8080
# open http://localhost:8080
```

## Refresh the odds feed

```bash
node scripts/fetch-fixtures.js
```

This rewrites `data/fixtures.json` with a fresh timestamp and rolling schedule.
In production, swap `buildFixtures()` for a licensed odds-provider API call.

## Keeping it live

`scripts/fetch-fixtures.js` runs daily via GitHub Actions to keep fixtures fresh.

> **Note:** GitHub Actions only reads workflows from the repository **root**
> `.github/workflows/`. The ready-made workflow ships here as
> `primebet/scripts/daily-refresh.yml.txt` (it's stored as `.txt` because pushing
> to `.github/workflows/` requires a token with `workflows` scope). To activate
> scheduled runs, copy it to the repo root:
>
> ```bash
> mkdir -p .github/workflows
> cp primebet/scripts/daily-refresh.yml.txt .github/workflows/daily-refresh.yml
> git add .github/workflows/daily-refresh.yml && git commit && git push
> ```
>
> It already references `primebet/scripts/fetch-fixtures.js`.

## Tech

Plain HTML, CSS and vanilla JS — no build step, no dependencies. Deploys to any
static host (GitHub Pages, Netlify, Vercel).
