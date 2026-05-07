import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthShell from '../../components/auth.shell';

export default function AdminLogin() {
  const { csrf_token, flash = {} } = usePage().props;
  const form = useForm({
    email: '',
    password: '',
    _token: csrf_token,
  });

  const submit = (event) => {
    event.preventDefault();

    form.post('/admin/login', {
      headers: {
        'X-CSRF-TOKEN': csrf_token,
      },
      preserveScroll: true,
      onFinish: () => form.reset('password'),
    });
  };

  return (
    <AuthShell
      eyebrow="Operator access"
      badge="Admin Login"
      title="Enter the control plane"
      description="This portal is reserved for users whose role is explicitly set to admin. The same session guard now powers the dashboard, admin product management, and admin creation flow."
      highlights={[
        {
          label: 'Guard',
          value: 'web session',
          copy: 'The admin portal now shares the same stateful Laravel session as the rest of the app.',
        },
        {
          label: 'Boundary',
          value: 'Role enforced',
          copy: 'Admin credentials cannot be used through the customer flow.',
        },
      ]}
    >
      <Head title="Admin Login" />

      {flash.success ? (
        <div className="mb-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          {flash.success}
        </div>
      ) : null}

      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Admin email</label>
          <input
            type="email"
            value={form.data.email}
            onChange={(event) => form.setData('email', event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:bg-white/8"
            placeholder="admin@example.com"
          />
          {form.errors.email ? <p className="mt-2 text-sm text-rose-300">{form.errors.email}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
          <input
            type="password"
            value={form.data.password}
            onChange={(event) => form.setData('password', event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:bg-white/8"
            placeholder="••••••••"
          />
          {form.errors.password ? <p className="mt-2 text-sm text-rose-300">{form.errors.password}</p> : null}
        </div>

        <button
          type="submit"
          disabled={form.processing}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {form.processing ? 'Signing in...' : 'Open admin dashboard'}
        </button>
      </form>

      <div className="mt-6 grid gap-3 text-sm text-slate-400 sm:grid-cols-2">
        <Link href="/login" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center transition hover:border-cyan-400/40 hover:text-white">
          Customer login
        </Link>
        <Link href="/admin/register" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center transition hover:border-cyan-400/40 hover:text-white">
          Create admin account
        </Link>
      </div>
    </AuthShell>
  );
}