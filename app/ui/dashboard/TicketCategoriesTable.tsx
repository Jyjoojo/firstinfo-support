"use client";

import {
  useMemo,
  useState,
} from "react";
import {
  BriefcaseBusiness,
  Database,
  Download,
  Eye,
  Filter,
  FolderCog,
  Search,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { motion } from "motion/react";
import EditTicketCategoryDialog from "@/app/ui/dashboard/admin/EditTicketCategoryDialog";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import type { TicketCategory } from "@/lib/ticket-categories";

const categoryIcons = {
  accounting: FolderCog,
  hr: UsersRound,
  database: Database,
  infrastructure: BriefcaseBusiness,
  crm: UsersRound,
  security: ShieldCheck,
};

const iconColors = {
  accounting: "bg-sky-100 text-sky-700",
  hr: "bg-amber-100 text-amber-700",
  database: "bg-stone-100 text-stone-700",
  infrastructure: "bg-teal-100 text-teal-700",
  crm: "bg-violet-100 text-violet-700",
  security: "bg-rose-100 text-rose-700",
};

function formatDate(date: string) {
  const parsedDate = new Date(date);
  if (!date || Number.isNaN(parsedDate.getTime())) return "Non renseignée";

  return parsedDate.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function CategoryDetailsDrawer({
  category,
}: {
  category: TicketCategory;
}) {
  const Icon = categoryIcons[category.icon];

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <button
          type="button"
          title={`Voir les détails de ${category.label}`}
          aria-label={`Voir les détails de ${category.label}`}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary/10"
        >
          <Eye size={18} />
        </button>
      </DrawerTrigger>

      <DrawerContent className="w-full sm:max-w-md">
        <DrawerHeader className="border-b border-outline-variant/20 p-6">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${iconColors[category.icon]}`}
            >
              <Icon size={21} />
            </span>
            <div>
              <DrawerTitle className="text-xl font-bold text-on-surface">
                Détail de la catégorie
              </DrawerTitle>
              <DrawerDescription className="mt-1">
                Informations disponibles en lecture seule.
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <dl className="space-y-6">
            <div className="border-b border-outline-variant/20 pb-5">
              <dt className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Libellé
              </dt>
              <dd className="mt-2 text-base font-semibold text-on-surface">
                {category.label}
              </dd>
            </div>

            <div className="border-b border-outline-variant/20 pb-5">
              <dt className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Description
              </dt>
              <dd className="mt-2 text-sm leading-6 text-on-surface">
                {category.description}
              </dd>
            </div>

            <div className="border-b border-outline-variant/20 pb-5">
              <dt className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Date de création
              </dt>
              <dd className="mt-2 text-sm font-medium text-on-surface">
                {formatDate(category.createdAt)}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Dernière mise à jour
              </dt>
              <dd className="mt-2 text-sm font-medium text-on-surface">
                {formatDate(category.updatedAt)}
              </dd>
            </div>
          </dl>
        </div>

        <DrawerFooter className="border-t border-outline-variant/20 p-5">
          <DrawerClose asChild>
            <Button
              type="button"
              variant="outline"
            >
              Fermer
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default function TicketCategoriesTable({
  categories,
  readOnly = false,
}: {
  categories: TicketCategory[];
  readOnly?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 4;

  const filteredCategories = useMemo(
    () =>
      categories.filter((category) =>
        [category.label, category.description]
          .join(" ")
          .toLocaleLowerCase("fr-FR")
          .includes(query.toLocaleLowerCase("fr-FR")),
      ),
    [categories, query],
  );

  const pageCount = Math.max(
    Math.ceil(filteredCategories.length / pageSize),
    1,
  );
  const visibleCategories = filteredCategories.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const exportCategories = () => {
    const csv = [
      [
        "Libellé",
        "Description",
        "Date de création",
        "Dernière mise à jour",
      ],
      ...filteredCategories.map((category) => [
        category.label,
        category.description,
        category.createdAt,
        category.updatedAt,
      ]),
    ]
      .map((row) =>
        row
          .map((cell) => `"${cell.replaceAll('"', '""')}"`)
          .join(";"),
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "categories-tickets.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-white shadow-sm"
    >
      <div className="flex flex-col gap-3 border-b border-outline-variant/20 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
          />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Filtrer par libellé…"
            className="h-10 w-full rounded-lg border border-outline-variant/30 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportCategories}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-outline-variant/30 px-3 text-sm font-semibold text-on-surface hover:bg-surface-container-low"
          >
            <Download size={16} />
            Exporter
          </button>
          <button
            type="button"
            aria-label="Options de filtre"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface hover:bg-surface-container-low"
          >
            <Filter size={17} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left">
          <thead className="border-b border-outline-variant/20 bg-surface-container-low text-xs uppercase tracking-wider text-on-surface-variant">
            <tr>
              <th className="px-6 py-4 font-semibold">
                Libellé
              </th>
              <th className="px-6 py-4 font-semibold">
                Description
              </th>
              <th className="px-6 py-4 font-semibold">
                Date de création
              </th>
              <th className="px-6 py-4 font-semibold">
                Dernière mise à jour
              </th>
              <th className="px-6 py-4 text-right font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-outline-variant/15">
            {visibleCategories.map((category, index) => {
              const Icon = categoryIcons[category.icon];

              return (
                <motion.tr
                  key={category.id}
                  initial={{
                    opacity: 0,
                    x: -18,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.22,
                    delay: index * 0.04,
                    ease: "easeOut",
                  }}
                  className="transition-colors hover:bg-surface-container-low/70"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${iconColors[category.icon]}`}
                      >
                        <Icon size={19} />
                      </span>
                      <span className="font-semibold text-on-surface">
                        {category.label}
                      </span>
                    </div>
                  </td>
                  <td className="max-w-80 px-6 py-5 text-sm text-on-surface-variant">
                    <p className="truncate">
                      {category.description}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-sm text-on-surface-variant">
                    {formatDate(category.createdAt)}
                  </td>
                  <td className="px-6 py-5 text-sm text-on-surface-variant">
                    {formatDate(category.updatedAt)}
                  </td>
                  <td className="px-6 py-5 text-right">
                    {readOnly ? (
                      <CategoryDetailsDrawer category={category} />
                    ) : (
                      <EditTicketCategoryDialog category={category} />
                    )}
                  </td>
                </motion.tr>
              );
            })}

            {!visibleCategories.length && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-sm text-on-surface-variant"
                >
                  Aucune catégorie ne correspond à la recherche.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-outline-variant/20 px-6 py-4 text-sm text-on-surface-variant sm:flex-row sm:items-center sm:justify-between">
        <span>
          Affichage{" "}
          {filteredCategories.length
            ? (page - 1) * pageSize + 1
            : 0}
          -{Math.min(page * pageSize, filteredCategories.length)} de{" "}
          {filteredCategories.length} catégories
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Page précédente"
            onClick={() =>
              setPage((value) => Math.max(value - 1, 1))
            }
            disabled={page === 1}
            className="h-9 w-9 rounded-lg hover:bg-surface-container-low disabled:opacity-35"
          >
            ‹
          </button>
          {Array.from(
            {
              length: pageCount,
            },
            (_, index) => index + 1,
          ).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => setPage(pageNumber)}
              className={`h-9 w-9 rounded-lg text-sm font-semibold ${
                pageNumber === page
                  ? "bg-primary-container text-on-primary-container"
                  : "hover:bg-surface-container-low"
              }`}
            >
              {pageNumber}
            </button>
          ))}
          <button
            type="button"
            aria-label="Page suivante"
            onClick={() =>
              setPage((value) => Math.min(value + 1, pageCount))
            }
            disabled={page === pageCount}
            className="h-9 w-9 rounded-lg hover:bg-surface-container-low disabled:opacity-35"
          >
            ›
          </button>
        </div>
      </div>
    </motion.section>
  );
}
