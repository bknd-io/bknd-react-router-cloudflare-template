import { lazy, Suspense, useSyncExternalStore } from "react";
import { type LoaderFunctionArgs, useLoaderData } from "react-router";

const Admin = lazy(() => import("~/components/Admin.client"));

export const loader = async (args: LoaderFunctionArgs) => {
   const api = args.context.bknd.api;
   return {
      user: api.getUser(),
   };
};

export default function AdminPage() {
   const { user } = useLoaderData<typeof loader>();
   // derived from https://github.com/sergiodxa/remix-utils
   const hydrated = useSyncExternalStore(
      // @ts-ignore
      () => {},
      () => true,
      () => false
   );
   if (!hydrated) return null;

   return (
      <Suspense>
         <Admin
            withProvider={{ user: user ?? undefined }}
            config={{ basepath: "/admin", logo_return_path: "/../" }}
         />
      </Suspense>
   );
}
