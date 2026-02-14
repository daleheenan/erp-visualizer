"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { departmentPerformance } from "@/lib/data";

export function DepartmentChart() {
  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-muted mb-4">Department Performance</h3>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={departmentPerformance}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="dept" stroke="#94a3b8" fontSize={12} />
          <PolarRadiusAxis stroke="#334155" fontSize={10} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#e2e8f0",
            }}
          />
          <Legend />
          <Radar
            name="Target"
            dataKey="target"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Radar
            name="Actual"
            dataKey="actual"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
