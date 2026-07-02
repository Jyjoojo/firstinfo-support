"use client";

import { useState, type FormEvent } from "react";
import Icon from "./Icon";

const navItems = [
  { label: "Expertise", href: "#" },
  { label: "Solutions", href: "#solutions" },
  { label: "Support", href: "#support" },
  { label: "Tarifs", href: "#" },
];

const stats = [
  { value: "1 200+", label: "clients en Afrique de l'Ouest" },
  { value: "98 %", label: "de satisfaction client" },
  { value: "< 4h", label: "de résolution moyenne" },
  { value: "24/7", label: "Disponible pour les urgences" },
];

const services = [
  {
    category: "SAGE 100 COMPTABILITÉ",
    title: "Sage Comptabilité",
    icon: "account_balance",
    description:
      "Gestion des écritures, rapprochement bancaire et bilans. Un problème de clôture ? Nos experts vous guident pas à pas.",
    toneClass: "bg-amber-100",
    iconClass: "text-amber-600",
  },
  {
    category: "IMMOBILISATIONS & TRÉSORERIE",
    title: "Sage Pool Finances",
    icon: "account_balance_wallet",
    description:
      "Optimisation de la trésorerie, gestion des immobilisations et pilotage des flux financiers de votre entreprise.",
    toneClass: "bg-emerald-100",
    iconClass: "text-emerald-700",
  },
  {
    category: "STOCKS & VENTES",
    title: "Sage Gestion Commerciale",
    icon: "inventory_2",
    description:
      "Suivi des stocks, cycle de ventes complet (devis, factures) et gestion de la chaîne logistique en temps réel.",
    toneClass: "bg-yellow-100",
    iconClass: "text-amber-700",
  },
  {
    category: "BULLETINS & DSN",
    title: "Sage Paie & RH",
    icon: "groups",
    description:
      "Édition des bulletins de paie, déclarations sociales (DSN) et gestion du capital humain en toute conformité.",
    toneClass: "bg-red-100",
    iconClass: "text-red-600",
  },
  {
    category: "RELATION CLIENT & DEVIS",
    title: "Sage CRM & Multi-devis",
    icon: "handshake",
    description:
      "Gestion de la relation client, suivi des opportunités commerciales et chiffrage précis de vos devis d'affaires.",
    toneClass: "bg-sky-100",
    iconClass: "text-sky-600",
  },
];

