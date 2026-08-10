import { BookOpen } from "lucide-react";
import Link from "next/link";
import type { PopularKnowledgeArticle } from "@/lib/client-dashboard-api";

function viewsLabel(views: number) {
  return `${new Intl.NumberFormat("fr-FR", { notation: "compact", maximumFractionDigits: 1 }).format(views)} vues`;
}

export default function KnowledgeBaseWidget({ articles }: { articles: PopularKnowledgeArticle[] }) {
  return (
    <div className="bg-white rounded-xl border border-outline-variant/30 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen size={18} className="text-on-surface" />
        <h4 className="font-bold text-sm text-on-surface">Base de connaissances</h4>
      </div>
      <div className="space-y-4">
        {articles.map((article) => (
          <Link key={article.id} href={`/dashboard/client/base-connaissances/article/${article.id}`} className="group block cursor-pointer">
            <h5 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors leading-snug">
              {article.titre}
            </h5>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-on-surface-variant">
              <span className="px-1.5 py-0.5 bg-surface-container rounded font-semibold">
                {article.categorie?.libelle ?? "Non classé"}
              </span>
              <span>•</span>
              <span>{viewsLabel(article.vues)}</span>
            </div>
          </Link>
        ))}
        {articles.length === 0 && <p className="text-sm text-on-surface-variant">Aucun article disponible.</p>}
      </div>
      <Link href="/dashboard/client/base-connaissances" className="block w-full mt-5 py-2 border-2 border-outline-variant/50 text-center text-on-surface font-bold text-sm rounded-lg hover:bg-surface-container transition-all">
        Voir tous les articles
      </Link>
    </div>
  );
}
