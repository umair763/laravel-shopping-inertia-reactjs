import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthShell from '../../components/auth.shell';

export default function AdminRegister() {
  const { csrf_token, flash = {}, has_admins = false } = usePage().props;
  const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    _token: csrf_token,
  });

  const submit = (event) => {
    event.preventDefault();

    form.post('/admin/register', {
      headers: {
        'X-CSRF-TOKEN': csrf_token,
      },
      preserveScroll: true,
      onFinish: () => form.reset('password', 'password_confirmation'),
    });
  };

  return (
    <AuthShell
      eyebrow="Admin provisioning"
      badge="Admin Registration"
      title="Create a new administrator"
      description={has_admins
        ? 'This page is reserved for authenticated admins who need to provision another administrator account.'
        : 'No admin exists yet. Use this bootstrap path to create the first administrator and unlock the control plane.'}
      highlights={[
        {
          label: 'Bootstrap',
          value: has_admins ? 'Existing admin required' : 'First admin allowed',
          copy: 'The backend permits an unauthenticated bootstrap only when there are no admin accounts in the system.',
        },
        {
          label: 'Access',
          value: '/api/admin/create',
          copy: 'The route remains JSON-friendly but now uses the session guard instead of a missing token guard.',
        },
      ]}
    >
      <Head title="Admin Registration" />

      {flash.success ? (
        <div className="mb-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          {flash.success}
        </div>
      ) : null}

      {has_admins ? (
        <div className="mb-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
          If you are not signed in as an admin, this request will be rejected.
        </div>
      ) : null}

      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Name</label>
          <input
            type="text"
            value={form.data.name}
            onChange={(event) => form.setData('name', event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:bg-white/8"
            placeholder="New Admin"
          />
          {form.errors.name ? <p className="mt-2 text-sm text-rose-300">{form.errors.name}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
          <input
            type="email"
            value={form.data.email}
            onChange={(event) => form.setData('email', event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:bg-white/8"
            placeholder="admin@example.com"
          />
          {form.errors.email ? <p className="mt-2 text-sm text-rose-300">{form.errors.email}</p> : null}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
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

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Confirm password</label>
            <input
              type="password"
              value={form.data.password_confirmation}
              onChange={(event) => form.setData('password_confirmation', event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:bg-white/8"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={form.processing}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {form.processing ? 'Creating admin...' : 'Create admin account'}
        </button>
      </form>

      <div className="mt-6 grid gap-3 text-sm text-slate-400 sm:grid-cols-2">
        <Link href="/admin/login" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center transition hover:border-cyan-400/40 hover:text-white">
          Admin login
        </Link>
        <Link href="/register" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center transition hover:border-cyan-400/40 hover:text-white">
          Customer signup
        </Link>
      </div>
    </AuthShell>
  );
}