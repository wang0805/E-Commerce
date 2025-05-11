"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; //we already added <Toaster/> in Rootlayout
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema } from "../../schema";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
// const formSchema = z.object({
//   email: z.string().email(),
// ...
// });

const poppins = Poppins({ subsets: ["latin"], weight: ["700"] });

export const SignInView = () => {
  const router = useRouter();

  // Using manual code (Local API)//
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const login = useMutation(
    trpc.auth.login.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: async () => {
        // invalidate session query, make sure session is refreshed once we logged in
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
        toast.success("User logged in successfully");
        router.push("/");
      },
    })
  );

  // using RESTAPI from payload docs
  // const login = useMutation({
  //   mutationFn: async (values: z.infer<typeof loginSchema>) => {
  //     const response = await fetch("/api/users/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(values),
  //     });
  //     if (!response.ok) {
  //       const error = await response.json();
  //       throw new Error(error.message || "Failed to login");
  //     }
  //     return response.json();
  //   },
  //   onError: (error) => {
  //     toast.error(error.message);
  //   },
  //   onSuccess: () => {
  //     toast.success("User logged in successfully");
  //     router.push("/");
  //   },
  // });

  const form = useForm<z.infer<typeof loginSchema>>({
    mode: "all", //show validation errors on every change
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    login.mutate(values);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      <div className="bg-[#F4F4F0] h-screen w-full lg:col-span-3 overflow-y-auto">
        {/* Form Column */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8 p-4 lg:p-16"
          >
            {/* form.handlesubmit handles the validation of the formschema */}
            <div className="flex items-center justify-between mb-8">
              <Link href="/">
                <span
                  className={cn("text-2xl font-semibold", poppins.className)}
                >
                  funroad
                </span>
              </Link>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-base border-none underline"
              >
                <Link prefetch href="/sign-up">
                  Sign Up
                </Link>
              </Button>
            </div>
            <h1 className="text-4xl font-medium">Welcome back to Funroad</h1>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                    {/* {...field adds all the onchange, onblur, etc. to the input automatically all at once} */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" {...field} type="password" />
                    {/* {...field adds all the onchange, onblur, etc. to the input automatically all at once} */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={login.isPending}
              type="submit"
              size="lg"
              className="bg-black text-white hover:bg-pink-400 hover:text-primary"
              variant="elevated"
            >
              Log In
            </Button>
          </form>
        </Form>
      </div>
      <div
        className="h-screen w-full lg:col-span-2 hidden lg:block"
        style={{
          backgroundImage: "url('/auth-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Background Column */}
      </div>
    </div>
  );
};
