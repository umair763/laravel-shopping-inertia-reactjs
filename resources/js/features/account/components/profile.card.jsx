import React from "react";
import useProfile from "../hooks/use.profile.js";

export default function ProfileCard() {
  const { data, isLoading } = useProfile();
  if (isLoading) return <div className="rounded-xl border border-zinc-800 p-4 text-zinc-300">Loading profile...</div>;
  return (
    <div className="rounded-xl border border-zinc-800 p-4">
      <h3 className="text-lg font-semibold">{data?.data?.name || data?.data?.email || "Profile"}</h3>
      <p className="text-sm text-zinc-400">{data?.data?.email}</p>
    </div>
  );
}

