import React from "react";
import { Outlet } from "react-router-dom";
import NavbarComponent from "../shared/ui/navigation/navbar.component.jsx";
import SidebarComponent from "../shared/ui/navigation/sidebar.component.jsx";
import FooterComponent from "../shared/ui/navigation/footer.component.jsx";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.05),_transparent_30%),linear-gradient(180deg,_#020617,_#0f172a)] text-zinc-100">
      <NavbarComponent />
      <SidebarComponent />
      <main className="p-4 lg:ml-72 lg:p-6"><Outlet /></main>
      <FooterComponent />
    </div>
  );
}
