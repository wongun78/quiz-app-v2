import { useState } from "react";
import UserSearchFilter from "@/components/admin/user/user-search-filter";
import UserTable from "@/components/admin/user/user-table";
import UserForm from "@/components/admin/user/user-form";
import { useUsers } from "@/hooks";
import type { UserResponse } from "@/types/backend";

const UserManagementPage = () => {
  const [searchFullName, setSearchFullName] = useState<string>("");
  const [activeOnly, setActiveOnly] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { users, isLoading, error, totalPages, totalElements, refetch } =
    useUsers({
      fullName: searchFullName || undefined,
      active: activeOnly ? true : undefined,
      page: currentPage,
      size: pageSize,
    });

  const handleSearch = (params: { fullName?: string; active?: boolean }) => {
    setSearchFullName(params.fullName || "");
    setActiveOnly(params.active || false);
    setCurrentPage(0); // Reset to first page on search
  };

  const handleClearSearch = () => {
    setSearchFullName("");
    setActiveOnly(false);
    setCurrentPage(0);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user: UserResponse) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setSelectedUser(null);
    setIsFormOpen(false);
  };

  const handleFormSuccess = () => {
    refetch();
    handleFormClose();
  };

  return (
    <div className="space-y-4">
      <UserSearchFilter
        onSearch={handleSearch}
        onClear={handleClearSearch}
        onCreate={handleCreate}
      />
      <UserTable
        users={users}
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
        <UserForm
          user={selectedUser}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default UserManagementPage;
