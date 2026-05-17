import React from "react";
import { useForm } from "@inertiajs/react";
import TextInput from "../../../shared/ui/inputs/text.input.jsx";
import PasswordInput from "../../../shared/ui/inputs/password.input.jsx";
import PrimaryButton from "../../../shared/ui/buttons/primary.button.jsx";

const copyByMode = {
    user: {
        description: "Use your email and password to access saved carts, orders, and faster checkout.",
        button: "Sign in",
        action: "/login",
    },
    admin: {
        description: "Authenticate with a privileged account to manage catalog, orders, and permissions.",
        button: "Access admin portal",
        action: "/admin/login",
    },
};

function Spinner() {
    return (
        <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    );
}

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
            {(errors.email || errors.general) && (
                <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                    {errors.email || errors.general}
                </div>
            )}

            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700" htmlFor={`email-${mode}`}>
                    Email address
                </label>
                <TextInput
                    id={`email-${mode}`}
                    type="email"
                    placeholder="name@example.com"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    autoComplete="email"
                    disabled={processing}
                    className={errors.email ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100" : ""}
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                    <label className="text-sm font-medium text-zinc-700" htmlFor={`password-${mode}`}>
                        Password
                    </label>
                    <span className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-400">
                        Secure entry
                    </span>
                </div>
                <PasswordInput
                    id={`password-${mode}`}
                    placeholder="Enter your password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    autoComplete="current-password"
                    disabled={processing}
                    className={errors.password ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100" : ""}
                />
                {errors.password && <p className="text-sm text-rose-600">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between text-sm text-zinc-500">
                <label className="flex cursor-pointer items-center gap-2">
                    <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                        defaultChecked
                        disabled={processing}
                    />
                    Keep me signed in
                </label>
                <span className="text-xs text-zinc-400">{copy.description.split(" ").slice(0, 6).join(" ")}…</span>
            </div>

            <PrimaryButton
                type="submit"
                className="flex w-full items-center justify-center gap-2.5 px-5 py-3 text-base shadow-lg shadow-sky-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={processing}
            >
                {processing && <Spinner />}
                {processing ? "Signing in…" : copy.button}
            </PrimaryButton>
        </form>
    );
}
