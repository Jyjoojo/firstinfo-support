"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const tooltipStyle = {
  border: "1px solid #e8e4df",
  borderRadius: 10,
  fontSize: 12,
};

export function TicketEvolutionChart({
  data,
}: {
  data: Array<{ label: string; created: number; resolved: number }>;
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="createdGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#a15c00" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#a15c00" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="resolvedGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#0f766e" stopOpacity={0.22} />
              <stop offset="95%" stopColor="#0f766e" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#eeeae6" />
          <XAxis dataKey="label" axisLine={false} tickLine={false} fontSize={12} />
          <YAxis axisLine={false} tickLine={false} fontSize={12} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend iconType="circle" iconSize={8} />
          <Area
            type="monotone"
            dataKey="created"
            name="Tickets créés"
            stroke="#a15c00"
            strokeWidth={3}
            fill="url(#createdGradient)"
          />
          <Area
            type="monotone"
            dataKey="resolved"
            name="Tickets résolus"
            stroke="#0f766e"
            strokeWidth={3}
            fill="url(#resolvedGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DonutChart({
  data,
  semicircle = false,
}: {
  data: Array<{ label: string; value: number; color: string }>;
  semicircle?: boolean;
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={56}
            outerRadius={84}
            paddingAngle={3}
            stroke="none"
            startAngle={semicircle ? 180 : undefined}
            endAngle={semicircle ? 0 : undefined}
            cy={semicircle ? "72%" : "50%"}
          >
            {data.map((entry) => (
              <Cell key={entry.label} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryBarChart({
  data,
  color = "#a15c00",
}: {
  data: Array<{ label: string; value: number }>;
  color?: string;
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#eeeae6" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            fontSize={11}
          />
          <YAxis axisLine={false} tickLine={false} fontSize={11} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="value" name="Total" fill={color} radius={[7, 7, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
