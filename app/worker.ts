import type { App } from "bknd";
import { getFresh } from "bknd/adapter/cloudflare";
import type { Api } from "bknd/client";
import { createRequestHandler } from "react-router";
import config from "../config";
import { Hono } from "hono";
import type { AppLoadContext } from "react-router";

declare module "react-router" {
   export interface AppLoadContext {
      bknd: {
         app: App;
         api: Api;
      };
      cloudflare: {
         env: Env;
         ctx: ExecutionContext;
      };
   }
}

const requestHandler = createRequestHandler(
   () => import("virtual:react-router/server-build"),
   import.meta.env.MODE
);

export default new Hono<{
   Bindings: Env;
   Variables: AppLoadContext["bknd"];
}>()
   .use(async (c, next) => {
      const url = new URL(c.req.url);
      const request = c.req.raw;
      const app = await getFresh(config, {
         env: c.env,
         ctx: c.executionCtx,
         request,
      });

      if (url.pathname !== "/") {
         // try bknd api
         const res = await app.fetch(request);
         if (res.status !== 404) {
            return res;
         }
      }

      const api = app.getApi({ headers: request.headers });
      await api.verifyAuth();

      c.set("app", app);
      c.set("api", api);

      await next();
   })
   .all("*", async (c) => {
      return requestHandler(c.req.raw, {
         bknd: { app: c.get("app"), api: c.get("api") },
         cloudflare: { env: c.env, ctx: c.executionCtx },
      });
   });
