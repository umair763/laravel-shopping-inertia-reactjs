import React, { useMemo, useState } from "react";
import { usePage } from "@inertiajs/react";
import TextInput from "../../../shared/ui/inputs/text.input.jsx";
import SelectInput from "../../../shared/ui/inputs/select.input.jsx";
import PrimaryButton from "../../../shared/ui/buttons/primary.button.jsx";

const regionOptions = [
    "Pakistan",
    "United Arab Emirates",
    "Saudi Arabia",
    "United Kingdom",
    "United States",
];
const languageOptions = ["English", "Urdu", "Arabic", "French", "Spanish"];

export default function ProfilePage({ scope = "customer" }) {
    const { props } = usePage();
    const user = props?.auth?.user || {};
    const profile = user;
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: profile?.name || "",
        email: profile?.email || "",
        region: "Pakistan",
        language: "English",
        profile_image: profile?.profile_image || "",
    });

    const profilePreview = useMemo(() => {
        if (profileImageFile) {
            return URL.createObjectURL(profileImageFile);
        }

        return form.profile_image || profile?.profile_image || "";
    }, [form.profile_image, profile?.profile_image, profileImageFile]);

    const heading = useMemo(
        () =>
            scope === "admin" ? "Admin profile settings" : "Profile settings",
        [scope],
    );
    const description = useMemo(
        () =>
            scope === "admin"
                ? "Use the same profile workspace to manage admin identity and preferences."
                : "Keep your personal details, region, and language preferences up to date.",
        [scope],
    );

    function handleSave(event) {
        event.preventDefault();

        const payload = new FormData();
        const nameParts = form.name.trim().split(/\s+/).filter(Boolean);

        payload.append("first_name", nameParts[0] || "");
        payload.append("last_name", nameParts.slice(1).join(" "));
        payload.append("email", form.email);

        if (profileImageFile) {
            payload.append("profile_image_file", profileImageFile);
        } else if (form.profile_image) {
            payload.append("profile_image", form.profile_image);
        }

        setSaving(true);
        fetch("/api/account/profile", {
            method: "PUT",
            headers: { "X-Requested-With": "XMLHttpRequest" },
            body: payload,
            credentials: "include",
        }).finally(() => setSaving(false));
    }

    return (
        <section className="space-y-6 rounded-[2rem] border border-sky-100 bg-white p-6 shadow-sm">
            <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.28em] text-sky-500">
                    {scope === "admin" ? "Admin profile" : "Customer profile"}
                </p>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">
                    {heading}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-600">
                    {description}
                </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <form
                    className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5"
                    onSubmit={handleSave}
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">
                                Full name
                            </span>
                            <TextInput
                                value={form.name}
                                onChange={(event) =>
                                    setForm((previous) => ({
                                        ...previous,
                                        name: event.target.value,
                                    }))
                                }
                            />
                        </label>
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">
                                Email
                            </span>
                            <TextInput
                                value={form.email}
                                onChange={(event) =>
                                    setForm((previous) => ({
                                        ...previous,
                                        email: event.target.value,
                                    }))
                                }
                            />
                        </label>
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">
                                Country / Region
                            </span>
                            <SelectInput
                                value={form.region}
                                onChange={(event) =>
                                    setForm((previous) => ({
                                        ...previous,
                                        region: event.target.value,
                                    }))
                                }
                            >
                                {regionOptions.map((region) => (
                                    <option key={region} value={region}>
                                        {region}
                                    </option>
                                ))}
                            </SelectInput>
                        </label>
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">
                                Language Preference
                            </span>
                            <SelectInput
                                value={form.language}
                                onChange={(event) =>
                                    setForm((previous) => ({
                                        ...previous,
                                        language: event.target.value,
                                    }))
                                }
                            >
                                {languageOptions.map((language) => (
                                    <option key={language} value={language}>
                                        {language}
                                    </option>
                                ))}
                            </SelectInput>
                        </label>
                        <label className="space-y-2 sm:col-span-2">
                            <span className="text-sm font-medium text-slate-700">
                                Profile image
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-sky-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-sky-600"
                                onChange={(event) =>
                                    setProfileImageFile(
                                        event.target.files?.[0] || null,
                                    )
                                }
                            />
                        </label>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                        <PrimaryButton type="submit" disabled={saving}>
                            {saving ? "Saving..." : "Save changes"}
                        </PrimaryButton>
                        <PrimaryButton
                            type="button"
                            className="bg-slate-100 text-slate-700 shadow-none hover:bg-slate-200"
                            onClick={() => {
                                setForm({
                                    name: profile?.name || "",
                                    email: profile?.email || "",
                                    region: "Pakistan",
                                    language: "English",
                                    profile_image: profile?.profile_image || "",
                                });
                                setProfileImageFile(null);
                            }}
                        >
                            Cancel
                        </PrimaryButton>
                    </div>
                </form>

                <div className="space-y-4 rounded-[1.5rem] border border-slate-100 bg-white p-5">
                    <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                            Current profile
                        </p>
                        <p className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                            {profile?.name || profile?.email || "Profile"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            {profile?.email || "No email loaded"}
                        </p>
                    </div>

                    {profilePreview ? (
                        <img
                            alt="Profile preview"
                            src={profilePreview}
                            className="h-40 w-full rounded-3xl object-cover"
                        />
                    ) : (
                        <div className="flex h-40 items-center justify-center rounded-3xl bg-slate-100 text-sm text-slate-500">
                            No profile image yet
                        </div>
                    )}

                    <div className="space-y-3 rounded-2xl bg-sky-50 p-4 text-sm text-slate-700">
                        <div className="flex items-center justify-between gap-3">
                            <span>Role</span>
                            <span className="font-semibold text-slate-900">
                                {scope === "admin"
                                    ? "Administrator"
                                    : "Customer"}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <span>Country / Region</span>
                            <span className="font-semibold text-slate-900">
                                {form.region}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <span>Language Preference</span>
                            <span className="font-semibold text-slate-900">
                                {form.language}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
