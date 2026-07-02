import Icon from "./Icon";

const footerColumns = [
  {
    title: "Expertise",
    links: ["Sage 100 Gestion", "Sage Paie & RH", "Sage CRM", "Formations"],
  },
  {
    title: "Solutions",
    links: ["Comptabilité", "Finances", "Gestion Commerciale"],
  },
  {
    title: "Support",
    links: ["Base de connaissances", "Espace Client", "FAQ"],
  },
];

export default function Footer() {
  return (
    <footer className="w-full py-section-padding px-gutter bg-surface-container-highest">
      <div className="max-w-container-max mx-auto w-full">
        {/* Top Section */}
        <div className="flex justify-between items-center mb-8">
          <span className="text-2xl font-bold text-primary">First Info CI</span>
          <p className="text-sm text-on-surface-variant">
            Transformation digitale qui réellement fonctionne.
          </p>
        </div>

        <div className="border-t border-outline-variant/20 mb-12" />

        {/* Middle Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs text-on-surface font-bold uppercase tracking-wider mb-6">
                {col.title}
              </h4>
              <ul className="space-y-4 text-sm">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      className="text-on-surface-variant hover:text-primary transition-colors"
                      href="#"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="md:col-span-1">
            <h4 className="text-xs text-on-surface font-bold uppercase tracking-wider mb-6">
              Contact
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3 text-on-surface-variant">
                <Icon name="mail" className="text-primary text-lg" />
                <span>info@firstinfo.ci</span>
              </li>
              <li className="flex items-center gap-3 text-on-surface-variant">
                <Icon name="call" className="text-primary text-lg" />
                <span>+225 27 22 44 XX XX</span>
              </li>
              <li className="flex items-center gap-3 text-on-surface-variant">
                <Icon name="location_on" className="text-primary text-lg" />
                <span>Abidjan, Côte d&apos;Ivoire</span>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div className="flex flex-col items-end gap-4">
            <div className="bg-surface-container px-4 py-2 rounded-lg border border-outline-variant/30 inline-flex items-center gap-3 mb-4">
              <Icon name="language" className="text-sm" />
              <span className="text-xs font-bold text-on-surface-variant">Français</span>
              <Icon name="expand_more" className="text-sm" />
            </div>
            <div className="flex gap-4">
              <a
                className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface-variant hover:bg-primary-container transition-all"
                href="#"
              >
                <Icon name="public" className="text-xl" />
              </a>
              <a
                className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface-variant hover:bg-primary-container transition-all"
                href="#"
              >
                <Icon name="groups" className="text-xl" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-outline-variant/20 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-on-surface-variant">
          <span>© {new Date().getFullYear()} First Info CI. Tous droits réservés.</span>
          <div className="flex gap-8">
            <a className="hover:text-primary transition-colors" href="#">
              Mentions Légales
            </a>
            <a className="hover:text-primary transition-colors" href="#">
              Confidentialité
            </a>
            <a className="hover:text-primary transition-colors" href="#">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
