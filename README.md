# bknd starter: React Router

A minimal React Router project with bknd & Cloudflare integration. Note that adding the bknd routes for the API and Admin are optional. Those could also be served from `app/worker.ts` directly.

This project uses Vite's Environment API, therefore bknd types generation does not work (yet).

## Project Structure

Inside of your React Router project, you'll see the following folders and files:

```text
/
├── public/
├── app/
│   ├── root.tsx
│   └── routes/
│       ├── _index.tsx
│       ├── admin.$.tsx
│       └── api.$.tsx
└── package.json
```

To update `bknd` config, check `bknd.config.ts`.

## Commands

All commands are run from the root of the project, from a terminal:

| Command         | Action                                      |
| :-------------- | :------------------------------------------ |
| `npm install`   | Installs dependencies                       |
| `npm run dev`   | Starts local dev server at `localhost:5173` |
| `npm run build` | Build your production site                  |

## Want to learn more?

Feel free to check [our documentation](https://docs.bknd.io/integration/remix) or jump into our [Discord server](https://discord.gg/952SFk8Tb8).
