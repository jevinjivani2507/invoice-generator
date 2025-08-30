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
}

export function InvoiceTable({ items, onDeleteItem }: InvoiceTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader className="hidden md:table-header-group">
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="relative">
              <TableCell className="md:table-cell">
                <span className="font-medium md:hidden block mb-1">
                  Description:
                </span>
                {item.description}
              </TableCell>
              <TableCell className="text-right md:table-cell">
                <span className="font-medium md:hidden block mb-1">
                  Quantity:
                </span>
                {item.quantity}
              </TableCell>
              <TableCell className="text-right md:table-cell">
                <span className="font-medium md:hidden block mb-1">Price:</span>
                {item.price.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </TableCell>
              <TableCell className="text-right md:table-cell">
                <span className="font-medium md:hidden block mb-1">
                  Amount:
                </span>
                {item.amount.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </TableCell>
              <TableCell className="md:static absolute top-2 right-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteItem(item.id)}
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
