import React from "react";

export default function CustomerReturnsPage() {
  return (
    <section className="space-y-4 rounded-[2rem] border border-sky-100 bg-white p-6 shadow-sm">
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-sky-500">Returns</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Return requests</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Review return eligibility, request a pickup, or follow pending returns.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">No returns in progress</p>
          <p className="mt-2 text-sm text-slate-500">When you start a return, it will appear here with its current status.</p>
        </article>
        <article className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">How returns work</p>
          <p className="mt-2 text-sm text-slate-500">Use this area to manage item pickup, approval, and refund updates.</p>
        </article>
      </div>
    </section>
  );
}