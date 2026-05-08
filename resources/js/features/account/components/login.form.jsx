import React, { useState } from "react";
import useLogin from "../hooks/use.login.js";
import useAdminLogin from "../hooks/use.admin.login.js";
import TextInput from "../../../shared/ui/inputs/text.input.jsx";
import PasswordInput from "../../../shared/ui/inputs/password.input.jsx";
import PrimaryButton from "../../../shared/ui/buttons/primary.button.jsx";

const copyByMode = {
  user: {
    title: "Sign in with your customer account",
    description: "Use your email and password to access saved carts, orders, and faster checkout.",
    button: "Sign in",
  },
  admin: {
    title: "Sign in to the admin console",
    description: "Authenticate with a privileged account to manage catalog, orders, and permissions.",
    button: "Access admin portal",
  },
};

export default function LoginForm({ mode = "user" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = mode === "admin" ? useAdminLogin() : useLogin();
  const copy = copyByMode[mode] || copyByMode.user;

  const onSubmit = (event) => {
    event.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700" htmlFor={`email-${mode}`}>Email address</label>
        <TextInput
          id={`email-${mode}`}
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-medium text-zinc-700" htmlFor={`password-${mode}`}>Password</label>
          <span className="text-xs uppercase tracking-[0.24em] text-zinc-400">Secure entry</span>
        </div>
        <PasswordInput
          id={`password-${mode}`}
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete={mode === "admin" ? "current-password" : "current-password"}
        />
      </div>

      <div className="flex items-center justify-between text-sm text-zinc-500">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500" defaultChecked />
          Keep me signed in
        </label>
        <span>{copy.description}</span>
      </div>

      <PrimaryButton type="submit" className="w-full px-5 py-3 text-base shadow-lg shadow-sky-500/20">
        {login.isPending ? "Please wait..." : copy.button}
      </PrimaryButton>

      {login.isError ? <p className="text-sm text-rose-600">Unable to sign in. Check your credentials and try again.</p> : null}
    </form>
  );
}

