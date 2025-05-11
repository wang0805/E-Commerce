import { headers as getHeaders, cookies as getCookies } from "next/headers"; // rename so we have no conflicting names
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { AUTH_COOKIE } from "./constant";
import { registerSchema, loginSchema } from "../schema";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();

    const session = await ctx.db.auth({ headers }); // payload auth

    return session;
  }),

  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      const existingData = await ctx.db.find({
        collection: "users",
        limit: 1,
        where: {
          username: {
            equals: input.username,
          },
        },
      });
      const existingUser = existingData.docs[0];
      if (existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username already exists",
        });
      }
      await ctx.db.create({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
          username: input.username,
        },
      });
      //login after acct registered
      const data = await ctx.db.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        },
      });

      if (!data.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }
      const cookies = await getCookies();
      cookies.set({
        name: AUTH_COOKIE,
        value: data.token,
        httpOnly: true,
        path: "/",
        // TODO: ensure cross-domain cookie sharing
        // funroad.com // initial cookie
        // xxx.funroad.com // cookie does not exist here
        // sameSite: "none",
        // domain: "",
      });
    }),

  login: baseProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    const data = await ctx.db.login({
      collection: "users",
      data: {
        email: input.email,
        password: input.password,
      },
    });

    if (!data.token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid credentials",
      });
    }
    const cookies = await getCookies();
    cookies.set({
      name: AUTH_COOKIE,
      value: data.token,
      httpOnly: true,
      path: "/",
      // TODO: ensure cross-domain cookie sharing
      // funroad.com // initial cookie
      // xxx.funroad.com // cookie does not exist here
      // sameSite: "none",
      // domain: "",
    });

    return data;
  }),

  logout: baseProcedure.mutation(async ({}) => {
    const cookies = await getCookies();
    cookies.delete(AUTH_COOKIE);
  }),
});
