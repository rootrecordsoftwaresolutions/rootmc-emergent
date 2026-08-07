# PRD — The Root (RootMC + RootRecord + Ava unified site)

## Problem statement
Merge three existing sites — RootMC, RootRecord, and Ava — into ONE unified web app,
organized as subpages/routes per original site. Codebase is the `rootmc-emergent` monorepo.

## Architecture
Single React SPA (frontend/) with brand-namespaced routes, backed by the existing
RootMC mock FastAPI + MongoDB backend (/api/*, REACT_APP_USE_MOCK=true).

- `/`            → **The Root** portal landing (pages/Portal.jsx) — two-worlds hub + Ava core
- `/rootmc/*`    → **RootMC** trading terminal (RootMCApp.jsx, nested relative routes)
- `/rootrecord`  → **RootRecord** marketing page (pages/RootRecord.jsx)
- `/ava`         → **Ava** wiki / atlas (pages/Ava.jsx)
- Shared `components/EcosystemNav.jsx` switches between the four sections.

RootMC nested routes (inside RootMCApp): `''`, `market`, `market/:ticker`, `portfolio`,
`rewards`, `leaderboards`, `more`, `auth` — all internal nav uses `/rootmc/...` absolute paths.

### Brand design languages
- The Root: dark botanical green-black #0a1210, solar amber accent, Bricolage Grotesque + Figtree.
- RootRecord: warm paper #F4F0E7, navy ink #0B1F2A, moss #2F6B4F, Fraunces serif + Geist.
- Ava: dark wiki #0b0f14, violet #a78bfa / teal #22d3ee, Syne + DM Sans.
- RootMC: existing dark + gold terminal (Manrope/Outfit/JetBrains Mono).

## What's implemented (2026-08-07)
- Unified router + The Root portal, RootRecord and Ava sections built in React.
- RootMC PWA fully namespaced under /rootmc (bottom nav, top bar, all page nav, auth redirect).
- EcosystemNav cross-links all four sections; RootMC TopBar brand returns to The Root.
- Fixed backend crash: pinned `pydantic-core==2.27.1` (validate_core_schema import error / 502s).
- Verified: testing agent 100% (backend 38/38, frontend 12/12 scenarios).

## Backlog / next
- P1: Silence React Router v7 future-flag warnings (opt-in flags on BrowserRouter).
- P2: Post-login RootMC redirect briefly shows OFFLINE badge before next status poll (cosmetic).
- P2: Deepen RootRecord/Ava with more sub-pages (pricing, about, Ava status embed) if desired.
- P2: Switch RootMC to live api.rootmc.net (REACT_APP_USE_MOCK=false) for production.
