"use client";

import { Ticket } from '@/lib/tickets';
import { Eye, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

const statusClasses: Record<Ticket['statut'], string> = {
    nouveau: 'border border-sky-200 bg-sky-50 text-sky-700',
    'en cours': 'border border-amber-200 bg-amber-50 text-amber-700',
    'résolu': 'border border-emerald-200 bg-emerald-50 text-emerald-700',
    'fermé': 'border border-slate-200 bg-slate-100 text-slate-700',
};

const priorityClasses: Record<Ticket['priorite'], string> = {
    basse: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
    normale: 'border border-blue-200 bg-blue-50 text-blue-700',
    haute: 'border border-amber-200 bg-amber-50 text-amber-700',
    urgente: 'border border-rose-200 bg-rose-50 text-rose-700',
};

export default function TicketsTable({ tickets }: { tickets: Ticket[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | Ticket['statut']>('all');
    const [priorityFilter, setPriorityFilter] = useState<'all' | Ticket['priorite']>('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const StatusBadge = ({ statut }: { statut: Ticket['statut'] }) => (
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[statut]}`}>
            {statut}
        </span>
    );

    const PriorityBadge = ({ priorite }: { priorite: Ticket['priorite'] }) => (
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityClasses[priorite]}`}>
            {priorite}
        </span>
    );

    const categories = useMemo(() => Array.from(new Set(tickets.map((ticket) => ticket.categorie))).sort(), [tickets]);

    const filteredTickets = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return tickets.filter((ticket) => {
            const matchesSearch =
                normalizedSearch.length === 0 ||
                [ticket.titre, ticket.contenu, ticket.categorie, ticket.assigneA]
                    .join(' ')
                    .toLowerCase()
                    .includes(normalizedSearch);

            const matchesStatus = statusFilter === 'all' || ticket.statut === statusFilter;
            const matchesPriority = priorityFilter === 'all' || ticket.priorite === priorityFilter;
            const matchesCategory = categoryFilter === 'all' || ticket.categorie === categoryFilter;

            return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
        });
    }, [tickets, searchTerm, statusFilter, priorityFilter, categoryFilter]);

    const columns: TableColumn<Ticket>[] = [
        {
            id: 'titre',
            name: 'Titre',
            selector: (row) => row.titre,
            sortable: true,
            grow: 2,
            cell: (row) => (
                <div className="py-3">
                    <div className="font-semibold text-slate-800 mb-1">{row.titre}</div>
                    <div className="text-xs text-slate-500">{row.contenu}</div>
                </div>
            ),
        },
        { id: 'categorie', name: 'Catégorie', selector: (row) => row.categorie, sortable: true, width: '140px' },
        { id: 'statut', name: 'Statut', selector: (row) => row.statut, sortable: true, cell: (row) => <StatusBadge statut={row.statut} /> },
        { id: 'priorite', name: 'Priorité', selector: (row) => row.priorite, sortable: true, cell: (row) => <PriorityBadge priorite={row.priorite} /> },
        { id: 'assigneA', name: 'Assigné à', selector: (row) => row.assigneA, sortable: true, width: '140px' },
        {
            id: 'dateCreation',
            name: 'Créé le',
            selector: (row) => row.dateCreation,
            sortable: true,
            width: '120px',
            format: (row) => new Date(row.dateCreation).toLocaleDateString('fr-FR'),
        },
        {
            id: 'action',
            name: 'Action',
            cell: (row) => (
                <Link
                    href={`/dashboard/client/tickets/${row.id}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
                >
                    <Eye size={15} />
                    Voir
                </Link>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '110px',
        },
    ];

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-sm">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Rechercher un ticket"
                        className="w-75 rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none ring-0 transition focus:border-sky-400"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    <select
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value as 'all' | Ticket['statut'])}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400"
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="nouveau">Nouveau</option>
                        <option value="en cours">En cours</option>
                        <option value="résolu">Résolu</option>
                        <option value="fermé">Fermé</option>
                    </select>

                    <select
                        value={priorityFilter}
                        onChange={(event) => setPriorityFilter(event.target.value as 'all' | Ticket['priorite'])}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400"
                    >
                        <option value="all">Toutes priorités</option>
                        <option value="basse">Basse</option>
                        <option value="normale">Normale</option>
                        <option value="haute">Haute</option>
                        <option value="urgente">Urgente</option>
                    </select>

                    <select
                        value={categoryFilter}
                        onChange={(event) => setCategoryFilter(event.target.value)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400"
                    >
                        <option value="all">Toutes catégories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredTickets}
                defaultSortFieldId="titre"
                defaultSortAsc
                pagination
                paginationPerPage={8}
                paginationRowsPerPageOptions={[5, 8, 10, 15]}
                paginationComponentOptions={{
                    rowsPerPageText: 'Lignes par page',
                    rangeSeparatorText: 'sur',
                    selectAllRowsItem: true,
                    selectAllRowsItemText: 'Tous',
                }}
                highlightOnHover
                responsive
                striped
                noDataComponent={<div className="py-10 text-center text-sm text-slate-500">Aucun ticket ne correspond à vos filtres.</div>}
            />
        </div>
    );
}
