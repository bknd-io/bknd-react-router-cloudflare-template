import type { Route } from "./+types/_index";
import {
   type ActionFunctionArgs,
   type LoaderFunctionArgs,
   useFetcher,
   useLoaderData,
} from "react-router";

// biome-ignore lint/correctness/noEmptyPattern: <explanation>
export function meta({}: Route.MetaArgs) {
   return [
      { title: "New bknd React Router App" },
      { name: "description", content: "Welcome to bknd & React Router!" },
   ];
}

export const loader = async (args: LoaderFunctionArgs) => {
   const api = args.context.bknd.api;

   const limit = 5;
   const {
      data: todos,
      body: { meta },
   } = await api.data.readMany("todos", {
      limit,
      sort: "-id",
   });

   return {
      todos: todos.reverse(),
      limit,
      user: api.getUser(),
   };
};

export default function Index() {
   const { todos, limit, user } = useLoaderData<typeof loader>();
   const fetcher = useFetcher();

   return (
      <div className="flex h-screen items-center justify-center">
         <div className="flex flex-col items-center gap-16">
            <header className="flex flex-col items-center gap-9">
               <img
                  src="/bknd.svg"
                  alt="bknd"
                  className="block w-48 dark:invert"
               />
               <div className="h-[144px] w-96">
                  <img
                     src="/logo-light.svg"
                     alt="React Router"
                     className="block w-full dark:hidden"
                  />
                  <img
                     src="/logo-dark.svg"
                     alt="React Router"
                     className="hidden w-full dark:block"
                  />
               </div>
            </header>
            <nav className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
               <p className="leading-6 text-gray-700 dark:text-gray-200 font-bold">
                  What&apos;s next?
               </p>
               <div className="flex flex-col w-full gap-2">
                  {todos.map((todo: any) => (
                     <div className="flex flex-row" key={String(todo.id)}>
                        <fetcher.Form
                           className="flex flex-row flex-grow items-center gap-3 ml-1"
                           method="post"
                        >
                           <input
                              type="checkbox"
                              name="done"
                              defaultChecked={todo.done}
                              onChange={(e) =>
                                 fetcher.submit(e.currentTarget.form!)
                              }
                           />
                           <input type="hidden" name="action" value="update" />
                           <input
                              type="hidden"
                              name="id"
                              value={String(todo.id)}
                           />
                           <div className="dark:text-gray-300 text-gray-800">
                              {todo.title}
                           </div>
                        </fetcher.Form>
                        <fetcher.Form
                           className="flex items-center"
                           method="post"
                        >
                           <input type="hidden" name="action" value="delete" />
                           <input
                              type="hidden"
                              name="id"
                              value={String(todo.id)}
                           />
                           <button
                              type="submit"
                              className="cursor-pointer grayscale transition-all hover:grayscale-0 text-xs "
                           >
                              ❌
                           </button>
                        </fetcher.Form>
                     </div>
                  ))}
                  <fetcher.Form
                     className="flex flex-row gap-3 mt-2"
                     method="post"
                     key={todos.map((t: any) => t.id).join()}
                  >
                     <input
                        type="text"
                        name="title"
                        placeholder="New todo"
                        className="py-2 px-4 rounded-xl bg-black/5 dark:bg-white/10"
                     />
                     <input type="hidden" name="action" value="add" />
                     <button type="submit" className="cursor-pointer">
                        Add
                     </button>
                  </fetcher.Form>
               </div>
            </nav>
            <div className="flex flex-col items-center gap-4">
               <a href="/admin">Go to Admin ➝</a>
               <div className="opacity-50 text-xs">
                  {user ? (
                     <p>
                        Authenticated as <b>{user.email}</b>
                     </p>
                  ) : (
                     <a href="/admin/auth/login">Login</a>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}

export const action = async (args: ActionFunctionArgs) => {
   const api = args.context.bknd.api;
   const formData = await args.request.formData();
   const action = formData.get("action") as string;

   switch (action) {
      case "update": {
         const id = Number(formData.get("id"));
         const done = formData.get("done") === "on";

         if (id > 0) {
            await api.data.updateOne("todos", id, { done });
         }
         break;
      }
      case "add": {
         const title = formData.get("title") as string;

         if (title.length > 0) {
            await api.data.createOne("todos", { title });
         }
         break;
      }
      case "delete": {
         const id = Number(formData.get("id"));

         if (id > 0) {
            await api.data.deleteOne("todos", id);
         }
         break;
      }
   }

   return null;
};
