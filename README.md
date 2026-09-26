# Sociality

[![CI](https://github.com/Yusuf-98/social-media-app-by-yusuf/actions/workflows/ci.yml/badge.svg)](https://github.com/Yusuf-98/social-media-app-by-yusuf/actions/workflows/ci.yml)

A full-stack-consuming social media app built with Next.js — feed, posts, comments,
likes, saves, follows, and profiles, backed by a REST API.

**Live demo:** [social-media-app-by-yusuf.vercel.app](https://social-media-app-by-yusuf.vercel.app/)

<p align="center">
  <img src="docs/screenshots/feed-hero.png" alt="Sociality feed with posts, likes and comments" width="820">
</p>

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green)

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

## Screenshots

| | |
| --- | --- |
| ![Login](docs/screenshots/login.png) | ![Register](docs/screenshots/register.png) |
| **Login** — email/password sign-in | **Register** — create an account |
| ![Feed](docs/screenshots/feed.png) | ![Explore](docs/screenshots/explore.png) |
| **Feed** — posts from people you follow, with likes and comments | **Explore** — public feed for signed-out visitors |
| ![Post detail](docs/screenshots/post-detail.png) | ![Post detail, empty comments](docs/screenshots/post-detail-empty-comments.png) |
| **Post detail** — opens as a modal over the feed | **Post detail** — empty state before the first comment |
| ![Create post](docs/screenshots/create-post.png) | ![My profile](docs/screenshots/my-profile.png) |
| **Create post** — image upload, also opens as a modal | **My profile** — gallery grid with stats |
| ![Empty profile](docs/screenshots/my-profile-empty.png) | ![Edit profile](docs/screenshots/edit-profile.png) |
| **Empty profile** — first-post call to action | **Edit profile** |
| ![Followers](docs/screenshots/followers.png) | ![Following](docs/screenshots/following.png) |
| **Followers** | **Following** |

<p align="center">
  <img src="docs/screenshots/search.png" alt="User search with debounced results" width="400">
</p>

<p align="center"><b>Search</b> — debounced user search</p>

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

Tests live next to the code they cover (`*.test.ts(x)`) and run with Vitest and Testing
Library. They target real interactive logic rather than static markup:

- **Cache patching**: `patchEntityInCache`/`patchPost` across flat, list-wrapped, and
  `InfiniteData` cache shapes.
- **Pagination**: `flattenPages` dedupes items that appear on more than one page by id.
- **Like/save cross-check**: cached liked/saved id lists correctly override a post's own
  `likedByMe`/`savedByMe` flags.
- **Optimistic mutations**: `useLikeToggle` (optimistic update, rollback on error, like
  count never goes negative) and `useComments` (optimistic insert/remove, `commentCount`
  bump/decrement, rollback on error).
- **Auth**: the API client's global 401 handler (only fires when a request actually
  carried a token) and `auth-storage`'s token helpers keeping localStorage, the cookie,
  and Redux in sync.

GitHub Actions runs lint, typecheck, tests, and a production build on every push and
pull request to `main` (see [ci.yml](.github/workflows/ci.yml)).

## Performance

Lighthouse results for the [live site](https://social-media-app-by-yusuf.vercel.app/feed): the median of 10 mobile and 6 desktop runs on 26 September 2026 (Lighthouse 13.5.0).

| | 📱 Mobile | 🖥️ Desktop |
| --- | :---: | :---: |
| **Performance** | **92** | **100** |
| **Accessibility** | **100** | **100** |
| **Best practices** | **100** | **100** |
| **SEO** | **100** | **100** |

Mobile performance ranged from 89 to 95 across the 10 runs (median 92); desktop from 99 to 100.

### Core metrics

| Metric | 📱 Mobile | 🖥️ Desktop | Good if |
| --- | :---: | :---: | :---: |
| **Largest Contentful Paint** (main content visible) | 🟠 2.6 s | 🟢 0.6 s | ≤ 2.5 s |
| **Total Blocking Time** (page unresponsive) | 🟠 248 ms | 🟢 11 ms | ≤ 200 ms |
| **Cumulative Layout Shift** (content jumping) | 🟢 0 | 🟢 0.01 | ≤ 0.1 |
| **Speed Index** (how fast it fills in) | 🟢 1.3 s | 🟢 0.6 s | ≤ 3.4 s |
| **First Contentful Paint** (first pixels) | 🟢 1.0 s | 🟢 0.4 s | ≤ 1.8 s |
| **Page weight** (feed, compressed) | 485 KiB | 452 KiB | |

🟢 within Google's "good" range · 🟠 needs improvement

Total Blocking Time is the metric that moves most between runs (141 to 330 ms on mobile): the largest share is React's own start-up work on a CPU slowed down 4×.

### What "mobile" means in this test

The mobile test does not simply run on a fast laptop. Lighthouse slows the machine down to imitate a mid-range phone on a weak connection:

- **Device**: a Moto G Power (2022), 412 × 823 px screen at 1.75× pixel density.
- **Network**: simulated slow 4G, about **1.6 Mbps** download with **150 ms** of round-trip latency.
- **CPU**: slowed down **4×**, so JavaScript takes four times as long to run as it does on the laptop.

The desktop test uses a 1350 × 940 px screen, 10 Mbps, 40 ms latency and no CPU slowdown.

Run it yourself with [PageSpeed Insights](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fsocial-media-app-by-yusuf.vercel.app%2Ffeed&form_factor=mobile) or `npx lighthouse https://social-media-app-by-yusuf.vercel.app/feed --form-factor=mobile`. A single run can move by a few points with network conditions, which is why the figures above are medians.

### How it stays fast

- **Server-rendered first paint**: route pages are thin Server Component shells. `/feed` is statically generated and revalidated every minute; its first page of posts is fetched on the server and hydrated into TanStack Query, so the first post image is already in the initial HTML, preloaded with `fetchpriority="high"`. That data is trusted for ten minutes, so the client does not ask for it again while the page loads.
- **No flash for signed-in users**: when the token cookie is present, `proxy.ts` rewrites `/feed` to a static skeleton-only variant. Signed-in visitors never see public posts appear and vanish, and no image is downloaded twice.
- **Skeletons have the exact box model** of the post card they stand in for (header, image, actions and caption rows), so nothing shifts when data arrives.
- **Images** are served from Cloudinary through `next/image` in AVIF or WebP with responsive `sizes`. The first image loads eagerly with a high priority and the rest are lazy; each post image keeps its own aspect ratio instead of being cropped, so there is no reflow when it loads. Avatars or images hosted elsewhere are shown as they are instead of failing.
- **Fonts**: SF Pro is converted to WOFF2 and subset to ASCII and common punctuation (kerning and tracking kept), about 87 KB for all eight files. Only the body family is preloaded, and `font-display: swap` with size-adjusted fallbacks keeps text from shifting.
- **JavaScript on demand**: the share and likes dialogs load when they are first opened (or on hover or focus, or after eight idle seconds), and the profile menu loads only for signed-in visitors. Links prefetch on hover, focus or touch instead of as they scroll into view, so opening the feed does not fire a burst of background requests.
- **Pagination**: the feed loads three posts at a time and asks for the next page 800 px before the reader reaches the end, so new posts are ready before they are needed.
- **Caching and requests**: hashed assets are served as immutable and Brotli-compressed, query results are cached for 30 seconds, 4xx answers are not retried, and search is debounced.

## API

The app talks to a separate REST API. It has no published OpenAPI/Swagger document, so
the contract this frontend relies on is summarized here.

- **Envelope**: every response is `{ success, message, data }`. The API client
  (`src/lib/api/client.ts`) unwraps `data` and turns `success: false` into an
  `ApiError` carrying the HTTP status.
- **Auth**: `POST /api/auth/login` and `POST /api/auth/register` return `{ token, user }`.
  The token is sent as `Authorization: Bearer <token>`. A `401` on an authenticated
  request clears the session and redirects to login.
- **Pagination**: list endpoints take `page` and `limit` query params.

| Area | Endpoints used |
| --- | --- |
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Feed | `GET /api/feed`, `GET /api/posts` (explore) |
| Posts | `POST /api/posts`, `GET /api/posts/:id`, `DELETE /api/posts/:id` |
| Likes | `POST`/`DELETE /api/posts/:id/like`, `GET /api/posts/:id/likes`, `GET /api/me/likes` |
| Comments | `GET`/`POST /api/posts/:id/comments`, `DELETE /api/comments/:id` |
| Follow | `POST`/`DELETE /api/follow/:username`, `GET /api/me/followers`, `GET /api/me/following` |
| Saves | `POST`/`DELETE /api/posts/:id/save`, `GET /api/me/saved` |
| Profile | `GET`/`PATCH /api/me`, `GET /api/users/:username`, `GET /api/users/search` |

## Project structure

```
src/
├── app/            # Routes (App Router) — Server Components by default,
│                   # interactive pieces delegated to client components
├── components/     # UI components, grouped by feature (post, profile, comment, ...)
├── hooks/          # TanStack Query hooks, grouped by feature
├── lib/
│   ├── api/        # API client + one file per resource
│   └── ...         # Cache patching, query keys, pagination, utils
├── store/          # Redux slice (auth token + hydration flag only)
├── types/          # Shared API types
└── proxy.ts        # Server-side route guard (Next's middleware convention)
```

## Deployment

Deployed on [Vercel](https://vercel.com), auto-deploying `main`. `NEXT_PUBLIC_API_BASE_URL`
is configured as a project environment variable there.

## Author

Built by [Yusuf AR](https://github.com/Yusuf-98).

## License

Licensed under the [MIT License](LICENSE).
