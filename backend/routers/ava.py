"""Ava core status endpoints: live-feeling solar/host/weather board + powered-by badge."""
from __future__ import annotations

import math
import random

from fastapi import APIRouter

from core import iso, now_utc

router = APIRouter(prefix="/ava", tags=["ava"])


def _solar_watts(now) -> float:
    """Daytime solar curve (HST ~ UTC-10). Peaks near local noon."""
    hour = (now.hour - 10) % 24  # crude HST offset
    # bell curve centred at 12, ~6am–8pm production window
    x = (hour - 12) / 4.0
    base = 1650 * math.exp(-x * x)
    if hour < 6 or hour > 20:
        base = 0.0
    return round(max(0.0, base + random.uniform(-40, 40)), 1)


@router.get("/status")
async def ava_status():
    now = now_utc()
    solar = _solar_watts(now)
    charging = solar > 220
    soc = round(58 + 34 * math.sin(now.timestamp() / 5400) / 2 + 17 + random.uniform(-1.2, 1.2), 1)
    soc = max(22.0, min(100.0, soc))
    return {
        "online": True,
        "core": "ava-core · OptiPlex",
        "power": {
            "solar_watts": solar,
            "battery_soc_pct": soc,
            "charging": charging,
            "load_watts": round(48 + random.uniform(-6, 9), 1),
            "grid": "solar" if charging else "battery",
        },
        "host": {
            "cpu_pct": round(9 + random.uniform(0, 22), 1),
            "ram_pct": round(41 + random.uniform(-3, 6), 1),
            "temp_c": round(46 + random.uniform(-2, 5), 1),
            "uptime_days": 63,
        },
        "weather": {
            "location": "Hawaiʻi Island",
            "temp_c": round(24 + random.uniform(-1.5, 2.5), 1),
            "condition": random.choice(["Clear", "Partly cloudy", "Trade showers", "Sunny"]),
            "wind_kph": round(12 + random.uniform(-3, 8), 1),
        },
        "services": [
            {"name": "cronRunner", "ok": True},
            {"name": "local-api", "ok": True},
            {"name": "MariaDB", "ok": True},
            {"name": "Ollama", "ok": True},
            {"name": "CF tunnel", "ok": True},
        ],
        "updated_at": iso(now),
    }


@router.get("/powered-by")
async def powered_by():
    now = now_utc()
    solar = _solar_watts(now)
    soc = max(22.0, min(100.0, round(70 + 12 * math.sin(now.timestamp() / 5400) + random.uniform(-1, 1), 1)))
    return {
        "ok": True,
        "cpu": round(9 + random.uniform(0, 22), 1),
        "ram": round(41 + random.uniform(-3, 6), 1),
        "soc": soc,
        "solar": solar,
    }
