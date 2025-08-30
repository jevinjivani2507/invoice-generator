"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvoiceItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface InvoiceTableProps {
  items: InvoiceItem[];
  onDeleteItem: (id: string) => void;
  onEditItem: (item: InvoiceItem) => void;
}

const formatCurrency = (amount: number) => {
  const formattedAmount = amount
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `₹ ${formattedAmount}`;
};

export function InvoiceTable({
  items,
  onDeleteItem,
  onEditItem,
}: InvoiceTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader className="hidden md:table-header-group">
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Pieces</TableHead>
            <TableHead className="text-right">Carats</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              className="relative cursor-pointer hover:bg-muted/50"
              onClick={() => onEditItem(item)}
            >
              <TableCell className="md:table-cell">
                <span className="font-medium md:hidden block mb-1">
                  Description:
                </span>
                {item.description}
              </TableCell>
              <TableCell className="text-right md:table-cell">
                <span className="font-medium md:hidden block mb-1">
                  Pieces:
                </span>
                {item.pieces}
              </TableCell>
              <TableCell className="text-right md:table-cell">
                <span className="font-medium md:hidden block mb-1">
                  Carats:
                </span>
                {item.carats}
              </TableCell>
              <TableCell className="text-right md:table-cell">
                <span className="font-medium md:hidden block mb-1">Price:</span>
                {formatCurrency(item.price)}
              </TableCell>
              <TableCell className="text-right md:table-cell">
                <span className="font-medium md:hidden block mb-1">
                  Amount:
                </span>
                {formatCurrency(item.amount)}
              </TableCell>
              <TableCell className="md:static absolute top-2 right-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteItem(item.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
