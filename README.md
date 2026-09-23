# Sociality

[![CI](https://github.com/Yusuf-98/social-media-app-by-yusuf/actions/workflows/ci.yml/badge.svg)](https://github.com/Yusuf-98/social-media-app-by-yusuf/actions/workflows/ci.yml)

A full-stack-consuming social media app built with Next.js — feed, posts, comments,
likes, saves, follows, and profiles, backed by a REST API.

**Live demo:** [social-media-app-by-yusuf.vercel.app](https://social-media-app-by-yusuf.vercel.app/)

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query) for server state (feed, posts, comments,
  likes, saves, follows)
- [Redux Toolkit](https://redux-toolkit.js.org) for auth/session state only
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) for form
  validation
- [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) for
  unit/integration tests

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables — copy `.env.example` to `.env.local` and fill it in:

   ```bash
   cp .env.example .env.local
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the codebase |
| `npm run test` | Run the test suite |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting without writing |

## Testing

Unit and integration tests run on [Vitest](https://vitest.dev) +
[Testing Library](https://testing-library.com), co-located with the code they cover
(`*.test.ts(x)`). They target real interactive logic — optimistic mutations and
rollback, cache patching, auth token handling — rather than static markup.

```bash
npm run test
```

CI runs lint, typecheck, tests, and a production build on every push and pull request
to `main` (see `.github/workflows/ci.yml`).

## Features

- Email/password auth (register, login, logout) with a global session guard that clears
  state and redirects to login on an expired/invalid token
- Feed (authenticated) and Explore (public) post streams with infinite scroll
- Post detail — opened as a modal over the feed or as its own page when shared directly
  — with comments, like, save, share, and owner-only delete
- Create post with image upload, also available as a modal or its own page
- Public and private profile pages, with dedicated `Posts`, `Saved`, and `Likes` routes
  on your own profile, plus a `Settings` panel for account info and logout
- Followers/following lists, follow/unfollow
- User search
- Optimistic updates (with rollback) for like, save, follow, and comment actions

## Project structure

```
src/
  app/            Routes (App Router) — Server Components by default,
                  interactive pieces delegated to client components
  components/     UI components, grouped by feature (post, profile, comment, ...)
  hooks/          TanStack Query hooks, grouped by feature
  lib/api/        API client + one file per resource
  lib/            Shared utilities (cache patching, query keys, pagination, ...)
  store/          Redux slice (auth token + hydration flag only)
  types/          Shared API types
  proxy.ts        Server-side route guard (Next's middleware convention)
```

## Architecture notes

- Server state (feed, posts, comments, likes, saves, follows) lives in TanStack Query;
  Redux only holds the auth token and hydration flag.
- Query keys are centralized in `src/lib/queryKeys.ts` via a typed factory (`qk`) to
  keep cache invalidation consistent and typo-proof.
- Route protection is enforced server-side in `src/proxy.ts` (Next's middleware
  convention) in addition to client-side auth checks.
- Pages that don't need client interactivity for their initial render are Server
  Components (with `generateMetadata` for post detail and profile pages); interactive
  pieces are split into client child components.

## Deployment

Deployed on [Vercel](https://vercel.com), auto-deploying `main`. `NEXT_PUBLIC_API_BASE_URL`
is configured as a project environment variable there.

## Known limitations

- No end-to-end/browser test coverage yet — the test suite covers cache utilities, data
  hooks, and the auth/401 flow.
- Response shapes for a few endpoints are normalized at the API-client boundary
  (`src/lib/api/`) to paper over inconsistencies in the upstream API rather than being
  fixed at the source.
