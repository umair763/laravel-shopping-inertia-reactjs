import React from "react";
import { Link } from "react-router-dom";
import AuthSplitLayout from "../../../shared/ui/auth/auth.split.layout.jsx";
import LoginForm from "../components/login.form.jsx";

const features = [
  {
    kicker: "Faster checkout",
    title: "Pick up where you left off",
    description: "Restore carts, addresses, and saved items from any device without starting over.",
  },
  {
    kicker: "Order tracking",
    title: "Always know the next step",
    description: "Track shipments, view receipts, and follow your order history from one profile.",
  },
];

export default function LoginPage() {
  return (
    <AuthSplitLayout
      badge="Customer portal"
      title="Sign in to your shopping account"
      subtitle="A cleaner, faster way to return to your carts, orders, and favorites."
      features={features}
      accent="amber"
      leftFooter={(
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link className="rounded-full border border-white/15 px-4 py-2 font-semibold text-white transition hover:border-white/30 hover:bg-white/10" to="/auth/register">
            Create an account
          </Link>
          <Link className="rounded-full border border-white/15 px-4 py-2 font-semibold text-white/75 transition hover:border-white/30 hover:bg-white/10" to="/store/shop">
            Browse store
          </Link>
        </div>
      )}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">Welcome back</p>
          <h2 className="text-3xl font-black tracking-tight text-zinc-950">User sign in</h2>
          <p className="max-w-md text-sm leading-6 text-zinc-500">
            Sign in with the email address you used at checkout to access personal orders, saved carts, and a smoother shopping flow.
          </p>
        </div>

        <LoginForm mode="user" />

        <p className="text-sm text-zinc-500">
          Need an account?{" "}
          <Link className="font-semibold text-sky-600 underline decoration-sky-200 decoration-2 underline-offset-4" to="/auth/register">
            Create one now
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
}
