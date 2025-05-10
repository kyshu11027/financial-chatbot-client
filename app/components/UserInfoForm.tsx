"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import UserInfo from "@/types/user";
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
});

export default function UserInfoForm({
  userInfo,
}: {
  userInfo: UserInfo | null;
}) {
  const { session } = useAuth();
  const onSubmit = async (data: z.infer<typeof formSchema>) => {

    try {
      if (!userInfo) {
        const res = await fetch("http://localhost:8080/api/user-info/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          console.error("Failed to create user info");
          return;
        }

        console.log("User info created");
        return;
      }

      const res = await fetch("http://localhost:8080/api/user-info/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        console.error("Failed to update user info");
      } else {
        console.log("User info updated");
      }
    } catch (error) {
      console.error("An error occurred while submitting user info:", error);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userInfo?.name || "",
      income: userInfo?.income || 0,
      savings_goal: userInfo?.savings_goal || 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <Input type="number" {...field} />
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
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                Your monthly savings goal in dollars
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
