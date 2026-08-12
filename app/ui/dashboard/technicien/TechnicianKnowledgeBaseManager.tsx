"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Clock, Eye, File, FilePenLine, Plus, Search, Send, TriangleAlert, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TechnicianArticleStatus, TechnicianKnowledgeArticle } from "@/lib/knowledge-base";

type ArticleForm = Pick<TechnicianKnowledgeArticle, "title" | "content" | "keywords"> & { categoryId: string | null };
type DrawerState = { article: TechnicianKnowledgeArticle | null; form: ArticleForm; mode: "create" | "edit" | "view" };
type StatusFilter = "all" | TechnicianArticleStatus;
type CategoryOption = { id: string; label: string };
type Identity = { id: string; fullName: string };
type UnknownRecord = Record<string, unknown>;

const PAGE_SIZE = 20;
const myStatusFilters: StatusFilter[] = ["all", "brouillon", "a_corriger", "en_attente_validation", "publie"];
const systemStatusFilters: StatusFilter[] = ["all", "publie"];

const statusLabels: Record<TechnicianArticleStatus, string> = {
  brouillon: "Brouillon",
  a_corriger: "À corriger",
  en_attente_validation: "En attente de validation",
  publie: "Publié",
  archive: "Archivé",
};

const statusStyles: Record<TechnicianArticleStatus, string> = {
  brouillon: "bg-amber-100 text-amber-800",
  a_corriger: "bg-red-100 text-red-700",
  en_attente_validation: "bg-blue-100 text-blue-700",
  publie: "bg-teal-100 text-teal-800",
  archive: "bg-stone-200 text-stone-700",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function emptyForm(): ArticleForm {
  return { title: "", content: "", categoryId: null, keywords: [] };
}

function canEdit(article: TechnicianKnowledgeArticle) {
  return article.isMine && (article.status === "brouillon" || article.status === "a_corriger");
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function relation(value: unknown) {
  return isRecord(value) ? value : null;
}

function responseMessage(payload: unknown, fallback: string) {
  return isRecord(payload) && text(payload.message) ? text(payload.message)! : fallback;
}

async function readJson(response: Response) {
  const payload = await response.json().catch(() => null) as unknown;
  if (!response.ok) throw new Error(responseMessage(payload, "La requête a échoué."));
  return payload;
}

function listItems(payload: unknown): UnknownRecord[] {
  if (Array.isArray(payload)) return payload.filter(isRecord);
  if (isRecord(payload) && Array.isArray(payload.data)) return payload.data.filter(isRecord);
  return [];
}

function articleRecord(payload: unknown) {
  if (isRecord(payload) && isRecord(payload.data)) return payload.data;
  return isRecord(payload) ? payload : null;
}

function normalizeIdentity(payload: unknown): Identity {
  const user = articleRecord(payload);
  const id = text(user?.id) ?? "";
  const fullName = text(user?.nom_complet)
    ?? [text(user?.prenom), text(user?.nom)].filter(Boolean).join(" ");
  return { id, fullName };
}

function normalizeCategories(payload: unknown): CategoryOption[] {
  return listItems(payload).flatMap((item) => {
    const id = text(item.id);
    const label = text(item.libelle) ?? text(item.nom);
    return id && label ? [{ id, label }] : [];
  });
}

function normalizeStatus(value: unknown, published: unknown): TechnicianArticleStatus {
  const status = text(value);
  if (status === "brouillon" || status === "a_corriger" || status === "en_attente_validation" || status === "publie" || status === "archive") return status;
  return published === true ? "publie" : "brouillon";
}

function normalizeKeywords(value: unknown) {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean);
  return text(value)?.split(",").map((item) => item.trim()).filter(Boolean) ?? [];
}

function normalizeArticle(payload: unknown, identity: Identity): TechnicianKnowledgeArticle {
  const article = articleRecord(payload);
  if (!article) throw new Error("La réponse de l’article est invalide.");
  const category = relation(article.categorie);
  const author = relation(article.auteur) ?? relation(article.technicien);
  const authorId = text(author?.id) ?? text(article.auteur_id) ?? "";
  const authorName = text(author?.nom_complet)
    ?? [text(author?.prenom), text(author?.nom)].filter(Boolean).join(" ")
    ?? "Auteur inconnu";
  const id = text(article.id);
  const title = text(article.titre);
  if (!id || !title) throw new Error("Un article reçu depuis l’API est incomplet.");

  return {
    id,
    reference: text(article.reference) ?? "—",
    title,
    content: text(article.contenu) ?? "",
    category: text(category?.libelle) ?? text(category?.nom) ?? null,
    categoryId: text(category?.id) ?? text(article.categorie_id),
    author: authorName,
    keywords: normalizeKeywords(article.mots_cles),
    views: typeof article.vues === "number" ? article.vues : typeof article.nombre_vues === "number" ? article.nombre_vues : 0,
    status: normalizeStatus(article.statut_editorial, article.publie),
    updatedAt: text(article.updated_at) ?? text(article.created_at) ?? new Date().toISOString(),
    isMine: Boolean(identity.id && authorId === identity.id) || Boolean(identity.fullName && authorName === identity.fullName),
    refusalReason: text(article.motif_refus) ?? undefined,
  };
}

export default function TechnicianKnowledgeBaseManager() {
  const [items, setItems] = useState<TechnicianKnowledgeArticle[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [identity, setIdentity] = useState<Identity>({ id: "", fullName: "" });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [openingArticleId, setOpeningArticleId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [myStatuses, setMyStatuses] = useState<Set<StatusFilter>>(new Set(["all"]));
  const [systemStatuses, setSystemStatuses] = useState<Set<StatusFilter>>(new Set(["all"]));
  const [technician, setTechnician] = useState("all");
  const [drawer, setDrawer] = useState<DrawerState | null>(null);
  const [pendingSubmission, setPendingSubmission] = useState<TechnicianKnowledgeArticle | null>(null);

  const loadData = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setLoadError(null);
    try {
      const [articlesPayload, categoriesPayload, identityPayload] = await Promise.all([
        fetch("/api/articles?espace=technicien&perPage=100", { headers: { Accept: "application/json" } }).then(readJson),
        fetch("/api/categories", { headers: { Accept: "application/json" } }).then(readJson),
        fetch("/api/auth/me", { headers: { Accept: "application/json" } }).then(readJson),
      ]);
      const nextIdentity = normalizeIdentity(identityPayload);
      setIdentity(nextIdentity);
      setCategories(normalizeCategories(categoriesPayload));
      setItems(listItems(articlesPayload).map((article) => normalizeArticle(article, nextIdentity)));
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Impossible de charger les articles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => active ? loadData(false) : undefined);
    return () => { active = false; };
  }, [loadData]);

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fr-FR");
    return items.filter((article) => {
      const matchesSearch = !query || [article.title, article.content, article.author, ...article.keywords].filter(Boolean).join(" ").toLocaleLowerCase("fr-FR").includes(query);
      return matchesSearch && (category === "all" || article.categoryId === category);
    });
  }, [category, items, search]);

  const technicians = useMemo(() => Array.from(new Set(
    items.map((article) => article.isMine ? "Vous" : article.author).filter((author): author is string => Boolean(author)),
  )), [items]);

  const myArticles = filtered.filter((article) => article.isMine && (myStatuses.has("all") || myStatuses.has(article.status)));
  const systemArticles = filtered.filter((article) => (
    (systemStatuses.has("all") || systemStatuses.has(article.status))
    && (technician === "all" || (article.isMine ? "Vous" : article.author) === technician)
  ));

  function nextStatuses(current: Set<StatusFilter>, value: StatusFilter): Set<StatusFilter> {
      if (value === "all") return new Set<StatusFilter>(["all"]);
      const next = new Set(current);
      next.delete("all");
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next.size ? next : new Set<StatusFilter>(["all"]);
  }

  async function openArticle(article: TechnicianKnowledgeArticle, mode: "edit" | "view") {
    setOpeningArticleId(article.id);
    try {
      const payload = await fetch(`/api/articles/${encodeURIComponent(article.id)}?espace=technicien`, { headers: { Accept: "application/json" } }).then(readJson);
      const detailedArticle = normalizeArticle(payload, identity);
      setDrawer({ article: detailedArticle, mode, form: { title: detailedArticle.title, content: detailedArticle.content, categoryId: detailedArticle.categoryId ?? null, keywords: detailedArticle.keywords } });
    } catch (error) {
      toast.error("Impossible d’ouvrir l’article", { description: error instanceof Error ? error.message : undefined });
    } finally {
      setOpeningArticleId(null);
    }
  }

  async function submitForValidation(article: TechnicianKnowledgeArticle) {
    if (!canEdit(article)) return;
    setSaving(true);
    try {
      await fetch(`/api/articles/${encodeURIComponent(article.id)}/soumettre`, { method: "POST", headers: { Accept: "application/json" } }).then(readJson);
      setPendingSubmission(null);
      await loadData(false);
      toast.success("Article soumis", { description: "L’article est désormais en attente de validation et n’est plus modifiable." });
    } catch (error) {
      toast.error("La soumission a échoué", { description: error instanceof Error ? error.message : undefined });
    } finally {
      setSaving(false);
    }
  }

  async function saveArticle(form: ArticleForm) {
    const title = form.title.trim();
    const content = form.content.trim();
    if (!title || !content) {
      toast.error("Titre et contenu requis");
      return;
    }
    const payload = { titre: title, contenu: content, mots_cles: form.keywords.join(", "), categorie_id: form.categoryId };
    setSaving(true);
    try {
      if (drawer?.mode === "edit" && drawer.article && canEdit(drawer.article)) {
        await fetch(`/api/articles/${encodeURIComponent(drawer.article.id)}`, { method: "PATCH", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(payload) }).then(readJson);
        toast.success("Brouillon enregistré");
      } else if (drawer?.mode === "create") {
        await fetch("/api/articles", { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(payload) }).then(readJson);
        toast.success("Article créé en brouillon", { description: "Vous en êtes l’auteur." });
      }
      setDrawer(null);
      await loadData(false);
    } catch (error) {
      toast.error("L’enregistrement a échoué", { description: error instanceof Error ? error.message : undefined });
    } finally {
      setSaving(false);
    }
  }

  function toolbarFor(variant: "mine" | "system") {
    const activeStatuses = variant === "mine" ? myStatuses : systemStatuses;
    const availableStatuses = variant === "mine" ? myStatusFilters : systemStatusFilters;
    const updateStatuses = variant === "mine" ? setMyStatuses : setSystemStatuses;

    return (
    <div className="border-b border-outline-variant/20 p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full sm:max-w-md">
          <span className="sr-only">Rechercher un article</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={17} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un article…" className="h-10 w-full rounded-lg border border-outline-variant/30 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-primary" />
        </label>
        <Button type="button" className="bg-tertiary/80 hover:bg-tertiary" onClick={() => setDrawer({ article: null, form: emptyForm(), mode: "create" })}>
          <Plus size={17} /> Nouvel article
        </Button>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-10 min-w-52 bg-white"><SelectValue placeholder="Toutes les catégories" /></SelectTrigger>
          <SelectContent><SelectItem value="all">Toutes les catégories</SelectItem>{categories.map((option) => <SelectItem key={option.id} value={option.id}>{option.label}</SelectItem>)}</SelectContent>
        </Select>
        {variant === "system" && (
          <Select value={technician} onValueChange={setTechnician}>
            <SelectTrigger className="h-10 min-w-52 bg-white"><SelectValue placeholder="Tous les techniciens" /></SelectTrigger>
            <SelectContent><SelectItem value="all">Tous les techniciens</SelectItem>{technicians.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
          </Select>
        )}
        <div className="flex flex-wrap gap-2" aria-label="Filtrer par statut">
          {availableStatuses.map((value) => (
            <button key={value} type="button" onClick={() => updateStatuses((current) => nextStatuses(current, value))} aria-pressed={activeStatuses.has(value)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${activeStatuses.has(value) ? "border-primary-container bg-primary-container text-on-primary" : "border-outline-variant/30 bg-white text-on-surface-variant hover:bg-primary-container"}`}>
              {value === "all" ? "Tous" : statusLabels[value]}
            </button>
          ))}
        </div>
      </div>
    </div>
    );
  }

  if (loading) {
    return <div className="mt-8 flex min-h-64 items-center justify-center rounded-2xl border border-outline-variant/20 bg-white"><Spinner aria-label="Chargement des articles" className="size-7 text-primary" /></div>;
  }

  if (loadError) {
    return <div role="alert" className="mt-8 rounded-2xl border border-destructive/20 bg-white p-8 text-center"><p className="text-sm text-destructive">{loadError}</p><Button type="button" variant="outline" className="mt-4" onClick={() => void loadData()}>Réessayer</Button></div>;
  }

  const metrics = [
    { label: "Mes brouillons", value: items.filter((article) => article.isMine && article.status === "brouillon").length, icon: File, accent: false },
    { label: "À corriger", value: items.filter((article) => article.isMine && article.status === "a_corriger").length, icon: TriangleAlert, accent: true },
    { label: "En attente", value: items.filter((article) => article.isMine && article.status === "en_attente_validation").length, icon: Clock, accent: false },
    { label: "Publiés (Équipe)", value: items.filter((article) => article.status === "publie").length, icon: BookOpen, accent: false },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon, accent }) => (
          <div key={label} className={`group relative overflow-hidden rounded-xl bg-surface-container-lowest p-6 shadow-sm transition-shadow hover:shadow-md ${accent ? "border border-primary-container/30" : ""}`}>
            <div className={`absolute -right-6 -top-6 size-24 rounded-full blur-xl transition-colors ${accent ? "bg-primary-container/20 group-hover:bg-primary-container/40" : "bg-surface-variant/50 group-hover:bg-outline-variant/30"}`} />
            <div className="relative z-10 mb-4 flex items-start justify-between">
              <span className="text-sm font-medium uppercase tracking-wider text-on-surface-variant">{label}</span>
              <div className={`flex size-8 items-center justify-center rounded-md ${accent ? "bg-primary-container/20" : "bg-surface-container"}`}><Icon size={16} className={accent ? "text-primary-container" : "text-on-surface-variant"} /></div>
            </div>
            <div className="relative z-10"><span className="text-4xl font-bold text-on-surface">{value}</span>{accent && value > 0 && <span className="ml-2 text-xs font-medium text-primary-container">Action requise</span>}</div>
          </div>
        ))}
      </div>

    <Tabs defaultValue="mine" className="mt-8 gap-5">
      <div className="border-b border-outline-variant/20">
        <TabsList variant="line" className="h-11">
          <TabsTrigger value="mine" className="px-4">Mes articles</TabsTrigger>
          <TabsTrigger value="system" className="px-4">Tous les articles</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="mine">
        <ArticleTable articles={myArticles} variant="mine" toolbar={toolbarFor("mine")} openingArticleId={openingArticleId} onView={(article) => void openArticle(article, "view")} onEdit={(article) => void openArticle(article, "edit")} onSubmit={setPendingSubmission} />
      </TabsContent>
      <TabsContent value="system">
        <ArticleTable articles={systemArticles} variant="system" toolbar={toolbarFor("system")} openingArticleId={openingArticleId} onView={(article) => void openArticle(article, "view")} onEdit={(article) => void openArticle(article, "edit")} onSubmit={(article) => void submitForValidation(article)} />
      </TabsContent>

      {drawer && <ArticleDrawer drawer={drawer} categories={categories} saving={saving} onClose={() => setDrawer(null)} onSave={saveArticle} />}
      <Dialog open={Boolean(pendingSubmission)} onOpenChange={(open) => !open && setPendingSubmission(null)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <div className="mb-1 flex size-11 items-center justify-center rounded-full bg-primary-container/15 text-primary-container">
              <Send size={20} />
            </div>
            <DialogTitle className="text-lg font-bold text-on-surface">Soumettre l’article à validation ?</DialogTitle>
            <DialogDescription className="leading-relaxed">
              L’article <strong className="font-semibold text-on-surface">« {pendingSubmission?.title} »</strong> sera envoyé à l’administrateur. Il ne pourra plus être modifié tant qu’il sera en attente de validation.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Annuler</Button></DialogClose>
            <Button type="button" disabled={saving} className="bg-primary-container text-on-primary-container hover:bg-primary-container/90" onClick={() => pendingSubmission && void submitForValidation(pendingSubmission)}>
              {saving ? <Spinner aria-hidden="true" /> : <Send size={16} />} Confirmer la soumission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
    </div>
  );
}

function ArticleTable({ articles, variant, toolbar, openingArticleId, onView, onEdit, onSubmit }: { articles: TechnicianKnowledgeArticle[]; variant: "mine" | "system"; toolbar: ReactNode; openingArticleId: string | null; onView: (article: TechnicianKnowledgeArticle) => void; onEdit: (article: TechnicianKnowledgeArticle) => void; onSubmit: (article: TechnicianKnowledgeArticle) => void }) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleArticles = articles.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  return (
    <section className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-white shadow-sm">
      {toolbar}
      <div className="overflow-x-auto">
        <table className={`w-full text-left ${variant === "system" ? "min-w-[1060px]" : "min-w-[820px]"}`}>
          <thead className="bg-surface-container-low text-xs uppercase tracking-wider text-on-surface-variant">
            <tr><th className="px-6 py-4 font-semibold">Titre</th><th className="px-4 py-4 font-semibold">Catégorie</th><th className="px-4 py-4 font-semibold">{variant === "mine" ? "Auteur (Vous)" : "Auteur"}</th>{variant === "system" && <th className="px-4 py-4 font-semibold">Mots-clés</th>}{variant === "system" && <th className="px-4 py-4 font-semibold">Vues</th>}<th className="px-4 py-4 font-semibold">Statut</th><th className="px-4 py-4 font-semibold">Dernière mise à jour</th><th className="px-5 py-4 text-right font-semibold">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/15">
            {visibleArticles.map((article) => (
              <tr key={article.reference} className="transition-colors hover:bg-surface-container-low/70">
                <td className="px-6 py-4"><p className="max-w-72 font-semibold text-on-surface">{article.title}</p><p className="mt-1 text-xs text-on-surface-variant">Réf. {article.reference}</p></td>
                <td className="px-4 py-4 text-sm text-on-surface-variant">{article.category ?? "—"}</td>
                <td className="px-4 py-4 text-sm text-on-surface-variant">{article.isMine ? (variant === "mine" ? <span className="font-semibold text-on-surface">Vous</span> : "Vous") : article.author ?? "Non assigné"}</td>
                {variant === "system" && <td className="px-4 py-4"><div className="flex max-w-44 flex-wrap gap-1">{article.keywords.length ? article.keywords.map((keyword, index) => <span key={`${article.reference}-${keyword}-${index}`} className="rounded border border-primary-container px-2 py-1 text-xs font-semibold text-on-surface-variant">{keyword}</span>) : "—"}</div></td>}
                {variant === "system" && <td className="px-4 py-4 text-sm font-medium text-on-surface">{article.views.toLocaleString("fr-FR")}</td>}
                <td className="px-4 py-4"><ArticleStatus article={article} showRefusal={variant === "mine"} /></td>
                <td className="px-4 py-4 text-sm text-on-surface-variant">{formatDate(article.updatedAt)}</td>
                <td className="px-5 py-4"><div className="flex justify-end gap-1"><ActionButton disabled={openingArticleId === article.id} label={`Consulter ${article.title}`} title="Consulter l’article" onClick={() => onView(article)}>{openingArticleId === article.id ? <Spinner aria-hidden="true" /> : <Eye size={16} />}</ActionButton>{canEdit(article) && <><ActionButton disabled={openingArticleId === article.id} label={`Modifier ${article.title}`} title="Modifier l’article" onClick={() => onEdit(article)}><FilePenLine size={16} /></ActionButton><ActionButton label={`Soumettre ${article.title}`} title="Soumettre à validation" primary onClick={() => onSubmit(article)}><Send size={16} /></ActionButton></>}</div></td>
              </tr>
            ))}
            {!articles.length && <tr><td colSpan={variant === "mine" ? 6 : 8} className="px-6 py-12 text-center text-sm text-on-surface-variant">Aucun article ne correspond à votre recherche.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 border-t border-outline-variant/20 px-6 py-4 text-sm text-on-surface-variant sm:flex-row sm:items-center sm:justify-between">
        <span>Affichage {articles.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}-{Math.min(currentPage * PAGE_SIZE, articles.length)} sur {articles.length} articles</span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1} className="inline-flex size-8 items-center justify-center rounded-lg border border-outline-variant/30 disabled:opacity-40" aria-label="Page précédente"><ChevronLeft size={17} /></button>
          <span>Page {currentPage} / {pageCount}</span>
          <button type="button" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={currentPage === pageCount} className="inline-flex size-8 items-center justify-center rounded-lg border border-outline-variant/30 disabled:opacity-40" aria-label="Page suivante"><ChevronRight size={17} /></button>
        </div>
      </div>
    </section>
  );
}

function ArticleStatus({ article, showRefusal }: { article: TechnicianKnowledgeArticle; showRefusal: boolean }) {
  const badge = <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[article.status]}`}>{statusLabels[article.status]}</span>;

  if (!showRefusal || article.status !== "a_corriger" || !article.refusalReason) return badge;

  return (
    <HoverCard openDelay={150} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button type="button" className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary-container" aria-label="Afficher le motif du refus">
          {badge}
        </button>
      </HoverCardTrigger>
      <HoverCardContent align="start" className="w-80 border-0 bg-on-tertiary-fixed p-4 text-white ring-0">
        <p className="text-xs font-bold uppercase tracking-wider text-primary-container">Motif du refus</p>
        <p className="mt-2 text-sm leading-relaxed text-white">{article.refusalReason}</p>
      </HoverCardContent>
    </HoverCard>
  );
}

function ActionButton({ children, label, title, primary = false, disabled = false, onClick }: { children: ReactNode; label: string; title: string; primary?: boolean; disabled?: boolean; onClick: () => void }) {
  return <button type="button" disabled={disabled} onClick={onClick} aria-label={label} title={title} className={`inline-flex size-8 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${primary ? "text-teal-700 hover:bg-teal-100" : "text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container"}`}>{children}</button>;
}

function KeywordField({ keywords, disabled, onChange }: { keywords: string[]; disabled: boolean; onChange: (keywords: string[]) => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function addKeyword() {
    const keyword = value.trim();
    if (!keyword) return;
    if (/\s|,/.test(keyword)) {
      setError("Ajoutez un seul mot, sans espace ni virgule.");
      return;
    }
    if (keywords.some((item) => item.toLocaleLowerCase("fr-FR") === keyword.toLocaleLowerCase("fr-FR"))) {
      setError("Ce mot-clé est déjà ajouté.");
      return;
    }
    onChange([...keywords, keyword]);
    setValue("");
    setError(null);
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="technician-article-keywords">Mots-clés</Label>
      {!disabled && (
        <div className="flex gap-2">
          <Input
            id="technician-article-keywords"
            value={value}
            onChange={(event) => { setValue(event.target.value); setError(null); }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addKeyword();
              }
            }}
            placeholder="Ex. réseau"
            autoComplete="off"
          />
          <Button type="button" variant="outline" onClick={addKeyword} disabled={!value.trim()} aria-label="Ajouter le mot-clé">
            <Plus size={16} /> Ajouter
          </Button>
        </div>
      )}
      {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
      <div className="flex min-h-7 flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <span key={`${keyword}-${index}`} className="inline-flex items-center gap-1 rounded-full border border-primary-container/40 bg-primary-container/10 px-2.5 py-1 text-xs font-semibold text-on-surface">
            {keyword}
            {!disabled && <button type="button" onClick={() => onChange(keywords.filter((_, itemIndex) => itemIndex !== index))} className="rounded-full text-on-surface-variant hover:text-destructive" aria-label={`Supprimer le mot-clé ${keyword}`}><X size={13} /></button>}
          </span>
        ))}
        {!keywords.length && <span className="text-xs text-on-surface-variant">Aucun mot-clé ajouté.</span>}
      </div>
    </div>
  );
}

function ArticleDrawer({ drawer, categories, saving, onClose, onSave }: { drawer: DrawerState; categories: CategoryOption[]; saving: boolean; onClose: () => void; onSave: (form: ArticleForm) => Promise<void> }) {
  const [form, setForm] = useState(drawer.form);
  const readOnly = drawer.mode === "view";
  const title = drawer.mode === "create" ? "Nouvel article" : drawer.mode === "edit" ? "Modifier l’article" : "Consulter l’article";
  return (
    <Drawer open onOpenChange={(open) => !open && onClose()} direction="right">
      <DrawerContent className="h-full w-full sm:max-w-2xl">
        <DrawerHeader className="border-b border-outline-variant/20 p-6"><DrawerTitle className="text-xl font-bold text-on-surface">{title}</DrawerTitle><DrawerDescription>{drawer.mode === "create" ? "L’article sera enregistré en brouillon à votre nom." : readOnly ? "Consultation uniquement." : "Enregistrez vos corrections avant de soumettre l’article."}</DrawerDescription></DrawerHeader>
        <form onSubmit={(event) => { event.preventDefault(); if (!readOnly) void onSave(form); }} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-6">
            {drawer.article?.refusalReason && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"><p className="flex items-center gap-2 font-semibold"><TriangleAlert size={16} /> Motif du refus</p><p className="mt-1">{drawer.article.refusalReason}</p></div>}
            <div><Label htmlFor="technician-article-title" className="mb-2">Titre *</Label><Input id="technician-article-title" maxLength={255} disabled={readOnly} value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} /></div>
            <div><Label htmlFor="technician-article-content" className="mb-2">Contenu *</Label><textarea id="technician-article-content" disabled={readOnly} value={form.content} onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))} className="min-h-64 w-full rounded-md border border-input bg-transparent p-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50 disabled:cursor-default disabled:opacity-80" /></div>
            <KeywordField keywords={form.keywords} disabled={readOnly || saving} onChange={(keywords) => setForm((current) => ({ ...current, keywords }))} />
            <div><Label className="mb-2">Catégorie</Label><Select disabled={readOnly || saving} value={form.categoryId ?? "none"} onValueChange={(value) => setForm((current) => ({ ...current, categoryId: value === "none" ? null : value }))}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">Aucune catégorie</SelectItem>{categories.map((option) => <SelectItem key={option.id} value={option.id}>{option.label}</SelectItem>)}</SelectContent></Select></div>
            {drawer.article && <div className="rounded-lg bg-surface-container-low p-4 text-sm text-on-surface-variant"><p><strong className="text-on-surface">Auteur :</strong> {drawer.article.isMine ? "Vous" : drawer.article.author}</p><p className="mt-1"><strong className="text-on-surface">Statut :</strong> {statusLabels[drawer.article.status]}</p></div>}
          </div>
          <DrawerFooter className="flex-row justify-end border-t border-outline-variant/20 p-5"><DrawerClose asChild><Button type="button" variant="outline" disabled={saving}>{readOnly ? "Fermer" : "Annuler"}</Button></DrawerClose>{!readOnly && <Button type="submit" disabled={saving} className="bg-tertiary">{saving && <Spinner aria-hidden="true" />}{drawer.mode === "create" ? "Créer le brouillon" : "Enregistrer"}</Button>}</DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
