import { devFsWrite, type CloudflareBkndConfig } from "bknd/adapter/cloudflare";
import { syncConfig, syncSecrets, syncTypes } from "bknd/plugins";

// @ts-ignore prettier-ignore
import appConfig from "./appconfig.json" with { type: "json" };

export default {
   app: (env) => {
      // make sure to have `ENVIRONMENT` set, to determine the mode
      const prod = env.ENVIRONMENT !== "development";
      return {
         // in production mode, we use the appconfig.json file as static config
         // in development, we use it as initial config
         config: appConfig as any,
         options: {
            // switch between code and db mode based on the environment
            mode: prod ? "code" : "db",
            manager: {
               // injecting the secrets from the environment
               // this is specifically required for the production mode
               // make sure to have all secrets properly set in the environment
               secrets: env,
            },
            plugins: [
               syncConfig({
                  enabled: !prod,
                  write: async (config) => {
                     await devFsWrite(
                        "appconfig.json",
                        JSON.stringify(config, null, 2)
                     );
                  },
               }),
               syncTypes({
                  enabled: !prod,
                  write: async (et) => {
                     await devFsWrite("bknd-types.d.ts", et.toString());
                  },
               }),
               // sync an .env.example file (template without secrets)
               syncSecrets({
                  enabled: !prod,
                  write: async (secrets) => {
                     await devFsWrite(
                        ".env.example",
                        Object.entries(secrets)
                           .map(([key, value]) => `${key}=${value}`)
                           .join("\n")
                     );
                  },
               }),
            ],
         },
      };
   },
} satisfies CloudflareBkndConfig<Env>;
