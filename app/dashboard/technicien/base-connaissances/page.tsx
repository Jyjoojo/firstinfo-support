import TechnicianKnowledgeBaseManager from "@/app/ui/dashboard/technicien/TechnicianKnowledgeBaseManager";
import { Info } from "lucide-react";


export default function KnowledgeBasePage() {
  return (
    <div className="w-full max-w-7xl p-6 lg:p-8">
      <div className="mb-7">
        <h1 className="mt-2 text-2xl font-bold text-on-surface">Base de connaissances</h1>
        <p className="mt-1 text-base text-on-surface-variant">
          Centralisez les procédures et les réponses utiles à vos utilisateurs.
        </p>
        <div className="bg-tertiary-fixed/40 rounded-lg p-4 flex items-start gap-3 mt-6">
          <Info size={16} />
          <p className="font-body-md text-sm text-on-surface-variant">
            <strong className="text-on-surface font-semibold">Astuce :</strong> Les solutions validées depuis vos tickets clôturés sont automatiquement générées en brouillon à votre nom ci-dessous.
          </p>
        </div>
      </div>
      <TechnicianKnowledgeBaseManager />
    </div>
  );
}
