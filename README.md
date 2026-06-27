# 🍃 Matcha

A memory-match (pairs) game with a bright, playful "Curiosity Carnival" visual style — built as a frontend portfolio project to demonstrate React, TypeScript, state management, responsive layout, async data fetching, and accessibility.

🔗 **Live demo:** https://matcha-two-topaz.vercel.app/ <!-- TODO: replace with your actual deployed URL -->

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Build tool | **Vite** | Fast dev server + bundler, minimal config |
| UI library | **React 18** | Component model + hooks for game state |
| Language | **TypeScript** | Type-safe game state (cards, themes, difficulty) |
| Styling | **Plain CSS** (custom properties, keyframe animations, CSS Grid) | Full control over the custom "Curiosity Carnival" theme and animations — no CSS framework dependency |
| Fonts | **Baloo 2** (display) + **Quicksand** (body) via Google Fonts | Rounded, playful typography fitting a kids' game |
| Persistence | **Web Storage API** (`localStorage`) | Per-browser best-score tracking — no backend needed |
| State management | **React `useState`** | Sufficient for a single-page game of this scope |

No backend or database — this is a fully static, client-side app, deployed as static files.

## Live Data Sources (no hardcoded images)

Each theme pulls real images from a public API at runtime rather than bundling static assets:

| Theme | API | Auth | What it returns |
|---|---|---|---|
| **Pokémon** | [PokeAPI sprite repository](https://github.com/PokeAPI/sprites) | None | Official sprite images by Pokémon ID |
| **Juices** | [TheCocktailDB](https://www.thecocktaildb.com/api.php) (`Non_Alcoholic` filter) | Shared dev/test key | Mocktail, smoothie, and juice-style drink photos |
| **World Food** | [TheMealDB](https://www.themealdb.com/api.php) (`Dessert` category) | Shared dev/test key | Dessert dish photos from around the world |

Each theme's data is fetched once per browser session and cached in memory — switching difficulty afterward doesn't re-fetch.

## Features

- **3 themes**, chosen before play begins, each backed by a live API
- **3 difficulty levels** — Easy (4×4), Medium (6×6), Hard (8×8) — always a perfect square board
- **No-scroll responsive board**: a custom `useSquareSize` hook (built on `ResizeObserver`) measures available space and renders the largest square grid that fits, on any screen size
- **Async loading states**: a spinner while a theme's images load, with a friendly retry option if a fetch fails
- **Move counter + stopwatch**, with best score saved per theme + difficulty combination via `localStorage`
- **3D card-flip animation** with a bouncy easing curve, and a two-point "sparkle pop" animation on every successful match
- **Animated title entrance** on the first screen (flies in, spins, settles)
- **Accessible by default**: real `<button>` elements for cards, `aria-label` / `aria-pressed`, visible keyboard focus rings, and full `prefers-reduced-motion` support
- **Graceful image fallbacks**: a placeholder icon renders if any external image fails to load, instead of a broken-image icon

## Getting Started

```bash
npm install
npm run dev
```

Open the local URL Vite prints (typically `http://localhost:5173`).

### Other scripts

```bash
npm run build      # production build, type-checked
npm run preview    # preview the production build locally
```

## Project Structure

```
src/
  types.ts                  # Shared TypeScript types (Theme, Difficulty, Stage, CardData)
  themes.ts                  # Per-theme API fetchers, in-memory cache, theme metadata
  data.ts                    # Deck creation, shuffle, and difficulty config
  hooks/
    useBestScore.ts           # localStorage-backed best score, keyed by theme + difficulty
    useSquareSize.ts           # ResizeObserver-based square-board sizing
  components/
    Card.tsx
    Board.tsx
    StatsBar.tsx
    ThemeSelect.tsx
    DifficultySelect.tsx
    WinModal.tsx
  App.tsx                    # Stage flow: theme select -> difficulty select -> loading -> playing
  index.css                  # Design tokens + full visual theme
```

## Architecture Notes

- **Theme system**: every theme-aware piece of data (icons, labels, preview images) is keyed by a single `Record<Theme, ...>` map. Adding, removing, or renaming a theme only touches `themes.ts` and `types.ts` — no other file needs to know a theme changed.
- **Deck creation is async**: `createDeck()` awaits the theme's fetched icon list before building the shuffled deck, so the app has an explicit `"loading"` stage rather than rendering an empty board while data is in flight.
- **Square board sizing**: instead of fixed card dimensions, the board fills exactly the space available via a callback ref + `ResizeObserver`, then CSS Grid (`fr` units) divides that space evenly — so 16 cards and 64 cards both fit the same screen without scrolling.

## Known Tradeoffs

- **No backend** — best scores are per-browser, not a shared/global leaderboard.
- **`useState` over `useReducer`** — fine at this scale; would reconsider for a more complex state machine.
- **No automated tests yet** — `data.ts` (shuffle/pairing logic) and the match-checking logic in `App.tsx` are the cleanest candidates for unit tests if added later (e.g., with Vitest + React Testing Library).
- **Dependent on 3 external services staying up** — if an API is briefly down, that theme falls back to a placeholder icon rather than crashing, but won't show real images until the service recovers.

## Deployment

Deployed on [Vercel](https://vercel.com), connected directly to this GitHub repo. Every push to `main` triggers an automatic redeploy. No environment variables or secrets are required — none of the APIs used here need a private key.
