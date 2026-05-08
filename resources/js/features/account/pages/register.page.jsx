import React from "react";
import { Link } from "react-router-dom";
import AuthSplitLayout from "../../../shared/ui/auth/auth.split.layout.jsx";
import RegisterForm from "../components/register.form.jsx";

const features = [
  {
    kicker: "Checkout saved",
    title: "Move faster on every purchase",
    description: "Store your profile once, then reuse it for shipping, billing, and repeat orders.",
  },
  {
    kicker: "Wishlists",
    title: "Keep track of what you love",
    description: "Save products, revisit price drops, and return to items when you're ready.",
  },
];

export default function RegisterPage() {
  return (
    <AuthSplitLayout
      badge="Customer portal"
      title="Create your shopper profile"
      subtitle="Set up your account once and get a faster, more polished checkout experience from day one."
      features={features}
      accent="emerald"
      reverse
      leftFooter={(
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link className="rounded-full border border-white/15 px-4 py-2 font-semibold text-white transition hover:border-white/30 hover:bg-white/10" to="/auth/login">
            Back to sign in
          </Link>
          <Link className="rounded-full border border-white/15 px-4 py-2 font-semibold text-white/75 transition hover:border-white/30 hover:bg-white/10" to="/store/shop">
            Continue shopping
          </Link>
        </div>
      )}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">Join the store</p>
          <h2 className="text-3xl font-black tracking-tight text-zinc-950">User registration</h2>
          <p className="max-w-md text-sm leading-6 text-zinc-500">
            Create your personal account to save shipping addresses, order history, and personalized shopping preferences.
          </p>
        </div>

        <RegisterForm mode="user" />

        <p className="text-sm text-zinc-500">
          Already have an account?{" "}
          <Link className="font-semibold text-sky-600 underline decoration-sky-200 decoration-2 underline-offset-4" to="/auth/login">
            Sign in instead
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
}
