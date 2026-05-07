import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthShell from '../../components/auth.shell';

export default function UserLogin() {
  const { csrf_token, flash = {} } = usePage().props;
  const form = useForm({
    email: '',
    password: '',
    _token: csrf_token,
  });

  const submit = (event) => {
    event.preventDefault();

    form.post('/login', {
      headers: {
        'X-CSRF-TOKEN': csrf_token,
      },
      preserveScroll: true,
      onFinish: () => form.reset('password'),
    });
  };

  return (
    <AuthShell
      eyebrow="Customer access"
      badge="User Login"
      title="Welcome back to the storefront"
      description="Sign in to browse products, place orders, and manage your shopping activity from the same session-backed Laravel stack."
      highlights={[
        {
          label: 'Flow',
          value: 'User session',
          copy: 'Keeps customer state in the web guard so orders and profile data stay aligned.',
        },
        {
          label: 'Path',
          value: '/api/login',
          copy: 'The Inertia form submits through the session-aware API route.',
        },
      ]}
    >
      <Head title="User Login" />

      {flash.success ? (
        <div className="mb-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          {flash.success}
        </div>
      ) : null}

      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
          <input
            type="email"
            value={form.data.email}
            onChange={(event) => form.setData('email', event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:bg-white/8"
            placeholder="you@example.com"
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
          {form.processing ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="mt-6 grid gap-3 text-sm text-slate-400 sm:grid-cols-2">
        <Link href="/register" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center transition hover:border-cyan-400/40 hover:text-white">
          Create user account
        </Link>
        <Link href="/admin/login" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center transition hover:border-cyan-400/40 hover:text-white">
          Admin portal
        </Link>
      </div>
    </AuthShell>
  );
}