import React from "react";
import DashboardLayout from "../../../layouts/dashboard.layout.jsx";
import KpiCards from "./widgets/kpi.cards.jsx";
import OrdersChart from "./widgets/orders.chart.jsx";
import TrendingProducts from "./widgets/trending.products.jsx";
import {
  InventoryAlertsPanel,
  PaymentAnalyticsPanel,
  RecentOrdersPanel,
  SalesByCategoryPanel,
  TopCustomersPanel,
} from "./widgets/side.panels.jsx";

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-1">
        <p className="text-[10px] uppercase tracking-[0.34em] text-slate-400">Admin workspace</p>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Real-time KPIs and analytics across orders, products, customers, and payments.</p>
      </header>

      <KpiCards />

      <OrdersChart />

      <TrendingProducts />

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentOrdersPanel />
        <InventoryAlertsPanel />
        <SalesByCategoryPanel />
        <TopCustomersPanel />
        <PaymentAnalyticsPanel />
      </div>
    </section>
  );
}

DashboardPage.layout = (page) => <DashboardLayout>{page}</DashboardLayout>;
