import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowUpRight, Sparkles, Gamepad2, LayoutGrid, Infinity as InfinityIcon } from "lucide-react";
import EcosystemNav from "../components/EcosystemNav";
import RRSubnav from "../components/RRSubnav";

const fr = { fontFamily: "'Fraunces', Georgia, serif" };
const ge = { fontFamily: "'Geist', system-ui, sans-serif" };
const INK = "#ffffff";
const MUTED = "#7a92a8";
const ACCENT = "#00e5ff";
const BG0 = "#000d1a";
const SURFACE = "#0c1c30";
const NAV_THEME = { bar: "rgba(0,13,26,0.82)", border: "rgba(0,229,255,0.16)", text: MUTED, activeText: INK, accent: ACCENT };

const plans = [
  {
    key: "free",
    name: "Free",
    price: "$0",
    cadence: "",
    blurb: "Get started at no cost and explore the basics.",
    features: ["Limited online account features", "Use RootRecord apps", "Community support on Discord"],
    cta: "Create account",
    href: "https://account.rootrecord.info/",
    highlight: false,
  },
  {
    key: "monthly",
    name: "Monthly",
    price: "$4.99",
    cadence: "/ month",
    blurb: "Low ongoing price, cancel whenever you like.",
    features: ["Full access to eligible online features", "Subscription-linked app access", "Manage or upgrade anytime", "Cancel at any time"],
    cta: "Get started",
    href: "https://account.rootrecord.info/",
    highlight: true,
    tag: "Popular",
  },
  {
    key: "lifetime",
    name: "Lifetime",
    price: "$150",
    cadence: "one time",
    blurb: "One payment. Every app on every network — for life.",
    features: [
      "Every app across RootRecord + RootMC networks",
      "All current & future RootRecord software",
      "All future updates included",
      "No recurring charges, ever",
    ],
    cta: "Buy lifetime",
    href: "https://account.rootrecord.info/",
    highlight: false,
    tag: "Best value",
  },
];

const networks = [
  { icon: LayoutGrid, name: "RootRecord", desc: "Kīlauea Alerts, Weather Manager, Business Manager, Root Goals, Account Hub", accent: ACCENT },
  { icon: Gamepad2, name: "RootMC", desc: "The RootMC survival network — economy terminal, market, rewards and player tools", accent: "#C98A2B" },
];

export default function RootRecordPricing() {
  return (
    <div style={{ ...ge, background: BG0, color: INK }} className="min-h-screen" data-testid="rootrecord-pricing-page">
      <EcosystemNav
        active="rootrecord"
        theme={NAV_THEME}
      />
      <RRSubnav active="pricing" />

      {/* HERO */}
      <section className="mx-auto max-w-4xl px-5 sm:px-8 pt-16 pb-8 text-center">
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 text-[13px] font-semibold" style={{ color: ACCENT }}>
          <InfinityIcon size={16} /> One membership · every network
        </motion.span>
        <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-3 font-semibold tracking-tight text-[clamp(2.6rem,7vw,4.5rem)] leading-[0.98]" style={fr}>
          One membership for everything on our networks
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-5 max-w-2xl mx-auto text-lg leading-relaxed" style={{ color: MUTED }}>
          Start free, go monthly for flexibility, or pay once for Lifetime and keep access to every app we ship across the <strong style={{ color: INK }}>RootRecord</strong> and <strong style={{ color: INK }}>RootMC</strong> networks.
        </motion.p>
      </section>

      {/* PLANS */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 pb-6">
        <div className="grid md:grid-cols-3 gap-5 items-stretch">
          {plans.map((p, i) => (
            <motion.article
              key={p.key}
              initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              data-testid={`rr-plan-${p.key}`}
              className="relative rounded-2xl p-8 flex flex-col"
              style={{
                background: SURFACE,
                color: INK,
                border: p.highlight ? "1px solid rgba(0,229,255,0.45)" : "1px solid rgba(0,229,255,0.16)",
                boxShadow: p.highlight ? "0 24px 60px -24px rgba(0,229,255,0.45)" : "none",
              }}
            >
              {p.tag && (
                <span className="absolute -top-3 left-8 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide"
                  style={{ background: ACCENT, color: BG0 }}>{p.tag}</span>
              )}
              <h3 className="font-semibold text-2xl" style={fr}>{p.name}</h3>
              <p className="mt-1 text-[14.5px]" style={{ color: MUTED }}>{p.blurb}</p>
              <div className="mt-6 flex items-end gap-2">
                <span className="font-semibold text-5xl tracking-tight" style={fr}>{p.price}</span>
                {p.cadence && <span className="mb-1.5 text-[14px]" style={{ color: MUTED }}>{p.cadence}</span>}
              </div>
              <ul className="mt-6 space-y-3 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[15px]">
                    <span className="mt-0.5 h-5 w-5 rounded-full grid place-items-center shrink-0"
                      style={{ background: `${ACCENT}22`, color: ACCENT }}>
                      <Check size={13} />
                    </span>
                    <span style={{ color: MUTED }}>{f}</span>
                  </li>
                ))}
              </ul>
              <a href={p.href} target="_blank" rel="noopener noreferrer"
                data-testid={`rr-plan-cta-${p.key}`}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-semibold transition-transform hover:-translate-y-0.5"
                style={{
                  background: ACCENT,
                  color: BG0,
                }}>
                {p.cta} <ArrowUpRight size={16} />
              </a>
            </motion.article>
          ))}
        </div>
        <p className="mt-5 text-center text-[13.5px]" style={{ color: MUTED }}>
          Prices in U.S. dollars. Already a member? Sign in on Account to see your current plan.
        </p>
      </section>

      {/* WHAT'S INCLUDED — networks */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-16">
        <div className="rounded-[28px] p-8 sm:p-12" style={{ background: SURFACE, border: "1px solid rgba(0,229,255,0.16)" }}>
          <div className="flex items-center gap-2">
            <Sparkles size={18} style={{ color: ACCENT }} />
            <span className="text-[13px] font-semibold uppercase tracking-wide" style={{ color: ACCENT }}>What Lifetime unlocks</span>
          </div>
          <h2 className="mt-3 font-semibold text-3xl sm:text-4xl tracking-tight" style={fr}>Two networks. <em>One key.</em></h2>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed" style={{ color: MUTED }}>
            Your RootRecord account is the single sign-in for the whole ecosystem. One membership carries across both networks — no separate purchases, no per-app upsells.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 gap-5">
            {networks.map((n) => (
              <div key={n.name} className="rounded-2xl p-6" style={{ background: BG0, border: "1px solid rgba(0,229,255,0.16)" }}>
                <span className="h-10 w-10 rounded-xl grid place-items-center" style={{ background: `${n.accent}1f`, color: n.accent }}><n.icon size={20} /></span>
                <h3 className="mt-4 font-semibold text-xl" style={fr}>{n.name}</h3>
                <p className="mt-2 text-[15px] leading-relaxed" style={{ color: MUTED }}>{n.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t py-10" style={{ borderColor: "rgba(0,229,255,0.16)" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-8 text-sm flex flex-wrap gap-x-6 gap-y-2" style={{ color: MUTED }}>
          <Link to="/" style={{ color: ACCENT }}>RootRecord home</Link>
          <Link to="/about" style={{ color: ACCENT }}>About</Link>
          <Link to="/" style={{ color: ACCENT }}>Home</Link>
          <span>© {new Date().getFullYear()} RootRecord</span>
        </div>
      </footer>
    </div>
  );
}
