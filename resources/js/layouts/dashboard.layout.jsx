import React, { useEffect } from "react";
import NavbarComponent from "../shared/ui/navigation/navbar.component.jsx";
import FooterComponent from "../shared/ui/navigation/footer.component.jsx";
import Container from "../shared/ui/layout/container.jsx";
import SidebarComponent from "../shared/ui/navigation/sidebar.component.jsx";

function syncBodyCollapsedFlag() {
  try {
    const collapsed = localStorage.getItem("sidebarCollapsed") === "true";
    if (collapsed) {
      document.documentElement.classList.add("sidebar-collapsed");
    } else {
      document.documentElement.classList.remove("sidebar-collapsed");
    }
  } catch (e) {
    document.documentElement.classList.remove("sidebar-collapsed");
  }
}

export default function DashboardLayout({ children }) {
  useEffect(() => {
    syncBodyCollapsedFlag();
    window.addEventListener("storage", syncBodyCollapsedFlag);
    return () => window.removeEventListener("storage", syncBodyCollapsedFlag);
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(186,230,253,0.28),_transparent_30%),linear-gradient(180deg,_#f8fafc,_#eef2f7)] text-slate-900 flex flex-col">
      <NavbarComponent />
      <div className="flex-1 lg:flex lg:items-start">
        <SidebarComponent />
        <main className="w-full p-4 lg:p-6" style={{ minHeight: "calc(100vh - 160px)" }}>
          <Container className="max-w-none px-0 lg:px-0">{children}</Container>
        </main>
      </div>
      <FooterComponent />
    </div>
  );
}
