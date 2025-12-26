import UserSearchFilter from "@/components/admin/user/user-search-filter";
import UserTable from "@/components/admin/user/user-table";
import UserForm from "@/components/admin/user/user-form";

const USERS = [
  {
    id: 1,
    firstName: "Admin",
    lastName: "User",
    email: "admin@domain.com",
    username: "admin",
    phone: "+84987654321",
    status: "Yes",
  },
  {
    id: 2,
    firstName: "Editor",
    lastName: "User",
    email: "editor@domain.com",
    username: "editor",
    phone: "+84987654321",
    status: "Yes",
  },
  {
    id: 3,
    firstName: "Cong",
    lastName: "Dinh",
    email: "congdinh@domain.com",
    username: "congdinh",
    phone: "+84987654321",
    status: "Yes",
  },
  {
    id: 4,
    firstName: "Van",
    lastName: "Nguyen",
    email: "vannguyen@domain.com",
    username: "vannguyen",
    phone: "+84987654321",
    status: "Yes",
  },
  {
    id: 5,
    firstName: "Test",
    lastName: "User",
    email: "test@domain.com",
    username: "testuser",
    phone: "+84987654321",
    status: "No",
  },
];

const UserManagementPage = () => {
  return (
    <div className="space-y-4">
      <UserSearchFilter />
      <UserTable users={USERS} />
      <UserForm />
    </div>
  );
};

export default UserManagementPage;
