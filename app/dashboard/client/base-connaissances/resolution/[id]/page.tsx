import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { MY_RESOLUTIONS } from "@/lib/knowledge-base";

export default async function ResolutionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resolution = MY_RESOLUTIONS.find(r => r.id === id);

  if (!resolution) {
    notFound();
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
            <BreadcrumbPage>Mes Résolutions</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{resolution.ticketId}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="bg-white border border-border rounded-xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            Résolu le {resolution.resolvedDate}
          </Badge>
          <Badge variant="secondary">{resolution.module}</Badge>
          <span className="text-sm text-muted-foreground">Par {resolution.technician}</span>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-foreground">{resolution.title}</h1>

        <div className="p-5 bg-muted/50 rounded-xl text-foreground text-sm leading-relaxed mb-8 border border-border">
          <h3 className="font-semibold mb-2">Résumé de l'intervention :</h3>
          {resolution.summary}
        </div>

        <div className="pt-6 border-t border-border flex justify-between items-center">
          <Button variant="outline" asChild>
            <Link href="/dashboard/client/base-connaissances">
              <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la base
            </Link>
          </Button>

          <Button variant="link" asChild className="text-muted-foreground">
            <Link href={`/dashboard/client/tickets/${resolution.ticketId}`}>
              Voir le ticket d'origine
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
