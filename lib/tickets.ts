
export interface Ticket {
    id: number;
    titre: string;
    contenu: string;
    statut: 'nouveau' | 'en cours' | 'résolu' | 'fermé';
    categorie: string;
    priorite: 'basse' | 'normale' | 'haute' | 'urgente';
    dateCreation: string;
    dateModification: string;
    assigneA: string;
}

export const tickets: Ticket[] = [
    {
        id: 1,
        titre: "Problème de connexion",
        contenu: "Je rencontre des difficultés pour me connecter à l'application.",
        statut: "nouveau",
        categorie: "Technique",
        priorite: "haute",
        dateCreation: "2023-10-01",
        dateModification: "2023-10-01",
        assigneA: "John Doe"
    },
    {
        id: 2,
        titre: "Problème d'impression",
        contenu: "Je rencontre des difficultés pour imprimer les documents.",
        statut: "en cours",
        categorie: "Technique",
        priorite: "normale",
        dateCreation: "2023-10-02",
        dateModification: "2023-10-02",
        assigneA: "Jane Smith"
    },
    {
        id: 3,
        titre: "Demande de mise à jour",
        contenu: "Je souhaite mettre à jour l'application.",
        statut: "nouveau",
        categorie: "Technique",
        priorite: "basse",
        dateCreation: "2023-10-03",
        dateModification: "2023-10-03",
        assigneA: "Bob Johnson"
    },
    {
        id: 4,
        titre: "Problème de performance",
        contenu: "L'application ralentit considérablement lors de l'utilisation.",
        statut: "nouveau",
        categorie: "Technique",
        priorite: "haute",
        dateCreation: "2023-10-04",
        dateModification: "2023-10-04",
        assigneA: "Alice Brown"
    },
    {
        id: 5,
        titre: "Erreur lors de l'enregistrement",
        contenu: "Je rencontre une erreur lors de l'enregistrement des données.",
        statut: "nouveau",
        categorie: "Technique",
        priorite: "haute",
        dateCreation: "2023-10-05",
        dateModification: "2023-10-05",
        assigneA: "Charlie Wilson"
    },
    {
        id: 6,
        titre: "Problème de compatibilité",
        contenu: "L'application ne fonctionne pas correctement sur mon système d'exploitation.",
        statut: "nouveau",
        categorie: "Technique",
        priorite: "haute",
        dateCreation: "2023-10-06",
        dateModification: "2023-10-06",
        assigneA: "David Davis"
    },
    {
        id: 7,
        titre: "Demande de fonctionnalité",
        contenu: "Je souhaite ajouter une nouvelle fonctionnalité à l'application.",
        statut: "nouveau",
        categorie: "Fonctionnalité",
        priorite: "normale",
        dateCreation: "2023-10-07",
        dateModification: "2023-10-07",
        assigneA: "Eve Thompson"
    },
    {
        id: 8,
        titre: "Problème de sécurité",
        contenu: "Je rencontre des problèmes de sécurité avec l'application.",
        statut: "nouveau",
        categorie: "Sécurité",
        priorite: "urgente",
        dateCreation: "2023-10-08",
        dateModification: "2023-10-08",
        assigneA: "Frank Miller"
    },
    {
        id: 9,
        titre: "Problème de synchronisation",
        contenu: "Je rencontre des difficultés pour synchroniser les données.",
        statut: "nouveau",
        categorie: "Technique",
        priorite: "haute",
        dateCreation: "2023-10-09",
        dateModification: "2023-10-09",
        assigneA: "Grace Lee"
    },
    {
        id: 10,
        titre: "Problème de notification",
        contenu: "Je ne reçois plus les notifications de l'application.",
        statut: "nouveau",
        categorie: "Technique",
        priorite: "normale",
        dateCreation: "2023-10-10",
        dateModification: "2023-10-10",
        assigneA: "Henry Garcia"
    },
    {
        id: 11,
        titre: "Problème de connexion",
        contenu: "Je rencontre des difficultés pour me connecter à l'application.",
        statut: "nouveau",
        categorie: "Technique",
        priorite: "haute",
        dateCreation: "2023-10-11",
        dateModification: "2023-10-11",
        assigneA: "Ivy Clark"
    }
]