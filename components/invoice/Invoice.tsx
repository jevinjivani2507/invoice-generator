"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Plus, Download, User, Percent } from "lucide-react";
import { Address } from "@/types";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
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
import { AddressForm } from "./AddressForm";
import { DiscountForm } from "./DiscountForm";
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

const defaultFromAddress: Address = {
  name: "Your Company Name",
  street: "123 Business Street",
  city: "Business City",
  state: "State",
  country: "Country",
  zipCode: "12345",
};

function InvoiceComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [editingItem, setEditingItem] = useState<InvoiceItem | undefined>();
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);

  const [fromAddress, setFromAddress] = useLocalStorage<Address>(
    "fromAddress",
    defaultFromAddress
  );
  const [toAddress, setToAddress] = useState<Address | null>(null);
  const [isAddressDrawerOpen, setIsAddressDrawerOpen] = useState(false);
  const [addressMode, setAddressMode] = useState<"from" | "to">("to");

  const handleAddItem = (data: Omit<InvoiceItem, "id" | "amount">) => {
    const newItem: InvoiceItem = {
      id: uuidv4(),
      ...data,
      amount: data.carats * data.price,
    };
    setItems([...items, newItem]);
    setIsOpen(false);
  };

  const handleEditItem = (data: Omit<InvoiceItem, "id" | "amount">) => {
    if (!editingItem) return;

    const updatedItem: InvoiceItem = {
      id: editingItem.id,
      ...data,
      amount: data.carats * data.price,
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

  const handleAddressDrawerClose = (open: boolean) => {
    setIsAddressDrawerOpen(open);
  };

  const handleAddressSubmit = (data: Address) => {
    if (addressMode === "from") {
      setFromAddress(data);
    } else {
      setToAddress(data);
    }
    setIsAddressDrawerOpen(false);
  };

  const handleEditFromAddress = () => {
    setAddressMode("from");
    setIsAddressDrawerOpen(true);
  };

  const handleEditToAddress = () => {
    setAddressMode("to");
    setIsAddressDrawerOpen(true);
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

      // Add From address
      pdf.setFont("helvetica", "bold");
      pdf.text("From:", 20, 55);
      pdf.setFont("helvetica", "normal");
      let fromY = 62;
      if (fromAddress.name) {
        pdf.text(fromAddress.name, 20, fromY);
        fromY += 7;
      }
      if (fromAddress.street) {
        pdf.text(fromAddress.street, 20, fromY);
        fromY += 7;
      }
      const fromCityState = [fromAddress.city, fromAddress.state]
        .filter(Boolean)
        .join(", ");
      if (fromCityState) {
        pdf.text(fromCityState, 20, fromY);
        fromY += 7;
      }
      const fromCountryZip = [fromAddress.country, fromAddress.zipCode]
        .filter(Boolean)
        .join(", ");
      if (fromCountryZip) {
        pdf.text(fromCountryZip, 20, fromY);
      }

      // Add To address
      if (toAddress) {
        pdf.setFont("helvetica", "bold");
        pdf.text("To:", 120, 55);
        pdf.setFont("helvetica", "normal");
        let toY = 62;
        if (toAddress.name) {
          pdf.text(toAddress.name, 120, toY);
          toY += 7;
        }
        if (toAddress.street) {
          pdf.text(toAddress.street, 120, toY);
          toY += 7;
        }
        const toCityState = [toAddress.city, toAddress.state]
          .filter(Boolean)
          .join(", ");
        if (toCityState) {
          pdf.text(toCityState, 120, toY);
          toY += 7;
        }
        const toCountryZip = [toAddress.country, toAddress.zipCode]
          .filter(Boolean)
          .join(", ");
        if (toCountryZip) {
          pdf.text(toCountryZip, 120, toY);
        }
      }

      // Add table headers
      const headers = ["Description", "Pieces", "Carats", "Price", "Amount"];
      const columnWidths = [70, 20, 20, 30, 30];
      let y = 100;

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

        // Pieces (right-aligned)
        pdf.text(item.pieces?.toString() || "-", x + columnWidths[1], y, {
          align: "right",
        });
        x += columnWidths[1];

        // Carats (right-aligned)
        pdf.text(item.carats.toString(), x + columnWidths[2], y, {
          align: "right",
        });
        x += columnWidths[2];

        // Price (right-aligned)
        pdf.text(formatCurrency(item.price), x + columnWidths[3], y, {
          align: "right",
        });
        x += columnWidths[3];

        // Amount (right-aligned)
        pdf.text(formatCurrency(item.amount), x + columnWidths[4], y, {
          align: "right",
        });

        y += 8;
      });

      // Add total
      y += 5;
      pdf.line(20, y, 190, y); // Add line above total
      y += 8;
      pdf.setFont("helvetica", "bold");
      pdf.text("Subtotal:", 140, y);
      pdf.text(formatCurrency(subtotal), 190, y, { align: "right" });

      if (discountPercentage > 0) {
        y += 8;
        pdf.setFont("helvetica", "bold");
        pdf.text(`Discount (${discountPercentage}%):`, 140, y);
        const discountAmount = (subtotal * discountPercentage) / 100;
        pdf.text(formatCurrency(discountAmount), 190, y, { align: "right" });
      }

      y += 8;
      pdf.setFont("helvetica", "bold");
      pdf.text("Total:", 140, y);
      pdf.text(
        formatCurrency(
          Math.max(0, subtotal - (subtotal * discountPercentage) / 100)
        ),
        190,
        y,
        {
          align: "right",
        }
      );

      pdf.save("invoice.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* From Address */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">From</h3>
            <Button variant="outline" size="sm" onClick={handleEditFromAddress}>
              <User className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Edit</span>
            </Button>
          </div>
          {fromAddress && (
            <div className="space-y-1">
              {fromAddress.name && (
                <p className="font-medium">{fromAddress.name}</p>
              )}
              {fromAddress.street && <p>{fromAddress.street}</p>}
              {(fromAddress.city || fromAddress.state) && (
                <p>
                  {[fromAddress.city, fromAddress.state]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
              {(fromAddress.country || fromAddress.zipCode) && (
                <p>
                  {[fromAddress.country, fromAddress.zipCode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
            </div>
          )}
        </div>

        {/* To Address */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">To</h3>
            <Button variant="outline" size="sm" onClick={handleEditToAddress}>
              <User className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">
                {toAddress ? "Edit" : "Add"}
              </span>
            </Button>
          </div>
          {toAddress ? (
            <div className="space-y-1">
              {toAddress.name && (
                <p className="font-medium">{toAddress.name}</p>
              )}
              {toAddress.street && <p>{toAddress.street}</p>}
              {(toAddress.city || toAddress.state) && (
                <p>
                  {[toAddress.city, toAddress.state].filter(Boolean).join(", ")}
                </p>
              )}
              {(toAddress.country || toAddress.zipCode) && (
                <p>
                  {[toAddress.country, toAddress.zipCode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">No recipient added yet</p>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Invoice Items</h2>
        <div className="flex space-x-2">
          <Drawer open={isDiscountOpen} onOpenChange={setIsDiscountOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline">
                <Percent className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">
                  {discountPercentage > 0
                    ? `Discount (${discountPercentage}%)`
                    : "Add Discount"}
                </span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DiscountForm
                onSubmit={(percentage) => {
                  setDiscountPercentage(percentage);
                  setIsDiscountOpen(false);
                }}
                onCancel={() => setIsDiscountOpen(false)}
                onRemove={() => {
                  setDiscountPercentage(0);
                  setIsDiscountOpen(false);
                }}
                currentDiscount={discountPercentage}
              />
            </DrawerContent>
          </Drawer>
          <Drawer open={isOpen} onOpenChange={handleDrawerClose}>
            <DrawerTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Add Item</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
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
      <Drawer
        open={isAddressDrawerOpen}
        onOpenChange={handleAddressDrawerClose}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {addressMode === "from"
                ? "Edit Sender Address"
                : "Edit Recipient Address"}
            </DrawerTitle>
          </DrawerHeader>
          <AddressForm
            onSubmit={handleAddressSubmit}
            onCancel={() => setIsAddressDrawerOpen(false)}
            defaultValues={
              addressMode === "from" ? fromAddress : toAddress || undefined
            }
            title={addressMode === "from" ? "From Address" : "To Address"}
          />
        </DrawerContent>
      </Drawer>
      <InvoiceTable
        items={items}
        onDeleteItem={handleDeleteItem}
        onEditItem={handleItemClick}
      />
      <div className="flex justify-end space-y-2">
        <div className="w-full md:w-[200px] px-4 md:px-0">
          <div className="flex justify-between py-2">
            <span className="font-medium">Subtotal:</span>
            <span>{formatCurrencyWithSymbol(subtotal)}</span>
          </div>
          {discountPercentage > 0 && (
            <div className="flex justify-between py-2 text-red-600">
              <span className="font-medium">
                Discount ({discountPercentage}%):
              </span>
              <span>
                -
                {formatCurrencyWithSymbol(
                  (subtotal * discountPercentage) / 100
                )}
              </span>
            </div>
          )}
          <div className="flex justify-between border-t pt-2">
            <span className="font-medium">Total:</span>
            <span className="font-bold">
              {formatCurrencyWithSymbol(
                Math.max(0, subtotal - (subtotal * discountPercentage) / 100)
              )}
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-end mb-6">
        <Button
          variant="outline"
          onClick={handleDownload}
          disabled={items.length === 0 || !toAddress}
          className="w-full md:w-auto"
        >
          <Download className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Download PDF</span>
        </Button>
      </div>
    </div>
  );
}

export const Invoice = InvoiceComponent;
