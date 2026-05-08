import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavbarComponent from "../shared/ui/navigation/navbar.component.jsx";
import FooterComponent from "../shared/ui/navigation/footer.component.jsx";
import CustomerSidebarComponent from "../shared/ui/navigation/customer.sidebar.component.jsx";

function syncCustomerCollapsedFlag() {
  try {
    const collapsed = localStorage.getItem("customerSidebarCollapsed") === "true";
    if (collapsed) {
      document.documentElement.classList.add("customer-sidebar-collapsed");
    } else {
      document.documentElement.classList.remove("customer-sidebar-collapsed");
    }
  } catch (e) {
    document.documentElement.classList.remove("customer-sidebar-collapsed");
  }
}

export default function CustomerLayout() {
  useEffect(() => {
    syncCustomerCollapsedFlag();
    window.addEventListener("storage", syncCustomerCollapsedFlag);
    return () => window.removeEventListener("storage", syncCustomerCollapsedFlag);
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(186,230,253,0.45),_transparent_30%),linear-gradient(180deg,_#f8fafc,_#f1f5f9)] text-slate-900 flex flex-col">
      <NavbarComponent />
      <div className="flex-1 mx-auto max-w-7xl w-full gap-6 px-4 py-6 lg:flex lg:px-6 lg:py-8">
        <CustomerSidebarComponent />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
      <FooterComponent />
    </div>
  );
}