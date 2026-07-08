import { BookOpen } from "lucide-react";

const articles = [
  { title: "Comment paramétrer le prélèvement à la source ?", tag: "Sage Paie", views: "1.2k vues" },
  { title: "Guide des raccourcis Sage 100cloud", tag: "Productivité", views: "850 vues" },
  { title: "Optimiser les clôtures mensuelles", tag: "Expertise", views: "640 vues" },
];

export default function KnowledgeBaseWidget() {
  return (
    <div className="bg-white rounded-xl border border-outline-variant/30 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen size={18} className="text-on-surface" />
        <h4 className="font-bold text-sm text-on-surface">Base de connaissances</h4>
      </div>
      <div className="space-y-4">
        {articles.map((article) => (
          <div key={article.title} className="group cursor-pointer">
            <h5 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors leading-snug">
              {article.title}
            </h5>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-on-surface-variant">
              <span className="px-1.5 py-0.5 bg-surface-container rounded font-semibold">
                {article.tag}
              </span>
              <span>•</span>
              <span>{article.views}</span>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-5 py-2 border-2 border-outline-variant/50 text-on-surface font-bold text-sm rounded-lg hover:bg-surface-container transition-all">
        Voir tous les articles
      </button>
    </div>
  );
}
