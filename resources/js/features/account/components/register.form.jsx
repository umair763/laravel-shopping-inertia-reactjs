import React from "react";
import { useForm } from "@inertiajs/react";
import TextInput from "../../../shared/ui/inputs/text.input.jsx";
import PasswordInput from "../../../shared/ui/inputs/password.input.jsx";
import PrimaryButton from "../../../shared/ui/buttons/primary.button.jsx";

const copyByMode = {
    user: {
        description: "Save addresses, track orders, and move through checkout faster on every visit.",
        button: "Create account",
        action: "/register",
    },
    admin: {
        description: "Provision a trusted operator account with privileged access and audit visibility.",
        button: "Create admin account",
        action: "/admin/register",
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
            {errors.general && (
                <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                    {errors.general}
                </div>
            )}

            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700" htmlFor={`name-${mode}`}>
                    Full name
                </label>
                <TextInput
                    id={`name-${mode}`}
                    placeholder="Your full name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    autoComplete="name"
                    disabled={processing}
                    className={errors.name ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100" : ""}
                />
                {errors.name && <p className="text-sm text-rose-600">{errors.name}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700" htmlFor={`email-${mode}-register`}>
                    Email address
                </label>
                <TextInput
                    id={`email-${mode}-register`}
                    type="email"
                    placeholder="name@example.com"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    autoComplete="email"
                    disabled={processing}
                    className={errors.email ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100" : ""}
                />
                {errors.email && <p className="text-sm text-rose-600">{errors.email}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700" htmlFor={`password-${mode}-register`}>
                        Password
                    </label>
                    <PasswordInput
                        id={`password-${mode}-register`}
                        placeholder="Create a password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        autoComplete="new-password"
                        disabled={processing}
                    />
                    {errors.password && <p className="text-sm text-rose-600">{errors.password}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700" htmlFor={`confirm-${mode}-register`}>
                        Confirm password
                    </label>
                    <PasswordInput
                        id={`confirm-${mode}-register`}
                        placeholder="Repeat your password"
                        value={data.password_confirmation}
                        onChange={(e) => setData("password_confirmation", e.target.value)}
                        autoComplete="new-password"
                        disabled={processing}
                    />
                    {errors.password_confirmation && (
                        <p className="text-sm text-rose-600">{errors.password_confirmation}</p>
                    )}
                </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
                {copy.description}
            </div>

            <PrimaryButton
                type="submit"
                className="flex w-full items-center justify-center gap-2.5 px-5 py-3 text-base shadow-lg shadow-sky-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={processing}
            >
                {processing && <Spinner />}
                {processing ? "Creating account…" : copy.button}
            </PrimaryButton>
        </form>
    );
}
