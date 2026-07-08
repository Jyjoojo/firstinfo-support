import { MessagesSquare, Info } from "lucide-react";

export function DirectSupportWidget() {
  return (
    <div className="bg-tertiary rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
      <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2.5">
          <MessagesSquare size={18} />
          <h4 className="font-bold text-sm">Assistance Directe</h4>
        </div>
        <p className="text-sm text-white/90 mb-5 leading-relaxed">
          Besoin d&apos;une réponse immédiate ? Nos experts Sage sont disponibles par chat direct.
        </p>
        <button className="w-full bg-white text-primary py-2.5 rounded-lg font-bold text-sm hover:shadow-xl active:scale-[0.98] transition-all">
          Lancer une discussion
        </button>
      </div>
    </div>
  );
}

export function MaintenanceNotice() {
  return (
    <div className="bg-surface-container-highest border border-outline-variant/30 rounded-xl p-4 flex items-start gap-3">
      <div className="p-1.5 bg-on-surface-variant/10 rounded-lg text-on-surface-variant shrink-0">
        <Info size={17} />
      </div>
      <div>
        <p className="text-sm font-bold text-on-surface">Maintenance Prévue</p>
        <p className="text-[12px] text-on-surface-variant mt-0.5 leading-normal">
          Intervention cloud Sage 100 le 20 Juin, 22h - 02h.
        </p>
      </div>
    </div>
  );
}
