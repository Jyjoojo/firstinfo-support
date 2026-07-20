"use client";
import { BadgeCheck, LockIcon } from "lucide-react";
import Link from "next/link";
import { TypeAnimation } from 'react-type-animation';

export default function Hero() {
  return (
    <section
      className="w-full bg-surface py-20 px-gutter"
      style={{ background: "linear-gradient(#f9f9f9 0%, #f3f3f4 100%)" }}
    >
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-container/10 border border-primary-container/30 font-label-sm text-sm py-2 bg-primary-container/20">
          <BadgeCheck className="text-sm mr-2" size={14}/>
          <div className="flex flex-col items-start leading-tight">
            <span className="text-on-surface-variant">
              Partenaire Agréé Sage - Abidjan, Côte d&apos;Ivoire
            </span>
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight text-sage-blue">
          Un problème avec votre <span className="text-sage-blue">solution Sage ?</span>{" "}
          <span className="text-primary-container">
            <TypeAnimation
              sequence={[
                '',
                1000, // Waits 1s
                'Notre équipe est là pour vous aider.',
                2000, // Waits 1s
                'Nos experts vous accompagnent.',
                () => {
                  console.log('Sequence completed');
                },
              ]}
              wrapper="span"
              speed={50}
              cursor={true}
            />
            
          </span>
        </h1>
        <p className="text-lg md:text-xl text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
          Expertise locale reconnue en Afrique de l&apos;Ouest. Taux de satisfaction de 98 % et
          un temps de réponse garanti inférieur à 24 heures pour nos clients sous contrat.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/dashboard/client" className="flex items-center gap-2 bg-primary-container text-on-primary-container px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all active:scale-[0.98]">
              <LockIcon size={14}/>
            Espace Client
          </Link>
          {/* <a
            href="#"
            className="flex items-center gap-2 bg-primary-container text-on-primary-container px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <LockIcon size={14}/>
            Espace Client
          </a> */}
          <a
            href="#"
            className="px-8 py-4 rounded-xl font-bold text-lg border border-outline-variant hover:bg-surface-container transition-all"
          >
            Nous contacter
          </a>
        </div>
      </div>
    </section>
  );
}
