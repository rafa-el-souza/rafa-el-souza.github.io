# rafasouza.dev.br

The landing page of Rafa Souza, backend developer: six full-screen levels
shown one at a time, in Portuguese, English and Spanish, in a light and a
dark theme, static on GitHub Pages. This repository holds its source, its
design and its decisions.

The site answers at <https://rafasouza.dev.br>.

## What it is for

Someone who is hiring gives a page like this thirty seconds; the engineer
who decides the hire gives it three minutes. The first level answers the
first reader without scrolling: who, what, where, the CV, a way to write.
The levels below hold the evidence for the second: two projects with live
sites ([Balcão](https://github.com/rafa-el-souza/balcao) and
[Pendulum](https://github.com/rafa-el-souza/pendulum)), how the work is
done, the path so far.

## How it is built

TypeScript with no UI framework and no runtime dependency; Vite; the HTML
of each language made at build time, from templates and one content module
per language, so that the page reads without JavaScript. In Claude Code
sessions, following [`CLAUDE.md`](CLAUDE.md): each slice of work is one
pull request, merged once CI is green. CI runs the types, the lint, the
unit tests and every journey in three browser engines, and scans every
commit for secrets; on `main`, once all of it passes, it publishes the
tested build to GitHub Pages.

Read, in this order:

1. [`docs/design.md`](docs/design.md): the readers, the numbered
   requirements with their acceptance scenarios, the budgets, security and
   privacy, the delivery plan.
2. [`docs/decisions.md`](docs/decisions.md): each decision with its reason,
   and what is still open.
3. [`docs/design-brief.md`](docs/design-brief.md): what the design has to
   solve, the three directions to draw first, and the list of things it
   must not look like.

## Status

Design written (2026-11-18). Built and published: the toolchain, CI and
the sober page, a plain page in the three languages that the domain serves
until launch (`docs/design.md`, FR-24). Next, in `docs/design.md` §9: the design, drawn
level by level and seen before it is built; a motion prototype tried on
real devices; the build and its hardening at a preview address; launch.

## Running the checks

Node, at the version in [`.nvmrc`](.nvmrc), then `npm ci` (no install
script runs: [`.npmrc`](.npmrc)). Each check is a script:

| Script | What it does |
|---|---|
| `npm run typecheck` | the type check, which also holds the three languages to one shape |
| `npm run lint` | ESLint, with no warning allowed |
| `npm run format:check` | Prettier, over everything but the documents |
| `npm test` | the unit tests, among them those that read a build of the site: its tags, its policy, its weight |
| `npm run build` | the site, into `dist/` |
| `npm run e2e` | every journey in Chromium, Firefox and WebKit, against the build served as GitHub Pages serves it; `npm run e2e:browsers` installs the engines |
| `npm run images` | redraws the preview images in `public/og/`, in Chromium |

Once per clone, `git config core.hooksPath .githooks` turns on the
pre-commit hook, which scans the staged changes with gitleaks and lints
staged workflows with actionlint.

## Licence

The code is under the MIT licence ([`LICENSE`](LICENSE)). The texts, the CV
files and the visual identity are not licensed for reuse: all rights
reserved (`docs/decisions.md`, decision 10).
