import { useEffect, useState, useMemo } from "react";
import UsersHeader from "./components/UsersHeader";
import UsersTable from "./components/UsersTable";
import AddEditUserModal from "./components/AddEditUserModal";
import ResetPasswordModal from "./components/ResetPasswordModal";
import ProfilesFiltersBar from "./components/ProfilesFiltersBar";
import {
  useProfilesQuery,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
} from "@/services/users.queries";
import { toast } from "@/components/ui/use-toast";

const ProfilesRoute = () => {
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all-roles");
  const [statusFilter, setStatusFilter] = useState("all-status");

  const profilesQuery = useProfilesQuery();
  const updateProfileMutation = useUpdateProfileMutation();
  const deleteProfileMutation = useDeleteProfileMutation();

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsAddEditModalOpen(true);
  };

  useEffect(() => {
    if (profilesQuery.error) {
      toast({
        title: "Failed to load users",
        description: profilesQuery.error.message,
        variant: "destructive",
      });
    }
  }, [profilesQuery.error]);

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsAddEditModalOpen(true);
  };

  const handleResetPassword = (user) => {
    setSelectedUser(user);
    setIsResetPasswordModalOpen(true);
  };

  const handleCloseAddEditModal = () => {
    setIsAddEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleCloseResetPasswordModal = () => {
    setIsResetPasswordModalOpen(false);
    setSelectedUser(null);
  };

  const handleToggleActive = async (user) => {
    if (!user?.id) return;
    try {
      const nextStatus = !user.is_active;
      await updateProfileMutation.mutateAsync({ id: user.id, patch: { is_active: nextStatus } });
      toast({ title: `User ${nextStatus ? "enabled" : "disabled"}` });
    } catch (err) {
      toast({
        title: "Status update failed",
        description: err?.message || "Unable to update status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (user) => {
    if (!user?.id) return;
    const confirmed = window.confirm("Delete this user?");
    if (!confirmed) return;

    try {
      await deleteProfileMutation.mutateAsync(user.id);
      toast({ title: "User deleted" });
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err?.message || "Unable to delete user",
        variant: "destructive",
      });
    }
  };

  // Filter users based on search, role, and status
  const filteredUsers = useMemo(() => {
    if (!profilesQuery.data) return [];

    return profilesQuery.data.filter((user) => {
      const matchesSearch =
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === "all-roles" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all-status" ||
        (statusFilter === "active" && user.is_active) ||
        (statusFilter === "disabled" && !user.is_active);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [profilesQuery.data, searchQuery, roleFilter, statusFilter]);

  return (
    <div className="flex flex-col gap-4 p-6">
      <UsersHeader onAddUser={handleAddUser} />
      <ProfilesFiltersBar
        onSearchChange={setSearchQuery}
        onRoleChange={setRoleFilter}
        onStatusChange={setStatusFilter}
      />
      <UsersTable
        users={filteredUsers}
        isLoading={profilesQuery.isLoading}
        onEditUser={handleEditUser}
        onResetPassword={handleResetPassword}
        onToggleActive={handleToggleActive}
        onDeleteUser={handleDeleteUser}
      />

      <AddEditUserModal
        isOpen={isAddEditModalOpen}
        onClose={handleCloseAddEditModal}
        user={selectedUser}
      />

      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={handleCloseResetPasswordModal}
        user={selectedUser}
      />
    </div>
  );
};

export default ProfilesRoute;
