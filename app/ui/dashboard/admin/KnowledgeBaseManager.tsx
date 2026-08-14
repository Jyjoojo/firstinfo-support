"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import CountUp from "react-countup";
import { Archive, ChartBarBig, Check, ChevronLeft, ChevronRight, Clock4, Eye, FilePenLine, Plus, RotateCcw, Search, Undo2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Status = "brouillon" | "a_corriger" | "en_attente_validation" | "publie" | "archive";
type StatusFilter = "all" | Status;
type Category = { id: string; label: string };
type Article = {
  id: string;
  reference: string;
  title: string;
  content: string;
  category: string | null;
  categoryId: string | null;
  author: string;
  keywords: string[];
  views: number;
  status: Status;
  updatedAt: string;
};
type Pagination = { currentPage: number; lastPage: number; from: number; to: number; total: number };
type FormState = { title: string; content: string; categoryId: string | null; keywords: string };
type AdminStats = { drafts: number; published: number; totalViews: number };
type UnknownRecord = Record<string, unknown>;

const PAGE_OPTIONS = [6, 10, 20, 50, 100];
const filters: StatusFilter[] = ["all", "brouillon", "en_attente_validation", "a_corriger", "publie", "archive"];
const labels: Record<Status, string> = {
  brouillon: "Brouillon",
  en_attente_validation: "En attente de validation",
  a_corriger: "À corriger",
  publie: "Publié",
  archive: "Archivé",
};
const badgeStyles: Record<Status, string> = {
  brouillon: "bg-amber-100 text-amber-800",
  en_attente_validation: "bg-blue-100 text-blue-700",
  a_corriger: "bg-red-100 text-red-700",
  publie: "bg-teal-100 text-teal-800",
  archive: "bg-stone-200 text-stone-700",
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function relation(value: unknown) {
  return isRecord(value) ? value : null;
}

function list(payload: unknown) {
  if (Array.isArray(payload)) return payload.filter(isRecord);
  return isRecord(payload) && Array.isArray(payload.data) ? payload.data.filter(isRecord) : [];
}

function record(payload: unknown) {
  if (isRecord(payload) && isRecord(payload.article)) return payload.article;
  if (isRecord(payload) && isRecord(payload.data)) return payload.data;
  return isRecord(payload) ? payload : null;
}

function status(value: unknown, published: unknown, deletedAt: unknown): Status {
  if (deletedAt) return "archive";
  const candidate = text(value);
  if (candidate === "brouillon" || candidate === "a_corriger" || candidate === "en_attente_validation" || candidate === "publie" || candidate === "archive") return candidate;
  return published === true ? "publie" : "brouillon";
}

function normalizeArticle(value: unknown): Article {
  const item = record(value);
  if (!item) throw new Error("Réponse article invalide.");
  const category = relation(item.categorie);
  const author = relation(item.auteur);
  const id = text(item.id);
  const title = text(item.titre);
  if (!id || !title) throw new Error("Article incomplet reçu depuis l’API.");
  const authorName = text(author?.nom_complet) ?? ([text(author?.prenom), text(author?.nom)].filter(Boolean).join(" ") || "Auteur inconnu");
  const rawKeywords = item.mots_cles;
  return {
    id,
    reference: text(item.reference) ?? "—",
    title,
    content: text(item.contenu) ?? "",
    category: text(category?.libelle) ?? text(category?.nom),
    categoryId: text(category?.id) ?? text(item.categorie_id),
    author: authorName,
    keywords: Array.isArray(rawKeywords) ? rawKeywords.filter((keyword): keyword is string => typeof keyword === "string") : text(rawKeywords)?.split(",").map((keyword) => keyword.trim()).filter(Boolean) ?? [],
    views: typeof item.vues === "number" ? item.vues : typeof item.nombre_vues === "number" ? item.nombre_vues : 0,
    status: status(item.statut_editorial, item.publie, item.deleted_at),
    updatedAt: text(item.updated_at) ?? text(item.created_at) ?? new Date().toISOString(),
  };
}

function pagination(payload: unknown): Pagination {
  const data = isRecord(payload) ? payload : {};
  const number = (value: unknown, fallback: number) => typeof value === "number" ? value : fallback;
  return { currentPage: number(data.current_page, 1), lastPage: number(data.last_page, 1), from: number(data.from, 0), to: number(data.to, 0), total: number(data.total, 0) };
}

function categories(payload: unknown): Category[] {
  return list(payload).flatMap((item) => {
    const id = text(item.id);
    const label = text(item.libelle) ?? text(item.nom);
    return id && label ? [{ id, label }] : [];
  });
}

async function json(response: Response) {
  const payload = await response.json().catch(() => null) as unknown;
  if (!response.ok) throw new Error(isRecord(payload) && text(payload.message) ? text(payload.message)! : "La requête a échoué.");
  return payload;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function compactNumber(value: number) {
  return new Intl.NumberFormat("fr-FR", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export default function KnowledgeBaseManager() {
  const [items, setItems] = useState<Article[]>([]);
  const [pending, setPending] = useState<Article[]>([]);
  const [stats, setStats] = useState<AdminStats>({ drafts: 0, published: 0, totalViews: 0 });
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [pageMeta, setPageMeta] = useState<Pagination>({ currentPage: 1, lastPage: 1, from: 0, to: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<{ article: Article | null; form: FormState; readOnly: boolean } | null>(null);
  const [refusal, setRefusal] = useState<{ article: Article; reason: string } | null>(null);

  const loadPending = useCallback(async () => {
    const payload = await fetch("/api/articles?espace=admin&statut=en_attente_validation&perPage=100", { headers: { Accept: "application/json" } }).then(json);
    setPending(list(payload).map(normalizeArticle));
  }, []);

  const loadStats = useCallback(async () => {
    const [draftPayload, publishedPayload, articlesPayload] = await Promise.all([
      fetch("/api/articles?espace=admin&statut=brouillon&perPage=6", { headers: { Accept: "application/json" } }).then(json),
      fetch("/api/articles?espace=admin&statut=publie&perPage=6", { headers: { Accept: "application/json" } }).then(json),
      fetch("/api/articles?espace=admin&with_archived=1&perPage=100", { headers: { Accept: "application/json" } }).then(json),
    ]);
    setStats({
      drafts: pagination(draftPayload).total,
      published: pagination(publishedPayload).total,
      totalViews: list(articlesPayload).reduce((total, article) => total + normalizeArticle(article).views, 0),
    });
  }, []);

  const loadArticles = useCallback(async (page = 1, options?: { status?: StatusFilter; search?: string; categoryId?: string; pageSize?: number; full?: boolean }) => {
    const nextStatus = options?.status ?? "all";
    const params = new URLSearchParams({ espace: "admin", page: String(page), perPage: String(options?.pageSize ?? 10) });
    if (nextStatus === "archive") params.set("only_archived", "1");
    else {
      params.set("with_archived", "1");
      if (nextStatus !== "all") params.set("statut", nextStatus);
    }
    const nextSearch = options?.search ?? "";
    const nextCategory = options?.categoryId ?? "all";
    if (nextSearch.trim()) params.set("search", nextSearch.trim());
    if (nextCategory !== "all") params.set("categorie_id", nextCategory);

    if (options?.full) setLoading(true);
    setError(null);
    try {
      const payload = await fetch(`/api/articles?${params}`, { headers: { Accept: "application/json" } }).then(json);
      setItems(list(payload).map(normalizeArticle));
      setPageMeta(pagination(payload));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Impossible de charger les articles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(async () => {
      if (!active) return;
      try {
        const categoriesPayload = await fetch("/api/categories", { headers: { Accept: "application/json" } }).then(json);
        if (!active) return;
        setCategoryOptions(categories(categoriesPayload));
        await Promise.all([loadArticles(1, { full: true, status: "all", search: "", categoryId: "all", pageSize: 10 }), loadPending(), loadStats()]);
      } catch (loadError) {
        if (active) { setError(loadError instanceof Error ? loadError.message : "Chargement impossible."); setLoading(false); }
      }
    });
    return () => { active = false; };
  }, [loadArticles, loadPending, loadStats]);

  async function refresh() {
    await Promise.all([loadArticles(pageMeta.currentPage, { status: statusFilter, search, categoryId, pageSize }), loadPending(), loadStats()]);
  }

  async function workflow(article: Article, action: string, body?: unknown) {
    setBusy(`${article.id}-${action}`);
    try {
      const response = await fetch(`/api/articles/${encodeURIComponent(article.id)}/${action}`, {
        method: "POST",
        headers: { Accept: "application/json", ...(body === undefined ? {} : { "Content-Type": "application/json" }) },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      const result = await json(response);
      toast.success(isRecord(result) && text(result.message) ? text(result.message)! : "Action effectuée.");
      await refresh();
    } catch (actionError) {
      toast.error("Action impossible", { description: actionError instanceof Error ? actionError.message : undefined });
    } finally {
      setBusy(null);
    }
  }

  async function archive(article: Article) {
    setBusy(`${article.id}-archiver`);
    try {
      await fetch(`/api/articles/${encodeURIComponent(article.id)}`, { method: "DELETE", headers: { Accept: "application/json" } }).then(json);
      toast.success("Article archivé");
      await refresh();
    } catch (actionError) {
      toast.error("Archivage impossible", { description: actionError instanceof Error ? actionError.message : undefined });
    } finally { setBusy(null); }
  }

  async function openArticle(article: Article, readOnly: boolean) {
    setBusy(`${article.id}-ouvrir`);
    try {
      const payload = await fetch(`/api/articles/${encodeURIComponent(article.id)}?espace=admin`, { headers: { Accept: "application/json" } }).then(json);
      const detail = normalizeArticle(payload);
      setDrawer({ article: detail, readOnly, form: { title: detail.title, content: detail.content, categoryId: detail.categoryId, keywords: detail.keywords.join(", ") } });
    } catch (openError) {
      toast.error("Ouverture impossible", { description: openError instanceof Error ? openError.message : undefined });
    } finally { setBusy(null); }
  }

  async function save(form: FormState) {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Titre et contenu requis");
      return;
    }
    setBusy("save");
    try {
      const body = { titre: form.title.trim(), contenu: form.content.trim(), mots_cles: form.keywords.trim() || null, categorie_id: form.categoryId };
      const response = await fetch(drawer?.article ? `/api/articles/${encodeURIComponent(drawer.article.id)}` : "/api/articles", { method: drawer?.article ? "PATCH" : "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = await json(response);
      toast.success(isRecord(result) && text(result.message) ? text(result.message)! : "Article enregistré.");
      setDrawer(null);
      await refresh();
    } catch (saveError) {
      toast.error("Enregistrement impossible", { description: saveError instanceof Error ? saveError.message : undefined });
    } finally { setBusy(null); }
  }

  function applyFilter(next: StatusFilter) {
    setStatusFilter(next);
    void loadArticles(1, { status: next, search, categoryId, pageSize });
  }

  if (loading) return <div className="flex min-h-72 items-center justify-center"><Spinner className="size-7 text-primary" aria-label="Chargement des articles" /></div>;

  return (
    <div className="space-y-7">
      <section className="grid gap-4 md:grid-cols-4">
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-2xl border border-outline-variant/20 bg-white p-6 shadow-sm md:col-span-2"
        >
          <ChartBarBig className="absolute -bottom-5 -right-4 size-32 text-primary-container/10" strokeWidth={1.2} />
          <p className="text-sm font-semibold text-on-surface-variant">Performance de la base</p>
          <div className="mt-3 flex items-end gap-3">
            <p className="text-4xl font-black text-on-surface"><CountUp end={84} duration={1.2} />%</p>
            <span className="mb-1 rounded-full bg-teal-100 px-2.5 py-1 text-xs font-bold text-teal-800">Stable</span>
          </div>
          <p className="mt-2 text-sm text-on-surface-variant">Indice de performance global</p>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="relative overflow-hidden rounded-2xl bg-primary-container p-6 text-on-primary-container shadow-sm"
        >
          <Clock4 className="absolute -bottom-4 -right-3 size-24 opacity-15" strokeWidth={1.4} />
          <p className="text-sm font-semibold opacity-80">Articles en brouillon</p>
          <p className="mt-3 text-4xl font-black"><CountUp end={stats.drafts} duration={1} /></p>
          <p className="mt-2 text-sm opacity-80">Requièrent validation</p>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.16 }}
          className="relative overflow-hidden rounded-2xl bg-teal-300 p-6 text-teal-950 shadow-sm"
        >
          <Eye className="absolute -bottom-4 -right-3 size-24 opacity-15" strokeWidth={1.4} />
          <p className="text-sm font-semibold opacity-80">Total lectures</p>
          <p className="mt-3 text-4xl font-black"><CountUp end={stats.totalViews} duration={1.1} formattingFn={compactNumber} /></p>
          <p className="mt-2 text-sm opacity-80">{stats.published} articles publiés</p>
        </motion.article>
      </section>

      <section className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-white shadow-sm">
        <div className="border-b border-outline-variant/20 p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative block w-full max-w-md"><span className="sr-only">Rechercher</span><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === "Enter" && void loadArticles(1, { status: statusFilter, search, categoryId, pageSize })} placeholder="Rechercher un article…" className="h-10 w-full rounded-lg border border-outline-variant/30 pl-10 pr-3 text-sm outline-none focus:border-primary" /></label>
            <Button className="bg-tertiary/80 hover:bg-tertiary" onClick={() => setDrawer({ article: null, readOnly: false, form: { title: "", content: "", categoryId: null, keywords: "" } })}><Plus /> Nouvel article</Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Select value={categoryId} onValueChange={(value) => { setCategoryId(value); void loadArticles(1, { status: statusFilter, search, categoryId: value, pageSize }); }}><SelectTrigger className="min-w-52"><SelectValue placeholder="Toutes les catégories" /></SelectTrigger><SelectContent><SelectItem value="all">Toutes les catégories</SelectItem>{categoryOptions.map((option) => <SelectItem key={option.id} value={option.id}>{option.label}</SelectItem>)}</SelectContent></Select>
            <ToggleGroup
              type="single"
              value={statusFilter}
              onValueChange={(value) => value && applyFilter(value as StatusFilter)}
              variant="outline"
              size="sm"
              spacing={1}
              aria-label="Filtrer par statut"
              className="flex-wrap"
            >
              {filters.map((value) => (
                <ToggleGroupItem
                  key={value}
                  value={value}
                  aria-label={value === "all" ? "Tous les articles" : labels[value]}
                  className="rounded-full px-3 text-xs data-[state=on]:border-primary-container data-[state=on]:bg-primary-container data-[state=on]:text-on-primary-container"
                >
                  {value === "all" ? "Tous" : labels[value]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
        {error && <p role="alert" className="border-b border-destructive/20 bg-destructive/5 px-5 py-3 text-sm text-destructive">{error}</p>}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left"><thead className="bg-surface-container-low text-xs uppercase tracking-wider text-on-surface-variant"><tr><th className="px-6 py-4">Titre</th><th className="px-4 py-4">Catégorie</th><th className="px-4 py-4">Auteur</th><th className="px-4 py-4">Mots-clés</th><th className="px-4 py-4">Vues</th><th className="px-4 py-4">Statut</th><th className="px-4 py-4">Mise à jour</th><th className="px-5 py-4 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-outline-variant/15">{items.map((article) => <tr key={article.reference} className="hover:bg-surface-container-low/70"><td className="px-6 py-4"><p className="max-w-72 font-semibold">{article.title}</p><p className="mt-1 text-xs text-on-surface-variant">{article.reference}</p></td><td className="px-4 py-4 text-sm text-on-surface-variant">{article.category ?? "—"}</td><td className="px-4 py-4 text-sm text-on-surface-variant">{article.author}</td><td className="px-4 py-4"><div className="flex max-w-48 flex-wrap gap-1">{article.keywords.map((keyword, index) => <span key={`${article.reference}-${keyword}-${index}`} className="rounded border border-primary-container/40 px-2 py-1 text-xs">{keyword}</span>)}</div></td><td className="px-4 py-4 text-sm">{article.views.toLocaleString("fr-FR")}</td><td className="px-4 py-4"><span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${badgeStyles[article.status]}`}>{labels[article.status]}</span></td><td className="px-4 py-4 text-sm text-on-surface-variant">{formatDate(article.updatedAt)}</td><td className="px-5 py-4"><div className="flex justify-end gap-1"><Action title="Consulter" onClick={() => void openArticle(article, true)}><Eye /></Action>{article.status !== "archive" && <Action title="Modifier" onClick={() => void openArticle(article, false)}><FilePenLine /></Action>}{article.status === "en_attente_validation" && <><Action title="Valider la soumission" tone="success" onClick={() => void workflow(article, "valider")}><Check /></Action><Action title="Refuser la soumission" tone="danger" onClick={() => setRefusal({ article, reason: "" })}><X /></Action></>}{(article.status === "brouillon" || article.status === "a_corriger") && <Action title="Publier directement" tone="success" onClick={() => void workflow(article, "publier")}><Upload /></Action>}{article.status === "publie" && <Action title="Dépublier" onClick={() => void workflow(article, "depublier")}><Undo2 /></Action>}{article.status !== "archive" ? <Action title="Archiver" onClick={() => void archive(article)}><Archive /></Action> : <Action title="Restaurer" tone="success" onClick={() => void workflow(article, "restaurer")}><RotateCcw /></Action>}</div></td></tr>)}{!items.length && <tr><td colSpan={8} className="px-6 py-12 text-center text-sm text-on-surface-variant">Aucun article ne correspond aux filtres.</td></tr>}</tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 border-t border-outline-variant/20 px-6 py-4 text-sm text-on-surface-variant sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><span>Affichage {pageMeta.from}-{pageMeta.to} sur {pageMeta.total}</span><Select value={String(pageSize)} onValueChange={(value) => { const size = Number(value); setPageSize(size); void loadArticles(1, { status: statusFilter, search, categoryId, pageSize: size }); }}><SelectTrigger className="h-8 w-20"><SelectValue /></SelectTrigger><SelectContent>{PAGE_OPTIONS.map((value) => <SelectItem key={value} value={String(value)}>{value}</SelectItem>)}</SelectContent></Select></div><div className="flex items-center gap-2"><button disabled={pageMeta.currentPage === 1} onClick={() => void loadArticles(pageMeta.currentPage - 1, { status: statusFilter, search, categoryId, pageSize })} className="inline-flex size-8 items-center justify-center rounded-lg border disabled:opacity-40"><ChevronLeft className="size-4" strokeWidth={1.75} /></button><span>Page {pageMeta.currentPage} / {pageMeta.lastPage}</span><button disabled={pageMeta.currentPage === pageMeta.lastPage} onClick={() => void loadArticles(pageMeta.currentPage + 1, { status: statusFilter, search, categoryId, pageSize })} className="inline-flex size-8 items-center justify-center rounded-lg border disabled:opacity-40"><ChevronRight className="size-4" strokeWidth={1.75} /></button></div></div>
      </section>

      <section className="rounded-2xl border border-primary-container/25 bg-surface-container-lowest p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div><h2 className="text-lg font-bold text-on-surface">Articles en attente de validation</h2><p className="mt-1 text-sm text-on-surface-variant">Consultez le contenu avant de valider ou de demander une correction.</p></div>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">{pending.length} en attente</span>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {pending.map((article) => (
            <article key={article.reference} className="rounded-xl border border-outline-variant/20 bg-white p-5">
              <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold text-primary-container">{article.reference}</p><h3 className="mt-1 font-bold text-on-surface">{article.title}</h3></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${badgeStyles[article.status]}`}>{labels[article.status]}</span></div>
              <div className="mt-3 max-h-52 overflow-y-auto whitespace-pre-line rounded-lg bg-surface-container-low p-4 text-sm leading-relaxed text-on-surface-variant">{article.content}</div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant/15 pt-4"><p className="text-xs text-on-surface-variant">{article.author} · {article.category ?? "Sans catégorie"}</p><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => void openArticle(article, true)}><Eye /> Consulter</Button><Button size="sm" variant="outline" className="text-red-700" onClick={() => setRefusal({ article, reason: "" })}><X /> Refuser</Button><Button size="sm" className="bg-teal-700 text-white hover:bg-teal-800" disabled={busy !== null} onClick={() => void workflow(article, "valider")}><Check /> Valider</Button></div></div>
            </article>
          ))}
          {!pending.length && <p className="rounded-xl border border-dashed border-outline-variant/30 p-8 text-center text-sm text-on-surface-variant lg:col-span-2">Aucun article en attente de validation.</p>}
        </div>
      </section>

      {drawer && <EditorDrawer state={drawer} categories={categoryOptions} busy={busy === "save"} onClose={() => setDrawer(null)} onSave={save} />}
      <Dialog open={Boolean(refusal)} onOpenChange={(open) => !open && setRefusal(null)}><DialogContent><DialogHeader><DialogTitle>Refuser la soumission</DialogTitle><DialogDescription>Indiquez précisément les corrections attendues pour « {refusal?.article.title} ».</DialogDescription></DialogHeader><div><Label htmlFor="refusal-reason" className="mb-2">Motif du refus *</Label><textarea id="refusal-reason" minLength={5} maxLength={2000} value={refusal?.reason ?? ""} onChange={(event) => setRefusal((current) => current ? { ...current, reason: event.target.value } : current)} className="min-h-36 w-full rounded-md border border-input p-3 text-sm" /><p className="mt-1 text-right text-xs text-on-surface-variant">{refusal?.reason.length ?? 0}/2000</p></div><DialogFooter><DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose><Button className="bg-red-700 text-white hover:bg-red-800" disabled={!refusal || refusal.reason.trim().length < 5 || busy !== null} onClick={() => { if (!refusal) return; const current = refusal; setRefusal(null); void workflow(current.article, "refuser", { motif: current.reason.trim() }); }}><X /> Confirmer le refus</Button></DialogFooter></DialogContent></Dialog>
    </div>
  );
}

function Action({ children, title, tone = "neutral", onClick }: { children: ReactNode; title: string; tone?: "neutral" | "success" | "danger"; onClick: () => void }) {
  return <button type="button" title={title} aria-label={title} onClick={onClick} className={`inline-flex size-7 items-center justify-center rounded-md transition-colors [&_svg]:size-3.5 [&_svg]:stroke-[1.75] ${tone === "success" ? "text-teal-700 hover:bg-teal-100" : tone === "danger" ? "text-red-700 hover:bg-red-100" : "text-on-surface-variant hover:bg-surface-container"}`}>{children}</button>;
}

function EditorDrawer({ state, categories, busy, onClose, onSave }: { state: { article: Article | null; form: FormState; readOnly: boolean }; categories: Category[]; busy: boolean; onClose: () => void; onSave: (form: FormState) => Promise<void> }) {
  const [form, setForm] = useState(state.form);
  return <Drawer open onOpenChange={(open) => !open && onClose()} direction="right"><DrawerContent className="h-full w-full sm:max-w-2xl"><DrawerHeader className="border-b p-6"><DrawerTitle>{state.readOnly ? "Consulter l’article" : state.article ? "Modifier l’article" : "Nouvel article"}</DrawerTitle><DrawerDescription>{state.readOnly ? `${state.article?.reference} · ${state.article?.author}` : "Renseignez le contenu de l’article."}</DrawerDescription></DrawerHeader><form onSubmit={(event) => { event.preventDefault(); if (!state.readOnly) void onSave(form); }} className="flex min-h-0 flex-1 flex-col"><div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-6"><div><Label htmlFor="admin-article-title" className="mb-2">Titre *</Label><Input id="admin-article-title" disabled={state.readOnly || busy} value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} /></div><div><Label htmlFor="admin-article-content" className="mb-2">Contenu *</Label><textarea id="admin-article-content" disabled={state.readOnly || busy} value={form.content} onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))} className="min-h-72 w-full rounded-md border border-input p-3 text-sm disabled:opacity-80" /></div><div><Label htmlFor="admin-article-keywords" className="mb-2">Mots-clés</Label><Input id="admin-article-keywords" disabled={state.readOnly || busy} value={form.keywords} onChange={(event) => setForm((current) => ({ ...current, keywords: event.target.value }))} placeholder="support, procédure" /></div><div><Label className="mb-2">Catégorie</Label><Select disabled={state.readOnly || busy} value={form.categoryId ?? "none"} onValueChange={(value) => setForm((current) => ({ ...current, categoryId: value === "none" ? null : value }))}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">Sans catégorie</SelectItem>{categories.map((category) => <SelectItem key={category.id} value={category.id}>{category.label}</SelectItem>)}</SelectContent></Select></div>{state.article && <div className="rounded-lg bg-surface-container-low p-4 text-sm"><p><strong>Statut :</strong> {labels[state.article.status]}</p><p className="mt-1"><strong>Auteur :</strong> {state.article.author}</p></div>}</div><DrawerFooter className="flex-row justify-end border-t p-5"><DrawerClose asChild><Button type="button" variant="outline" disabled={busy}>{state.readOnly ? "Fermer" : "Annuler"}</Button></DrawerClose>{!state.readOnly && <Button type="submit" disabled={busy} className="bg-tertiary">{busy && <Spinner />}Enregistrer</Button>}</DrawerFooter></form></DrawerContent></Drawer>;
}
