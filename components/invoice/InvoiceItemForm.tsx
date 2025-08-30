"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InvoiceItem } from "@/types";
import { useEffect } from "react";

const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  pieces: z.number().min(1, "Pieces must be at least 1"),
  carats: z.number().min(0.01, "Carats must be greater than 0"),
  price: z.number().min(0, "Price must be positive"),
});

interface InvoiceItemFormProps {
  onSubmit: (data: Omit<InvoiceItem, "id" | "amount">) => void;
  onCancel: () => void;
  editItem?: InvoiceItem;
  mode?: "create" | "edit";
}

export function InvoiceItemForm({
  onSubmit,
  onCancel,
  editItem,
  mode = "create",
}: InvoiceItemFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      pieces: 1,
      carats: 0.01,
      price: 0,
    },
  });

  useEffect(() => {
    if (mode === "edit" && editItem) {
      form.reset({
        description: editItem.description,
        pieces: editItem.pieces,
        carats: editItem.carats,
        price: editItem.price,
      });
    }
  }, [editItem, mode, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 p-4"
      >
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Item description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pieces"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pieces</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="carats"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Carats</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0.01}
                  step={0.01}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {mode === "edit" ? "Update Item" : "Add Item"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
