import type { LoaderFunctionArgs } from "react-router";

const handler = async (args: LoaderFunctionArgs) => {
   return args.context.bknd.app.fetch(args.request);
};

export const loader = handler;
export const action = handler;
