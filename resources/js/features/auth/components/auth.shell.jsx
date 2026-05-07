import React from 'react';

export default function AuthShell({
  eyebrow,
  title,
  description,
  badge,
  highlights = [],
  children,
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.20),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(2,6,23,1))]" />
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-stretch px-4 py-8 md:px-8 lg:grid-cols-[1.05fr_minmax(380px,460px)] lg:gap-8 lg:px-10">
        <section className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl lg:p-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
              <span className="h-2 w-2 rounded-full bg-cyan-300" />
              {eyebrow}
            </div>

            <div className="max-w-2xl space-y-5">
              <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
                {title}
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-300 md:text-lg">
                {description}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {highlights.map((highlight) => (
                <div key={highlight.label} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{highlight.label}</div>
                  <div className="mt-2 text-lg font-semibold text-white">{highlight.value}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-400">{highlight.copy}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Web session auth</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Role-separated access</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Inertia + React</span>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl md:p-8 lg:mt-0">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-slate-400">{badge}</div>
              <p className="mt-2 text-sm leading-6 text-slate-400">Use the form below to continue.</p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-right text-xs text-emerald-200">
              <div className="font-semibold uppercase tracking-[0.2em]">Protected</div>
              <div className="mt-1">Session-backed routes</div>
            </div>
          </div>

          {children}
        </section>
      </div>
    </div>
  );
}