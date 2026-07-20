"use client";

import {
  Area,
  AreaChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TrendDatum = { label: string; tickets: number };
type DistributionDatum = { label: string; value: number; color: string };

export function TicketTrendChart({ data }: { data: TrendDatum[] }) {
  return (
    <div className="mt-5 h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="ticketTrend" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#a15c00" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#a15c00" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#6b6560", fontSize: 12 }} />
          <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#6b6560", fontSize: 12 }} />
          <Tooltip cursor={{ stroke: "#a15c00", strokeDasharray: "4 4" }} contentStyle={{ borderRadius: 10, border: "1px solid #e8e4df", fontSize: 13 }} />
          <Area type="monotone" dataKey="tickets" name="Tickets créés" stroke="#a15c00" strokeWidth={3} fill="url(#ticketTrend)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TicketDistributionChart({ data }: { data: DistributionDatum[] }) {
  return (
    <div className="mt-4 h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="label" innerRadius={62} outerRadius={88} paddingAngle={3} stroke="none">
            {data.map((item) => <Cell key={item.label} fill={item.color} />)}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e8e4df", fontSize: 13 }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
