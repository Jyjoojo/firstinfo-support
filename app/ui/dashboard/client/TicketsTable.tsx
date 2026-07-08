import { Eye } from "lucide-react";

const statusStyles: Record<string, string> = {
  "En cours": "bg-orange-50 text-orange-700 border-orange-100",
  "Résolu": "bg-green-50 text-green-700 border-green-100",
  "Ouvert": "bg-blue-50 text-blue-700 border-blue-100",
  "Urgent": "bg-red-50 text-red-700 border-red-100",
};

const dotStyles: Record<string, string> = {
  "En cours": "bg-orange-500",
  "Résolu": "bg-green-500",
  "Ouvert": "bg-blue-500",
  "Urgent": "bg-red-500",
};

const tickets = [
  {
    id: "#TK-4029",
    title: "Erreur synchronisation Sage 100",
    category: "Comptabilité Cloud",
    status: "En cours",
    date: "Aujourd'hui, 09:45",
  },
  {
    id: "#TK-4015",
    title: "Mise à jour annuelle DSN",
    category: "Sage Paie & RH",
    status: "Résolu",
    date: "Hier, 16:20",
  },
  {
    id: "#TK-3998",
    title: "Blocage interface utilisateur",
    category: "Sage X3",
    status: "Ouvert",
    date: "12 Juin, 11:30",
  },
  {
    id: "#TK-3982",
    title: "Export FEC corrompu",
    category: "Comptabilité",
    status: "Urgent",
    date: "10 Juin, 09:15",
  },
];

export default function 
TicketsTable() {
  return (
    <div className="bg-white rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-surface-container-low border-b border-outline-variant/20">
          <tr>
            <th className="px-5 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              ID Ticket
            </th>
            <th className="px-5 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Sujet
            </th>
            <th className="px-5 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Statut
            </th>
            <th className="px-5 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Date
            </th>
            <th className="px-5 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/10">
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="hover:bg-surface-container-low/50 transition-colors">
              <td className="px-5 py-3.5 text-primary text-sm">{ticket.id}</td>
              <td className="px-5 py-3.5">
                <p className="font-bold text-on-surface text-sm">{ticket.title}</p>
                <p className="text-[11px] text-on-surface-variant">{ticket.category}</p>
              </td>
              <td className="px-5 py-3.5">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${statusStyles[ticket.status]}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[ticket.status]}`} />
                  {ticket.status}
                </span>
              </td>
              <td className="px-5 py-3.5 text-sm text-on-surface-variant">{ticket.date}</td>
              <td className="px-5 py-3.5 text-center">
                <button className="w-8 h-8 inline-flex items-center justify-center rounded-full text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all">
                  <Eye size={17} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
