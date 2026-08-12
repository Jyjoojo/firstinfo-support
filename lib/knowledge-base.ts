// Données conservées pour l'espace client.
export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  excerpt: string;
  module: string;
  category: string;
  readTime: string;
  lastUpdated: string;
  content: string;
}

export interface MyResolution {
  id: string;
  ticketId: string;
  ticketReference: string;
  title: string;
  summary: string;
  module: string;
  resolvedDate: string;
  technician: string;
  breadcrumb: string[];
}

export const KNOWLEDGE_BASE_PUBLIC: KnowledgeBaseArticle[] = [
  { id: "kb-1", title: "Renouveler le certificat SSL d'une instance SQL Server", module: "Sage 100 Comptabilité", category: "Infrastructure", readTime: "4 min", lastUpdated: "2024-07-18", excerpt: "Procédure pas-à-pas pour renouveler un certificat SSL expiré.", content: "Contenu détaillé de l'article sur le renouvellement SSL..." },
  { id: "kb-2", title: "Procédure de clôture annuelle Sage Paie & RH", module: "Sage Paie & RH", category: "Paie", readTime: "6 min", lastUpdated: "2024-07-15", excerpt: "Checklist complète avant la clôture.", content: "Contenu détaillé de l'article sur la clôture annuelle..." },
  { id: "kb-3", title: "Sauvegarder et restaurer un dossier Sage", module: "Sage Gestion Commerciale", category: "Maintenance", readTime: "3 min", lastUpdated: "2024-07-12", excerpt: "Les bonnes pratiques de sauvegarde.", content: "Contenu détaillé de l'article sur la sauvegarde..." },
  { id: "kb-4", title: "Corriger un stock négatif après inventaire", module: "Sage Gestion Commerciale", category: "Stock", readTime: "5 min", lastUpdated: "2024-07-10", excerpt: "Recalculer les coûts moyens pondérés.", content: "Contenu détaillé sur les stocks négatifs..." },
  { id: "kb-5", title: "Configurer le rapprochement bancaire automatique", module: "Sage 100 Comptabilité", category: "Comptabilité", readTime: "4 min", lastUpdated: "2024-07-08", excerpt: "Importer les relevés et paramétrer les règles.", content: "Contenu détaillé sur le rapprochement bancaire..." },
  { id: "kb-6", title: "Résoudre une erreur de DSN mensuelle", module: "Sage Paie & RH", category: "Paie", readTime: "3 min", lastUpdated: "2024-07-05", excerpt: "Diagnostic du code d'erreur DSN.", content: "Contenu détaillé sur l'erreur DSN..." },
];

export const MY_RESOLUTIONS: MyResolution[] = [
  { id: "res-1", ticketId: "res-1-ticket", ticketReference: "TKT-2026-042", title: "Problème d'impression des bulletins de paie", summary: "Le service d'impression a été redémarré.", module: "Sage Paie & RH", resolvedDate: "15 Mai 2026", technician: "Support Niveau 2", breadcrumb: ["Mes Résolutions", "Sage Paie & RH", "Impression"] },
  { id: "res-2", ticketId: "res-2-ticket", ticketReference: "TK-2026-0831", title: "Bulletins de paie non imprimables", summary: "Le pilote d'impression par défaut était corrompu.", module: "Sage Paie & RH", resolvedDate: "6 mai 2026", technician: "Traoré M.", breadcrumb: ["Base de connaissances", "Sage Paie & RH", "Impression bulletins"] },
  { id: "res-3", ticketId: "res-3-ticket", ticketReference: "TK-2026-0812", title: "DSN mensuelle rejetée S40.001", summary: "Le numéro SIRET a été corrigé.", module: "Sage Paie & RH", resolvedDate: "20 avr. 2026", technician: "Traoré M.", breadcrumb: ["Base de connaissances", "Sage Paie & RH", "DSN"] },
];

export type ArticleStatus = "draft" | "published" | "archived";

export type KnowledgeArticle = {
  id: string;
  title: string;
  content: string;
  category: string | null;
  author: string | null;
  keywords: string[];
  views: number;
  status: ArticleStatus;
  updatedAt: string;
};

export const knowledgeCategories = ["Sage 100", "Sage Paie", "Infrastructure", "Comptabilité"];

export const knowledgeArticles: KnowledgeArticle[] = [
  { id: "KB-2024-001", title: "Configuration SQL Server pour Sage 100", content: "Procédure de configuration de SQL Server et de la connexion Sage 100.", category: "Sage 100", author: "Jean Dupont", keywords: ["SQL", "Sage"], views: 1245, status: "published", updatedAt: "2024-10-12T09:15:00.000Z" },
  { id: "KB-2024-042", title: "Erreur de clôture annuelle – Paie", content: "Résoudre les erreurs fréquentes rencontrées lors de la clôture annuelle.", category: "Sage Paie", author: "Marie Kone", keywords: ["Clôture", "Paie"], views: 89, status: "draft", updatedAt: "2026-07-22T09:30:00.000Z" },
  { id: "KB-2023-112", title: "Guide Migration Cloud Sage", content: "Guide de préparation et de migration d'un environnement Sage vers le cloud.", category: "Infrastructure", author: "Ali Kouame", keywords: ["Migration", "Cloud"], views: 3402, status: "archived", updatedAt: "2023-09-15T10:00:00.000Z" },
  { id: "KB-2025-018", title: "Créer un exercice comptable", content: "Étapes pour créer et paramétrer un nouvel exercice comptable.", category: "Comptabilité", author: "Jean Dupont", keywords: ["Exercice", "Comptabilité"], views: 756, status: "published", updatedAt: "2025-11-04T08:20:00.000Z" },
  { id: "KB-2025-030", title: "Vérifier la sauvegarde quotidienne", content: "Checklist de vérification des sauvegardes quotidiennes de l'infrastructure.", category: "Infrastructure", author: null, keywords: ["Sauvegarde", "Serveur"], views: 0, status: "draft", updatedAt: "2026-07-20T16:10:00.000Z" },
];

export type TechnicianArticleStatus =
  | "brouillon"
  | "a_corriger"
  | "en_attente_validation"
  | "publie"
  | "archive";

export type TechnicianKnowledgeArticle = Omit<KnowledgeArticle, "status"> & {
  reference: string;
  status: TechnicianArticleStatus;
  isMine: boolean;
  refusalReason?: string;
  categoryId?: string | null;
};
