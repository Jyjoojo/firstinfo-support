import Icon from "./Icon";
import { 
  Landmark, 
  Wallet, 
  Archive, 
  FileSpreadsheet, 
  Handshake, 
  MoveRight 
} from "lucide-react";

const services = [
  {
    icon: Landmark,
    iconBg: "bg-primary-container/10",
    iconColor: "text-primary-container",
    eyebrow: "SAGE 100 COMPTABILITÉ",
    title: "Sage Comptabilité",
    description:
      "Gestion des écritures, rapprochement bancaire et bilans. Un problème de clôture ? Nos experts vous guident pas à pas.",
  },
  {
    icon: Wallet,
    iconBg: "bg-error/10",
    iconColor: "text-on-surface-variant",
    eyebrow: "IMMOBILISATIONS & TRÉSORERIE",
    title: "Sage Pool Finances",
    description:
      "Optimisation de la trésorerie, gestion des immobilisations et pilotage des flux financiers de votre entreprise.",
  },
  {
    icon: Archive,
    iconBg: "bg-tertiary/10",
    iconColor: "text-tertiary",
    eyebrow: "STOCKS & VENTES",
    title: "Sage Gestion Commerciale",
    description:
      "Suivi des stocks, cycle de ventes complet (devis, factures) et gestion de la chaîne logistique en temps réel.",
  },
  {
    icon: FileSpreadsheet,
    iconBg: "bg-error/10",
    iconColor: "text-error",
    eyebrow: "BULLETINS & DSN",
    title: "Sage Paie & RH",
    description:
      "Édition des bulletins de paie, déclarations sociales (DSN) et gestion du capital humain en toute conformité.",
  },
  {
    icon: Handshake,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    eyebrow: "RELATION CLIENT & DEVIS",
    title: "Sage CRM & Multi-devis",
    description:
      "Gestion de la relation client, suivi des opportunités commerciales et chiffrage précis de vos devis d'affaires.",
  },
];

export default function ServiceCards() {
  return (
    <section className="px-gutter py-section-padding bg-surface-container-low/20" id="solutions">
      <div className="max-w-container-max mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-sage-blue mb-4">Nos solutions Sage</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">
            First Info CI maîtrise l&apos;ensemble de l&apos;écosystème Sage. Votre logiciel est
            entre de bonnes mains.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;

            return (
            <div
              key={service.title}
              className="bg-white p-8 rounded-2xl shadow-sm border border-outline-variant/10 hover:shadow-md transition-shadow flex flex-col"
            >
              <div
                className={`w-12 h-12 rounded-xl ${service.iconBg} flex items-center justify-center mb-6`}
              >
                <Icon className={`${service.iconColor} text-3xl`} size={30}/>
              </div>
              <span className="text-[10px] font-bold tracking-widest text-on-surface-variant/60 uppercase mb-2">
                {service.eyebrow}
              </span>
              <h3 className="text-xl font-bold text-sage-blue mb-3">{service.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6 flex-grow">
                {service.description}
              </p>
            </div>
            );
          })}

          {/* Carte CTA */}
          <div className="p-8 rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-low flex flex-col justify-center text-center">
            <h3 className="text-xl font-bold text-sage-blue mb-3">Votre logiciel est couvert</h3>
            <p className="text-on-surface-variant text-sm mb-6">
              Pas encore client chez First Info CI ? Discutons de vos besoins.
            </p>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 text-primary font-bold hover:underline"
            >
              Nous contacter <Icon name="east" className="text-sm" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
