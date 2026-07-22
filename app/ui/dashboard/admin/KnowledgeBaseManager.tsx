"use client";

import { useMemo, useState } from "react";
import { Archive, ChevronLeft, ChevronRight, Eye, FilePenLine, Plus, Search, Send, X, ChartBarBig, Clock4 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { ArticleStatus, KnowledgeArticle } from "@/lib/knowledge-base";

type StatusFilter = "all" | ArticleStatus;
type ArticleForm = Pick<KnowledgeArticle, "title" | "content" | "category" | "keywords">;

const PAGE_SIZE = 20;

const statusLabels: Record<ArticleStatus, string> = {
  draft: "Brouillon",
  published: "Publié",
  archived: "Archivé",
};

const statusStyles: Record<ArticleStatus, string> = {
  draft: "bg-amber-100 text-amber-800",
  published: "bg-teal-100 text-teal-800",
  archived: "bg-stone-200 text-stone-700",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date));
}

function emptyForm(): ArticleForm {
  return { title: "", content: "", category: null, keywords: [] };
}

export default function KnowledgeBaseManager({
  articles,
  categories,
}: {
  articles: KnowledgeArticle[];
  categories: string[];
}) {
  const [items, setItems] = useState(articles);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [statuses, setStatuses] = useState<Set<StatusFilter>>(
    new Set(["all"]),
  );
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState<{ article: KnowledgeArticle | null; form: ArticleForm } | null>(null);

  const filtered = useMemo(() => items.filter((article) => {
    const query = search.trim().toLocaleLowerCase("fr-FR");
    const matchesSearch = !query || [article.title, article.content, ...article.keywords]
      .join(" ")
      .toLocaleLowerCase("fr-FR")
      .includes(query);
    const matchesCategory = category === "all" || article.category === category;
    const matchesStatus = statuses.has("all") || statuses.has(article.status);

    return matchesSearch && matchesCategory && matchesStatus;
  }), [category, items, search, statuses]);

  const toggleStatus = (value: StatusFilter) => {
    setStatuses((current) => {
      if (value === "all") {
        return current.has("all") ? new Set() : new Set(["all"]);
      }

      const next = new Set(current);
      next.delete("all");
      next.has(value) ? next.delete(value) : next.add(value);
      return next;
    });
    setPage(1);
  };

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleArticles = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const publishedCount = items.filter((article) => article.status === "published").length;
  const draftCount = items.filter((article) => article.status === "draft").length;
  const totalViews = items.reduce((total, article) => total + article.views, 0);

  const applyStatus = (article: KnowledgeArticle, nextStatus: ArticleStatus) => {
    // TODO: relier l'action à l'endpoint de publication / archivage du backend.
    setItems((current) => current.map((item) => (
      item.id === article.id ? { ...item, status: nextStatus, updatedAt: new Date().toISOString() } : item
    )));
    toast.success(nextStatus === "published" ? "Article publié" : "Article archivé", {
      description: `« ${article.title} » a été ${nextStatus === "published" ? "publié" : "archivé"}.`,
    });
  };

  const saveArticle = (form: ArticleForm) => {
    if (!drawer) return;
    const title = form.title.trim();
    const content = form.content.trim();

    if (!title || !content) {
      toast.error("Formulaire incomplet", { description: "Le titre et le contenu sont requis." });
      return;
    }

    if (title.length > 255) {
      toast.error("Titre trop long", { description: "Le titre ne peut pas dépasser 255 caractères." });
      return;
    }

    const now = new Date().toISOString();
    if (drawer.article) {
      // TODO: appeler l'API de mise à jour lorsque l'endpoint sera disponible.
      setItems((current) => current.map((item) => (
        item.id === drawer.article?.id ? { ...item, ...form, title, content, updatedAt: now } : item
      )));
      toast.success("Article modifié", { description: "Les modifications sont visibles dans la liste." });
    } else {
      // TODO: appeler l'API de création lorsque l'endpoint sera disponible.
      setItems((current) => [{
        id: `KB-${Date.now()}`,
        title,
        content,
        category: form.category,
        keywords: form.keywords,
        author: null,
        views: 0,
        status: "draft",
        updatedAt: now,
      }, ...current]);
      toast.success("Brouillon créé", { description: "Le nouvel article a été ajouté avec 0 vue." });
    }

    setDrawer(null);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-4 gap-gutter mt-2 mb-9">
        <article className="rounded-xl border border-outline-variant/30 bg-white p-5 shadow-sm md:col-span-2 bg-surface-container-lowest flex items-center justify-between overflow-hidden relative">
          <div className="z-10">
            <p className="text-lg font-medium uppercase tracking-wider text-on-surface-variant">Performance du KB</p>
            <p className="mt-3 text-5xl font-bold text-teal-700">84%</p>
            <p className="mt-2 text-sm text-on-surface-variant">Taux de résolution autonome</p>
          </div>
          <div className="absolute -right-2 bottom-0 opacity-10">
            <ChartBarBig size={100}/>
          </div>
        </article>
        <article className="rounded-xl bg-primary-container p-5 shadow-sm">
          <p className="text-lg font-medium uppercase tracking-wide text-teal-950">Articles en brouillon</p>
          <p className="mt-3 text-5xl font-bold text-black">{draftCount}</p>
          <div className="flex items-center gap-1 mt-2">
            <Clock4 size={12}/>
            <p className="text-sm font-medium text-black"> Requièrent validation</p>
          </div>
        </article>
        <article className="rounded-xl bg-teal-300 p-5 shadow-sm">
          <p className="text-lg font-medium uppercase tracking-wide text-teal-950">Total lectures</p>
          <p className="mt-3 text-5xl font-bold text-teal-700">{new Intl.NumberFormat("fr-FR", { notation: "compact" }).format(totalViews)}</p>
          <p className="mt-2 text-sm text-teal-900">{publishedCount} article{publishedCount > 1 ? "s" : ""} publié{publishedCount > 1 ? "s" : ""}</p>
        </article>
      </section>

      <section className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-white shadow-sm">
        <div className="border-b border-outline-variant/20 p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative block w-full sm:max-w-md">
              <span className="sr-only">Rechercher un article</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={17} />
              <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Rechercher un article…" className="h-10 w-full rounded-lg border border-outline-variant/30 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-primary" />
            </label>
            <Button type="button" className="bg-tertiary/80 cursor-pointer hover:bg-tertiary" onClick={() => setDrawer({ article: null, form: emptyForm() })}>
              <Plus size={17} /> Nouvel article
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Select value={category} onValueChange={(value) => { setCategory(value); setPage(1); }}>
              <SelectTrigger className="h-10 min-w-48"><SelectValue placeholder="Toutes les catégories" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2" aria-label="Filtrer par statut">
              {(["all", "draft", "published", "archived"] as StatusFilter[]).map((value) => (
                <button key={value} type="button" onClick={() => toggleStatus(value)} className={`rounded-full px-3 py-1.5 text-xs border font-semibold transition-colors ${statuses.has(value) ? "bg-primary-container text-on-primary" : "bg-white text-on-surface-variant hover:bg-primary-container"}`}>
                  {value === "all" ? "Tous" : statusLabels[value]}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1060px] text-left">
            <thead className="bg-surface-container-low text-xs uppercase tracking-wider text-on-surface-variant">
              <tr>
                <th className="px-6 py-4 font-semibold">Titre</th><th className="px-4 py-4 font-semibold">Catégorie</th><th className="px-4 py-4 font-semibold">Technicien</th><th className="px-4 py-4 font-semibold">Mots-clés</th><th className="px-4 py-4 font-semibold">Vues</th><th className="px-4 py-4 font-semibold">Statut</th><th className="px-4 py-4 font-semibold">Dernière mise à jour</th><th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15">
              {visibleArticles.map((article) => (
                <tr key={article.id} className={article.status === "published" ? "transition-colors hover:bg-surface-container-low/70" : "bg-tertiary-container/10 transition-colors hover:bg-surface-container-low"}>
                  <td className="px-6 py-4"><p className="max-w-64 font-semibold text-on-surface">{article.title}</p><p className="mt-1 text-xs text-on-surface-variant">Réf: {article.id}</p></td>
                  <td className="px-4 py-4 text-sm text-on-surface-variant">{article.category ?? "—"}</td>
                  <td className="px-4 py-4 text-sm text-on-surface-variant">{article.author ?? "Non assigné"}</td>
                  <td className="px-4 py-4"><div className="flex max-w-44 flex-wrap gap-1">{article.keywords.length ? article.keywords.map((keyword) => <span key={keyword} className="rounded font-semibold border border-primary-container px-2 py-1 text-xs text-on-surface-variant">{keyword}</span>) : "—"}</div></td>
                  <td className="px-4 py-4 text-sm font-medium text-on-surface">{article.views.toLocaleString("fr-FR")}</td>
                  <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[article.status]}`}>{statusLabels[article.status]}</span></td>
                  <td className="px-4 py-4 text-sm text-on-surface-variant">{formatDate(article.updatedAt)}</td>
                  <td className="px-5 py-4"><div className="flex justify-end gap-1"><button type="button" onClick={() => setDrawer({ article, form: { title: article.title, content: article.content, category: article.category, keywords: article.keywords } })} className="inline-flex size-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container cursor-pointer" aria-label={`Modifier ${article.title}`} title="Modifier l’article"><FilePenLine size={16} /></button>{article.status === "draft" && <button type="button" onClick={() => applyStatus(article, "published")} className="inline-flex size-8 items-center justify-center  cursor-pointer rounded-lg text-teal-700 hover:bg-teal-100" aria-label={`Publier ${article.title}`} title="Publier l’article"><Send size={16} /></button>}{article.status !== "archived" && <button type="button" onClick={() => applyStatus(article, "archived")} className="inline-flex size-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-stone-200" aria-label={`Archiver ${article.title}`} title="Archiver l’article"><Archive size={16} /></button>}</div></td>
                </tr>
              ))}
              {!visibleArticles.length && <tr><td colSpan={8} className="px-6 py-12 text-center text-sm text-on-surface-variant">Aucun article ne correspond aux filtres.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 border-t border-outline-variant/20 px-6 py-4 text-sm text-on-surface-variant sm:flex-row sm:items-center sm:justify-between"><span>Affichage {filtered.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}-{Math.min(currentPage * PAGE_SIZE, filtered.length)} sur {filtered.length} articles</span><div className="flex items-center gap-2"><button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1} className="inline-flex size-8 items-center justify-center rounded-lg border border-outline-variant/30 disabled:opacity-40"><ChevronLeft size={17} /></button><span>Page {currentPage} / {pageCount}</span><button type="button" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={currentPage === pageCount} className="inline-flex size-8 items-center justify-center rounded-lg border border-outline-variant/30 disabled:opacity-40"><ChevronRight size={17} /></button></div></div>
      </section>
      {drawer && <ArticleDrawer drawer={drawer} categories={categories} onClose={() => setDrawer(null)} onSave={saveArticle} />}
    </div>
  );
}

function ArticleDrawer({
  drawer,
  categories,
  onClose,
  onSave,
}: {
  drawer: { article: KnowledgeArticle | null; form: ArticleForm };
  categories: string[];
  onClose: () => void;
  onSave: (form: ArticleForm) => void;
}) {
  const [form, setForm] = useState(drawer.form);
  const isEditing = Boolean(drawer.article);

  return (
    <Drawer open onOpenChange={(open) => !open && onClose()} direction="right">
      <DrawerContent className="h-full w-full sm:max-w-2xl">
        <DrawerHeader className="border-b border-outline-variant/20 p-6">
          <DrawerTitle className="text-xl font-bold text-on-surface">
            {isEditing ? "Modifier l’article" : "Nouvel article"}
          </DrawerTitle>
          <DrawerDescription>
            {isEditing ? "Mettez à jour les informations de l’article." : "L’article sera créé en brouillon."}
          </DrawerDescription>
        </DrawerHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSave(form);
          }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-6">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label htmlFor="article-title">Titre *</Label>
                <span className="text-xs text-on-surface-variant">{form.title.length}/255</span>
              </div>
              <Input id="article-title" maxLength={255} value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
            </div>
            <div>
              <Label htmlFor="article-content" className="mb-2">Contenu *</Label>
              <textarea id="article-content" value={form.content} onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))} className="min-h-64 w-full rounded-md border border-input bg-transparent p-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50" />
            </div>
            <div>
              <Label htmlFor="article-keywords" className="mb-2">Mots-clés</Label>
              <Input id="article-keywords" value={form.keywords.join(", ")} onChange={(event) => setForm((current) => ({ ...current, keywords: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) }))} placeholder="Ex. Sage, SQL, sauvegarde" />
            </div>
            <div>
              <Label className="mb-2">Catégorie</Label>
              <Select value={form.category ?? "none"} onValueChange={(value) => setForm((current) => ({ ...current, category: value === "none" ? null : value }))}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Aucune catégorie" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune catégorie</SelectItem>
                  {categories.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DrawerFooter className="flex-row justify-end border-t border-outline-variant/20 p-5">
            <DrawerClose asChild><Button type="button" variant="outline">Annuler</Button></DrawerClose>
            <Button type="submit" className="bg-tertiary">{isEditing ? "Enregistrer" : "Créer le brouillon"}</Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

function LegacyArticleDrawer({ drawer, categories, onClose, onSave }: { drawer: { article: KnowledgeArticle | null; form: ArticleForm }; categories: string[]; onClose: () => void; onSave: (form: ArticleForm) => void }) {
  const [form, setForm] = useState(drawer.form);
  const isEditing = Boolean(drawer.article);
  return <div className="fixed inset-0 z-50"><button type="button" className="absolute inset-0 bg-black/20" aria-label="Fermer le panneau" onClick={onClose} /><aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl"><header className="flex items-start justify-between border-b border-outline-variant/20 p-6"><div><h2 className="text-xl font-bold text-on-surface">{isEditing ? "Modifier l’article" : "Nouvel article"}</h2><p className="mt-1 text-sm text-on-surface-variant">{isEditing ? "Mettez à jour les informations de l’article." : "L’article sera créé en brouillon."}</p></div><button type="button" onClick={onClose} className="inline-flex size-9 items-center justify-center rounded-lg hover:bg-surface-container-low" aria-label="Fermer"><X size={18} /></button></header><form onSubmit={(event) => { event.preventDefault(); onSave(form); }} className="flex min-h-0 flex-1 flex-col"><div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-6"><div><div className="mb-2 flex items-center justify-between"><Label htmlFor="article-title">Titre *</Label><span className="text-xs text-on-surface-variant">{form.title.length}/255</span></div><Input id="article-title" maxLength={255} value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} /></div><div><Label htmlFor="article-content" className="mb-2">Contenu *</Label><textarea id="article-content" value={form.content} onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))} className="min-h-64 w-full rounded-md border border-input bg-transparent p-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50" /></div><div><Label htmlFor="article-keywords" className="mb-2">Mots-clés</Label><Input id="article-keywords" value={form.keywords.join(", ")} onChange={(event) => setForm((current) => ({ ...current, keywords: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) }))} placeholder="Ex. Sage, SQL, sauvegarde" /></div><div><Label className="mb-2">Catégorie</Label><Select value={form.category ?? "none"} onValueChange={(value) => setForm((current) => ({ ...current, category: value === "none" ? null : value }))}><SelectTrigger className="w-full"><SelectValue placeholder="Aucune catégorie" /></SelectTrigger><SelectContent><SelectItem value="none">Aucune catégorie</SelectItem>{categories.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>{isEditing && <div className="rounded-lg bg-surface-container-low p-4 text-sm text-on-surface-variant"><p><strong className="text-on-surface">Auteur :</strong> {drawer.article?.author ?? "Non assigné"}</p><p className="mt-1"><strong className="text-on-surface">Vues :</strong> {drawer.article?.views.toLocaleString("fr-FR")}</p></div>}</div><footer className="flex justify-end gap-2 border-t border-outline-variant/20 p-5"><Button type="button" variant="outline" onClick={onClose}>Annuler</Button><Button type="submit">{isEditing ? "Enregistrer" : "Créer le brouillon"}</Button></footer></form></aside></div>;
}
