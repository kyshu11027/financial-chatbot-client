"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { UserInfo } from "@/types/user";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/app/context/AuthContext";
import { useUser } from "@/app/context/UserContext";
import { Plus, LoaderCircle } from "lucide-react";

// Schema for the dynamic fields
const dynamicItemSchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().optional(),
  amount: z.coerce.number().min(0, "Amount must be positive"),
});

// Form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  income: z.coerce.number().min(0, {
    message: "Income must be a positive number.",
  }),
  savings_goal: z.coerce.number().min(0, {
    message: "Savings goal must be a positive number.",
  }),
  additional_monthly_expenses: z.array(dynamicItemSchema).optional(),
});

export default function UserInfoForm({
  userInfo,
  setOpenDialog,
}: {
  userInfo: UserInfo | null;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { session } = useAuth();
  const { refreshUserInfo } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userInfo?.name || "",
      income: userInfo?.income || 0,
      savings_goal: userInfo?.savings_goal || 0,
      additional_monthly_expenses: userInfo?.additional_monthly_expenses || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "additional_monthly_expenses",
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const endpoint = userInfo
        ? "/api/user-info/update"
        : "/api/user-info/create";

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        console.error("Failed to submit user info");
      }

      await refreshUserInfo();
      setOpenDialog(false);
    } catch (error) {
      console.error("An error occurred while submitting user info:", error);
      window.alert(
        "There was an error while updating your user information. Try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Static fields */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="income"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Income</FormLabel>
              <FormControl>
                <Input className="no-spinner" type="number" {...field} />
              </FormControl>
              <FormDescription>Your monthly income in dollars</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="savings_goal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Savings Goal</FormLabel>
              <FormControl>
                <Input className="no-spinner" type="number" {...field} />
              </FormControl>
              <FormDescription>
                Your monthly savings goal in dollars
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Dynamic fields */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium mb-2">
            Additional Monthly Expenses
          </h3>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name={`additional_monthly_expenses.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expense Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-1">
                <FormField
                  control={form.control}
                  name={`additional_monthly_expenses.${index}.amount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount ($)</FormLabel>
                      <FormControl>
                        <Input
                          className="no-spinner"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-3">
                <FormField
                  control={form.control}
                  name={`additional_monthly_expenses.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Description of Monthly Expense"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-full flex justify-end">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}

          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ name: "", description: "", amount: 0 })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        <div className="flex flex-row gap-3 justify-end">
          <Button
            variant="outline"
            className="min-w-[80px]"
            type="reset"
            onClick={() => {
              setOpenDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button disabled={isLoading} type="submit" className="min-w-[80px]">
            {isLoading ? <LoaderCircle className="animate-spin" /> : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
