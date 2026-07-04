import FaqAccordion from "@/components/ui/FaqAccordion";

const faqs = [
  {
    question: "Erreur de connexion SQL Server avec Sage 100 Comptabilité",
    answer:
      "Vérifiez que le service SQL Server est bien démarré et que les ports 1433/1434 ne sont pas bloqués par le pare-feu. Redémarrez le service Sage et reconnectez-vous. Si l'erreur persiste, contrôlez que l'instance (ex : SQLSAGE2019) est bien configurée dans les paramètres réseau du poste client.",
  },
  {
    question: "Problème de clôture annuelle Sage Paie & RH",
    answer:
      "Avant toute clôture, sauvegardez votre dossier. Vérifiez que tous les bulletins de décembre sont validés et que la DSN mensuelle a été transmise. Utilisez ensuite l'assistant de clôture dans le menu Gestion. En cas de blocage, contactez notre support — une mauvaise clôture peut impacter l'exercice suivant.",
  },
  {
    question: "Sage Gestion Commerciale : stock négatif après inventaire",
    answer:
      "Ce problème survient lorsque des mouvements sont enregistrés pendant l'inventaire. Verrouillez les stocks avant l'inventaire et relancez le calcul des coûts moyens pondérés après validation. Vérifiez également les dates des saisies en attente.",
  },
];

export default function FaqSection() {
  return (
    <section className="px-gutter py-section-padding bg-surface">
      <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Colonne gauche */}
        <div className="space-y-6">
          <div className="inline-flex px-6 py-2 rounded-full border border-primary-container text-primary-container font-bold text-sm uppercase tracking-widest">
            FAQ
          </div>
          <h2 className="text-5xl font-bold text-sage-blue leading-tight">
            Notre Expertise <br /> en action !
          </h2>
          <p className="text-lg text-on-surface-variant leading-relaxed max-w-md">
            Solutions rapides aux incidents les plus courants sur Sage, tirées de nos 1 200+
            interventions.
          </p>
        </div>

        {/* Colonne droite : accordéon */}
        <FaqAccordion items={faqs} defaultOpenIndex={0} />
      </div>
    </section>
  );
}
