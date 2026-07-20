"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Search, FileText, CheckCircle2, Clock, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KNOWLEDGE_BASE_PUBLIC, KnowledgeBaseArticle, MY_RESOLUTIONS, MyResolution } from "@/lib/knowledge-base";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type KbTab = "public" | "resolutions";

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`relative px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors duration-150 ${active ? "text-white border-transparent bg-primary-container" : "bg-white text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
        }`}
    >
      {active && (
        <motion.span layoutId="kb-filter-pill" transition={{ type: "spring", stiffness: 500, damping: 35 }}
          className="absolute inset-0 rounded-full bg-primary -z-10" />
      )}
      {label}
    </button>
  );
}

export default function KnowledgeBasePage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<KbTab>("public");
  const [category, setCategory] = useState<string | null>(null);
  const [module, setModule] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const categories = useMemo(() =>
    Array.from(new Set(KNOWLEDGE_BASE_PUBLIC.map(a => a.category))), []);
  const resModules = useMemo(() =>
    Array.from(new Set(MY_RESOLUTIONS.map(r => r.module))), []);

  const handleTabChange = (t: string) => {
    setActiveTab(t as KbTab);
    setCategory(null);
    setModule(null);
    setCurrentPage(1);
  };

  const handleCategoryChange = (c: string | null) => {
    setCategory(c);
    setCurrentPage(1);
  };

  const handleModuleChange = (m: string | null) => {
    setModule(m);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const filteredPublic = useMemo(() =>
    KNOWLEDGE_BASE_PUBLIC.filter(a =>
      (a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.module.toLowerCase().includes(search.toLowerCase()) ||
        a.category.toLowerCase().includes(search.toLowerCase())) &&
      (!category || a.category === category)
    ), [search, category]);

  const filteredRes = useMemo(() =>
    MY_RESOLUTIONS.filter(r =>
      (r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.module.toLowerCase().includes(search.toLowerCase())) &&
      (!module || r.module === module)
    ), [search, module]);

  const currentList = activeTab === "public" ? filteredPublic : filteredRes;
  const totalPages = Math.ceil(currentList.length / itemsPerPage);

  const displayedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return currentList.slice(startIndex, startIndex + itemsPerPage);
  }, [currentList, currentPage, itemsPerPage]);

  const generatePagination = (totalPages: number, currentPage: number): Array<number | '...'> => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (currentPage > totalPages - 4) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const paginationRange = useMemo(() => generatePagination(totalPages, currentPage), [totalPages, currentPage]);

  const handlePageChange = (page: number | '...') => {
    if (typeof page === 'number') {
      setCurrentPage(page);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const totalLength = currentList.length;
  const startItem = totalLength > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalLength);

  return (
    <div className="flex min-h-full w-full max-w-6xl mx-auto flex-col gap-6 p-6 md:p-7">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Base de Connaissances</h1>
      </div>

      {/* Recherche prédictive — le placeholder s'adapte à l'onglet actif */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={handleSearchChange}
          placeholder={activeTab === "public"
            ? "Rechercher un article, un module Sage, une catégorie..."
            : "Rechercher dans mes résolutions..."}
          className="pl-10 h-11 bg-white"
        />
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1">
        <TabsList className="mb-3 w-full bg-on-secondary-fixed-variant/10">
          <TabsTrigger value="public">Base Publique ({filteredPublic.length})</TabsTrigger>
          <TabsTrigger value="resolutions">Mes Résolutions ({filteredRes.length})</TabsTrigger>
        </TabsList>

        {/* Filtres à puces — catégories pour la base publique, modules pour mes résolutions */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
            className="flex flex-wrap items-center gap-2 pb-1 mb-4 -mx-1 px-1">
            {activeTab === "public" ? (
              <>
                <FilterChip label={`Toutes (${KNOWLEDGE_BASE_PUBLIC.length})`} active={!category} onClick={() => handleCategoryChange(null)} />
                {categories.map(c => (
                  <FilterChip key={c} label={c} active={category === c} onClick={() => handleCategoryChange(category === c ? null : c)} />
                ))}
              </>
            ) : (
              <>
                <FilterChip label={`Tous modules (${MY_RESOLUTIONS.length})`} active={!module} onClick={() => handleModuleChange(null)} />
                {resModules.map(m => (
                  <FilterChip key={m} label={m} active={module === m} onClick={() => handleModuleChange(module === m ? null : m)} />
                ))}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <TabsContent value="public" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedItems.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-full py-8 text-center">Aucun article trouvé.</p>
            )}
            {displayedItems.map((item, i) => { const article = item as KnowledgeBaseArticle; return (
              <motion.div key={article.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18, delay: i * 0.02 }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.9 }}
              >
                <Link
                  href={`/dashboard/client/base-connaissances/article/${article.id}`}
                  className="bg-white border border-border rounded-xl p-4 hover:border-primary-container/50 hover:shadow-md transition-all flex items-start gap-3 group shadow-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary-container" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm group-hover:text-primary-container mb-1 text-foreground">{article.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="font-normal">{article.module}</Badge>
                      <Badge variant="outline" className="font-normal">{article.category}</Badge>
                      <span><Clock className="w-3 h-3 inline mr-1" />{article.readTime}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary-container transition-transform group-hover:translate-x-1 mt-1" />
                </Link>
              </motion.div>
            )})}
          </div>
        </TabsContent>

        <TabsContent value="resolutions" className="mt-0">
          <div className="space-y-3">
            {displayedItems.length === 0 && (
              <p className="text-sm text-muted-foreground py-8 text-center">Aucune résolution trouvée.</p>
            )}
            {displayedItems.map((item, i) => { const res = item as MyResolution; return (
              <motion.div key={res.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18, delay: i * 0.02 }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.9 }}>
                <Link
                  href={`/dashboard/client/base-connaissances/resolution/${res.id}`}
                  className="bg-white border border-border rounded-xl p-4 hover:border-emerald-400/50 hover:shadow-md transition-all flex items-center gap-3 group shadow-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm group-hover:text-emerald-700 mb-1 text-foreground">{res.title}</h3>
                    <p className="text-xs text-muted-foreground">Ticket {res.ticketId} • Résolu le {res.resolvedDate}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-emerald-600 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            )})}
          </div>
        </TabsContent>
      </Tabs>
      <div className="mt-auto flex items-center justify-between gap-4 rounded-lg border bg-white px-4 py-2">
          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="rows-per-page" className="text-muted-foreground">Lignes par page</label>
            <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-20" id="rows-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-6">
            <p className="text-sm text-muted-foreground w-full">
              {startItem}-{endItem} sur {totalLength}
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={handlePrevPage}
                    className={cn("cursor-pointer", { "pointer-events-none opacity-50": currentPage === 1 || totalPages <= 1 })} />
                </PaginationItem>
                {paginationRange.map((page, index) => (
                  <PaginationItem key={index} className="cursor-pointer">
                    {page === '...' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink isActive={currentPage === page} onClick={() => handlePageChange(page)}>
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext onClick={handleNextPage}
                    className={cn("cursor-pointer", { "pointer-events-none opacity-50": currentPage === totalPages || totalPages <= 1 })} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
    </div>
  );
}
