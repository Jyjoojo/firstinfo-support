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
import { CalendarDays, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download, Eye, MoreVertical, Plus, Printer, Search, Settings2, UserRoundCheck } from "lucide-react";
import type { DateRange } from "react-day-picker";
import type { Ticket } from "@/lib/tickets";
import { priorityStyles, statusStyles } from "@/lib/styles";
import { Calendar } from "@/components/ui/calendar";

function useColumnVisibility(): [VisibilityState, React.Dispatch<React.SetStateAction<VisibilityState>>] {
  return useState<VisibilityState>({ contenu: false, dateModification: false });
}

const statusOptions: Array<Ticket["statut"]> = ["nouveau", "en cours", "résolu", "fermé"];
const priorityOptions: Array<Ticket["priorite"]> = ["basse", "normale", "haute", "urgente"];

const formatDateInput = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const formatDateLabel = (date: Date) => date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

function getPaginationRange(pageCount: number, currentPage: number): Array<number | "ellipsis"> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);
  if (currentPage <= 4) return [1, 2, 3, 4, "ellipsis", pageCount - 1, pageCount];
  if (currentPage >= pageCount - 3) return [1, 2, "ellipsis", pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", pageCount];
}

function StatusBadge({ status }: { status: Ticket["statut"] }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status].base}`}>{status}</span>;
}

function PriorityBadge({ priority }: { priority: Ticket["priorite"] }) {
  const Icon = priorityStyles[priority].icon;
  const priorityTextColor: Record<Ticket["priorite"], string> = {
    basse: "text-emerald-700",
    normale: "text-sky-700",
    haute: "text-amber-700",
    urgente: "text-red-700",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold ${priorityTextColor[priority]}`}>
      {Icon && <Icon size={13} />}{priority}
    </span>
  );
}

