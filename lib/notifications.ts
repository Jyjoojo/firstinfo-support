export type NotificationType = "ticket" | "info" | "contract";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  day: "Aujourd'hui" | "Hier" | "Cette semaine" | "Plus ancien";
  read: boolean;
}

// Style associé à chaque type de notification (icône + couleurs)
export const notificationTypeStyles: Record<
  NotificationType,
  { bg: string; text: string; iconName: "ticket" | "info" | "history" }
> = {
  ticket: { bg: "bg-orange-50", text: "text-orange-700", iconName: "ticket" },
  info: { bg: "bg-blue-50", text: "text-blue-700", iconName: "info" },
  contract: { bg: "bg-green-50", text: "text-green-700", iconName: "history" },
};

// Aperçu affiché dans le volet (les plus récentes)
export const recentNotifications: AppNotification[] = [
  {
    id: "n1",
    type: "ticket",
    title: "Ticket #TK-4029 mis à jour",
    description:
      "Un expert a répondu à votre demande concernant l'erreur de synchronisation.",
    time: "Il y a 15 min",
    day: "Aujourd'hui",
    read: false,
  },
  {
    id: "n2",
    type: "info",
    title: "Alerte Maintenance",
    description: "L'intervention sur Sage Cloud est confirmée pour ce soir à 22h.",
    time: "Il y a 2h",
    day: "Aujourd'hui",
    read: false,
  },
  {
    id: "n3",
    type: "contract",
    title: "Renouvellement de contrat",
    description: "Votre contrat Sage Paie & RH arrive à échéance dans 30 jours.",
    time: "Hier, 14:30",
    day: "Hier",
    read: true,
  },
];

// Historique complet (page dédiée) — inclut les notifications récentes + plus anciennes
export const allNotifications: AppNotification[] = [
  ...recentNotifications,
  {
    id: "n4",
    type: "ticket",
    title: "Ticket #TK-4015 résolu",
    description: "Votre demande sur la mise à jour DSN a été clôturée par notre équipe.",
    time: "Hier, 09:10",
    day: "Hier",
    read: true,
  },
  {
    id: "n5",
    type: "info",
    title: "Nouvel article publié",
    description: "\"Optimiser les clôtures mensuelles\" est disponible dans la base de connaissances.",
    time: "Lundi, 11:00",
    day: "Cette semaine",
    read: true,
  },
  {
    id: "n6",
    type: "ticket",
    title: "Ticket #TK-3998 assigné",
    description: "Un technicien a pris en charge votre blocage d'interface Sage X3.",
    time: "Lundi, 08:42",
    day: "Cette semaine",
    read: true,
  },
  {
    id: "n7",
    type: "contract",
    title: "Contrat Sage CRM",
    description: "Votre contrat expire dans 60 jours. Contactez-nous pour le renouveler.",
    time: "Il y a 2 semaines",
    day: "Plus ancien",
    read: true,
  },
  {
    id: "n8",
    type: "info",
    title: "Mise à jour de sécurité",
    description: "Un correctif a été appliqué sur votre instance Sage 100 Comptabilité.",
    time: "Il y a 3 semaines",
    day: "Plus ancien",
    read: true,
  },
];

export const DAY_ORDER: AppNotification["day"][] = [
  "Aujourd'hui",
  "Hier",
  "Cette semaine",
  "Plus ancien",
];

export function groupByDay(notifications: AppNotification[]) {
  return DAY_ORDER.map((day) => ({
    day,
    items: notifications.filter((n) => n.day === day),
  })).filter((group) => group.items.length > 0);
}
