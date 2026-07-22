import UsersManagementTable from "@/app/ui/dashboard/admin/UsersManagementTable";
import { supportUsers } from "@/lib/users";

export default function UsersManagementPage() {
  return (
    <div className="w-full max-w-7xl p-6 lg:p-8">
      <div className="mb-7">
        <h1 className="mt-2 text-2xl font-bold text-on-surface">
          Gestion des utilisateurs
        </h1>
        <p className="mt-1 text-base text-on-surface-variant">
          Gérez les accès des administrateurs, techniciens et clients.
        </p>
      </div>

      <UsersManagementTable users={supportUsers} />
    </div>
  );
}
