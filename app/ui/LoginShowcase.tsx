import Image from "next/image";

const products = [
  "Sage 100 Comptabilité",
  "Sage Paie & RH",
  "Sage Gestion Commerciale",
  "Sage CRM",
];

export default function LoginShowcase() {
  return (
    <div className="relative h-full rounded-3xl lg:rounded-l-none overflow-hidden flex flex-col justify-between p-10 lg:p-14">
      <Image
        src="/login-bgv2.png"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
      {/* Voile pour garantir la lisibilité du texte sur le fond */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/10" />

      <div className="relative">
        <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
          Votre partenaire Sage,
          <br /> à chaque étape.
        </h2>
        <p className="mt-4 text-white/90 max-w-md">
          Connectez-vous pour suivre vos tickets, échanger avec nos experts et garder une vue
          claire sur vos interventions Sage.
        </p>
      </div>

      <div className="relative">
        <p className="text-xs uppercase tracking-widest text-white/70 mb-3 font-semibold">
          Solutions couvertes
        </p>
        <div className="flex flex-wrap gap-2">
          {products.map((product) => (
            <span
              key={product}
              className="text-xs font-medium text-white bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/25"
            >
              {product}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
