# Test credentials

## RootMC (in-app `/link` demo auth)
- No fixed username/password. RootMC uses Minecraft `/link` code flow.
- Preview runs with `REACT_APP_USE_MOCK=true` and `REACT_APP_DEMO_LINK=true`:
  go to `/rootmc/auth`, enter any Minecraft username (3–16 chars), click "Request code".
  A demo 6-char code is issued and pre-filled; click "Complete link" to sign in.
- No external API keys required for the preview (mock FastAPI backend serves /api/*).

## RootRecord / Ava
- Static marketing/wiki sections. External product links (Google Play, *.rootrecord.info,
  ava.rootmc.net) point to real production and open in new tabs — no auth needed on this site.
