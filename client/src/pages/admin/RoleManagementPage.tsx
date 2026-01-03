import { useState } from "react";
import RoleSearchFilter from "@/components/admin/role/role-search-filter";
import RoleTable from "@/components/admin/role/role-table";
import RoleForm from "@/components/admin/role/role-form";
import { useRoles } from "@/hooks";
import type { RoleResponse } from "@/types/backend";

const RoleManagementPage = () => {
  const [searchName, setSearchName] = useState<string>("");
  const [activeOnly, setActiveOnly] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRole, setSelectedRole] = useState<RoleResponse | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { roles, isLoading, error, totalPages, totalElements, refetch } =
    useRoles({
      name: searchName || undefined,
      page: currentPage,
      size: pageSize,
    });

  const handleSearch = (params: { name?: string; status?: boolean }) => {
    setSearchName(params.name || "");
    setActiveOnly(params.status || false);
    setCurrentPage(0); // Reset to first page on search
  };

  const handleClearSearch = () => {
    setSearchName("");
    setActiveOnly(false);
    setCurrentPage(0);
  };

  const handleCreate = () => {
    setSelectedRole(null);
    setIsFormOpen(true);
  };

  const handleEdit = (role: RoleResponse) => {
    setSelectedRole(role);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setSelectedRole(null);
    setIsFormOpen(false);
  };

  const handleFormSuccess = () => {
    refetch();
    handleFormClose();
  };

  // Filter roles by active status on client side
  const filteredRoles = activeOnly
    ? roles.filter((role) => !role.isDeleted)
    : roles;

  return (
    <div className="space-y-4">
      <RoleSearchFilter
        onSearch={handleSearch}
        onClear={handleClearSearch}
        onCreate={handleCreate}
      />
      <RoleTable
        roles={filteredRoles}
        isLoading={isLoading}
        error={error}
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onEdit={handleEdit}
        onRefetch={refetch}
      />
      {isFormOpen && (
        <RoleForm
          role={selectedRole}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default RoleManagementPage;
