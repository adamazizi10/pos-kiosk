import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TransactionsFiltersBar = () => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select defaultValue="today">
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="last7">Last 7 Days</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="all-methods">
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Payment Method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-methods">All Methods</SelectItem>
          <SelectItem value="card">Card</SelectItem>
          <SelectItem value="cash">Cash</SelectItem>
          <SelectItem value="wallet">Wallet</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="all-status">
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-status">All Status</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="refunded">Refunded</SelectItem>
          <SelectItem value="voided">Voided</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="text"
        placeholder="Search transaction or customer..."
        className="w-[240px]"
      />
    </div>
  );
};

export default TransactionsFiltersBar;
