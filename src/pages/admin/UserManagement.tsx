import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUsers,
  updateUserRole,
  toggleUserStatus,
} from "@services/UserApi";
import PageHeader from "@components/PageHeader";
import InputField from "@/components/TextField";
import CustomPagination from "@components/Pagination";
import CustomSelect from "@components/CustomSelect";
import CommonTable from "@/components/CommonTable";

const ITEMS_PER_PAGE = 5;

// ✅ **Define Type for User**
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "editor";
  status: boolean;
  created_at: Date;
}

const UserManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<"All" | "Active" | "Inactive">("All");
  const queryClient = useQueryClient();

  // ✅ **Fetch Users from Firestore**
  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // ✅ **Update Role Mutation**
  const updateRoleMutation = useMutation({
    mutationFn: ({
      id,
      newRole,
    }: {
      id: string;
      newRole: "admin" | "user" | "editor";
    }) => updateUserRole(id, newRole),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  // ✅ **Toggle Active/Inactive Mutation**
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: boolean }) =>
      toggleUserStatus(id, newStatus),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  // 🔍 **Search and Filter Users**
  const filteredUsers: User[] = Array.isArray(users)
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) &&
          (filter === "All" ||
            (filter === "Active" ? user.status : !user.status))
      )
    : [];

  // ✅ **Pagination Logic**
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      {/* 🔹 Page Header */}
      <PageHeader title="Users" subtitle="Manage user roles and statuses" />

      <div className="bg-surface text-theme p-6 rounded-lg shadow-md overflow-hidden">
        {/* 🔹 Filters & Search */}
        <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
          <InputField
            id="search"
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <CustomSelect
            options={["All", "Active", "Inactive"]}
            value={filter}
            onChange={(value) =>
              setFilter(value as "All" | "Active" | "Inactive")
            }
          />
        </div>

        <CommonTable
          columns={["Name", "Email", "Role", "Status", "Actions"]}
          isLoading={isLoading}
          isError={isError}
          noDataText="No users found."
          rows={paginatedUsers.map((user) => (
            <tr key={user.id}>
              <td className="p-3 border theme-border">{user.name}</td>
              <td className="p-3 border theme-border">{user.email}</td>
              <td className="p-3 border theme-border">
                <CustomSelect
                  options={["admin", "user"]}
                  value={user.role}
                  onChange={(newRole) =>
                    updateRoleMutation.mutate({
                      id: user.id,
                      newRole: newRole as "admin" | "user" | "editor",
                    })
                  }
                />
              </td>
              <td className="p-3 border theme-border">
                <span
                  className={`px-2 py-1 rounded-md text-theme text-sm ${
                    user.status ? "bg-success" : "bg-error"
                  }`}
                >
                  {user.status ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="p-3 border theme-border">
                <button
                  className={`px-2 py-1 rounded-md text-theme text-sm ${
                    user.status ? "bg-error" : "bg-success"
                  }`}
                  onClick={() =>
                    toggleStatusMutation.mutate({
                      id: user.id,
                      newStatus: !user.status,
                    })
                  }
                >
                  {user.status ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        />

        {filteredUsers.length > ITEMS_PER_PAGE && (
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </>
  );
};

export default UserManagement;
