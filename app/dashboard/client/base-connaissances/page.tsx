"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Search, FileText, CheckCircle2, Clock, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KNOWLEDGE_BASE_PUBLIC, MY_RESOLUTIONS } from "@/lib/knowledge-base";

type KbTab = "public" | "resolutions";

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`relative shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors duration-150 ${
        active ? "text-white border-transparent bg-primary-container" : "bg-white text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
      }`}>
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

  const categories = useMemo(() =>
    Array.from(new Set(KNOWLEDGE_BASE_PUBLIC.map(a => a.category))), []);
  const resModules = useMemo(() =>
    Array.from(new Set(MY_RESOLUTIONS.map(r => r.module))), []);

  const handleTabChange = (t: KbTab) => { setActiveTab(t); setCategory(null); setModule(null); };

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

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Base de Connaissances</h1>
      </div>

      {/* Recherche prédictive — le placeholder s'adapte à l'onglet actif */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={activeTab === "public"
            ? "Rechercher un article, un module Sage, une catégorie..."
            : "Rechercher dans mes résolutions..."}
          className="pl-10 h-11 bg-white"
        />
      </div>

      <Tabs value={activeTab} onValueChange={v => handleTabChange(v as KbTab)} className="w-full">
        <TabsList className="mb-3">
          <TabsTrigger value="public">Base Publique ({filteredPublic.length})</TabsTrigger>
          <TabsTrigger value="resolutions">Mes Résolutions ({filteredRes.length})</TabsTrigger>
        </TabsList>

        {/* Filtres à puces — catégories pour la base publique, modules pour mes résolutions */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-4 -mx-1 px-1">
            {activeTab === "public" ? (
              <>
                <FilterChip label={`Toutes (${KNOWLEDGE_BASE_PUBLIC.length})`} active={!category} onClick={() => setCategory(null)} />
                {categories.map(c => (
                  <FilterChip key={c} label={c} active={category === c} onClick={() => setCategory(category === c ? null : c)} />
                ))}
              </>
            ) : (
              <>
                <FilterChip label={`Tous modules (${MY_RESOLUTIONS.length})`} active={!module} onClick={() => setModule(null)} />
                {resModules.map(m => (
                  <FilterChip key={m} label={m} active={module === m} onClick={() => setModule(module === m ? null : m)} />
                ))}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <TabsContent value="public" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPublic.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-full py-8 text-center">Aucun article trouvé.</p>
            )}
            {filteredPublic.map((article, i) => (
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
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resolutions" className="mt-0">
          <div className="space-y-3">
            {filteredRes.length === 0 && (
              <p className="text-sm text-muted-foreground py-8 text-center">Aucune résolution trouvée.</p>
            )}
            {filteredRes.map((res, i) => (
              <motion.div key={res.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18, delay: i * 0.02 }}>
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
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
