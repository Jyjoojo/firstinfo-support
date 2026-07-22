export type UserRole = "administrateur" | "technicien" | "client";

export type SupportUser = {
  id: string;
  nom: string;
  prenoms: string;
  email: string;
  role: UserRole;
  telephone: string;
  actif: boolean;
  createdAt: string;
  updatedAt: string;
  specialite?: string;
  ticketsEnCours?: number;
  entreprise?: string;
  secteur?: string;
  estClientOfficiel?: boolean;
  adresse?: string;
};

export const supportUsers: SupportUser[] = [
  {
    id: "USR-001",
    nom: "Koffi",
    prenoms: "Jean-Marc",
    email: "jean-marc.koffi@firstinfo.ci",
    role: "technicien",
    telephone: "(+225) 07 07 53 37 54",
    actif: true,
    createdAt: "2024-02-12T09:15:00.000Z",
    updatedAt: "2026-07-20T14:42:00.000Z",
    specialite: "Comptabilité Sage 100",
    ticketsEnCours: 8,
  },
  {
    id: "USR-002",
    nom: "Soro",
    prenoms: "Amadou",
    email: "amadou.soro@firstinfo.ci",
    role: "technicien",
    telephone: "(+225) 05 45 62 18 70",
    actif: true,
    createdAt: "2024-04-05T10:00:00.000Z",
    updatedAt: "2026-07-21T08:25:00.000Z",
    specialite: "Infrastructure & réseau",
    ticketsEnCours: 12,
  },
  {
    id: "USR-003",
    nom: "Kouassi",
    prenoms: "Marie",
    email: "marie.kouassi@firstinfo.ci",
    role: "technicien",
    telephone: "(+225) 01 02 03 04 05",
    actif: false,
    createdAt: "2024-08-18T11:30:00.000Z",
    updatedAt: "2026-07-18T16:10:00.000Z",
    specialite: "Paie & ressources humaines",
    ticketsEnCours: 0,
  },
  {
    id: "USR-004",
    nom: "Traoré",
    prenoms: "Ibrahim",
    email: "ibrahim.traore@firstinfo.ci",
    role: "client",
    telephone: "(+225) 07 07 53 37 54",
    actif: true,
    createdAt: "2024-10-12T09:15:00.000Z",
    updatedAt: "2026-07-20T09:30:00.000Z",
    entreprise: "First Info CI",
    secteur: "Support & services Sage",
    estClientOfficiel: true,
    adresse: "Cocody, Abidjan, Côte d’Ivoire",
  },
  {
    id: "USR-005",
    nom: "Bohoussou",
    prenoms: "Aïcha",
    email: "aicha.bohoussou@global-logistics.ci",
    role: "client",
    telephone: "(+225) 27 22 48 59 60",
    actif: true,
    createdAt: "2025-01-28T13:00:00.000Z",
    updatedAt: "2026-07-19T11:05:00.000Z",
    entreprise: "Global Logistics CI",
    secteur: "Logistique & transport",
    estClientOfficiel: true,
    adresse: "Zone industrielle, Vridi, Abidjan",
  },
  {
    id: "USR-006",
    nom: "N’Guessan",
    prenoms: "Darlène",
    email: "darlene.nguessan@techsolutions.ci",
    role: "client",
    telephone: "(+225) 05 06 07 08 09",
    actif: false,
    createdAt: "2025-05-11T15:20:00.000Z",
    updatedAt: "2026-06-30T08:42:00.000Z",
    entreprise: "Tech Solutions",
    secteur: "Technologies de l’information",
    estClientOfficiel: false,
    adresse: "Deux-Plateaux, Abidjan",
  },
  {
    id: "USR-007",
    nom: "Kouehi",
    prenoms: "Ange Joël",
    email: "ange.koueh@firstinfo.ci",
    role: "administrateur",
    telephone: "(+225) 07 89 45 12 34",
    actif: true,
    createdAt: "2023-10-02T08:00:00.000Z",
    updatedAt: "2026-07-21T10:15:00.000Z",
  },
];
