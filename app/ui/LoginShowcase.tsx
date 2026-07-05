import { Ticket, Clock3, CheckCircle2 } from "lucide-react";

const recentTickets = [
  { ref: "TCK-1042", client: "CIE Distribution", produit: "Sage Paie", statut: "En cours" },
  { ref: "TCK-1041", client: "Sivoa SA", produit: "Sage Compta", statut: "Résolu" },
  { ref: "TCK-1039", client: "Prosuma", produit: "Sage Gestion Co.", statut: "En cours" },
  { ref: "TCK-1037", client: "NSIA Banque", produit: "Sage CRM", statut: "Résolu" },
];

const statusStyles: Record<string, string> = {
  "En cours": "bg-white/25 text-white",
  "Résolu": "bg-white text-primary-container",
};

export default function LoginShowcase() {
  return (
    <div className="relative h-full bg-primary-container rounded-3xl lg:rounded-l-none overflow-hidden p-10 lg:p-14 flex flex-col">
      {/* Motif décoratif en fond */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10" />
      <div className="absolute bottom-10 -left-16 w-56 h-56 rounded-full bg-white/10" />

      <div className="relative z-10">
        <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
          Suivez vos tickets Sage en toute simplicité.
        </h2>
        <p className="text-white/85 max-w-md">
          Connectez-vous pour accéder à votre tableau de bord support et suivre l&apos;avancement
          de vos interventions en temps réel.
        </p>
      </div>

      {/* Mockup dashboard */}
      <div className="relative z-10 mt-10 flex-1">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-on-surface-variant">Tickets ouverts</span>
              <div className="w-7 h-7 rounded-lg bg-primary-container/10 flex items-center justify-center">
                <Ticket size={14} className="text-primary-container" />
              </div>
            </div>
            <p className="text-2xl font-bold text-sage-blue">24</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-on-surface-variant">Temps moyen</span>
              <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Clock3 size={14} className="text-secondary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-sage-blue">3h42</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-lg mb-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-sage-blue">Tickets récents</span>
            <div className="flex items-center gap-1.5 text-xs font-medium text-secondary">
              <CheckCircle2 size={14} />
              128 résolus ce mois
            </div>
          </div>
          <div className="space-y-3">
            {recentTickets.map((ticket) => (
              <div key={ticket.ref} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-sage-blue">{ticket.client}</p>
                  <p className="text-xs text-on-surface-variant">
                    {ticket.ref} · {ticket.produit}
                  </p>
                </div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    ticket.statut === "Résolu"
                      ? "bg-secondary-container text-on-secondary-container"
                      : "bg-primary-container/15 text-on-primary-container"
                  }`}
                >
                  {ticket.statut}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
