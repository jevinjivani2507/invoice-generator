"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Plus } from "lucide-react";
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

export function Invoice() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<InvoiceItem[]>([]);

  const handleAddItem = (data: Omit<InvoiceItem, "id" | "amount">) => {
    const newItem: InvoiceItem = {
      id: uuidv4(),
      ...data,
      amount: data.quantity * data.price,
    };
    setItems([...items, newItem]);
    setIsOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Invoice Items</h2>
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Add Invoice Item</DrawerTitle>
            </DrawerHeader>
            <InvoiceItemForm
              onSubmit={handleAddItem}
              onCancel={() => setIsOpen(false)}
            />
          </DrawerContent>
        </Drawer>
      </div>

      <InvoiceTable items={items} onDeleteItem={handleDeleteItem} />

      <div className="flex justify-end space-y-2">
        <div className="w-full md:w-[200px] px-4 md:px-0">
          <div className="flex justify-between py-2">
            <span className="font-medium">Subtotal</span>
            <span>
              {subtotal.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="font-medium">Total</span>
            <span className="font-bold">
              {subtotal.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
