import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ApiError } from "@/lib/api";
import { getPublicArticle } from "@/lib/knowledge-base-api";

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let article;
  try {
    article = await getPublicArticle(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/client/base-connaissances">Base de connaissances</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/client/base-connaissances">{article.category}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{article.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="bg-white border border-border rounded-xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Badge>{article.category}</Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />{article.readTime} de lecture
          </span>
        </div>

        <h1 className="text-3xl font-bold mb-4 text-foreground">{article.title}</h1>
        <p className="text-lg text-muted-foreground mb-8">{article.excerpt}</p>

        <div className="prose prose-sm md:prose-base max-w-none text-foreground space-y-4 mb-8">
          <p>{article.content}</p>
        </div>

        <div className="pt-6 border-t border-border flex flex-wrap justify-between items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/client/base-connaissances">
              <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la base
            </Link>
          </Button>
          <span className="text-xs text-muted-foreground">Dernière mise à jour : {article.lastUpdated}</span>
        </div>
      </div>
    </div>
  );
}
