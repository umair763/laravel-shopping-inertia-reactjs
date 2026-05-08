import React from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_25%),linear-gradient(180deg,_#0f172a,_#09090b)] text-zinc-100">
      <Outlet />
    </div>
  );
}
