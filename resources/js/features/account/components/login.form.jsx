import React from "react";
import { useForm } from "@inertiajs/react";
import TextInput from "../../../shared/ui/inputs/text.input.jsx";
import PasswordInput from "../../../shared/ui/inputs/password.input.jsx";
import PrimaryButton from "../../../shared/ui/buttons/primary.button.jsx";

const copyByMode = {
  user: {
    title: "Sign in with your customer account",
    description: "Use your email and password to access saved carts, orders, and faster checkout.",
    button: "Sign in",
    action: "/login",
  },
  admin: {
    title: "Sign in to the admin console",
    description: "Authenticate with a privileged account to manage catalog, orders, and permissions.",
    button: "Access admin portal",
    action: "/admin/login",
  },
};

export default function LoginForm({ mode = "user" }) {
  const copy = copyByMode[mode] || copyByMode.user;
  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
  });

  const onSubmit = (event) => {
    event.preventDefault();
    post(copy.action);
  };

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      {errors.general && <p className="text-sm text-rose-600 bg-rose-50 p-3 rounded-lg">{errors.general}</p>}
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700" htmlFor={`email-${mode}`}>Email address</label>
        <TextInput
          id={`email-${mode}`}
          type="email"
          placeholder="name@example.com"
          value={data.email}
          onChange={(event) => setData("email", event.target.value)}
          autoComplete="email"
          disabled={processing}
        />
        {errors.email && <p className="text-sm text-rose-600">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-medium text-zinc-700" htmlFor={`password-${mode}`}>Password</label>
          <span className="text-xs uppercase tracking-[0.24em] text-zinc-400">Secure entry</span>
        </div>
        <PasswordInput
          id={`password-${mode}`}
          placeholder="Enter your password"
          value={data.password}
          onChange={(event) => setData("password", event.target.value)}
          autoComplete="current-password"
          disabled={processing}
        />
        {errors.password && <p className="text-sm text-rose-600">{errors.password}</p>}
      </div>

      <div className="flex items-center justify-between text-sm text-zinc-500">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500" defaultChecked disabled={processing} />
          Keep me signed in
        </label>
        <span>{copy.description}</span>
      </div>

      <PrimaryButton type="submit" className="w-full px-5 py-3 text-base shadow-lg shadow-sky-500/20" disabled={processing}>
        {processing ? "Please wait..." : copy.button}
      </PrimaryButton>
    </form>
  );
}
