import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CashDrawerFiltersBar = ({ onSearchChange, onStatusChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select defaultValue="all-status" onValueChange={onStatusChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-status">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="text"
        placeholder="Search drawer label..."
        className="w-[240px]"
        onChange={(e) => onSearchChange?.(e.target.value)}
      />
    </div>
  );
};

export default CashDrawerFiltersBar;
