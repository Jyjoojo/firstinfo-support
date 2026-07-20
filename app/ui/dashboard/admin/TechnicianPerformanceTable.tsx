"use client";

import Link from "next/link";
import { motion } from "motion/react";

export type TechnicianPerformance = {
  name: string;
  assigned: number;
  active: number;
  resolutionRate: number;
  averageTime: string;
};

export default function TechnicianPerformanceTable({ technicians, reportsHref }: { technicians: TechnicianPerformance[]; reportsHref: string }) {
  const topTechnicians = [...technicians]
    .sort((a, b) => b.resolutionRate - a.resolutionRate || b.assigned - a.assigned)
    .slice(0, 5);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="mt-6 rounded-2xl border border-outline-variant/20 bg-white p-6 shadow-sm"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Performance des techniciens</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Top 5 calculé à partir des assignations de tickets.</p>
        </div>
        <Link href={reportsHref} className="rounded-lg border border-primary/30 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5">Voir tous les détails</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-y border-outline-variant/20 text-xs uppercase tracking-wider text-on-surface-variant">
            <tr><th className="py-3 font-semibold">Technicien</th><th className="py-3 font-semibold">Tickets assignés</th><th className="py-3 font-semibold">Tickets actifs</th><th className="py-3 font-semibold">Taux de résolution</th><th className="py-3 font-semibold">Temps moyen</th></tr>
          </thead>
          <tbody>
              {topTechnicians.map((technician, index) => (
                <motion.tr
                  key={technician.name}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.07 }}
                  className="border-b border-outline-variant/15 last:border-0"
                >
                <td className="py-4 font-semibold text-on-surface"><span className="mr-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-container/15 text-xs text-primary">{technician.name.split(" ").map((part) => part[0]).join("")}</span>{technician.name}</td>
                <td className="py-4 text-on-surface">{technician.assigned}</td>
                <td className="py-4 text-on-surface">{technician.active}</td>
                <td className="py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${technician.resolutionRate >= 80 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{technician.resolutionRate}%</span></td>
                <td className="py-4 text-on-surface">{technician.averageTime}</td>
                </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}
