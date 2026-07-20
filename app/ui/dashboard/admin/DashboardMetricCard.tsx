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
      className="group rounded-xl border border-outline-variant/20 bg-white p-4 shadow-sm transition-colors hover:border-primary-container hover:bg-primary-container hover:text-on-primary-container"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors group-hover:bg-white/15 group-hover:text-on-primary-container ${iconClass}`}>
          <Icon size={18} />
        </div>
        {trend && <span className={`text-xs font-semibold group-hover:text-on-primary-container ${trend.positive ? "text-emerald-700" : "text-red-600"}`}>{trend.value}</span>}
        {alert && <span className="text-xs font-bold text-red-700 group-hover:text-on-primary-container">Action requise</span>}
      </div>
      <p className="text-xs font-medium uppercase tracking-[0.1em] text-on-surface-variant transition-colors group-hover:text-on-primary-container/75">{eyebrow}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-on-surface transition-colors group-hover:text-on-primary-container">{value}</p>
      <p className="mt-2 text-xs font-medium text-on-surface-variant transition-colors group-hover:text-on-primary-container/75">{detail}</p>
    </motion.article>
  );
}
