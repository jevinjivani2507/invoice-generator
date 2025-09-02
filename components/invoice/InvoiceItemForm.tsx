"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { RotateCcw, X, Check } from "lucide-react";
import { DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
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

type FormData = {
  description: string;
  pieces: string;
  carats: string;
  price: string;
};

const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  pieces: z
    .string()
    .min(1, "Pieces is required")
    .refine((val) => !isNaN(Number(val)), "Must be a number")
    .refine((val) => Number(val) >= 1, "Pieces must be at least 1"),
  carats: z
    .string()
    .min(1, "Carats is required")
    .refine((val) => !isNaN(Number(val)), "Must be a number")
    .refine((val) => Number(val) > 0, "Carats must be greater than 0"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)), "Must be a number")
    .refine((val) => Number(val) >= 0, "Price must be positive"),
});

interface InvoiceItemFormProps {
  onSubmit: (data: Omit<InvoiceItem, "id" | "amount">) => void;
  onCancel: () => void;
  editItem?: InvoiceItem;
  mode?: "create" | "edit";
}

function HeaderButtons({
  form,
  onCancel,
}: {
  form: any;
  onCancel: () => void;
}) {
  return (
    <>
      <Button
        type="button"
        size="icon"
        variant="secondary"
        onClick={() => form.reset()}
        className="h-8 w-8 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
      >
        <RotateCcw className="h-4 w-4" />
        <span className="sr-only">Reset form</span>
      </Button>
      <Button
        type="button"
        size="icon"
        variant="secondary"
        onClick={onCancel}
        className="h-8 w-8 text-gray-600 hover:text-gray-700"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Cancel</span>
      </Button>
      <Button
        type="submit"
        size="icon"
        variant="secondary"
        form="invoice-item-form"
        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
      >
        <Check className="h-4 w-4" />
        <span className="sr-only">Save item</span>
      </Button>
    </>
  );
}

function InvoiceItemFormComponent({
  onSubmit,
  onCancel,
  editItem,
  mode = "create",
}: InvoiceItemFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      pieces: "",
      carats: "",
      price: "",
    },
  });

  useEffect(() => {
    if (mode === "edit" && editItem) {
      form.reset({
        description: editItem.description,
        pieces: String(editItem.pieces),
        carats: String(editItem.carats),
        price: String(editItem.price),
      });
    }
  }, [editItem, mode, form]);

  const handleSubmit = (values: FormData) => {
    onSubmit({
      description: values.description,
      pieces: Number(values.pieces),
      carats: Number(values.carats),
      price: Number(values.price),
    });
    form.reset();
  };

  return (
    <div>
      <DrawerHeader>
        <div className="flex items-center justify-between">
          <DrawerTitle>
            {mode === "edit" ? "Edit Invoice Item" : "Add Invoice Item"}
          </DrawerTitle>
          <div className="flex space-x-2">
            <HeaderButtons form={form} onCancel={onCancel} />
          </div>
        </div>
      </DrawerHeader>
      <Form {...form}>
        <form
          id="invoice-item-form"
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
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
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
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
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
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}

export const InvoiceItemForm = InvoiceItemFormComponent;
