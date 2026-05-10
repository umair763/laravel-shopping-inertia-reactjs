import React from "react";

import NavbarComponent from "../shared/ui/navigation/navbar.component.jsx";
import SidebarComponent from "../shared/ui/navigation/sidebar.component.jsx";
import FooterComponent from "../shared/ui/navigation/footer.component.jsx";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(186,230,253,0.28),_transparent_30%),linear-gradient(180deg,_#f8fafc,_#eef2f7)] text-slate-900">
      <NavbarComponent />
      <SidebarComponent />
      <main className="p-4 lg:ml-72 lg:p-6"><Outlet /></main>
      <FooterComponent />
    </div>
  );
}
