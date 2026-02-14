"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

export function KpiCard({ label, value, change, trend }: KpiCardProps) {
  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-5 hover:border-accent/30 transition-colors">
      <p className="text-sm text-muted mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold">{value}</p>
        <span
          className={`flex items-center gap-1 text-sm font-medium ${
            trend === "up" ? "text-success" : "text-danger"
          }`}
        >
          {trend === "up" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {change}
        </span>
      </div>
    </div>
  );
}
