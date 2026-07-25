import KnowledgeBaseManager from "@/app/ui/dashboard/admin/KnowledgeBaseManager";
import { knowledgeArticles, knowledgeCategories } from "@/lib/knowledge-base";

export default function KnowledgeBasePage() {
  return (
    <div className="w-full max-w-7xl p-6 lg:p-8">
      <div className="mb-7">
        <h1 className="mt-2 text-2xl font-bold text-on-surface">Base de connaissances</h1>
        <p className="mt-1 text-base text-on-surface-variant">
          Centralisez les procédures et les réponses utiles à vos utilisateurs.
        </p>
      </div>
      <KnowledgeBaseManager articles={knowledgeArticles} categories={knowledgeCategories} />
    </div>
  );
}
