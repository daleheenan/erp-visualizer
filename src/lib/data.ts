export const revenueData = [
  { month: "Jul", revenue: 42000, expenses: 31000 },
  { month: "Aug", revenue: 48000, expenses: 33000 },
  { month: "Sep", revenue: 45000, expenses: 29000 },
  { month: "Oct", revenue: 52000, expenses: 35000 },
  { month: "Nov", revenue: 58000, expenses: 37000 },
  { month: "Dec", revenue: 63000, expenses: 39000 },
  { month: "Jan", revenue: 55000, expenses: 34000 },
  { month: "Feb", revenue: 61000, expenses: 36000 },
];

export const inventoryData = [
  { category: "Raw Materials", value: 340, fill: "#3b82f6" },
  { category: "WIP", value: 120, fill: "#f59e0b" },
  { category: "Finished Goods", value: 580, fill: "#22c55e" },
  { category: "MRO Supplies", value: 90, fill: "#8b5cf6" },
];

export const orderStatusData = [
  { status: "Pending", count: 24, color: "#f59e0b" },
  { status: "Processing", count: 18, color: "#3b82f6" },
  { status: "Shipped", count: 42, color: "#8b5cf6" },
  { status: "Delivered", count: 156, color: "#22c55e" },
  { status: "Returned", count: 7, color: "#ef4444" },
];

export const departmentPerformance = [
  { dept: "Sales", target: 95, actual: 88 },
  { dept: "Production", target: 90, actual: 92 },
  { dept: "Logistics", target: 85, actual: 79 },
  { dept: "Finance", target: 92, actual: 94 },
  { dept: "HR", target: 88, actual: 85 },
  { dept: "Procurement", target: 90, actual: 87 },
];

export const recentActivities = [
  { id: 1, action: "Purchase Order #4521 approved", module: "Procurement", time: "2 min ago", type: "success" as const },
  { id: 2, action: "Low stock alert: Steel Rods (SKU-2847)", module: "Inventory", time: "15 min ago", type: "warning" as const },
  { id: 3, action: "Invoice #INV-9823 overdue", module: "Finance", time: "1 hr ago", type: "danger" as const },
  { id: 4, action: "New employee onboarding: Sarah Chen", module: "HR", time: "2 hr ago", type: "info" as const },
  { id: 5, action: "Production batch B-445 completed", module: "Manufacturing", time: "3 hr ago", type: "success" as const },
  { id: 6, action: "Shipment #SH-7721 dispatched", module: "Logistics", time: "4 hr ago", type: "info" as const },
];

export const kpiData = [
  { label: "Total Revenue", value: "$424K", change: "+12.5%", trend: "up" as const },
  { label: "Active Orders", value: "247", change: "+8.2%", trend: "up" as const },
  { label: "Inventory Value", value: "$1.2M", change: "-3.1%", trend: "down" as const },
  { label: "On-Time Delivery", value: "94.2%", change: "+2.4%", trend: "up" as const },
];
