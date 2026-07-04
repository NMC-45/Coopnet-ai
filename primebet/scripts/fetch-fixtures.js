#!/usr/bin/env node
/* =====================================================================
   fetch-fixtures.js
   Regenerates data/fixtures.json so the site always shows fresh,
   plausible fixtures. Runs locally or via the daily GitHub Action.

   In a real deployment you'd swap `buildFixtures()` for a call to a
   licensed odds/data provider. This version generates deterministic-ish
   sample data with a rolling schedule so the site never looks stale.
   ===================================================================== */

const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'data', 'fixtures.json');

function iso(offsetMinutes) {
  return new Date(Date.now() + offsetMinutes * 60000).toISOString();
}

function odd(base) {
  const jitter = (Math.random() - 0.5) * 0.4;
  return Math.max(1.05, +(base + jitter).toFixed(2));
}

function buildFixtures() {
  return {
    updated: new Date().toISOString(),
    sports: [
      {
        key: 'football',
        name: 'Football',
        icon: '⚽',
        fixtures: [
          {
            id: 'fb-1001', league: 'Premier League',
            home: 'Arsenal', away: 'Manchester City',
            start: iso(-45), status: 'live', minute: 63,
            score: { home: 1, away: 2 },
            odds: { home: odd(3.4), draw: odd(3.6), away: odd(2.05) },
          },
          {
            id: 'fb-1002', league: 'La Liga',
            home: 'Real Madrid', away: 'Sevilla',
            start: iso(90), status: 'upcoming', minute: null,
            score: { home: 0, away: 0 },
            odds: { home: odd(1.55), draw: odd(4.1), away: odd(6.2) },
          },
          {
            id: 'fb-1003', league: 'Serie A',
            home: 'Inter Milan', away: 'Juventus',
            start: iso(1440), status: 'upcoming', minute: null,
            score: { home: 0, away: 0 },
            odds: { home: odd(2.3), draw: odd(3.2), away: odd(3.1) },
          },
        ],
      },
      {
        key: 'basketball',
        name: 'Basketball',
        icon: '🏀',
        fixtures: [
          {
            id: 'bk-2001', league: 'NBA',
            home: 'LA Lakers', away: 'Boston Celtics',
            start: iso(-20), status: 'live', minute: null,
            score: { home: 88, away: 84 },
            odds: { home: odd(1.9), draw: null, away: odd(1.95) },
          },
          {
            id: 'bk-2002', league: 'EuroLeague',
            home: 'Real Madrid', away: 'Fenerbahce',
            start: iso(300), status: 'upcoming', minute: null,
            score: { home: 0, away: 0 },
            odds: { home: odd(1.7), draw: null, away: odd(2.15) },
          },
        ],
      },
      {
        key: 'tennis',
        name: 'Tennis',
        icon: '🎾',
        fixtures: [
          {
            id: 'tn-3001', league: 'Wimbledon',
            home: 'C. Alcaraz', away: 'J. Sinner',
            start: iso(-60), status: 'live', minute: null,
            score: { home: 2, away: 1 },
            odds: { home: odd(1.65), draw: null, away: odd(2.25) },
          },
          {
            id: 'tn-3002', league: 'Wimbledon',
            home: 'N. Djokovic', away: 'A. Zverev',
            start: iso(180), status: 'upcoming', minute: null,
            score: { home: 0, away: 0 },
            odds: { home: odd(1.5), draw: null, away: odd(2.6) },
          },
        ],
      },
    ],
  };
}

function main() {
  const data = buildFixtures();
  fs.writeFileSync(OUT, JSON.stringify(data, null, 2) + '\n');
  console.log('[fetch-fixtures] Wrote', OUT, 'at', data.updated);
}

main();
