import { boolean, em, entity, text } from "bknd";
import { secureRandomString } from "bknd/utils";
import {
   d1,
   devFsWrite,
   type CloudflareBkndConfig,
} from "bknd/adapter/cloudflare";
import { syncTypes } from "bknd/plugins";

const schema = em({
   todos: entity("todos", {
      title: text(),
      done: boolean(),
   }),
});

export default {
   app: (env) => ({
      connection: d1({
         binding: env.DB,
      }),
      // an initial config is only applied if the database is empty
      initialConfig: {
         data: schema.toJSON(),
         // we're enabling auth ...
         auth: {
            enabled: true,
            jwt: {
               issuer: "bknd-remix-example",
               secret: env.SECRET ?? secureRandomString(64),
            },
         },
      },
   }),
   mode: "warm",
   options: {
      plugins: [
         syncTypes({
            write: async (et) => {
               try {
                  await devFsWrite("bknd-types.d.ts", et.toString());
               } catch (error) {
                  console.error("-- error types error", String(error));
               }
            },
         }),
      ],

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
