import React from "react";
import { useForm } from "@inertiajs/react";
import TextInput from "../../../shared/ui/inputs/text.input.jsx";
import PasswordInput from "../../../shared/ui/inputs/password.input.jsx";
import PrimaryButton from "../../../shared/ui/buttons/primary.button.jsx";

const copyByMode = {
  user: {
    title: "Create your customer account",
    description: "Save addresses, track orders, and move through checkout faster on every visit.",
    button: "Create account",
    action: "/register",
  },
  admin: {
    title: "Create an admin account",
    description: "Provision a trusted operator account with privileged access and audit visibility.",
    button: "Create admin account",
    action: "/admin/register",
  },
};

export default function RegisterForm({ mode = "user" }) {
  const copy = copyByMode[mode] || copyByMode.user;
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const onSubmit = (event) => {
    event.preventDefault();
    post(copy.action);
  };

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700" htmlFor={`name-${mode}`}>Full name</label>
        <TextInput
          id={`name-${mode}`}
          placeholder="Your full name"
          value={data.name}
          onChange={(event) => setData("name", event.target.value)}
          autoComplete="name"
        />
        {errors.name && <p className="text-sm text-rose-600">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700" htmlFor={`email-${mode}-register`}>Email address</label>
        <TextInput
          id={`email-${mode}-register`}
          type="email"
          placeholder="name@example.com"
          value={data.email}
          onChange={(event) => setData("email", event.target.value)}
          autoComplete="email"
        />
        {errors.email && <p className="text-sm text-rose-600">{errors.email}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700" htmlFor={`password-${mode}-register`}>Password</label>
          <PasswordInput
            id={`password-${mode}-register`}
            placeholder="Create a password"
            value={data.password}
            onChange={(event) => setData("password", event.target.value)}
            autoComplete="new-password"
          />
          {errors.password && <p className="text-sm text-rose-600">{errors.password}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700" htmlFor={`confirm-${mode}-register`}>Confirm password</label>
          <PasswordInput
            id={`confirm-${mode}-register`}
            placeholder="Repeat your password"
            value={data.password_confirmation}
            onChange={(event) => setData("password_confirmation", event.target.value)}
            autoComplete="new-password"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
        {copy.description}
      </div>

      <PrimaryButton type="submit" className="w-full px-5 py-3 text-base shadow-lg shadow-sky-500/20">
        {processing ? "Creating account..." : copy.button}
      </PrimaryButton>
    </form>
  );
}
