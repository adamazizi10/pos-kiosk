import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProfilesFiltersBar = ({ onSearchChange, onRoleChange, onStatusChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select defaultValue="all-roles" onValueChange={onRoleChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-roles">All Roles</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
          <SelectItem value="EMPLOYEE">Employee</SelectItem>
          <SelectItem value="KIOSK_ROLE">Kiosk</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="all-status" onValueChange={onStatusChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-status">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="disabled">Disabled</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="text"
        placeholder="Search users..."
        className="w-[240px]"
        onChange={(e) => onSearchChange?.(e.target.value)}
      />
    </div>
  );
};

export default ProfilesFiltersBar;
