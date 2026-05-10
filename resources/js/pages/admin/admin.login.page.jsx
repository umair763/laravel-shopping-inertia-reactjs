import React from "react";
import { Link } from "@inertiajs/react";
import AuthSplitLayout from "../../shared/ui/auth/auth.split.layout.jsx";
import LoginForm from "../../features/account/components/login.form.jsx";

const features = [
  {
    kicker: "Permissions",
    title: "Role-aware access",
    description: "Use privileged credentials to unlock catalog, orders, users, and reporting tools.",
  },
  {
    kicker: "Audit trail",
    title: "Controlled operations",
    description: "Every administrative action stays inside a secure workspace with clear accountability.",
  },
];

export default function AdminLoginPage() {
  return (
    <AuthSplitLayout
      badge="Admin portal"
      title="Secure access for your operations team"
      subtitle="Manage the storefront from a dedicated control room with permission-aware actions and protected workflows."
      features={features}
      accent="violet"
      leftFooter={(
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link className="rounded-full border border-white/15 px-4 py-2 font-semibold text-white transition hover:border-white/30 hover:bg-white/10" href="/admin/register">
            Invite an admin
          </Link>
          <Link className="rounded-full border border-white/15 px-4 py-2 font-semibold text-white/75 transition hover:border-white/30 hover:bg-white/10" href="/store">
            Back to store
          </Link>
        </div>
      )}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-violet-600">Admin console</p>
          <h2 className="text-3xl font-black tracking-tight text-zinc-950">Admin sign in</h2>
          <p className="max-w-md text-sm leading-6 text-zinc-500">
            Use a trusted administrative account to manage products, handle orders, and access protected workflows.
          </p>
        </div>

        <LoginForm mode="admin" />

        <p className="text-sm text-zinc-500">
          Need to create an admin profile?{" "}
          <Link className="font-semibold text-violet-600 underline decoration-violet-200 decoration-2 underline-offset-4" href="/admin/register">
            Open the admin registration screen
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
}
