"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type RowSelectionState,
  type VisibilityState,
} from "@tanstack/react-table";
import { Download, Eye, Filter, MoreVertical, Plus, Printer, Search, Settings2, UserRoundCheck } from "lucide-react";
import type { Ticket } from "@/lib/tickets";
import { priorityStyles, statusStyles } from "@/lib/styles";

function useColumnVisibility(): [VisibilityState, React.Dispatch<React.SetStateAction<VisibilityState>>] {
  return useState<VisibilityState>({ contenu: false, dateModification: false });
}

const statusOptions: Array<Ticket["statut"]> = ["nouveau", "en cours", "résolu", "fermé"];
const priorityOptions: Array<Ticket["priorite"]> = ["basse", "normale", "haute", "urgente"];

function StatusBadge({ status }: { status: Ticket["statut"] }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status].base}`}>{status}</span>;
}

function PriorityBadge({ priority }: { priority: Ticket["priorite"] }) {
  const Icon = priorityStyles[priority].icon;
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[priority].base}`}>
      {Icon && <Icon size={13} />}{priority}
    </span>
  );
}

export default function AdminTicketsTable({ tickets }: { tickets: Ticket[] }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useColumnVisibility();
  const [showFilters, setShowFilters] = useState(false);

  const categories = useMemo(() => [...new Set(tickets.map((ticket) => ticket.categorie))].sort(), [tickets]);
  const technicians = useMemo(() => [...new Set(tickets.map((ticket) => ticket.assigneA))].sort(), [tickets]);

  const columns = useMemo<ColumnDef<Ticket>[]>(() => [
    {
      id: "select",
      header: ({ table }) => <input aria-label="Sélectionner tous les tickets de la page" type="checkbox" checked={table.getIsAllPageRowsSelected()} ref={(element) => { if (element) element.indeterminate = table.getIsSomePageRowsSelected(); }} onChange={table.getToggleAllPageRowsSelectedHandler()} className="h-4 w-4 accent-primary" />,
      cell: ({ row }) => <input aria-label={`Sélectionner ${row.original.id}`} type="checkbox" checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} className="h-4 w-4 accent-primary" />,
      enableSorting: false,
      enableHiding: false,
      size: 42,
    },
    { accessorKey: "id", header: "ID ticket", cell: ({ getValue }) => <span className="font-semibold text-primary">{getValue<string>()}</span>, size: 110 },
    {
      accessorKey: "titre",
      header: "Sujet",
      cell: ({ row }) => <div className="min-w-56 py-2"><p className="font-semibold text-on-surface">{row.original.titre}</p><p className="mt-0.5 line-clamp-1 text-xs text-on-surface-variant">{row.original.contenu}</p></div>,
      size: 270,
    },
    { accessorKey: "categorie", header: "Catégorie", cell: ({ getValue }) => <span className="text-sm text-on-surface">{getValue<string>()}</span>, size: 160 },
    { accessorKey: "statut", header: "Statut", cell: ({ getValue }) => <StatusBadge status={getValue<Ticket["statut"]>()} />, size: 130 },
    { accessorKey: "priorite", header: "Priorité", cell: ({ getValue }) => <PriorityBadge priority={getValue<Ticket["priorite"]>()} />, size: 130 },
    { accessorKey: "assigneA", header: "Assigné à", cell: ({ getValue }) => <span className="whitespace-nowrap text-sm text-on-surface">{getValue<string>()}</span>, size: 150 },
    { accessorKey: "dateCreation", header: "Créé le", cell: ({ getValue }) => <span className="whitespace-nowrap text-sm text-on-surface-variant">{new Date(getValue<string>()).toLocaleDateString("fr-FR")}</span>, size: 120 },
    { accessorKey: "dateModification", header: "Modifié le", cell: ({ getValue }) => <span className="whitespace-nowrap text-sm text-on-surface-variant">{new Date(getValue<string>()).toLocaleDateString("fr-FR")}</span>, size: 120 },
    { accessorKey: "contenu", header: "Description", cell: ({ getValue }) => <p className="line-clamp-2 min-w-64 text-sm text-on-surface-variant">{getValue<string>()}</p>, size: 280 },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Link href={`/dashboard/client/tickets/${row.original.id}`} title="Voir le détail" className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-primary/10 hover:text-primary"><Eye size={17} /></Link>
          <details className="relative">
            <summary title="Actions du ticket" className="flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-primary/10 hover:text-primary"><MoreVertical size={17} /></summary>
            <div className="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-outline-variant/30 bg-white p-1 shadow-lg">
              <Link href={`/dashboard/client/tickets/${row.original.id}`} className="block rounded-md px-3 py-2 text-sm hover:bg-surface-container-low">Voir les détails</Link>
              <button type="button" className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-surface-container-low"><UserRoundCheck size={15} /> Assigner</button>
            </div>
          </details>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 90,
    },
  ], []);

  const table = useReactTable({
    data: tickets,
    columns,
    state: { globalFilter, columnFilters, rowSelection, columnVisibility },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _columnId, value) => [row.original.id, row.original.titre, row.original.contenu, row.original.categorie, row.original.assigneA].join(" ").toLowerCase().includes(String(value).toLowerCase()),
    enableRowSelection: true,
    initialState: { pagination: { pageSize: 8 } },
  });

  const updateFilter = (columnId: string, value: string) => table.getColumn(columnId)?.setFilterValue(value === "all" ? undefined : value);
  const exportTickets = () => {
    const rows = table.getSelectedRowModel().rows.length ? table.getSelectedRowModel().rows.map((row) => row.original) : table.getFilteredRowModel().rows.map((row) => row.original);
    const header = ["ID", "Sujet", "Catégorie", "Statut", "Priorité", "Assigné à", "Créé le", "Modifié le"];
    const csv = [header, ...rows.map((ticket) => [ticket.id, ticket.titre, ticket.categorie, ticket.statut, ticket.priorite, ticket.assigneA, ticket.dateCreation, ticket.dateModification])]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(";"))
      .join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    link.download = "tickets-support.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-outline-variant/20 p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-md"><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={17} /><input value={globalFilter} onChange={(event) => setGlobalFilter(event.target.value)} placeholder="Rechercher par ID, sujet, contenu, catégorie ou technicien…" className="h-10 w-full rounded-lg border border-outline-variant/30 bg-white py-2 pl-10 pr-3 text-sm outline-none transition focus:border-primary" /></div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/40 px-3 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container-low"><Printer size={16} /> Imprimer</button>
            <button type="button" onClick={exportTickets} className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/40 px-3 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container-low"><Download size={16} /> Exporter</button>
            <Link href="/dashboard/admin/tickets/nouveau" className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90"><Plus size={16} /> Créer un ticket</Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select aria-label="Filtrer par statut" onChange={(event) => updateFilter("statut", event.target.value)} className="h-9 rounded-lg border border-outline-variant/30 bg-white px-3 text-sm text-on-surface"><option value="all">Tous les statuts</option>{statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select>
          <select aria-label="Filtrer par priorité" onChange={(event) => updateFilter("priorite", event.target.value)} className="h-9 rounded-lg border border-outline-variant/30 bg-white px-3 text-sm text-on-surface"><option value="all">Toutes priorités</option>{priorityOptions.map((priority) => <option key={priority} value={priority}>{priority}</option>)}</select>
          <select aria-label="Filtrer par catégorie" onChange={(event) => updateFilter("categorie", event.target.value)} className="h-9 rounded-lg border border-outline-variant/30 bg-white px-3 text-sm text-on-surface"><option value="all">Toutes catégories</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select>
          <select aria-label="Filtrer par technicien" onChange={(event) => updateFilter("assigneA", event.target.value)} className="h-9 rounded-lg border border-outline-variant/30 bg-white px-3 text-sm text-on-surface"><option value="all">Tous les techniciens</option>{technicians.map((technician) => <option key={technician} value={technician}>{technician}</option>)}</select>
          <button type="button" onClick={() => setShowFilters((visible) => !visible)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-outline-variant/30 px-3 text-sm font-medium text-on-surface hover:bg-surface-container-low"><Filter size={15} /> Filtres colonnes</button>
          <details className="relative ml-auto"><summary className="inline-flex h-9 cursor-pointer list-none items-center gap-2 rounded-lg border border-outline-variant/30 px-3 text-sm font-medium text-on-surface hover:bg-surface-container-low"><Settings2 size={15} /> Colonnes</summary><div className="absolute right-0 z-30 mt-2 w-52 rounded-lg border border-outline-variant/30 bg-white p-2 shadow-lg">{table.getAllLeafColumns().filter((column) => column.getCanHide()).map((column) => <label key={column.id} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-surface-container-low"><input type="checkbox" checked={column.getIsVisible()} onChange={column.getToggleVisibilityHandler()} className="accent-primary" />{typeof column.columnDef.header === "string" ? column.columnDef.header : column.id}</label>)}</div></details>
        </div>
        {showFilters && <div className="grid grid-cols-1 gap-2 rounded-lg bg-surface-container-low p-3 sm:grid-cols-2 lg:grid-cols-4">{["id", "titre", "categorie", "assigneA"].map((columnId) => <input key={columnId} value={(table.getColumn(columnId)?.getFilterValue() as string) ?? ""} onChange={(event) => table.getColumn(columnId)?.setFilterValue(event.target.value)} placeholder={`Filtrer ${columnId === "titre" ? "le sujet" : columnId}`} className="h-9 rounded-md border border-outline-variant/30 bg-white px-3 text-sm outline-none focus:border-primary" />)}</div>}
      </div>

      {table.getSelectedRowModel().rows.length > 0 && <div className="flex items-center justify-between border-b border-primary/20 bg-primary/5 px-4 py-2 text-sm text-on-surface"><span><strong>{table.getSelectedRowModel().rows.length}</strong> ticket(s) sélectionné(s)</span><button type="button" onClick={() => table.resetRowSelection()} className="font-semibold text-primary hover:underline">Désélectionner</button></div>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left">
          <thead className="border-b border-outline-variant/20 bg-surface-container-low text-xs uppercase tracking-wider text-on-surface-variant">
            {table.getHeaderGroups().map((headerGroup) => <tr key={headerGroup.id}>{headerGroup.headers.map((header) => <th key={header.id} style={{ width: header.getSize() }} className="px-4 py-3 font-semibold">{header.isPlaceholder ? null : header.column.getCanSort() ? <button type="button" onClick={header.column.getToggleSortingHandler()} className="inline-flex items-center gap-1 hover:text-primary">{flexRender(header.column.columnDef.header, header.getContext())}{header.column.getIsSorted() === "asc" ? " ↑" : header.column.getIsSorted() === "desc" ? " ↓" : ""}</button> : flexRender(header.column.columnDef.header, header.getContext())}</th>)}</tr>)}
          </thead>
          <tbody className="divide-y divide-outline-variant/15">{table.getRowModel().rows.length ? table.getRowModel().rows.map((row) => <tr key={row.id} className="transition-colors hover:bg-surface-container-low/70">{row.getVisibleCells().map((cell) => <td key={cell.id} className="px-4 py-3 align-middle">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>) : <tr><td colSpan={table.getVisibleLeafColumns().length} className="px-4 py-12 text-center text-sm text-on-surface-variant">Aucun ticket ne correspond aux filtres sélectionnés.</td></tr>}</tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 border-t border-outline-variant/20 px-4 py-3 text-sm text-on-surface-variant sm:flex-row sm:items-center sm:justify-between">
        <span>{table.getFilteredRowModel().rows.length} ticket(s) au total</span>
        <div className="flex flex-wrap items-center gap-2"><select value={table.getState().pagination.pageSize} onChange={(event) => table.setPageSize(Number(event.target.value))} className="h-9 rounded-lg border border-outline-variant/30 bg-white px-2 text-sm text-on-surface"><option value={5}>5 / page</option><option value={8}>8 / page</option><option value={10}>10 / page</option><option value={20}>20 / page</option></select><button type="button" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="rounded-lg border border-outline-variant/30 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40">Précédent</button><span>Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}</span><button type="button" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="rounded-lg border border-outline-variant/30 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40">Suivant</button></div>
      </div>
    </div>
  );
}
