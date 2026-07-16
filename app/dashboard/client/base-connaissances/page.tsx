"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter, FileText, CheckCircle2, Clock, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KNOWLEDGE_BASE_PUBLIC, MY_RESOLUTIONS } from "@/lib/knowledge-base";

export default function KnowledgeBasePage() {
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const allModules = useMemo(() => 
    Array.from(new Set([...KNOWLEDGE_BASE_PUBLIC.map(a => a.module), ...MY_RESOLUTIONS.map(r => r.module)])), 
  []);
  const allCategories = useMemo(() => 
    Array.from(new Set(KNOWLEDGE_BASE_PUBLIC.map(a => a.category))), 
  []);

  const filteredPublic = useMemo(() =>
    KNOWLEDGE_BASE_PUBLIC.filter(a => {
      const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.module.toLowerCase().includes(search.toLowerCase());
      const matchModule = moduleFilter === "all" || a.module === moduleFilter;
      const matchCategory = categoryFilter === "all" || a.category === categoryFilter;
      return matchSearch && matchModule && matchCategory;
    }), [search, moduleFilter, categoryFilter]);

  const filteredRes = useMemo(() =>
    MY_RESOLUTIONS.filter(r => {
      const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.module.toLowerCase().includes(search.toLowerCase());
      const matchModule = moduleFilter === "all" || r.module === moduleFilter;
      return matchSearch && matchModule;
    }), [search, moduleFilter]);

  return (
    /* DIV PARENT AVEC PADDING ET MAX-WIDTH */
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Base de Connaissances</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une solution..." 
            className="pl-10 h-10 bg-white" 
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger className="h-10 w-full sm:w-[160px] bg-white">
              <Filter className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Module Sage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les modules</SelectItem>
              {allModules.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-10 w-full sm:w-[150px] bg-white">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes catégories</SelectItem>
              {allCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="public" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="public">
            Base Publique ({filteredPublic.length})
          </TabsTrigger>
          <TabsTrigger value="resolutions">
            Mes Résolutions ({filteredRes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="public" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPublic.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-full py-8 text-center">Aucun article trouvé.</p>
            )}
            {filteredPublic.map(article => (
              <Link 
                href={`/dashboard/client/base-connaissances/article/${article.id}`} 
                key={article.id} 
                className="bg-white border border-border rounded-xl p-4 hover:border-primary/50 transition-all flex items-start gap-3 group shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm group-hover:text-primary mb-1 text-foreground">{article.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="font-normal">{article.module}</Badge>
                    <span><Clock className="w-3 h-3 inline mr-1"/>{article.readTime}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-transform group-hover:translate-x-1 mt-1" />
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resolutions" className="mt-0">
          <div className="space-y-3">
            {filteredRes.length === 0 && (
              <p className="text-sm text-muted-foreground py-8 text-center">Aucune résolution trouvée.</p>
            )}
            {filteredRes.map(res => (
              <Link 
                href={`/dashboard/client/base-connaissances/resolution/${res.id}`} 
                key={res.id} 
                className="bg-white border border-border rounded-xl p-4 hover:border-emerald-400/50 transition-all flex items-center gap-3 group shadow-sm"
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
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}