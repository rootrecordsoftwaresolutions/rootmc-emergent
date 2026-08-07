# RootMC — Emergent deployment repo

Standalone GitHub repo for **Emergent AI** to own large, cross-surface updates across RootMC **web**, **API Workers**, **edge**, **apps**, and **Android**. Minecraft plugin source and live Shockbyte deploy stay in the canonical workstation; this repo is the condensed Web Files surface.

Re-export from Ava OptiPlex:

```bash
bash /home/ava-core/ava/workstations/rootmc/scripts/export-emergent-repo.sh
```

## What’s in this repo

| Path | Production | Role |
|------|------------|------|
| [`web/`](web/) | https://rootmc.net | Cloudflare Pages — static site, economy/market/governance UI |
| [`api/rootmc-api/`](api/rootmc-api/) | https://api.rootmc.net | Worker deploy target (gateway + crons) |
| [`api/rootmc-api-g2/`](api/rootmc-api-g2/) | *(gen-2 / experimental)* | Alternate API Worker |
| [`api/rootmc-realm-api/`](api/rootmc-realm-api/) | *(bundled into worker)* | RootMC routes, Discord, economy sync, `/link` auth |
| [`api/shared/`](api/shared/) | — | Vendored RootRecord shared TS |
| [`api/rootrecord-api-account/`](api/rootrecord-api-account/) | — | Account shard (auth, FCM, D1 migrations) |
| [`edge/rootmc-ava-edge/`](edge/rootmc-ava-edge/) | ava.rootmc.net edge | Public chat / Ava edge Worker |
| [`edge/rootmc-webstat-proxy/`](edge/rootmc-webstat-proxy/) | — | Webstat proxy |
| [`edge/rootmc-minecraft-map/`](edge/rootmc-minecraft-map/) | map.rootmc.net | Map surface |
| [`apps/rootmc-app/`](apps/rootmc-app/) | — | Web companion app surface |
| [`apps/rootmc-ava/`](apps/rootmc-ava/) | — | Ava web surface |
| [`apps/rootmc-sexi/`](apps/rootmc-sexi/) | — | Legacy/aux web package |
| [`apps/rootmc-ava-desktop/`](apps/rootmc-ava-desktop/) | — | Ava desktop (source; no node_modules) |
| [`android/`](android/) | Play: `com.rootrecord.rootmc` | Kotlin / Compose companion app |
| [`frontend/`](frontend/) + [`backend/`](backend/) | Emergent preview / future `app.rootmc.net` | React PWA + FastAPI |

**Emergent final push:** [EMERGENT-READ-THIS.md](EMERGENT-READ-THIS.md) → [docs/EMERGENT-LAST-PUSH.md](docs/EMERGENT-LAST-PUSH.md)

## Live URLs

| Service | URL |
|---------|-----|
| Game | `play.rootmc.net` |
| Website | https://rootmc.net |
| API | https://api.rootmc.net |
| Map | https://map.rootmc.net |
| Ava | https://ava.rootmc.net |
| Constitution (wiki) | https://rootmc.net/wiki/constitution/ |
| Discord | https://discord.gg/rFFQYrNaqS |

## Ecosystem (read before big changes)

- **[ECOSYSTEM.md](ECOSYSTEM.md)** — full map: plugins, server, treasury rules, RootRecord vs RootMC
- **[PROMPT.md](PROMPT.md)** — Emergent agent brief (scope, constraints, deliverables)
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — data flow web ↔ API ↔ Android ↔ game
- **[docs/DEPLOY.md](docs/DEPLOY.md)** — deploy commands and secrets
- **[docs/PLUGINS-AND-SERVER.md](docs/PLUGINS-AND-SERVER.md)** — Paper plugins + Shockbyte (outside this repo)

## Notes for Emergent

- No `node_modules`, `.env`, keystores, or `google-services.json` in this export.
- Prefer editing packages under `web/`, `api/`, `edge/`, `apps/`, `android/` then human deploys with Wrangler / Gradle.
- Canonical live copies on Ava-core: `workstations/rootmc/Web Files/` — re-run the export script after workstation changes.
