import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CashDrawerEventsFiltersBar = ({ onSearchChange, onTypeChange, onDateChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select defaultValue="all-types" onValueChange={onTypeChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Event Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-types">All Types</SelectItem>
          <SelectItem value="OPEN">Open</SelectItem>
          <SelectItem value="CLOSE">Close</SelectItem>
          <SelectItem value="ADD">Add Cash</SelectItem>
          <SelectItem value="REMOVE">Remove Cash</SelectItem>
          <SelectItem value="SALE">Sale</SelectItem>
          <SelectItem value="REFUND">Refund</SelectItem>
        </SelectContent>
      </Select>

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

      <Input
        type="text"
        placeholder="Search events..."
        className="w-[240px]"
        onChange={(e) => onSearchChange?.(e.target.value)}
      />
    </div>
  );
};

export default CashDrawerEventsFiltersBar;
