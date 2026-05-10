import React from "react";
import { Link } from "@inertiajs/react";

const themes = {
  amber: {
    panel: "bg-[linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(224,242,254,0.92))]",
    glow: "bg-[radial-gradient(circle_at_top_right,_rgba(125,211,252,0.35),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(245,158,11,0.12),_transparent_30%)]",
    badge: "border-sky-200 bg-white/90 text-sky-700",
    pill: "border-sky-100 bg-white text-sky-700",
    accent: "from-sky-500 via-cyan-400 to-sky-300",
  },
  violet: {
    panel: "bg-[linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(240,249,255,0.92))]",
    glow: "bg-[radial-gradient(circle_at_top_right,_rgba(125,211,252,0.28),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(196,181,253,0.12),_transparent_30%)]",
    badge: "border-sky-200 bg-white/90 text-sky-700",
    pill: "border-sky-100 bg-white text-sky-700",
    accent: "from-sky-500 via-cyan-400 to-sky-300",
  },
  emerald: {
    panel: "bg-[linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(245,245,244,0.96))]",
    glow: "bg-[radial-gradient(circle_at_top_right,_rgba(125,211,252,0.22),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(202,138,4,0.08),_transparent_34%)]",
    badge: "border-sky-200 bg-white/90 text-sky-700",
    pill: "border-sky-100 bg-white text-sky-700",
    accent: "from-sky-500 via-cyan-400 to-sky-300",
  },
};

function FeatureCard({ theme, feature }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm backdrop-blur-sm">
      <div className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${theme.pill}`}>
        {feature.kicker}
      </div>
      <h3 className="mt-3 text-lg font-semibold text-slate-900">{feature.title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-500">{feature.description}</p>
    </div>
  );
}

export default function AuthSplitLayout({
  badge,
  title,
  subtitle,
  features = [],
  accent = "amber",
  reverse = false,
  leftFooter,
  children,
}) {
  const theme = themes[accent] || themes.amber;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(186,230,253,0.4),_transparent_32%),linear-gradient(180deg,_rgba(248,250,252,0.98),_rgba(241,245,249,1))]" />
      <div className={`relative mx-auto grid min-h-screen max-w-7xl gap-6 p-4 sm:p-6 lg:grid-cols-[1.08fr_0.92fr] lg:p-8 ${reverse ? "lg:grid-flow-col-dense" : ""}`}>
        <section className={`relative overflow-hidden rounded-[2rem] border border-sky-100 ${theme.panel} ${reverse ? "lg:order-2" : ""} shadow-sm`}>
          <div className={`absolute inset-0 ${theme.glow}`} />
          <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.55),_transparent_28%)]" />
          <div className="relative flex h-full flex-col justify-between p-6 sm:p-8 lg:p-10">
            <div className="max-w-xl">
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] ${theme.badge}`}>
                {badge}
              </span>
              <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                {subtitle}
              </p>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {features.map((feature) => (
                <FeatureCard key={feature.title} feature={feature} theme={theme} />
              ))}
            </div>

            {leftFooter ? <div className="mt-8">{leftFooter}</div> : null}
          </div>
        </section>

        <section className={`flex items-center justify-center ${reverse ? "lg:order-1" : ""}`}>
          <div className="w-full max-w-xl rounded-[2rem] border border-sky-100 bg-white p-5 text-slate-900 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.18)] sm:p-8 lg:p-10">
            <div className={`mb-8 h-1.5 w-24 rounded-full bg-gradient-to-r ${theme.accent}`} />
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}