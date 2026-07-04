"use client";

import { useState } from "react";
import Icon from "./Icon";

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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="px-gutter py-section-padding bg-surface">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-sage-blue mb-4">Notre expertise en action</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">
            Solutions rapides aux incidents les plus courants sur Sage, tirées de nos 1 200+
            interventions.
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="border border-outline-variant/20 rounded-xl overflow-hidden bg-surface-container-lowest"
              >
                <button
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-surface-container-low transition-colors group"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-sage-blue">{faq.question}</span>
                  <Icon
                    name="expand_more"
                    className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-on-surface-variant text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