const faqItems = [
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

export default function FirstInfoHome() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", message: "" });

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? -1 : index);
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert("Merci! Votre demande a été envoyée.");
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans selection:bg-primary-container selection:text-on-primary-container">
      <header className="fixed top-0 left-0 z-50 w-full border-b border-outline-variant/20 bg-surface/80 px-6 py-4 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-container-max items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <div className="text-lg font-bold text-primary">First Info CI</div>
            <nav className="hidden items-center gap-6 md:flex">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={
                    item.label === "Expertise"
                      ? "border-b-2 border-primary pb-1 font-semibold text-primary"
                      : "text-on-surface-variant hover:text-primary transition-colors"
                  }
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-outline-variant/30 bg-surface-container-low px-3 py-1 text-sm text-on-surface-variant lg:flex">
              <Icon name="search" className="text-outline" />
              Rechercher...
            </div>
            <button className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-low transition-all">
              <Icon name="help" />
            </button>
            <button className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-low transition-all">
              <Icon name="notifications" />
            </button>
            <a
              href="#"
              className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-on-primary transition-all hover:bg-primary/90 active:scale-95 shadow-sm"
            >
              Se connecter
            </a>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <section className="bg-surface py-20 px-6" style={{ background: "linear-gradient(rgb(249, 249, 249) 0%, rgb(243, 243, 244) 100%)" }}>
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-container/30 bg-primary-container/20 px-4 py-2 text-sm text-on-surface-variant">
              <Icon name="verified" className="text-sm" />
              <div className="leading-tight">
                Partenaire Agréé Sage - Abidjan, Côte d'Ivoire
              </div>
            </div>
            <h1 className="max-w-3xl text-5xl font-bold leading-tight text-sage-blue md:text-6xl">
              Un problème avec votre <span className="text-sage-blue">solution Sage ?</span>{" "}
              <span className="text-primary-container">Notre équipe support est là pour vous aider.</span>
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-on-surface-variant md:text-xl">
              Expertise locale reconnue en Afrique de l'Ouest. Taux de satisfaction de 98 % et un temps de réponse garanti inférieur à 24 heures pour nos clients sous contrat.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-container px-8 py-4 text-lg font-bold text-on-primary-container shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
              >
                <Icon name="lock" />
                Espace Client
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-xl border border-outline-variant px-8 py-4 text-lg font-bold transition-all hover:bg-surface-container"
              >
                Nous contacter
              </a>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest border-y border-outline-variant/30 py-12">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
              {stats.map((stat, index) => (
                <div key={stat.label} className={`text-center px-4 ${index < stats.length - 1 ? "md:border-r md:border-outline-variant/30" : ""}`}>
                  <div className="text-4xl md:text-5xl font-bold text-sage-blue mb-2">{stat.value}</div>
                  <div className="text-sm text-on-surface-variant font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-gutter py-section-padding bg-surface-container-low/20" id="solutions">
          <div className="max-w-container-max mx-auto">
            <div className="mb-16 text-center">
              <h2 className="text-4xl font-bold text-sage-blue mb-4">Nos solutions Sage</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto">
                First Info CI maîtrise l'ensemble de l'écosystème Sage. Votre logiciel est entre de bonnes mains.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {services.map((service) => (
                <div key={service.title} className="bg-white p-8 rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <div>
                    <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl ${service.toneClass}`}>
                      <Icon name={service.icon} className={`text-3xl ${service.iconClass}`} />
                    </div>
                    <div className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant/60 mb-2">
                      {service.category}
                    </div>
                    <h3 className="text-xl font-bold text-sage-blue mb-3">{service.title}</h3>
                    <p className="text-sm leading-relaxed text-on-surface-variant">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
              <div className="p-8 rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-low flex flex-col justify-center text-center">
                <h3 className="text-xl font-bold text-sage-blue mb-3">Votre logiciel est couvert</h3>
                <p className="text-on-surface-variant text-sm mb-6">
                  Pas encore client chez First Info CI ? Discutons de vos besoins.
                </p>
                <a className="inline-flex items-center justify-center gap-2 text-primary font-bold hover:underline" href="#">
                  Nous contacter <Icon name="east" className="text-sm" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="px-gutter py-section-padding bg-surface" id="support">
          <div className="max-w-container-max mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-sage-blue mb-4">Notre expertise en action</h2>
              <p className="max-w-2xl mx-auto text-on-surface-variant">
                Solutions rapides aux incidents les plus courants sur Sage, tirées de nos 1 200+ interventions.
              </p>
            </div>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={item.question} className="border border-outline-variant/20 rounded-xl overflow-hidden bg-surface-container-lowest">
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-surface-container-low transition-colors"
                    aria-expanded={openFaqIndex === index}
                  >
                    <span className="font-bold text-sage-blue">{item.question}</span>
                    <Icon
                      name="expand_more"
                      className={`transition-transform duration-300 ${openFaqIndex === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div className={`${openFaqIndex === index ? "block" : "hidden"} px-6 pb-6 text-on-surface-variant text-sm leading-relaxed`}>
                    {item.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-gutter py-section-padding">
          <div className="max-w-container-max mx-auto bg-inverse-surface rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="grid lg:grid-cols-2 relative z-10">
              <div className="p-12 lg:p-20 text-inverse-on-surface">
                <h2 className="text-4xl font-bold mb-6">Prêt à transformer votre gestion ?</h2>
                <p className="mb-10 text-lg opacity-80 leading-relaxed">
                  Discutez avec l'un de nos consultants experts pour définir la solution qui correspond le mieux à vos besoins spécifiques.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary-fixed">
                      <Icon name="call" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/70">Téléphone</p>
                      <p className="text-lg">+225 00 00 00 00 00</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/20 text-secondary-fixed">
                      <Icon name="mail" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/70">E-mail</p>
                      <p className="text-lg">contact@firstinfo.ci</p>
                    </div>
                  </div>
                </div>
                <div className="mt-12 p-8 bg-white/5 rounded-2xl border border-white/10">
                  <h4 className="text-xs text-primary-fixed mb-2 uppercase font-bold tracking-wider">Accès Rapide</h4>
                  <p className="mb-6 text-white/80">
                    Déjà client ? Accédez directement à votre espace de support dédié.
                  </p>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 bg-white text-inverse-surface px-6 py-3 rounded-xl font-bold hover:bg-primary-fixed transition-colors"
                  >
                    Portail Client <Icon name="open_in_new" className="text-sm" />
                  </a>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-12 lg:p-20 backdrop-blur-md">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="block text-xs uppercase tracking-wider text-white/70">Prénom</span>
                      <input
                        value={form.firstName}
                        onChange={(event) => handleChange("firstName", event.target.value)}
                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-primary-container transition-all"
                        placeholder="Jean"
                        type="text"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="block text-xs uppercase tracking-wider text-white/70">Nom</span>
                      <input
                        value={form.lastName}
                        onChange={(event) => handleChange("lastName", event.target.value)}
                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-primary-container transition-all"
                        placeholder="Dupont"
                        type="text"
                      />
                    </label>
                  </div>
                  <label className="space-y-2">
                    <span className="block text-xs uppercase tracking-wider text-white/70">E-mail Professionnel</span>
                    <input
                      value={form.email}
                      onChange={(event) => handleChange("email", event.target.value)}
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-primary-container transition-all"
                      placeholder="jean.dupont@entreprise.com"
                      type="email"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="block text-xs uppercase tracking-wider text-white/70">Message</span>
                    <textarea
                      value={form.message}
                      onChange={(event) => handleChange("message", event.target.value)}
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-primary-container transition-all"
                      placeholder="Parlez-nous de votre projet..."
                      rows={5}
                    />
                  </label>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-amber-500 px-6 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-amber-600 active:scale-[0.98]"
                  >
                    Envoyer la demande
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-surface-container-highest px-gutter py-section-padding">
        <div className="max-w-container-max mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <span className="text-2xl font-bold text-primary">First Info CI</span>
            <p className="text-sm text-on-surface-variant">Transformation digitale qui réellement fonctionne.</p>
          </div>
          <div className="border-t border-outline-variant/20 mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
            <div>
              <h4 className="text-xs uppercase tracking-wider text-on-surface font-bold mb-6">Expertise</h4>
              <ul className="space-y-4 text-sm text-on-surface-variant">
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Sage 100 Gestion
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Sage Paie & RH
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Sage CRM
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Formations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-on-surface font-bold mb-6">Solutions</h4>
              <ul className="space-y-4 text-sm text-on-surface-variant">
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Comptabilité
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Finances
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Gestion Commerciale
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-on-surface font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-on-surface-variant">
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Base de connaissances
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Espace Client
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-on-surface font-bold mb-6">Contact</h4>
              <ul className="space-y-4 text-sm text-on-surface-variant">
                <li className="flex items-center gap-3">
                  <Icon name="mail" className="text-primary text-lg" />
                  <span>info@firstinfo.ci</span>
                </li>
                <li className="flex items-center gap-3">
                  <Icon name="call" className="text-primary text-lg" />
                  <span>+225 27 22 44 XX XX</span>
                </li>
                <li className="flex items-center gap-3">
                  <Icon name="location_on" className="text-primary text-lg" />
                  <span>Abidjan, Côte d'Ivoire</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-end gap-4">
              <div className="inline-flex items-center gap-3 rounded-lg border border-outline-variant/30 bg-surface-container px-4 py-2">
                <Icon name="language" className="text-sm" />
                <span className="text-xs font-bold text-on-surface-variant">Français</span>
                <Icon name="expand_more" className="text-sm" />
              </div>
              <div className="flex gap-4">
                <a className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface-variant hover:bg-primary transition-all" href="#">
                  <Icon name="public" className="text-xl" />
                </a>
                <a className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface-variant hover:bg-primary transition-all" href="#">
                  <Icon name="groups" className="text-xl" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-outline-variant/20 mb-8"></div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-on-surface-variant">
            <span>© 2024 First Info CI. Tous droits réservés.</span>
            <div className="flex gap-8">
              <a className="hover:text-primary transition-colors" href="#">Mentions Légales</a>
              <a className="hover:text-primary transition-colors" href="#">Confidentialité</a>
              <a className="hover:text-primary transition-colors" href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
