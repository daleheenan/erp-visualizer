import { KpiCard } from "@/components/KpiCard";
import { RevenueChart } from "@/components/RevenueChart";
import { OrderStatusChart } from "@/components/OrderStatusChart";
import { DepartmentChart } from "@/components/DepartmentChart";
import { ActivityFeed } from "@/components/ActivityFeed";
import { kpiData } from "@/lib/data";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-muted mt-1">Enterprise Resource Planning Overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart />
        <OrderStatusChart />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DepartmentChart />
        <ActivityFeed />
      </div>
    </div>
  );
}
