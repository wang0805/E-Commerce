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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerSchema } from "../../schema";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
// const formSchema = z.object({
//   email: z.string().email(),
// ...
// });

const poppins = Poppins({ subsets: ["latin"], weight: ["700"] });

export const SignUpView = () => {
  const router = useRouter();

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const register = useMutation(
    trpc.auth.register.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
        toast.success("User registered successfully");
        router.push("/");
      },
    })
  );

  const form = useForm<z.infer<typeof registerSchema>>({
    mode: "all", //show validation errors on every change
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    register.mutate(values);
  };

  //actively observe the username field to update the formdescription
  const username = form.watch("username");
  const usernameError = form.formState.errors.username;
  const showPreview = username && !usernameError;

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
                <Link prefetch href="/sign-in">
                  Sign In
                </Link>
              </Button>
            </div>
            <h1 className="text-4xl font-medium">
              Join over 1,000 creators earning money on Funroad
            </h1>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                    {/* {...field adds all the onchange, onblur, etc. to the input automatically all at once} */}
                  </FormControl>
                  <FormDescription
                    className={cn("hidden", showPreview && "block")}
                  >
                    Your store will be available at&nbsp;
                    {/* TODO: use proper method to update the real preview URL */}
                    <strong>{username}</strong>
                  </FormDescription>
                  <FormMessage /> {/* show error message */}
                </FormItem>
              )}
            />
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
              disabled={register.isPending}
              type="submit"
              size="lg"
              className="bg-black text-white hover:bg-pink-400 hover:text-primary"
              variant="elevated"
            >
              Create Account
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
