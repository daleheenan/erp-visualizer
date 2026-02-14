"use client";

import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import { recentActivities } from "@/lib/data";

const iconMap = {
  success: CheckCircle,
  warning: AlertTriangle,
  danger: XCircle,
  info: Info,
};

const colorMap = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-accent",
};

export function ActivityFeed() {
  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-muted mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {recentActivities.map((activity) => {
          const Icon = iconMap[activity.type];
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-card-border/20 transition-colors"
            >
              <Icon size={18} className={`mt-0.5 ${colorMap[activity.type]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm">{activity.action}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted bg-card-border/40 px-2 py-0.5 rounded">
                    {activity.module}
                  </span>
                  <span className="text-xs text-muted">{activity.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
