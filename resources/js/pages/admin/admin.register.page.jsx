import React from "react";
import { Link } from "@inertiajs/react";
import AuthSplitLayout from "../../shared/ui/auth/auth.split.layout.jsx";
import RegisterForm from "../../features/account/components/register.form.jsx";

const features = [
  {
    kicker: "Invite flow",
    title: "Provision the right access",
    description: "Create trusted operator accounts with a controlled onboarding path and clear permissions.",
  },
  {
    kicker: "Visibility",
    title: "Keep admin actions accountable",
    description: "Pair every account with a role and maintain oversight over store changes and approvals.",
  },
];

export default function AdminRegisterPage() {
  return (
    <AuthSplitLayout
      badge="Admin portal"
      title="Invite a new admin account"
      subtitle="Create a secure administrative profile for your operations, merchandising, or support team."
      features={features}
      accent="violet"
      reverse
      leftFooter={(
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link className="rounded-full border border-white/15 px-4 py-2 font-semibold text-white transition hover:border-white/30 hover:bg-white/10" href="/admin/login">
            Back to admin sign in
          </Link>
          <Link className="rounded-full border border-white/15 px-4 py-2 font-semibold text-white/75 transition hover:border-white/30 hover:bg-white/10" href="/admin">
            Open dashboard
          </Link>
        </div>
      )}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-violet-600">Admin onboarding</p>
          <h2 className="text-3xl font-black tracking-tight text-zinc-950">Admin registration</h2>
          <p className="max-w-md text-sm leading-6 text-zinc-500">
            Use this screen to create a protected admin identity that can manage the storefront and its permissions.
          </p>
        </div>

        <RegisterForm mode="admin" />

        <p className="text-sm text-zinc-500">
          Already have admin access?{" "}
          <Link className="font-semibold text-violet-600 underline decoration-violet-200 decoration-2 underline-offset-4" href="/admin/login">
            Sign in to the admin portal
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
}