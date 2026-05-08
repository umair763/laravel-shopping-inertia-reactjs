import React from "react";
import StatsCards from "./stats.cards.jsx";
import RevenueChart from "./revenue.chart.jsx";
import ActivityFeed from "./activity.feed.jsx";

export default function DashboardPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <StatsCards />
      <RevenueChart />
      <ActivityFeed />
    </section>
  );
}
