import type { App } from "bknd";
import { getFresh } from "bknd/adapter/cloudflare";
import type { Api } from "bknd/client";
import { createRequestHandler } from "react-router";
import config from "../config";

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

export default {
   async fetch(request: Request, env: Env, ctx: ExecutionContext) {
      const app = await getFresh(config, { env, ctx, request });
      const api = app.getApi({ headers: request.headers });
      await api.verifyAuth();

      return requestHandler(request, {
         bknd: { app, api },
         cloudflare: { env, ctx },
      });
   },
} satisfies ExportedHandler<Env>;
