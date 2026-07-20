"use client";

import { CircleAlert, Clock3, Gauge, Ticket } from "lucide-react";
import { motion } from "motion/react";

const icons = {
  tickets: Ticket,
  clock: Clock3,
  gauge: Gauge,
  alert: CircleAlert,
};

type DashboardMetricCardProps = {
  icon: keyof typeof icons;
  iconClass: string;
  eyebrow: string;
  value: string;
  detail: string;
  trend?: { value: string; positive?: boolean };
  alert?: boolean;
  delay?: number;
};

export default function DashboardMetricCard({
  icon,
  iconClass,
  eyebrow,
  value,
  detail,
  trend,
  alert,
  delay = 0,
}: DashboardMetricCardProps) {
  const Icon = icons[icon];

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      className="rounded-xl border border-outline-variant/20 bg-white p-4 shadow-sm"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconClass}`}>
          <Icon size={18} />
        </div>
        {trend && <span className={`text-xs font-semibold ${trend.positive ? "text-emerald-700" : "text-red-600"}`}>{trend.value}</span>}
        {alert && <span className="text-xs font-bold text-red-700">Action requise</span>}
      </div>
      <p className="text-xs font-medium uppercase tracking-[0.1em] text-on-surface-variant">{eyebrow}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-on-surface">{value}</p>
      <p className="mt-2 text-xs font-medium text-on-surface-variant">{detail}</p>
    </motion.article>
  );
}
