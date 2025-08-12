/**
 * This file is completely optional, feel free to remove it.
 */

import { boolean, em, entity, text } from "bknd";
import { secureRandomString } from "bknd/utils";
import { d1, type CloudflareBkndConfig } from "bknd/adapter/cloudflare";

const schema = em({
   todos: entity("todos", {
      title: text(),
      done: boolean(),
   }),
});

// register your schema to get automatic type completion
type Database = (typeof schema)["DB"];
declare module "bknd" {
   interface DB extends Database {}
}

export default {
   app: (env) => ({
      connection: d1({
         binding: env.DB,
      }),
   }),

   // an initial config is only applied if the database is empty
   initialConfig: {
      data: schema.toJSON(),
      // we're enabling auth ...
      auth: {
         enabled: true,
         jwt: {
            issuer: "bknd-remix-example",
            secret: secureRandomString(64),
         },
      },
   },
   options: {
      // the seed option is only executed if the database was empty
      seed: async (ctx) => {
         // create some entries
         await ctx.em.mutator("todos").insertMany([
            { title: "Learn bknd", done: true },
            { title: "Build something cool", done: false },
         ]);

         // and create a user
         await ctx.app.module.auth.createUser({
            email: "test@bknd.io",
            password: "12345678",
         });
      },
   },
} satisfies CloudflareBkndConfig<Env>;
