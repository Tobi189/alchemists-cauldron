# Alchemist's Cauldron

Alchemist's Cauldron is a browser-based potion-brewing game developed for the
[RS School JavaScript/Front-end Short Track](https://rs.school/docs/short-track/course-overview).

The player combines ingredients to bring Temperature, Density and Magic Power into a recipe's
target ranges before time, lives or ingredient stock runs out.

## Task

- [Official task requirements](https://github.com/rolling-scopes-school/qualifying-stage/blob/main/tasks/game-alchemists-cauldron/README.md)
- Target score: **393 points**
- Supported browser: latest Google Chrome
- Supported viewport width: **375px–1920px**

## Current implementation

The project is currently in its technical-foundation stage.

Implemented:

- [x] Vite development and production build
- [x] Strict TypeScript configuration
- [x] ESLint and Prettier
- [x] Husky commit-message and pre-push hooks
- [x] Organized source-code structure
- [x] Pull request template

Planned:

- [ ] Level 1 — complete basic game
- [ ] Level 2 — difficulty selection, saving and continuing
- [ ] Level 3 — advanced controls, reactions and visual feedback
- [ ] GitHub Pages deployment

This section will be updated as each story is completed.

## Game overview

A game begins with a randomly selected recipe and a shelf of ingredients. Every ingredient changes
three cauldron parameters:

- Temperature
- Density
- Magic Power

Each ingredient has limited randomly generated stock. The player adds ingredients to the cauldron
and attempts to move all three parameter values into the active recipe's target ranges.

A successful brew awards points and a time bonus. A failed brew removes one life. The game ends
when time expires, all lives are lost, or no ingredients remain.

## Planned levels

| Level        | Functionality                                                       | Total score |
| ------------ | ------------------------------------------------------------------- | ----------: |
| Precondition | Repository, tooling and project structure                           |          58 |
| Level 1      | Basic Medium-difficulty game                                        |         228 |
| Level 2      | Difficulty selection, auto-save and Continue Game                   |         278 |
| Level 3      | Drag and drop, reactions, tooltips, Pour Out, shortcuts and effects |         393 |

## Technology

- TypeScript
- Vite
- SCSS
- HTML
- CSS
- ESLint
- Prettier
- Husky

The game uses no front-end framework, CSS framework or game engine.

## Project structure

```text
.github/
  pull_request_template.md
.husky/
  commit-msg
  pre-push
scripts/
  validate-commit-message.mjs
src/
  assets/
  data/
  logic/
  state/
  storage/
  styles/
    main.scss
  ui/
    app.ts
  main.ts
index.html
```

The main responsibilities are separated as follows:

- `data` contains fixed game catalogues and configuration.
- `logic` contains game rules and calculations without DOM rendering.
- `state` contains the current game state and state transitions.
- `storage` contains safe persistence and leaderboard helpers.
- `ui` contains DOM rendering and browser event handling.
- `styles` contains the responsive layout and visual effects.
- `assets` contains individual visual assets used by the game.

## Running locally

Requirements:

- Node.js
- npm

Clone the repository and install dependencies:

```bash
git clone git@github.com:Tobi189/alchemists-cauldron.git
cd alchemists-cauldron
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Quality checks

Run all configured checks:

```bash
npm run check
```

Individual commands:

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
```

Apply automatic formatting:

```bash
npm run format
```

The pre-push hook runs ESLint and the Prettier check. The commit-message hook validates commit
messages against the configured RS School-style convention.

## Development workflow

Development uses cumulative story branches:

- `story-1` is based on `main`.
- `story-2` will be based on `story-1`.
- `story-3` will be based on `story-2`.
- Small task branches are merged into the current story branch.
- Final story pull requests target the preceding story branch and remain unmerged for Cross-Check.

## Author

[Tobi189](https://github.com/Tobi189)
