import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserSessionsFiltersBar = ({ onSearchChange, onDateChange, onStatusChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select defaultValue="all" onValueChange={onDateChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="last7">Last 7 Days</SelectItem>
          <SelectItem value="last30">Last 30 Days</SelectItem>
          <SelectItem value="all">All Time</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="all-status" onValueChange={onStatusChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Session Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-status">All Sessions</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="ended">Ended</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="text"
        placeholder="Search by user..."
        className="w-[240px]"
        onChange={(e) => onSearchChange?.(e.target.value)}
      />
    </div>
  );
};

export default UserSessionsFiltersBar;
