# rafasouza.dev.br

The landing page of Rafa Souza, backend developer: six full-screen levels
shown one at a time, in Portuguese, English and Spanish, in a light and a
dark theme, static on GitHub Pages. This repository holds its design and
its decisions; its source arrives with the first slice of work.

The site will answer at <https://rafasouza.dev.br>.

## What it is for

Someone who is hiring gives a page like this thirty seconds; the engineer
who decides the hire gives it three minutes. The first level answers the
first reader without scrolling: who, what, where, the CV, a way to write.
The levels below hold the evidence for the second: two projects with live
sites ([Balcão](https://github.com/rafa-el-souza/balcao) and
[Pendulum](https://github.com/rafa-el-souza/pendulum)), how the work is
done, the path so far.

## How it will be built

TypeScript with no UI framework and no runtime dependency; Vite; the HTML
of each language made at build time, so that the page reads without
JavaScript. In Claude Code sessions, following [`CLAUDE.md`](CLAUDE.md):
each slice of work is one pull request, merged once CI is green. CI will
run the types, the lint, the unit tests and every journey in three browser
engines, and scan every commit for secrets; on `main`, once all of it
passes, it will publish the tested build.

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

Design written (2026-11-18). Nothing is built yet. The plan, in
`docs/design.md` §9: a sober page first, so that the domain answers; then
the design, drawn level by level and seen before it is built; a motion
prototype tried on real devices; the build and its hardening at a preview
address; launch.

## Running the checks

To be written with the first slice: Node, `npm ci`, and the scripts for the
type check, the lint, the unit tests, the build and the browser journeys.

## Licence

The code is under the MIT licence ([`LICENSE`](LICENSE)). The licence of
the texts, the CV files and the visual identity is still to be decided
(`docs/design.md`, OD-2); until it is, they are not licensed for reuse.
