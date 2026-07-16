import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { KNOWLEDGE_BASE_PUBLIC } from "@/lib/knowledge-base";

export default function ArticleDetailPage({ params }: { params: { id: string } }) {
  const article = KNOWLEDGE_BASE_PUBLIC.find(a => a.id === params.id);

  if (!article) {
    notFound(); // Renvoie vers la page 404 de Next.js si l'ID n'existe pas
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb shadcn correctement implémenté avec Link */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/client/base-connaissances">Base de connaissances</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{article.module}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="bg-white border border-border rounded-xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Badge>{article.category}</Badge>
          <Badge variant="secondary">{article.module}</Badge>
        </div>
        
        <h1 className="text-3xl font-bold mb-4 text-foreground">{article.title}</h1>
        <p className="text-lg text-muted-foreground mb-8">{article.excerpt}</p>
        
        {/* Ici tu pourras injecter le contenu riche (HTML ou Markdown) de l'article */}
        <div className="prose prose-sm md:prose-base max-w-none text-foreground space-y-4 mb-8">
          <p>Voici le contenu détaillé de la solution technique...</p>
        </div>

        <div className="pt-6 border-t border-border">
          <Button variant="outline" asChild>
            <Link href="/dashboard/client/base-connaissances">
              <ArrowLeft className="w-4 h-4 mr-2"/> Retour à la base
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}