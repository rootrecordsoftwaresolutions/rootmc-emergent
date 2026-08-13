import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight, HardDrive, Globe, Hammer, Map, Shield, Network } from "lucide-react";
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

const sections = [
  {
    icon: HardDrive,
    title: "How we think about data",
    body: "Where a product stores a database on your device, that data stays there unless you move it or use features that copy or sync data you have configured. Sign-in and online services are for subscription, sync, backup, or other features — only when you use them.",
  },
  {
    icon: Globe,
    title: "One web account",
    body: "Your RootRecord account hosts sign-in, settings and billing that tie into our apps where configured. Use Account and Billing from any browser to check status and manage the single membership that spans both networks.",
  },
  {
    icon: Network,
    title: "Two networks, one grounding root",
    body: "RootRecord (operations, weather, business) and RootMC (the survival network) share the same account and the same membership. One key, everywhere we ship.",
  },
  {
    icon: Hammer,
    title: "Custom app development",
    body: "Need something built for your workflow, team, or customers? Submit an app build request with purpose, platforms, scope, timeline and how to reach you — we will follow up with next steps.",
  },
  {
    icon: Map,
    title: "Roadmap",
    body: "See what we ship today and what is queued next on the public roadmap. Priorities change as we learn from beta testers and production use.",
  },
  {
    icon: Shield,
    title: "Contact & policies",
    body: "Questions about plans, data or privacy? Reach us on Discord or Contact. Our Terms and Privacy pages cover billing, data handling and the details that apply at checkout.",
  },
];

export default function RootRecordAbout() {
  return (
    <div style={{ ...ge, background: BG0, color: INK }} className="min-h-screen" data-testid="rootrecord-about-page">
      <EcosystemNav
        active="rootrecord"
        theme={NAV_THEME}
      />
      <RRSubnav active="about" />

      {/* HERO */}
      <section className="mx-auto max-w-4xl px-5 sm:px-8 pt-16 pb-10">
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
          className="text-[13px] font-semibold" style={{ color: ACCENT }}>About RootRecord</motion.span>
        <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-3 font-semibold tracking-tight text-[clamp(2.6rem,7vw,4.8rem)] leading-[0.98]" style={fr}>
          Capable tools, without giving up control.
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-6 max-w-2xl text-lg leading-relaxed" style={{ color: MUTED }}>
          RootRecord builds multi-device software for people who want real operational tools — on the desk, in the field, and everywhere between. Product-specific features, install paths and screenshots live on each program's page under <Link to="/#products" style={{ color: ACCENT, textDecoration: "underline" }}>Products</Link>.
        </motion.p>
      </section>

      {/* SECTIONS */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 pb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sections.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
              data-testid={`rr-about-${s.title.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "")}`}
              className="rounded-2xl p-7" style={{ background: SURFACE, border: "1px solid rgba(0,229,255,0.16)" }}
            >
              <span className="h-10 w-10 rounded-xl grid place-items-center" style={{ background: `${ACCENT}22`, color: ACCENT }}><s.icon size={20} /></span>
              <h3 className="mt-4 font-semibold text-xl" style={fr}>{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed" style={{ color: MUTED }}>{s.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 pb-20">
        <div className="rounded-[28px] p-10 sm:p-14 text-white" style={{ background: SURFACE, border: "1px solid rgba(0,229,255,0.22)" }}>
          <h2 className="font-semibold text-3xl sm:text-4xl tracking-tight" style={fr}>One account. One membership. <em>Every network.</em></h2>
          <p className="mt-4 max-w-2xl text-[17px]" style={{ color: "rgba(255,255,255,0.72)" }}>
            Explore what a single RootRecord membership unlocks across RootRecord and RootMC, or jump into the products.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/pricing" data-testid="rr-about-see-pricing"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold" style={{ background: ACCENT, color: BG0 }}>
              See pricing <ArrowRight size={16} />
            </Link>
            <Link to="/#products"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold" style={{ border: "1px solid rgba(255,255,255,0.25)", color: "#fff" }}>
              View products
            </Link>
            <a href="https://account.rootrecord.info/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold" style={{ border: "1px solid rgba(255,255,255,0.25)", color: "#fff" }}>
              Account hub <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t py-10" style={{ borderColor: "rgba(0,229,255,0.16)" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-8 text-sm flex flex-wrap gap-x-6 gap-y-2" style={{ color: MUTED }}>
          <Link to="/" style={{ color: ACCENT }}>RootRecord home</Link>
          <Link to="/pricing" style={{ color: ACCENT }}>Pricing</Link>
          <Link to="/" style={{ color: ACCENT }}>Home</Link>
          <span>© {new Date().getFullYear()} RootRecord</span>
        </div>
      </footer>
    </div>
  );
}
