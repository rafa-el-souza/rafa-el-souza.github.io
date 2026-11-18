# Working in this repository

This site is built in Claude Code sessions. This file holds the rules they
follow here; where other instructions differ, this file applies to this
repository.

## The project

The author's landing page, at the root of his domain: a portfolio piece in
itself. Every tracked file, commit and pull request is written for a reader
assessing the work. Tracked text is in English; the page's own copy is in
three languages and lives in the content files.

## Decisions

- The author decides technologies, formats, constraints, and how anything
  looks, reads or moves. Bring a recommendation and wait for the answer in
  the author's own words; not objecting is not a yes.
- How something looks or moves is decided by seeing it: build the
  recommended option for the author to try, keep the others on record, ask
  afterwards.
- Decisions go into `docs/decisions.md` in the pull request that acts on
  them, with reason and evidence. A changed decision is a new entry that
  names the one it replaces.
- `docs/design.md` is the specification. When it is wrong, say so, change
  it in the same pull request and mention it there; do not drift from it
  silently.

## Copy

- Every string a visitor reads comes from the content files, and the
  content files come from the author. Do not write, reword, shorten or
  translate copy. If a text does not fit, ask for another.
- Nothing a visitor can read reaches this repository before the author has
  approved it.

## Slices and pull requests

- One pull request per slice, on a branch from `main`. Commit each coherent
  piece as soon as it is done and green.
- Commit subjects: `type(scope): what now exists, as a sentence` (`feat`,
  `fix`, `docs`, `test`, `build`, `ci`, `chore`, `refactor`). No co-author
  trailers.
- Pull request bodies follow `.github/pull_request_template.md`.
- A session merges its own pull request once CI is green, with a merge
  commit, and never merges red.
- A change of CSS alone is reviewed by looking and measuring: pictures at
  360 and 1280 px wide, in the three languages and both themes, and the
  contrast computed.
- Automated code review runs only on changes the author names, or on a
  change a session judges critical and proposes for review (what, how, at
  what cost) once the author approves.

## Tests

- Test first where an answer can be checked: the parity of the languages,
  the character budgets, the contrast of the tokens, the weight of the
  build, which level an address opens, what the keys do.
- Each test names the requirement it checks (`FR-06 every level fits the
  floor`).
- How the page looks and moves is judged by looking. Playwright runs the
  journeys of `docs/design.md` §3 in Chromium, Firefox and WebKit.

## Tools

- Read the current documentation or source of a tool before configuring it.
- Node tools run through `package.json` scripts.
- Run `git config core.hooksPath .githooks` once per clone. The pre-commit
  hook scans staged changes with gitleaks, lints staged workflows with
  actionlint, and refuses a commit it cannot check.

## Hygiene

- The repository is public: no private names, machines, accounts, paths or
  working notes in tracked files, commits or pull requests.
- No runtime dependency is added, and no request to another origin, without
  an entry in `docs/decisions.md` (`docs/design.md`, NFR-05).
