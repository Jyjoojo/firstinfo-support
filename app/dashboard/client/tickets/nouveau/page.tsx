import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

export default function NewTicketPage() {
    return (
        <div className="w-full p-6 lg:p-8">
            <Link href="/dashboard/client/tickets" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-sky-700">
                <ArrowLeft size={16} />
                Retour aux tickets
            </Link>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-sky-100 p-2 text-sky-700">
                        <Plus size={18} />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">Créer un nouveau ticket</h2>
                        <p className="text-sm text-slate-600">Cette vue pourra ensuite être enrichie avec le formulaire complet de création.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
