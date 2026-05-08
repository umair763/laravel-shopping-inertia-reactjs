import React, { useState } from "react";
import useRegister from "../hooks/use.register.js";
import useAdminRegister from "../hooks/use.admin.register.js";
import TextInput from "../../../shared/ui/inputs/text.input.jsx";
import PasswordInput from "../../../shared/ui/inputs/password.input.jsx";
import PrimaryButton from "../../../shared/ui/buttons/primary.button.jsx";

const copyByMode = {
  user: {
    title: "Create your customer account",
    description: "Save addresses, track orders, and move through checkout faster on every visit.",
    button: "Create account",
  },
  admin: {
    title: "Create an admin account",
    description: "Provision a trusted operator account with privileged access and audit visibility.",
    button: "Create admin account",
  },
};

export default function RegisterForm({ mode = "user" }) {
  const register = mode === "admin" ? useAdminRegister() : useRegister();
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });
  const copy = copyByMode[mode] || copyByMode.user;

  const setValue = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));

  const onSubmit = (event) => {
    event.preventDefault();
    register.mutate(form);
  };

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700" htmlFor={`name-${mode}`}>Full name</label>
        <TextInput
          id={`name-${mode}`}
          placeholder="Your full name"
          value={form.name}
          onChange={(event) => setValue("name", event.target.value)}
          autoComplete="name"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700" htmlFor={`email-${mode}-register`}>Email address</label>
        <TextInput
          id={`email-${mode}-register`}
          type="email"
          placeholder="name@example.com"
          value={form.email}
          onChange={(event) => setValue("email", event.target.value)}
          autoComplete="email"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700" htmlFor={`password-${mode}-register`}>Password</label>
          <PasswordInput
            id={`password-${mode}-register`}
            placeholder="Create a password"
            value={form.password}
            onChange={(event) => setValue("password", event.target.value)}
            autoComplete="new-password"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700" htmlFor={`confirm-${mode}-register`}>Confirm password</label>
          <PasswordInput
            id={`confirm-${mode}-register`}
            placeholder="Repeat your password"
            value={form.password_confirmation}
            onChange={(event) => setValue("password_confirmation", event.target.value)}
            autoComplete="new-password"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
        {copy.description}
      </div>

      <PrimaryButton type="submit" className="w-full px-5 py-3 text-base shadow-lg shadow-sky-500/20">
        {register.isPending ? "Creating account..." : copy.button}
      </PrimaryButton>

      {register.isError ? <p className="text-sm text-rose-600">Unable to create the account. Check the details and try again.</p> : null}
    </form>
  );
}

