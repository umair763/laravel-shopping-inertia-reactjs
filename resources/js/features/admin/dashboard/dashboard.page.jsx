import React from "react";
import StatsCards from "./stats.cards.jsx";
import RevenueChart from "./revenue.chart.jsx";
import ActivityFeed from "./activity.feed.jsx";
import DashboardLayout from "../../../layouts/dashboard.layout.jsx";

export default function DashboardPage({ stats }) {
    const recentOrders = stats?.recent_orders ?? [];

    return (
        <section className="space-y-6">
            <div>
                <p className="text-[10px] uppercase tracking-[0.34em] text-slate-400">
                    Admin workspace
                </p>
                <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                    Dashboard
                </h1>
            </div>
            <StatsCards stats={stats} />
            <RevenueChart stats={stats} />
            <ActivityFeed orders={recentOrders} />
        </section>
    );
}

DashboardPage.layout = (page) => <DashboardLayout>{page}</DashboardLayout>;
