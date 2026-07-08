const contracts = [
  {
    product: "Sage 100 Comptabilité",
    expiresAt: "Juin 2027",
    remainingPct: 70,
  },
  {
    product: "Sage Gestion Commerciale",
    expiresAt: "Avril 2027",
    remainingPct: 85,
  },
  {
    product: "Sage Paie & RH",
    expiresAt: "Janvier 2027",
    remainingPct: 45,
  },
  {
    product: "Sage CRM",
    expiresAt: "Septembre 2026",
    remainingPct: 12,
  },
];

// Couleur du point + de la barre selon le temps restant, pas de texte long
function urgency(pct: number) {
  if (pct <= 20) return { dot: "bg-red-500", bar: "bg-red-500" };
  if (pct <= 40) return { dot: "bg-orange-500", bar: "bg-orange-500" };
  return { dot: "bg-secondary", bar: "bg-secondary" };
}

export default function ContractsOverview() {
  return (
    <div className="mt-6 bg-white rounded-xl border border-outline-variant/30 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-on-surface">Produits sous contrat</h4>
        <a className="text-primary font-bold text-xs hover:underline" href="#">
          Gérer les contrats
        </a>
      </div>

      <div className="space-y-4">
        {contracts.map((contract) => {
          const { dot, bar } = urgency(contract.remainingPct);
          return (
            <div key={contract.product}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                  <span className="text-sm font-semibold text-on-surface">
                    {contract.product}
                  </span>
                  <span className="text-[11px] text-on-surface-variant">Actif</span>
                </div>
                <span className="text-[11px] text-on-surface-variant">
                  Expire · {contract.expiresAt}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-surface-container-high overflow-hidden">
                <div
                  className={`h-full rounded-full ${bar}`}
                  style={{ width: `${contract.remainingPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
