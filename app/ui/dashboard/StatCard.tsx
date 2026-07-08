import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  iconColorClass: string; 
  bgColorClass: string;
  tag: string;
  label: string;
  value: string;
  trend?: { icon: LucideIcon; value: string; colorClass: string };
  helper: string;
}

export default function StatCard({
  icon: Icon,
  iconColorClass,
  bgColorClass,
  tag,
  label,
  value,
  trend,
  helper,
}: StatCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-outline-variant/30 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${bgColorClass}`}>
          <Icon size={20} className={iconColorClass} />
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${iconColorClass} ${bgColorClass}`}
        >
          {tag}
        </span>
      </div>
      <p className="text-sm font-medium text-on-surface-variant">{label}</p>
      <div className="flex items-baseline gap-2.5 mt-1">
        <h3 className="text-2xl font-bold text-on-surface">{value}</h3>
        {trend && (
          <div className={`flex items-center gap-0.5 text-xs font-semibold ${trend.colorClass}`}>
            <trend.icon size={13} />
            <span>{trend.value}</span>
          </div>
        )}
      </div>
      <p className="text-[11px] text-on-surface-variant mt-1.5">{helper}</p>
    </div>
  );
}
