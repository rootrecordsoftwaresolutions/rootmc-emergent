/**
 * Gaming bonus + host taxes + skills XP from solar / CPU.
 *
 * Gold track 10%–100% bank: 10% → 1.0×, 100% → 2.0×.
 * Offline / underpowered (bank &lt; 10%) → 10% tax + 0.90× mining.
 *
 * CPU average:
 *   &lt; 75%  → gold gaming bonus active (if bank track ok)
 *   75–89% → +1% tax on everything, gold bonus paused (1.0×)
 *   90–100% → +3% tax on everything, gold bonus paused (1.0×)
 *
 * Skills XP: +0.01× per 100 W solar input (floor).
 */
export const GAMING_TRACK_FLOOR = 10;
export const GAMING_TRACK_CEIL = 100;
export const GAMING_MULT_AT_FLOOR = 1;
export const GAMING_MULT_AT_CEIL = 2;
export const GAMING_UNDERPOWERED_TAX = 0.1;
export const GAMING_UNDERPOWERED_MULT = 0.9;
export const CPU_BONUS_MAX = 75;
export const CPU_TAX_HIGH = 90;
export const CPU_TAX_MILD = 0.01;
export const CPU_TAX_HEAVY = 0.03;
export const XP_WATTS_STEP = 100;
export const XP_PER_STEP = 0.01;

function round3(n) {
  return Math.round(Number(n) * 1000) / 1000;
}

function clamp(n, lo, hi) {
  return Math.min(hi, Math.max(lo, n));
}

export function cpuTaxRate(cpuPercent) {
  if (cpuPercent == null || !Number.isFinite(Number(cpuPercent))) return 0;
  const cpu = clamp(Number(cpuPercent), 0, 100);
  if (cpu >= CPU_TAX_HIGH) return CPU_TAX_HEAVY;
  if (cpu >= CPU_BONUS_MAX) return CPU_TAX_MILD;
  return 0;
}

export function solarXpMultiplier(solarW) {
  if (solarW == null || !Number.isFinite(Number(solarW)) || Number(solarW) <= 0) {
    return 1;
  }
  const steps = Math.floor(Number(solarW) / XP_WATTS_STEP);
  return round3(1 + steps * XP_PER_STEP);
}

/**
 * @param {number|null|undefined} batteryPercent
 * @param {boolean} online host + live bank feed
 */
export function computeSolarMiningMultiplier(batteryPercent, online) {
  return resolveGamingBonus(batteryPercent, online).multiplier;
}

/**
 * @param {number|null|undefined} batteryPercent
 * @param {boolean} hostOnline
 * @param {{ cpuPct?: number|null, solarW?: number|null }} [extras]
 */
export function resolveGamingBonus(batteryPercent, hostOnline, extras = {}) {
  const bank =
    batteryPercent != null && Number.isFinite(Number(batteryPercent))
      ? clamp(Number(batteryPercent), 0, 100)
      : null;
  const cpu =
    extras.cpuPct != null && Number.isFinite(Number(extras.cpuPct))
      ? clamp(Number(extras.cpuPct), 0, 100)
      : null;
  const solarW =
    extras.solarW != null && Number.isFinite(Number(extras.solarW))
      ? Math.max(0, Number(extras.solarW))
      : null;
  const cpuTax = cpuTaxRate(cpu);
  const cpuHot = cpu != null && cpu >= CPU_BONUS_MAX;
  const xpMult = solarXpMultiplier(solarW);
  const powered = Boolean(hostOnline) && bank != null && bank >= GAMING_TRACK_FLOOR;

  if (!powered) {
    const underTax = GAMING_UNDERPOWERED_TAX;
    return {
      battery_percent: bank,
      track_percent: bank,
      multiplier: GAMING_UNDERPOWERED_MULT,
      tax_rate: round3(underTax + cpuTax),
      underpowered_tax_rate: underTax,
      cpu_tax_rate: cpuTax,
      cpu_percent: cpu,
      solar_w: solarW,
      xp_multiplier: xpMult,
      bonus: 0,
      online: false,
      host_online: Boolean(hostOnline),
      underpowered: Boolean(hostOnline),
      cpu_hot: cpuHot,
      mode: "tax",
      detail: !hostOnline
        ? "host_offline"
        : bank == null
          ? "no_bank"
          : "underpowered",
    };
  }

  if (cpuHot) {
    return {
      battery_percent: bank,
      track_percent: clamp(bank, GAMING_TRACK_FLOOR, GAMING_TRACK_CEIL),
      multiplier: 1,
      tax_rate: cpuTax,
      underpowered_tax_rate: 0,
      cpu_tax_rate: cpuTax,
      cpu_percent: cpu,
      solar_w: solarW,
      xp_multiplier: xpMult,
      bonus: 0,
      online: false,
      host_online: true,
      underpowered: false,
      cpu_hot: true,
      mode: "tax",
      detail: cpuTax >= CPU_TAX_HEAVY ? "cpu_90" : "cpu_75",
    };
  }

  const track = clamp(bank, GAMING_TRACK_FLOOR, GAMING_TRACK_CEIL);
  const span = GAMING_TRACK_CEIL - GAMING_TRACK_FLOOR;
  const multiplier = round3(
    GAMING_MULT_AT_FLOOR +
      ((track - GAMING_TRACK_FLOOR) / span) * (GAMING_MULT_AT_CEIL - GAMING_MULT_AT_FLOOR),
  );
  return {
    battery_percent: bank,
    track_percent: track,
    multiplier,
    tax_rate: 0,
    underpowered_tax_rate: 0,
    cpu_tax_rate: 0,
    cpu_percent: cpu,
    solar_w: solarW,
    xp_multiplier: xpMult,
    bonus: round3(multiplier - 1),
    online: true,
    host_online: true,
    underpowered: false,
    cpu_hot: false,
    mode: "bonus",
    detail: "live",
  };
}

/**
 * From Ava /api/solar live block.
 * Prefers last-hour CPU average, then instant CPU.
 */
export function miningMultiplierFromLive(live = {}) {
  const battery =
    live?.batteryPct != null && Number.isFinite(Number(live.batteryPct))
      ? Number(live.batteryPct)
      : null;
  const hostOnline = live?.hostOnline !== false;
  const cpu =
    live?.cpuHour != null && Number.isFinite(Number(live.cpuHour))
      ? Number(live.cpuHour)
      : live?.cpu != null && Number.isFinite(Number(live.cpu))
        ? Number(live.cpu)
        : null;
  const solarW =
    live?.solarW != null && Number.isFinite(Number(live.solarW))
      ? Number(live.solarW)
      : null;
  const resolved = resolveGamingBonus(battery, hostOnline, { cpuPct: cpu, solarW });
  return {
    ...resolved,
    source: "ecoflow.bankSoc+host.cpu",
  };
}
