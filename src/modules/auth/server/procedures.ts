import { headers as getHeaders } from "next/headers"; // rename so we have no conflicting names
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { registerSchema, loginSchema } from "../schema";
import { generateAuthCookie } from "../util";

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

      const tenant = await ctx.db.create({
        collection: "tenants",
        data: {
          name: input.username, // user can change this later
          slug: input.username, //username is unique and can be used as slug
          stripeAccountId: "test",
        },
      });

      await ctx.db.create({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
          username: input.username,
          tenants: [
            {
              tenant: tenant.id, //user can have multiple tenants but for this case will just be 1 store per tenant
            },
          ],
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
      //   const cookies = await getCookies();
      //   //set cookies manually (via Local API in docs)
      //   //if using RESTAPI, then cookies are automatically assigned
      //   cookies.set({
      //     name: `${ctx.db.config.cookiePrefix}-token`,
      //     value: data.token,
      //     httpOnly: true,
      //     path: "/",
      //     // TODO: ensure cross-domain cookie sharing
      //     // funroad.com // initial cookie
      //     // xxx.funroad.com // cookie does not exist here
      //     // sameSite: "none",
      //     // domain: "",
      //   });
      await generateAuthCookie({
        prefix: ctx.db.config.cookiePrefix,
        value: data.token,
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
    await generateAuthCookie({
      prefix: ctx.db.config.cookiePrefix,
      value: data.token,
    });

    return data;
  }),
});
