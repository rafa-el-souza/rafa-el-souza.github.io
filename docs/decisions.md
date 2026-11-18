# Decisions

Each decision that shapes this site, with its reason and the evidence behind
it, oldest first. A changed decision gets a new entry that names the one it
replaces; entries are not rewritten. Questions still open are at the end.

## 1. The landing page takes the root of the domain; writing goes under `/blog`

*2026-11-18.* `rafasouza.dev.br` opens on a landing page about the author
and his work, served from this repository, the account's user site. A blog,
when it has a first text, lives in a repository of its own and answers
under `/blog`.

**Why.** A reader who arrives from a CV, a profile or a pull request wants
to know who this is before reading anything long. An earlier plan gave the
root to a blog; the blog has no text yet, and the root answered nothing
while two projects went live. On GitHub Pages a project repository named
`blog` is served under the user site's domain at `/blog` without any
further setup.

## 2. Three readers, in order

*2026-11-18.* The page is written first for someone recruiting, who gives
it thirty seconds; then for the engineer who decides a hire, who gives it
three minutes; then for peers. Where they conflict, the first reader wins
the first level and the second wins everything below it. The page makes no
offer to clients looking for freelance work.

**Why.** The first reader never scrolls, so the first level has to be a
complete answer; the second reader scrolls for evidence, so every level
below has to link to it. A page that also sold a service would blur what
it asks of the first two.

## 3. Six levels, one per subject, a level for each project

*2026-11-18.* The first version has six levels: Opening, Balcão, Pendulum,
How I work, Path and open source, Contact. Each of the two recent projects
has a level of its own, not a shared portfolio level.

**Why.** Each level costs the reader a gesture, so each has to earn it. The
two projects have live sites and show different things: one a Rails product
with its evidence, the other numerical work and a front end with no
framework and no graphics library.

## 4. TypeScript without a UI framework, on the tools of Pendulum

*2026-11-18.* Plain TypeScript; Vite; the HTML of each language made at
build time; no runtime dependency. The tools and their versions are those
of Pendulum, the author's other static site: Vitest, Playwright in three
engines, ESLint, Prettier, gitleaks, one CI workflow that publishes to
GitHub Pages. A motion library enters only by a new entry here, after the
motion prototype shows something the platform cannot do.

**Why.** The page has three pieces of state (the level, the language, the
theme) and no data to fetch. A UI framework would add tens of kilobytes and
a hydration step before the first frame, which is exactly where the
entrance animation has to start. The author's other work already shows
React (Balcão) and framework-less TypeScript (Pendulum); what this page can
show is the judgement of using neither where neither is needed, with a
number to say for it: no runtime dependency.

## 5. Portuguese at the root, English and Spanish beside it, no redirect

*2026-11-18.* Portuguese at `/`, English at `/en/`, Spanish at `/es/`, each
a complete page. The page never redirects by the browser's language; on a
first visit it offers the better match in one line.

**Why.** An automatic redirect breaks shared links, link previews and the
Back button, and a static host cannot negotiate the language on the server.
The author chooses which address goes on which CV and profile, so most
readers arrive in their language already.

## 6. GitHub Pages on the apex domain; other project sites keep their own subdomains

*2026-11-18.* The site is published by GitHub Pages from the account's
user-site repository, on `rafasouza.dev.br`, with `www` redirecting. The
domain is verified for the account. Pendulum keeps a subdomain of its own.

**Why.** A custom domain on a user site is used for every project site of
the account that has none of its own, so the two roots that answered
nothing are fixed by one setting. Pendulum's subdomain was decided before
this site existed and stays; a separate origin also keeps each site's
storage apart.

**Evidence.** GitHub's documentation, "About custom domains and GitHub
Pages", section "Using a custom domain across multiple repositories", read
2026-11-18.

## 7. Visits are counted in aggregate, without cookies, and the page says so

*2026-11-18.* One count per visit, no cookie, nothing stored that
identifies a visitor; links the author spreads carry a source tag; Global
Privacy Control and Do Not Track switch the count off. Which service counts
is open (see the end).

**Why.** GitHub Pages gives no statistics at all, and a page made for a job
search needs to know whether the link on the CV is ever opened. Counting
only what that question needs keeps the page free of consent banners and
of anything to hide.

## 8. A sober page first

*2026-11-18.* The first deploy publishes a plain page with the name, a
line, and the links, in three languages. The designed page is built and
hardened at a preview address marked `noindex`, and replaces the plain page
whole at launch, in one pull request.

**Why.** The domain should answer from the first day; the design should
take the time it takes; and the root should never show the designed page
half done, without its CV files or before its checks.

## 9. A process in proportion to a small static site

*2026-11-18.* One short design document with numbered requirements and
acceptance scenarios; this log, with no separate decision records; half a
page on security and privacy inside the design document; one CI workflow;
one pull request per slice. Two things come before the build because here
they are the product: a design slice in which every level is drawn and seen
before any of it is built, and a motion prototype in which the level
change and the entrance are tried on real devices. CSS is reviewed by
looking and measuring; automated code review runs on the changes the author
names.

**Why.** The page is small and nothing on it is critical; what it has to
get right is how it looks, how it moves and how fast it answers, and those
are judged by eye and by measurement.

## 10. The code under MIT; the texts, the CV files and the visual identity, all rights reserved

*2026-11-18.* The code in this repository is under the MIT licence
(`LICENSE`). The texts of the page, the CV files and the visual identity
are not licensed for reuse: all rights are reserved. The licence line of
the last level says both. This answers OD-2 of the design document.

**Why.** The code is the part another developer may want to read and
reuse. The texts and the CV speak for one person, and the identity is made
for this site; their reuse is not offered.

## 11. The name shown is Rafa Souza

*2026-11-18.* The page shows the author as Rafa Souza: in its title, its
heading and its structured data, and at the start of the CV files' names
(FR-18). This answers OD-3 of the design document.

**Why.** It is the name the domain spells and the commits carry, so a
reader who arrives from either finds the same name on the page.

## 12. The availability line names remote work, and hybrid work in three cities, with its date

*2026-11-18.* The availability line, on the Opening and on the last level,
says that he is available for remote work, or for hybrid work in Belo
Horizonte, São Paulo or Florianópolis, and carries its date. Its wording
comes with the copy and is approved with its level. This answers OD-4 of
the design document.

**Why.** The first reader decides in thirty seconds whether a role fits
(decision 2), and where he can work is part of that answer; a line about
availability without a date cannot say whether it still holds.

## Open

Decided by seeing, in the design slice and the motion prototype: the visual
direction; how a level changes (the browser's own scrolling with snap
points, or a conducted change); the transition between levels; the
entrance; a portrait or none; the selectors' form; the favicon and the
preview image.

Decided in words, not yet: the counting service (recommended: GoatCounter's
hosted service, with its script served from this site); whether the Spanish
page gets a CV in Spanish.
