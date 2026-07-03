"use client";

import CountUp from 'react-countup';
import { useInView } from "react-intersection-observer";

const stats = [
  { value: " +", label: "Clients et partenaires en Côte d'Ivoire", number: 70 },
  { value: " %", label: "de satisfaction client", number: 99 },
  { value: " h", label: "de résolution moyenne", number: 4 , prefix: "<" },
  { value: " /7", label: "Disponible pour les urgences", number: 24 },
];

export default function StatsBanner() {
  const { ref, inView } = useInView({
    triggerOnce: true, // animation une seule fois
    threshold: 1,    // déclenche quand 30% visible
  });

  return (
    <section className="bg-surface-container-lowest border-y border-outline-variant/30 py-12">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
          {stats.map((stat, i) => (
            <div
              ref={ref}
              key={stat.label}
              className={`text-center px-4 ${
                i < stats.length - 1 ? "md:border-r border-outline-variant/30" : ""
              }`}
            >
              <div className="text-4xl md:text-5xl font-bold text-sage-blue mb-2">
                {stat.prefix ? (<span className="text-4xl md:text-5xl font-bold text-sage-blue mb-2">{stat.prefix}</span>) : null}
                { inView && <CountUp end={stat.number} duration={3} /> }
                {stat.value}
              </div>
              <div className="text-sm text-on-surface-variant font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
