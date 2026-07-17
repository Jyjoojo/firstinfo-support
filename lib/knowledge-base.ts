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
  title: string;
  summary: string;
  module: string;
  resolvedDate: string;
  technician: string;
  breadcrumb: string[];
}

export const KNOWLEDGE_BASE_PUBLIC: KnowledgeBaseArticle[] = [
  {
    id: "kb-1",
    title: "Renouveler le certificat SSL d'une instance SQL Server",
    module: "Sage 100 Comptabilité",
    category: "Infrastructure",
    readTime: "4 min",
    lastUpdated: "2024-07-18",
    excerpt: "Procédure pas-à-pas pour renouveler un certificat SSL expiré sur SQL Server 2016/2019.",
    content: "Contenu détaillé de l'article sur le renouvellement SSL...",
  },
  {
    id: "kb-2",
    title: "Procédure de clôture annuelle Sage Paie & RH",
    module: "Sage Paie & RH",
    category: "Paie",
    readTime: "6 min",
    lastUpdated: "2024-07-15",
    excerpt: "Checklist complète avant la clôture : validation des bulletins, envoi DSN, sauvegarde dossier.",
    content: "Contenu détaillé de l'article sur la clôture annuelle...",
  },
  {
    id: "kb-3",
    title: "Sauvegarder et restaurer un dossier Sage",
    module: "Sage 100 / Gestion Commerciale",
    category: "Maintenance",
    readTime: "3 min",
    lastUpdated: "2024-07-12",
    excerpt: "Les bonnes pratiques de sauvegarde pour éviter toute perte de données en cas d'incident.",
    content: "Contenu détaillé de l'article sur la sauvegarde...",
  },
  {
    id: "kb-4",
    title: "Corriger un stock négatif après inventaire",
    module: "Sage Gestion Commerciale",
    category: "Stock",
    readTime: "5 min",
    lastUpdated: "2024-07-10",
    excerpt: "Comment verrouiller les stocks avant l'inventaire et recalculer les coûts moyens pondérés.",
    content: "Contenu détaillé de l'article sur les stocks négatifs...",
  },
  {
    id: "kb-5",
    title: "Configurer le rapprochement bancaire automatique",
    module: "Sage 100 Comptabilité",
    category: "Comptabilité",
    readTime: "4 min",
    lastUpdated: "2024-07-08",
    excerpt: "Import des relevés OFX/CFONB et paramétrage des règles de rapprochement automatique.",
    content: "Contenu détaillé de l'article sur le rapprochement bancaire...",
  },
  {
    id: "kb-6",
    title: "Résoudre une erreur de DSN mensuelle (code S40.001)",
    module: "Sage Paie & RH",
    category: "Paie",
    readTime: "3 min",
    lastUpdated: "2024-07-05",
    excerpt: "Diagnostic et correction du code d'erreur S40.001 lors de la transmission DSN.",
    content: "Contenu détaillé de l'article sur l'erreur DSN...",
  },
  {
    id: "kb-7",
    title: "Optimiser les performances de Sage 100 sur un réseau distant",
    module: "Sage 100 Comptabilité",
    category: "Infrastructure",
    readTime: "7 min",
    lastUpdated: "2024-07-01",
    excerpt: "Configuration des sessions TSE/RDS, optimisation de la bande passante et réglages SQL pour un accès fluide.",
    content: "Contenu détaillé sur l'optimisation des performances...",
  },
  {
    id: "kb-8",
    title: "Gérer les acomptes et factures d'acompte",
    module: "Sage Gestion Commerciale",
    category: "Facturation",
    readTime: "4 min",
    lastUpdated: "2024-06-28",
    excerpt: "De la création de la facture d'acompte à son imputation sur la facture finale.",
    content: "Contenu détaillé sur la gestion des acomptes...",
  },
  {
    id: "kb-9",
    title: "Personnaliser les modèles d'impression (mises en page)",
    module: "Sage 100 / Gestion Commerciale",
    category: "Personnalisation",
    readTime: "8 min",
    lastUpdated: "2024-06-25",
    excerpt: "Utiliser l'éditeur de mises en page pour ajouter un logo, des champs personnalisés et des conditions d'affichage.",
    content: "Contenu détaillé sur la personnalisation des modèles...",
  },
  {
    id: "kb-10",
    title: "Configurer un nouvel exercice comptable",
    module: "Sage 100 Comptabilité",
    category: "Comptabilité",
    readTime: "3 min",
    lastUpdated: "2024-06-22",
    excerpt: "Étapes pour créer un nouvel exercice, reporter les à-nouveaux et archiver l'exercice précédent.",
    content: "Contenu détaillé sur la création d'exercice...",
  },
  {
    id: "kb-11",
    title: "Automatiser l'envoi des factures par e-mail",
    module: "Sage Gestion Commerciale",
    category: "Facturation",
    readTime: "5 min",
    lastUpdated: "2024-06-20",
    excerpt: "Paramétrage du serveur SMTP et configuration des modèles d'e-mail pour l'envoi en masse.",
    content: "Contenu détaillé sur l'envoi de factures par e-mail...",
  },
  {
    id: "kb-12",
    title: "Gérer les profils de congés et absences",
    module: "Sage Paie & RH",
    category: "Paie",
    readTime: "6 min",
    lastUpdated: "2024-06-18",
    excerpt: "Création des profils de congés (payés, RTT, maladie) et affectation aux salariés pour un décompte automatique.",
    content: "Contenu détaillé sur la gestion des congés...",
  },
];