export default function AdminTicketsTable({ tickets }: { tickets: Ticket[] }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useColumnVisibility();
  const [creationDateRange, setCreationDateRange] = useState<DateRange | undefined>();

  const categories = useMemo(() => [...new Set(tickets.map((ticket) => ticket.categorie))].sort(), [tickets]);
  const technicians = useMemo(() => [...new Set(tickets.map((ticket) => ticket.assigneA).filter((assignee): assignee is string => Boolean(assignee)))].sort(), [tickets]);

  const columns = useMemo<ColumnDef<Ticket>[]>(() => [
    {
      id: "select",
      header: ({ table }) => <input aria-label="Sélectionner tous les tickets de la page" type="checkbox" checked={table.getIsAllPageRowsSelected()} ref={(element) => { if (element) element.indeterminate = table.getIsSomePageRowsSelected(); }} onChange={table.getToggleAllPageRowsSelectedHandler()} className="h-3 w-3 accent-primary" />,
      cell: ({ row }) => <input aria-label={`Sélectionner ${row.original.id}`} type="checkbox" checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} className="h-3 w-3 accent-primary" />,
      enableSorting: false,
      enableHiding: false,
      size: 42,
    },
    { accessorKey: "id", header: "ID ticket", cell: ({ getValue }) => <span className="font-semibold text-tertiary text-sm">{getValue<string>()}</span>, size: 110 },
    {
      accessorKey: "titre",
      header: "Sujet",
      cell: ({ row }) => <div className="min-w-56 py-2"><p className="font-semibold text-sm text-on-surface">{row.original.titre}</p><p className="mt-0.5 line-clamp-1 text-xs text-on-surface-variant">{row.original.contenu}</p></div>,
      size: 270,
    },
    { accessorKey: "categorie", header: "Catégorie", cell: ({ getValue }) => <span className="text-sm text-on-surface">{getValue<string>()}</span>, size: 160 },
    { accessorKey: "statut", header: "Statut", cell: ({ getValue }) => <StatusBadge status={getValue<Ticket["statut"]>()} />, size: 130 },
    { accessorKey: "priorite", header: "Priorité", cell: ({ getValue }) => <PriorityBadge priority={getValue<Ticket["priorite"]>()} />, size: 130 },
    {
      accessorKey: "assigneA",
      header: "Assigné à",
      filterFn: (row, columnId, value) => value === "unassigned" ? !row.getValue<string | null>(columnId) : row.getValue<string | null>(columnId) === value,
      cell: ({ getValue }) => <span className="whitespace-nowrap text-sm text-on-surface">{getValue<string | null>() || "Non assigné"}</span>,
      size: 150,
    },
    {
      accessorKey: "dateCreation",
      header: "Créé le",
      filterFn: (row, columnId, value: { from?: string; to?: string }) => {
        const date = row.getValue<string>(columnId);
        return (!value?.from || date >= value.from) && (!value?.to || date <= value.to);
      },
      cell: ({ getValue }) => <span className="whitespace-nowrap text-sm text-on-surface-variant">{new Date(getValue<string>()).toLocaleDateString("fr-FR")}</span>,
      size: 120,
    },
    { accessorKey: "dateModification", header: "Modifié le", cell: ({ getValue }) => <span className="whitespace-nowrap text-sm text-on-surface-variant">{new Date(getValue<string>()).toLocaleDateString("fr-FR")}</span>, size: 120 },
    { accessorKey: "contenu", header: "Description", cell: ({ getValue }) => <p className="line-clamp-2 min-w-64 text-sm text-on-surface-variant">{getValue<string>()}</p>, size: 280 },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <details className="relative">
            <summary title="Actions du ticket" className="flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-primary/10 hover:text-primary"><MoreVertical size={17} /></summary>
            <div className="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-outline-variant/30 bg-white p-1 shadow-lg">
              <Link href={`/dashboard/admin/tickets/${row.original.id}`} className="block rounded-md px-3 py-2 text-sm hover:bg-surface-container-low">Voir les détails</Link>
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
  const updateCreationDateFilter = (range: DateRange | undefined) => {
    setCreationDateRange(range);
    table.getColumn("dateCreation")?.setFilterValue(range?.from || range?.to ? {
      from: range?.from ? formatDateInput(range.from) : "",
      to: range?.to ? formatDateInput(range.to) : "",
    } : undefined);
  };
  const pageCount = Math.max(table.getPageCount(), 1);
  const currentPage = table.getState().pagination.pageIndex + 1;
  const paginationRange = getPaginationRange(pageCount, currentPage);
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
  const printTickets = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const rows = selectedRows.length > 0 ? selectedRows : table.getSortedRowModel().rows;
    const columns = table.getVisibleLeafColumns().filter((column) => !["select", "actions"].includes(column.id));
    const valueForColumn = (ticket: Ticket, columnId: string) => {
      const value = ticket[columnId as keyof Ticket];
      return columnId === "dateCreation" || columnId === "dateModification"
        ? new Date(value as string).toLocaleDateString("fr-FR")
        : String(value ?? "");
    };
    const title = selectedRows.length > 0 ? `${selectedRows.length} ticket(s) sélectionné(s)` : `${rows.length} ticket(s) affiché(s)`;
    const printWindow = window.open("", "_blank", "width=1100,height=800");

    if (!printWindow) return;

    const printDocument = printWindow.document;
    printDocument.title = "Impression des tickets";

    const style = printDocument.createElement("style");
    style.textContent = "body{font-family:Arial,sans-serif;color:#211a15;padding:28px}h1{font-size:22px;margin:0 0 4px}p{color:#6b6560;margin:0 0 20px}table{width:100%;border-collapse:collapse;font-size:12px}th{background:#f5f2ef;text-align:left;text-transform:uppercase;font-size:10px;letter-spacing:.06em}th,td{border:1px solid #ddd5ce;padding:9px;vertical-align:top}tr:nth-child(even){background:#fcfbfa}@media print{body{padding:0}}";
    printDocument.head.appendChild(style);

    const heading = printDocument.createElement("h1");
    heading.textContent = "Liste des tickets";
    const subtitle = printDocument.createElement("p");
    subtitle.textContent = title;
    const printableTable = printDocument.createElement("table");
    const tableHead = printDocument.createElement("thead");
    const headerRow = printDocument.createElement("tr");

    columns.forEach((column) => {
      const cell = printDocument.createElement("th");
      cell.textContent = typeof column.columnDef.header === "string" ? column.columnDef.header : column.id;
      headerRow.appendChild(cell);
    });
    tableHead.appendChild(headerRow);
    printableTable.appendChild(tableHead);

    const tableBody = printDocument.createElement("tbody");
    rows.forEach((row) => {
      const rowElement = printDocument.createElement("tr");
      columns.forEach((column) => {
        const cell = printDocument.createElement("td");
        cell.textContent = valueForColumn(row.original, column.id);
        rowElement.appendChild(cell);
      });
      tableBody.appendChild(rowElement);
    });
    printableTable.appendChild(tableBody);
    printDocument.body.append(heading, subtitle, printableTable);
    printWindow.focus();
    window.setTimeout(() => printWindow.print(), 150);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-outline-variant/20 p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-md"><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={17} /><input value={globalFilter} onChange={(event) => setGlobalFilter(event.target.value)} placeholder="Rechercher par ID, sujet, contenu, catégorie ou technicien…" className="h-10 w-full rounded-lg border border-outline-variant/30 bg-white py-2 pl-10 pr-3 text-sm outline-none transition focus:border-primary" /></div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={printTickets} className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/40 px-3 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container-low"><Printer size={16} /> Imprimer</button>
            <button type="button" onClick={exportTickets} className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/40 px-3 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container-low"><Download size={16} /> Exporter</button>
            <Link href="/dashboard/admin/tickets/nouveau" className="inline-flex items-center gap-2 rounded-lg bg-primary-container text-white px-3 py-2 text-sm font-semibold hover:bg-primary-container/90"><Plus size={16} /> Créer un ticket</Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select aria-label="Filtrer par statut" onChange={(event) => updateFilter("statut", event.target.value)} className="h-9 rounded-lg border border-outline-variant/30 bg-white px-3 text-sm text-on-surface"><option value="all">Tous les statuts</option>{statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select>
          <select aria-label="Filtrer par priorité" onChange={(event) => updateFilter("priorite", event.target.value)} className="h-9 rounded-lg border border-outline-variant/30 bg-white px-3 text-sm text-on-surface"><option value="all">Toutes priorités</option>{priorityOptions.map((priority) => <option key={priority} value={priority}>{priority}</option>)}</select>
          <select aria-label="Filtrer par catégorie" onChange={(event) => updateFilter("categorie", event.target.value)} className="h-9 rounded-lg border border-outline-variant/30 bg-white px-3 text-sm text-on-surface"><option value="all">Toutes catégories</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select>
          <select aria-label="Filtrer par technicien" onChange={(event) => updateFilter("assigneA", event.target.value)} className="h-9 rounded-lg border border-outline-variant/30 bg-white px-3 text-sm text-on-surface"><option value="all">Tous les techniciens</option><option value="unassigned">Tickets non assignés</option>{technicians.map((technician) => <option key={technician} value={technician}>{technician}</option>)}</select>
          <details className="relative"><summary className="inline-flex h-9 cursor-pointer list-none items-center gap-2 rounded-lg border border-outline-variant/30 bg-white px-3 text-sm text-on-surface hover:bg-surface-container-low"><CalendarDays size={15} />{creationDateRange?.from ? creationDateRange.to ? `${formatDateLabel(creationDateRange.from)} – ${formatDateLabel(creationDateRange.to)}` : `Depuis le ${formatDateLabel(creationDateRange.from)}` : "Date de création"}</summary><div className="absolute right-0 z-30 mt-2 rounded-lg border border-outline-variant/30 bg-white shadow-lg"><Calendar mode="range" selected={creationDateRange} onSelect={updateCreationDateFilter} numberOfMonths={2} defaultMonth={creationDateRange?.from} /></div></details>
          <details className="relative ml-auto"><summary className="inline-flex h-9 cursor-pointer list-none items-center gap-2 rounded-lg border border-outline-variant/30 px-3 text-sm font-medium text-on-surface hover:bg-surface-container-low"><Settings2 size={15} /> Colonnes</summary><div className="absolute right-0 z-30 mt-2 w-52 rounded-lg border border-outline-variant/30 bg-white p-2 shadow-lg">{table.getAllLeafColumns().filter((column) => column.getCanHide()).map((column) => <label key={column.id} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-surface-container-low"><input type="checkbox" checked={column.getIsVisible()} onChange={column.getToggleVisibilityHandler()} className="accent-primary" />{typeof column.columnDef.header === "string" ? column.columnDef.header : column.id}</label>)}</div></details>
        </div>
      </div>

      {table.getSelectedRowModel().rows.length > 0 && <div className="flex items-center justify-between border-b border-primary/20 bg-primary/5 px-4 py-2 text-sm text-on-surface"><span><strong>{table.getSelectedRowModel().rows.length}</strong> ticket(s) sélectionné(s)</span><button type="button" onClick={() => table.resetRowSelection()} className="font-semibold text-primary hover:underline">Désélectionner</button></div>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left">
          <thead className="border-b border-outline-variant/20 bg-surface-container-low text-xs tracking-wider text-on-surface-variant">
            {table.getHeaderGroups().map((headerGroup) => <tr key={headerGroup.id}>{headerGroup.headers.map((header) => <th key={header.id} style={{ width: header.getSize() }} className={`px-4 py-3 font-semibold ${header.column.id === "actions" ? "normal-case" : "uppercase"}`}>{header.isPlaceholder ? null : header.column.getCanSort() ? <button type="button" onClick={header.column.getToggleSortingHandler()} className="inline-flex items-center gap-1 hover:text-primary">{flexRender(header.column.columnDef.header, header.getContext())}{header.column.getIsSorted() === "asc" ? " ↑" : header.column.getIsSorted() === "desc" ? " ↓" : ""}</button> : flexRender(header.column.columnDef.header, header.getContext())}</th>)}</tr>)}
          </thead>
          <tbody className="divide-y divide-outline-variant/15">{table.getRowModel().rows.length ? table.getRowModel().rows.map((row) => <tr key={row.id} className={`transition-colors ${row.original.assigneA ? "hover:bg-surface-container-low/70" : "bg-tertiary/10 hover:bg-tertiary/20"}`}>{row.getVisibleCells().map((cell) => <td key={cell.id} className="px-4 py-3 align-middle">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>) : <tr><td colSpan={table.getVisibleLeafColumns().length} className="px-4 py-12 text-center text-sm text-on-surface-variant">Aucun ticket ne correspond aux filtres sélectionnés.</td></tr>}</tbody>
        </table>
      </div>
      <div className="m-4 flex flex-col gap-4 rounded-[20px] border border-outline-variant/40 px-5 py-3 text-sm text-on-surface sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          <span>Page</span>
          <input key={currentPage} defaultValue={currentPage} onBlur={(event) => { const page = Number(event.target.value); if (Number.isInteger(page) && page >= 1 && page <= pageCount) table.setPageIndex(page - 1); else event.target.value = String(currentPage); }} onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }} aria-label="Aller à la page" className="h-10 w-10 rounded-lg border border-outline-variant/30 bg-white text-center text-sm outline-none focus:border-primary" />
          <span>sur {pageCount}</span>
          <span className="mx-1 hidden h-5 w-px bg-outline-variant/40 sm:block text-sm" />
          <span>Lignes par page</span>
          <select value={table.getState().pagination.pageSize} onChange={(event) => table.setPageSize(Number(event.target.value))} aria-label="Lignes par page" className="h-9 rounded-lg border border-outline-variant/30 bg-white px-3 text-sm outline-none focus:border-primary"><option value={5}>5</option><option value={8}>8</option><option value={10}>10</option><option value={20}>20</option></select>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <button type="button" title="Première page" aria-label="Première page" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant disabled:cursor-not-allowed disabled:opacity-35"><ChevronsLeft size={19} /></button>
          <button type="button" title="Page précédente" aria-label="Page précédente" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant disabled:cursor-not-allowed disabled:opacity-35"><ChevronLeft size={19} /></button>
          {paginationRange.map((page, index) => page === "ellipsis" ? <span key={`ellipsis-${index}`} className="inline-flex h-10 w-8 items-center justify-center text-on-surface-variant">…</span> : <button key={page} type="button" onClick={() => table.setPageIndex(page - 1)} aria-current={page === currentPage ? "page" : undefined} className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${page === currentPage ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:bg-surface-container-low"}`}>{page}</button>)}
          <button type="button" title="Page suivante" aria-label="Page suivante" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant disabled:cursor-not-allowed disabled:opacity-35"><ChevronRight size={19} /></button>
          <button type="button" title="Dernière page" aria-label="Dernière page" onClick={() => table.setPageIndex(pageCount - 1)} disabled={!table.getCanNextPage()} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant disabled:cursor-not-allowed disabled:opacity-35"><ChevronsRight size={19} /></button>
        </div>
      </div>
    </div>
  );
}
