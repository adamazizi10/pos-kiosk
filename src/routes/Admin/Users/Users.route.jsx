import { useEffect, useState } from "react";
import UsersHeader from "./components/UsersHeader";
import UsersTable from "./components/UsersTable";
import AddEditUserModal from "./components/AddEditUserModal";
import ResetPasswordModal from "./components/ResetPasswordModal";
import {
  useProfilesQuery,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
} from "@/services/users.queries";
import { toast } from "@/components/ui/use-toast";

const UsersRoute = () => {
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
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

  return (
    <div className="min-h-screen bg-background">
      <UsersHeader onAddUser={handleAddUser} />
      <UsersTable
        users={profilesQuery.data}
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

export default UsersRoute;
