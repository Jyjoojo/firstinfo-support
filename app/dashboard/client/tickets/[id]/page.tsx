import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { tickets } from "@/lib/tickets";

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const ticket = tickets.find((item) => item.id === Number(id));

    if (!ticket) {
        notFound();
    }

    return (
        <div className="w-full p-6 lg:p-8">
            <Link href="/dashboard/client/tickets" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-sky-700">
                <ArrowLeft size={16} />
                Retour aux tickets
            </Link>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-600">Détail du ticket</p>
                        <h2 className="mt-2 text-2xl font-semibold text-slate-900">{ticket.titre}</h2>
                    </div>
                    <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700">
                        #{ticket.id}
                    </span>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
                    <div className="rounded-2xl bg-slate-50 p-5">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Description</h3>
                        <p className="mt-3 text-sm leading-7 text-slate-700">{ticket.contenu}</p>
                    </div>

                    <div className="space-y-4 rounded-2xl bg-slate-50 p-5 text-sm text-slate-700">
                        <div>
                            <p className="font-semibold text-slate-900">Catégorie</p>
                            <p className="mt-1">{ticket.categorie}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">Statut</p>
                            <p className="mt-1">{ticket.statut}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">Priorité</p>
                            <p className="mt-1">{ticket.priorite}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">Assigné à</p>
                            <p className="mt-1">{ticket.assigneA}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
