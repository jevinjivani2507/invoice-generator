"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useEffect } from "react";

type FormData = {
  discountPercentage: string;
};

const formSchema = z.object({
  discountPercentage: z
    .string()
    .min(1, "Discount percentage is required")
    .refine((val) => !isNaN(Number(val)), "Must be a number")
    .refine(
      (val) => Number(val) >= 0 && Number(val) <= 100,
      "Percentage must be between 0 and 100"
    ),
});

interface DiscountFormProps {
  onSubmit: (discountPercentage: number) => void;
  onCancel: () => void;
  onRemove: () => void;
  currentDiscount?: number;
}

function HeaderButtons({
  form,
  onCancel,
  onRemove,
  hasDiscount,
}: {
  form: any;
  onCancel: () => void;
  onRemove: () => void;
  hasDiscount: boolean;
}) {
  return (
    <>
      {hasDiscount ? (
        <Button
          type="button"
          size="icon"
          variant="secondary"
          onClick={onRemove}
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Remove discount</span>
        </Button>
      ) : (
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
            form="discount-form"
            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <Check className="h-4 w-4" />
            <span className="sr-only">Apply discount</span>
          </Button>
        </>
      )}
    </>
  );
}

function DiscountFormComponent({
  onSubmit,
  onCancel,
  onRemove,
  currentDiscount,
}: DiscountFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      discountPercentage: "",
    },
  });

  useEffect(() => {
    if (currentDiscount) {
      form.reset({
        discountPercentage: String(currentDiscount),
      });
    }
  }, [currentDiscount, form]);

  const handleSubmit = (values: FormData) => {
    onSubmit(Number(values.discountPercentage));
    form.reset();
  };

  return (
    <div>
      <DrawerHeader>
        <div className="flex items-center justify-between">
          <DrawerTitle>Add Discount</DrawerTitle>
          <div className="flex space-x-2">
            <HeaderButtons
              form={form}
              onCancel={onCancel}
              onRemove={onRemove}
              hasDiscount={!!currentDiscount}
            />
          </div>
        </div>
      </DrawerHeader>
      <Form {...form}>
        <form
          id="discount-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 p-4"
        >
          <FormField
            control={form.control}
            name="discountPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Percentage</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      step={1}
                      placeholder="Enter discount percentage"
                      {...field}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500">%</span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}

export const DiscountForm = DiscountFormComponent;
