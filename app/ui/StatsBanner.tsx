const stats = [
  { value: "1 200+", label: "clients en Afrique de l'Ouest" },
  { value: "98 %", label: "de satisfaction client" },
  { value: "< 4h", label: "de résolution moyenne" },
  { value: "24/7", label: "Disponible pour les urgences" },
];

export default function StatsBanner() {
  return (
    <section className="bg-surface-container-lowest border-y border-outline-variant/30 py-12">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center px-4 ${
                i < stats.length - 1 ? "md:border-r border-outline-variant/30" : ""
              }`}
            >
              <div className="text-4xl md:text-5xl font-bold text-sage-blue mb-2">
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
