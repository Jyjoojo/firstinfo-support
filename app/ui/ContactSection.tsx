"use client";

import { useState } from "react";
import Icon from "./Icon";
import { ExternalLink } from "lucide-react";

export default function ContactSection() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: brancher sur l'API (ex: POST /api/contact)
    setSubmitted(true);
    setForm({ firstName: "", lastName: "", email: "", message: "" });
  };

  return (
    <section className="px-gutter py-section-padding max-w-container-max mx-auto" id="contact">
      <div className="bg-inverse-surface rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="grid lg:grid-cols-2 relative z-10">
          {/* Left: Info */}
          <div className="p-12 lg:p-20 flex flex-col justify-center text-inverse-on-surface">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à transformer votre gestion ?
            </h2>
            <p className="text-lg opacity-80 mb-10">
              Discutez avec l&apos;un de nos consultants experts pour définir la solution qui
              correspond le mieux à vos besoins spécifiques.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-fixed">
                  <Icon name="call" />
                </div>
                <div>
                  <p className="text-xs opacity-60 uppercase font-bold tracking-wider">
                    Téléphone
                  </p>
                  <p className="text-lg">+225 27 22 43 58 65 / 07 59 09 87 32</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-fixed">
                  <Icon name="mail" />
                </div>
                <div>
                  <p className="text-xs opacity-60 uppercase font-bold tracking-wider">E-mail</p>
                  <p className="text-lg">commercial@firstinfoci.com</p>
                </div>
              </div>
            </div>
            <div className="mt-12 p-8 bg-white/5 rounded-2xl border border-white/10">
              <h4 className="text-xs text-primary-fixed mb-2 uppercase font-bold tracking-wider">
                Accès Rapide
              </h4>
              <p className="mb-6">
                Déjà client ? Accédez directement à votre espace de support dédié.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-white text-inverse-surface px-6 py-3 rounded-xl font-bold hover:bg-primary-fixed transition-colors"
              >
                Portail Client <ExternalLink className="text-sm" size={15} />
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white/5 backdrop-blur-md p-12 lg:p-20 border-l border-white/10">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-inverse-on-surface space-y-4">
                <Icon name="check_circle" className="text-5xl text-secondary-fixed" />
                <p className="text-lg font-bold">Merci ! Votre demande a été envoyée.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-sm underline opacity-80 hover:opacity-100"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs text-inverse-on-surface/70 font-bold">
                      Prénom
                    </label>
                    <input
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:ring-2 focus:ring-primary-container outline-none transition-all"
                      placeholder="Jean"
                      type="text"
                      value={form.firstName}
                      onChange={handleChange("firstName")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs text-inverse-on-surface/70 font-bold">
                      Nom
                    </label>
                    <input
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:ring-2 focus:ring-primary-container outline-none transition-all"
                      placeholder="Dupont"
                      type="text"
                      value={form.lastName}
                      onChange={handleChange("lastName")}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs text-inverse-on-surface/70 font-bold">
                    E-mail Professionnel
                  </label>
                  <input
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:ring-2 focus:ring-primary-container outline-none transition-all"
                    placeholder="jean.dupont@entreprise.com"
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs text-inverse-on-surface/70 font-bold">
                    Message
                  </label>
                  <textarea
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:ring-2 focus:ring-primary-container outline-none transition-all"
                    placeholder="Parlez-nous de votre projet..."
                    rows={5}
                    value={form.message}
                    onChange={handleChange("message")}
                    required
                  />
                </div>
                <button
                  className="w-full bg-primary-container text-on-primary-container font-bold py-4 rounded-xl shadow-lg hover:shadow-primary-container/20 transition-all active:scale-[0.98]"
                  type="submit"
                >
                  Envoyer la demande
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
