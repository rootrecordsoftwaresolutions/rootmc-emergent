import React from "react";
import { Link } from "react-router-dom";

const MUTED = "#7a92a8";
const ACCENT = "#00e5ff";
const BG0 = "#000d1a";
const ge = { fontFamily: "'Geist', system-ui, sans-serif" };

const items = [
  { to: "/", key: "home", label: "Home" },
  { to: "/#products", key: "products", label: "Products" },
  { to: "/pricing", key: "pricing", label: "Pricing" },
  { to: "/about", key: "about", label: "About" },
];

/** Secondary in-section navigation for the RootRecord brand pages. */
export default function RRSubnav({ active = "home" }) {
  return (
    <div className="border-b" style={{ borderColor: "rgba(0,229,255,0.16)", background: "rgba(0,13,26,0.72)" }} data-testid="rr-subnav">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 h-12 flex items-center gap-1 overflow-x-auto" style={ge}>
        {items.map((it) => {
          const on = it.key === active;
          return (
            <Link
              key={it.key}
              to={it.to}
              data-testid={`rr-subnav-${it.key}`}
              className="shrink-0 px-3.5 py-1.5 rounded-full text-[13.5px] font-medium transition-colors"
              style={{
                color: on ? BG0 : MUTED,
                background: on ? ACCENT : "transparent",
              }}
            >
              {it.label}
            </Link>
          );
        })}
        <a
          href="https://rootrecord.info/account"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="rr-subnav-account"
          className="ml-auto shrink-0 px-3.5 py-1.5 rounded-full text-[13.5px] font-semibold"
          style={{ border: `1px solid ${ACCENT}`, color: ACCENT }}
        >
          Account
        </a>
      </div>
    </div>
  );
}
