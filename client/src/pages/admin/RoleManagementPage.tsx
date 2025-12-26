import RoleSearchFilter from "@/components/admin/role/role-search-filter";
import RoleTable from "@/components/admin/role/role-table";
import RoleForm from "@/components/admin/role/role-form";

const ROLES = [
  { id: 1, name: "Admin", description: "Full Access", status: "Yes" },
  { id: 2, name: "Editor", description: "Editable", status: "Yes" },
  { id: 3, name: "User", description: "Customer", status: "Yes" },
  { id: 4, name: "Viewer", description: "Read only", status: "No" },
  { id: 5, name: "Moderator", description: "Manage comments", status: "Yes" },
];

const RoleManagementPage = () => {
  return (
    <div className="space-y-4">
      <RoleSearchFilter />
      <RoleTable roles={ROLES} />
      <RoleForm />
    </div>
  );
};

export default RoleManagementPage;