export const MY_RESOLUTIONS: MyResolution[] = [
  {
    id: "res-1",
    ticketId: "TKT-2026-042",
    title: "Problème d'impression des bulletins de paie",
    summary: "Le service d'impression a été redémarré et le modèle de bulletin a été réassocié dans les paramètres de la société.",
    module: "Sage Paie & RH",
    resolvedDate: "15 Mai 2026",
    technician: "Support Niveau 2",
    breadcrumb: ["Mes Résolutions", "Sage Paie & RH", "Impression"]
  },
  {
    id: "res-2",
    ticketId: "TK-2026-0831",
    title: "Résolution : Bulletins de paie non imprimables",
    module: "Sage Paie & RH",
    resolvedDate: "6 mai 2026",
    technician: "Traoré M.",
    breadcrumb: ["Base de connaissances", "Sage Paie & RH", "Impression bulletins"],
    summary: "Le pilote d'impression par défaut était corrompu. Réinstallation du driver et redémarrage du service Spooler ont résolu le problème. Les modèles de bulletins ont été reconfigurés.",
  },
  {
    id: "res-3",
    ticketId: "TK-2026-0812",
    title: "Résolution : DSN mensuelle rejetée S40.001",
    module: "Sage Paie & RH",
    resolvedDate: "20 avr. 2026",
    technician: "Traoré M.",
    breadcrumb: ["Base de connaissances", "Sage Paie & RH", "DSN / Déclarations"],
    summary: "Un SIRET incorrect dans la fiche établissement causait le rejet. Correction du numéro, régénération de la DSN et retransmission via Net-Entreprises.",
  },
  {
    id: "res-4",
    ticketId: "TK-2026-0785",
    title: "Résolution : Migration Sage 100 v8 → v9",
    module: "Sage 100 Comptabilité",
    resolvedDate: "23 mars 2026",
    technician: "Kouassi A.",
    breadcrumb: ["Base de connaissances", "Sage 100 Comptabilité", "Migration / Mise à jour"],
    summary: "Incompatibilité de charset entre la base v8 (Latin1) et v9 (UTF-8). Conversion effectuée via script SQL fourni par l'éditeur, puis restauration du dossier comptable.",
  },
  {
    id: "res-5",
    ticketId: "TK-2026-0750",
    title: "Résolution : Lenteurs extrêmes sur les éditions",
    module: "Sage 100 Gestion Commerciale",
    resolvedDate: "15 mars 2026",
    technician: "Kouassi A.",
    breadcrumb: ["Base de connaissances", "Sage 100 Gestion Commerciale", "Performances"],
    summary: "L'index de la table des documents de vente était fragmenté à plus de 90%. Une réindexation complète de la base de données a restauré les performances nominales.",
  },
  {
    id: "res-6",
    ticketId: "TK-2026-0699",
    title: "Résolution : Erreur d'accès à la base de données après mise à jour Windows",
    module: "Sage 100 Comptabilité",
    resolvedDate: "2 fév. 2026",
    technician: "Diallo S.",
    breadcrumb: ["Base de connaissances", "Sage 100 Comptabilité", "Infrastructure"],
    summary: "La mise à jour Windows a réactivé une règle de pare-feu bloquant le port 1433. Ajout d'une règle entrante explicite pour autoriser le trafic SQL.",
  },
  {
    id: "res-7",
    ticketId: "TK-2026-0651",
    title: "Résolution : Calcul de TVA incorrect sur facture",
    module: "Sage Gestion Commerciale",
    resolvedDate: "10 jan. 2026",
    technician: "Traoré M.",
    breadcrumb: ["Base de connaissances", "Sage Gestion Commerciale", "Facturation"],
    summary: "Le code taxe associé à l'article était erroné (5.5% au lieu de 20%). Correction de la fiche article et re-génération de la facture.",
  },
  {
    id: "res-8",
    ticketId: "TK-2026-0610",
    title: "Résolution : Impossible d'ouvrir le dossier de paie",
    module: "Sage Paie & RH",
    resolvedDate: "18 déc. 2025",
    technician: "Kouassi A.",
    breadcrumb: ["Base de connaissances", "Sage Paie & RH", "Accès"],
    summary: "Le fichier .prh était en lecture seule suite à une restauration incorrecte. Rétablissement des permissions d'écriture pour le groupe 'Utilisateurs' sur le dossier de la société.",
  },
];
