# RootMC + RootRecord + Ava — Emergent web monorepo

Standalone GitHub repo for **Emergent AI** with **all** website / web-app / Worker surfaces condensed into one tree: RootMC, Ava, RootRecord (live OptiPlex + archived D: web dumps). Minecraft plugins and live game deploy stay outside this repo.

Re-export from Ava OptiPlex:

```bash
bash /home/ava-core/ava/workstations/rootmc/scripts/export-emergent-repo.sh
```

## What’s in this repo

### RootMC

| Path | Production | Role |
|------|------------|------|
| [`web/`](web/) | https://rootmc.net | Cloudflare Pages — site, economy/market/governance, per-server surfaces |
| [`api/rootmc-api/`](api/rootmc-api/) | https://api.rootmc.net | Worker gateway + crons |
| [`api/rootmc-api-g2/`](api/rootmc-api-g2/) | *(gen-2)* | Alternate API Worker |
| [`api/rootmc-realm-api/`](api/rootmc-realm-api/) | *(bundled)* | RootMC routes, Discord, economy, `/link` |
| [`edge/`](edge/) | ava.rootmc.net / map.rootmc.net | Ava edge, webstat proxy, map |
| [`apps/rootmc-*`](apps/) | — | Companion web, Ava runtime, desktop, sexi |
| [`android/`](android/) | Play: `com.rootrecord.rootmc` | Kotlin / Compose companion |

### Ava

| Path | Production | Role |
|------|------------|------|
| [`apps/rootmc-ava/`](apps/rootmc-ava/) | Ava core surfaces | Ava web/runtime package |
| [`apps/rootmc-ava-desktop/`](apps/rootmc-ava-desktop/) | Desktop client | Electron source (no node_modules) |
| [`edge/rootmc-ava-edge/`](edge/rootmc-ava-edge/) | ava.rootmc.net | Public Ava edge Worker |
| [`sites/rootrecord-ava/`](sites/rootrecord-ava/) | rootrecord.info/ava | Ava wiki / status Worker + assets |
| [`sites/rootrecord-merged/`](sites/rootrecord-merged/) | — | Merged Ava landing experiment |

### RootRecord

| Path | Production | Role |
|------|------------|------|
| [`sites/rootrecord-main/`](sites/rootrecord-main/) | https://rootrecord.info | Main marketing / account / charts site (archived live dump) |
| [`sites/rootrecord-solana/`](sites/rootrecord-solana/) | Solana site | Live `solana-rootrecord-site` |
| [`api/rootrecord-primary/`](api/rootrecord-primary/) | API primary | Auth + D1 `root-record` Worker |
| [`api/rootrecord-api-*`](api/) | API shards | account, business, goals, kilauea, token, weather |
| [`api/rootrecord-license/`](api/rootrecord-license/) | License | License Worker |
| [`api/rootrecord-minecraft-map/`](api/rootrecord-minecraft-map/) | Map | Map Worker |
| [`api/rootrecord-solana-tx/`](api/rootrecord-solana-tx/) | Solana tx | Tx Worker |
| [`apps/*-web`](apps/) | Product apps | weather-manager, business-manager, root-goals, farms, kilauea-alerts, realm, token-manager, account-hub, visiting-hawaii |

### Archives (merge / diff only)

| Path | Role |
|------|------|
| [`archive/rootmc-web-files-pre-august/`](archive/rootmc-web-files-pre-august/) | Older RootMC Web Files snapshot |
| [`archive/rootmc-web-files-08052026/`](archive/rootmc-web-files-08052026/) | Dated RootMC dump |
| [`archive/rootrecord-web-pre-august/`](archive/rootrecord-web-pre-august/) | Full RootRecord web dump (main + apps + cloudflare) |

[`frontend/`](frontend/) + [`backend/`](backend/) remain Emergent preview / future `app.rootmc.net`.

**Emergent final push:** [EMERGENT-READ-THIS.md](EMERGENT-READ-THIS.md) → [docs/EMERGENT-LAST-PUSH.md](docs/EMERGENT-LAST-PUSH.md)

## Live URLs

| Service | URL |
|---------|-----|
| RootMC game | `play.rootmc.net` |
| RootMC website | https://rootmc.net |
| RootMC API | https://api.rootmc.net |
| RootMC map | https://map.rootmc.net |
| Ava (RootMC) | https://ava.rootmc.net |
| RootRecord | https://rootrecord.info |
| Ava (RootRecord) | https://rootrecord.info/ava |

## Ecosystem

- **[ECOSYSTEM.md](ECOSYSTEM.md)** — plugins, server, treasury, RootRecord vs RootMC
- **[PROMPT.md](PROMPT.md)** — Emergent agent brief
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — layout + data flow
- **[docs/DEPLOY.md](docs/DEPLOY.md)** — deploy commands

## Notes for Emergent

- No `node_modules`, `.env`, keystores, or `google-services.json` in this export.
- Prefer live packages under `web/`, `api/`, `edge/`, `apps/`, `sites/` over `archive/` unless diffing history.
- Re-run the export script after workstation changes, then commit/push.
