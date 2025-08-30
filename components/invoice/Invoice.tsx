"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { InvoiceItem } from "@/types";
import { InvoiceItemForm } from "./InvoiceItemForm";
import { InvoiceTable } from "./InvoiceTable";
import { format } from "date-fns";

const formatCurrency = (amount: number) => {
  // Remove the currency symbol from the PDF output
  const formattedAmount = amount
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return formattedAmount;
};

const formatCurrencyWithSymbol = (amount: number) => {
  // Use this for display in the UI
  return `₹ ${formatCurrency(amount)}`;
};

export function Invoice() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [editingItem, setEditingItem] = useState<InvoiceItem | undefined>();
  const [mode, setMode] = useState<"create" | "edit">("create");

  const handleAddItem = (data: Omit<InvoiceItem, "id" | "amount">) => {
    const newItem: InvoiceItem = {
      id: uuidv4(),
      ...data,
      amount: data.quantity * data.price,
    };
    setItems([...items, newItem]);
    setIsOpen(false);
  };

  const handleEditItem = (data: Omit<InvoiceItem, "id" | "amount">) => {
    if (!editingItem) return;

    const updatedItem: InvoiceItem = {
      id: editingItem.id,
      ...data,
      amount: data.quantity * data.price,
    };

    setItems(
      items.map((item) => (item.id === editingItem.id ? updatedItem : item))
    );

    setIsOpen(false);
    setEditingItem(undefined);
    setMode("create");
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemClick = (item: InvoiceItem) => {
    setEditingItem(item);
    setMode("edit");
    setIsOpen(true);
  };

  const handleDrawerClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setEditingItem(undefined);
      setMode("create");
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);

  const handleDownload = async () => {
    try {
      const jsPDF = (await import("jspdf")).default;
      const pdf = new jsPDF();

      // Set font
      pdf.setFont("helvetica");

      // Add title
      pdf.setFontSize(24);
      pdf.text("Invoice", 20, 20);

      // Add invoice details
      pdf.setFontSize(12);
      pdf.text(`Date: ${format(new Date(), "dd MMMM yyyy")}`, 20, 35);
      pdf.text("Invoice Number: INV-1234", 20, 42);

      // Add table headers
      const headers = ["Description", "Qty", "Price", "Amount"];
      const columnWidths = [80, 20, 35, 35];
      let y = 60;

      pdf.setFont("helvetica", "bold");
      let x = 20;
      headers.forEach((header, i) => {
        const align = i === 0 ? "left" : "right";
        if (align === "right") {
          pdf.text(header, x + columnWidths[i], y, { align });
        } else {
          pdf.text(header, x, y);
        }
        x += columnWidths[i];
      });

      // Add items
      pdf.setFont("helvetica", "normal");
      y += 10;
      items.forEach((item) => {
        if (y > 270) {
          // Add new page if near bottom
          pdf.addPage();
          y = 20;
        }

        x = 20;
        // Description (left-aligned)
        pdf.text(item.description, x, y);
        x += columnWidths[0];

        // Quantity (right-aligned)
        pdf.text(item.quantity.toString(), x + columnWidths[1], y, {
          align: "right",
        });
        x += columnWidths[1];

        // Price (right-aligned)
        pdf.text(formatCurrency(item.price), x + columnWidths[2], y, {
          align: "right",
        });
        x += columnWidths[2];

        // Amount (right-aligned)
        pdf.text(formatCurrency(item.amount), x + columnWidths[3], y, {
          align: "right",
        });

        y += 8;
      });

      // Add total
      y += 5;
      pdf.line(20, y, 190, y); // Add line above total
      y += 8;
      pdf.setFont("helvetica", "bold");
      pdf.text("Subtotal :", 140, y);
      pdf.text(formatCurrency(subtotal), 190, y, { align: "right" });

      y += 8;
      pdf.text("Total :", 140, y);
      pdf.text(formatCurrency(subtotal), 190, y, { align: "right" });

      pdf.save("invoice.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Invoice Items</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={items.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Drawer open={isOpen} onOpenChange={handleDrawerClose}>
            <DrawerTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>
                  {mode === "edit" ? "Edit Invoice Item" : "Add Invoice Item"}
                </DrawerTitle>
              </DrawerHeader>
              <InvoiceItemForm
                onSubmit={mode === "edit" ? handleEditItem : handleAddItem}
                onCancel={() => handleDrawerClose(false)}
                editItem={editingItem}
                mode={mode}
              />
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      <InvoiceTable
        items={items}
        onDeleteItem={handleDeleteItem}
        onEditItem={handleItemClick}
      />

      <div className="flex justify-end space-y-2">
        <div className="w-full md:w-[200px] px-4 md:px-0">
          <div className="flex justify-between py-2">
            <span className="font-medium">Subtotal</span>
            <span>{formatCurrencyWithSymbol(subtotal)}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="font-medium">Total</span>
            <span className="font-bold">
              {formatCurrencyWithSymbol(subtotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
