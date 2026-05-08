import React from "react";
import { Outlet } from "react-router-dom";
import NavbarComponent from "../shared/ui/navigation/navbar.component.jsx";
import FooterComponent from "../shared/ui/navigation/footer.component.jsx";

export default function StoreLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(186,230,253,0.35),_transparent_28%),linear-gradient(180deg,_#f8fafc,_#eef2f7)] text-slate-900">
      <NavbarComponent />
      <main className="py-6 lg:py-8"><Outlet /></main>
      <FooterComponent />
    </div>
  );
}
