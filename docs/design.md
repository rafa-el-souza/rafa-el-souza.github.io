# rafasouza.dev.br — design document

**Status:** v1, 2026-11-18. Owner: Rafa Souza. Implementers: separate
sessions, reading this file top to bottom before their first slice.

The landing page of a backend developer's career, at the root of his own
domain: six full-screen levels shown one at a time, in three languages and
two themes, static on GitHub Pages. It has to answer someone who is hiring
in thirty seconds and hold up for three minutes under an engineer's eye.
Every requirement below has an identifier; tests name the identifier they
check.

Related documents: [`decisions.md`](decisions.md) (each decision with its
reason) and [`design-brief.md`](design-brief.md) (the visual brief, until
`visual-identity.md` replaces it).

---

## 1. Context

### 1.1 Why this exists

The author is a backend developer (Ruby on Rails, three years in
production) and a former pharmacist, looking for a backend role. His public
work is spread over several places: two recent projects with live sites
(Balcão, an AI attendant for a fictional pharmacy, on Rails; Pendulum, an
interactive physics piece), three earlier tools, a merged upstream pull
request, a CV. The root of his domain answered nothing. This page is the
one address that says who he is, shows the proof and hands over the CV.

| Reader | Time | Arrives from | Needs |
|---|---|---|---|
| A recruiter or sourcer | thirty seconds, often on a phone, often inside another app's browser | a CV, a LinkedIn profile, an e-mail | the role, the stack, where he is, whether he is available, the CV, a way to write |
| The engineer who decides the hire | three minutes, on a desktop | the recruiter's forward, a repository, a post | evidence of judgement: what was built, how, what was measured, links that go deep |
| A peer: a maintainer, a reviewer of talk proposals | a minute or two | a pull request, a proposal, a post | who this is, where the code is, how he works |

Where they conflict, the first reader wins the first level and the second
wins everything below it (decision 2). The page makes no offer to clients
looking for freelance work.

### 1.2 Vocabulary

- **Level** — one full-screen section of the page. The first version has six.
- **Opening** — the first level.
- **Frame** — what stays on screen at every level: the name, the index, the
  CV and e-mail actions, the language and theme selectors.
- **Index** — the list of the levels, in the frame.
- **At rest** — no level change is under way.
- **Level change** — going from one level at rest to another at rest.
- **Arrival** — the short choreography of a level's content when the level
  comes to rest.
- **Entrance** — the animation of a first visit.
- **The floor** — the smallest viewport at which the level layout is
  guaranteed: 22.5 rem wide by 35 rem tall, which is 360 × 560 CSS pixels at
  the default font size.
- **Content files** — the per-language modules that hold every string.
- **Preview** — the address where the designed page is published before
  launch, `/preview/`, marked `noindex` (§9).

---

## 2. Goals and non-goals

### 2.1 Goals

1. The thirty-second answer is on the first screen, without scrolling.
2. Proof is one activation away: every claim links to something a reader
   can open.
3. A made-to-measure design that impresses on arrival and then stays out of
   the reader's way: motion that is quick, smooth and refined.
4. Three languages and two themes, each of them first-class.
5. The page is itself evidence: small, fast, accessible, readable without
   JavaScript, open source, with its decisions written down.
6. It is cheap to keep true: a change of text touches one file per language.

### 2.2 Non-goals (first version)

A blog or any writing section (planned under `/blog`, in its own
repository: decision 1); a contact form; a content management system; an
offer of freelance work; testimonials; anything on a server; a fourth
language; a UI framework or a component library.

---

## 3. Readers and journeys

Each journey is one browser test, run in the three engines.

- **J1 Thirty seconds.** A phone at 360 × 560 arrives at `/` from a CV, with
  `?ref=cv`. On the first screen the reader finds the name, the role and
  stack, the city, the availability line, and the CV and e-mail actions.
  The CV action answers with a PDF. Nothing asked for scrolling.
- **J2 Three minutes.** A desktop at 1280 × 720 goes through the six levels
  with the keyboard, each coming to rest alone. The reader opens the Balcão
  demo, returns with Back to the same level, and the entrance does not play
  again.
- **J3 A link to one thing.** `/en/#balcao` opens with the Balcão level at
  rest and no entrance. Choosing Spanish lands on `/es/#balcao`.
- **J4 Without JavaScript.** With scripts off, `/` is a document with the
  six levels in order; the index and the language links work; the theme
  follows the browser.
- **J5 Sharing.** Each language's root carries its own title, description
  and preview image, and the image answers with the right size.

---

## 4. Functional requirements

Format: identifier, statement, acceptance scenarios in Given / When / Then.
A requirement without a scenario is a bug in this document. How anything
looks or moves is decided by seeing it (§10); the requirements say what
must hold whichever option is chosen.

### 4.1 Levels and navigation

**FR-01 The six levels.** The page has these levels, in this order. The
table binds content and order; the design decides form.

| # | Id | Must contain |
|---|---|---|
| 1 | `opening` | the name; the role and stack in one line; one sentence of who he is; three facts; the city and time zone; the availability line with its date; the actions CV, e-mail, LinkedIn, GitHub |
| 2 | `balcao` | what Balcão is, in one sentence; that the pharmacy is fictional and the site a live demo; what to look at; up to four figures with their date; the stack in one line; the actions open the demo, the repository, the design document; one visual |
| 3 | `pendulum` | what Pendulum is, in one sentence; the paper check; up to three figures; the stack in one line; the actions open the piece, the repository, the paper check; one visual |
| 4 | `method` | the author's sentence on how the code is written and what his part is; four practices, each one line and one link to its evidence |
| 5 | `path` | one sentence; the entries, each with its period: the independent projects, the three years of public-health software, the training in web development, the pharmacy before that, the degree; open source (the merged upstream pull request, the three tools) |
| 6 | `contact` | one sentence; the e-mail address with its copy control, LinkedIn, GitHub, the CV files; city and time zone; languages spoken; the availability line; the colophon (how the site is made, with a link to this repository; the privacy note; the licence line) |

- Given any language, When the page is rendered, Then the six levels exist
  in this order, each a `section` with its heading, and the page has exactly
  one `h1`, the name.
- A level that is not in this table is added by editing this table first.

**FR-02 One level at a time.** At rest, exactly one level fills the visible
area: its top edge at the top, its bottom edge at the bottom. This holds on
every viewport at or above the floor (FR-06), with a phone browser's bars
showing and after they retract.
- Given a viewport of 390 × 844, When any level change ends, Then one
  level's box equals the visible viewport within one pixel, and no other
  level is visible.
- Given a phone whose browser bars retract on scrolling, checked by hand on
  the owner's devices (NFR-03), Then at rest no strip of the next level
  shows.

**FR-03 Changing level.** A level changes by touch (drag or fling), by wheel
or trackpad, by the keys ArrowDown and ArrowUp, PageDown and PageUp, Space
and Shift+Space, Home and End, through the index, and by a link to a level.
One gesture moves one level; Home and End go to the first and the last. The
page never swallows input: a new gesture during a change redirects it.
- Given the Opening at rest on a touch device, When the visitor flings
  upward once, however fast, Then the second level comes to rest, not a
  later one.
- Given the fourth level at rest, When PageDown is pressed, Then the fifth
  comes to rest; When Home is pressed, Then the Opening does.
- Given a mouse with a wheel, When the wheel turns one notch down, Then the
  next level comes to rest.

**FR-04 An address for each level.** Every level has a fragment in each
language, and the address bar always names the level at rest.

| Id | Portuguese (`/`) | English (`/en/`) | Spanish (`/es/`) |
|---|---|---|---|
| `opening` | `#abertura` | `#opening` | `#apertura` |
| `balcao` | `#balcao` | `#balcao` | `#balcao` |
| `pendulum` | `#pendulum` | `#pendulum` | `#pendulum` |
| `method` | `#como-trabalho` | `#how-i-work` | `#como-trabajo` |
| `path` | `#trajetoria` | `#path` | `#trayectoria` |
| `contact` | `#contato` | `#contact` | `#contacto` |

- Given `/en/#how-i-work` opened directly, Then that level is at rest, the
  index marks it and the entrance does not play.
- Given the visitor goes from level to level by scrolling, Then the address
  shows the level at rest and the history gains no entry; activating an
  index entry adds one, as any link does.
- Given a fragment that names no level, Then the Opening is shown.
- Given a return through the browser's Back, from the demo or from the CV,
  Then the level that was left is at rest and the entrance does not play.

**FR-05 The frame.** At every level the frame shows the name (a link to the
Opening), the index with the current level marked, the CV action, the
e-mail action (a `mailto:` link), and the language and theme selectors.
From any level, the CV and the e-mail take one activation, and so does any
other level through the index, whose last entry leads to the Contact level;
language and theme take at most two (on small screens they may sit behind
one control) and are in plain view on the Opening. The frame never covers a
level's text, and it counts inside FR-06's fit.
- Given the third level at rest at 360 × 560, Then the CV action and the
  e-mail action are visible, each a single activation, and the index shows
  its six entries, or their compact form, with the third marked
  (`aria-current`).
- Given keyboard use, Then the first Tab stop is a link that skips to the
  current level's content, and the frame's controls follow in a fixed order.

**FR-06 The floor, and what happens below it.** At or above the floor, the
content of every level, with the frame, fits the viewport in the three
languages and both themes, with no scrolling inside a level. Below the
floor in either dimension (a phone held sideways, a page zoomed to 200 %, a
very large default font) the page is an ordinary scrolling document: levels
take their natural height, nothing snaps, the frame stays reachable. This
rule shapes the copy: each block of text has a character budget (FR-16).
- Given each reference viewport (360 × 560, 390 × 844, 768 × 1024,
  1280 × 720, 1920 × 1080, 2560 × 1440) and each language, Then for every
  level no content overflows its box and no text is clipped or overlapped;
  both themes are checked at 360 × 560 and 1280 × 720.
- Given 740 × 360 (a phone held sideways) or 640 × 360 (1280 × 720 at
  200 %), Then the document scrolls freely, every level can be read in full
  by scrolling, and nothing snaps.
- Given the default font size raised to 24 px at 1280 × 720, Then the same
  ordinary scrolling applies, because the floor is measured in `rem`.

**FR-07 Without JavaScript.** With scripts off or failed, the page is a
complete, styled document: the six levels in order; the index and the
language selector as plain links; the theme following the browser; level
changes still snapping where the browser's CSS does it. The theme selector,
the language suggestion, the once-per-session rule of the entrance and the
visit counter are absent. No content is rendered by script.
- Given scripts off, When `/es/` loads, Then every string of the six levels
  is in the HTML response and visible by scrolling.

### 4.2 Motion

**FR-08 Between levels and on arrival.** Where the browser's own scrolling
produces a level change, the change takes the time the gesture gives it;
where the page conducts it, between 350 and 600 ms. When a level comes to
rest its arrival plays, and all of its text is fully legible within 400 ms.
A level passed without resting does not play its arrival. At rest nothing
moves unless the visitor acts; the one exception is a visual whose subject
is motion, which runs only while its level is at rest and the tab visible.
Animation uses opacity and transform only. Effects tied to the scroll
position are an enhancement behind a feature query (§6.4); without them a
level change is the plain snap and the arrival.
- Given the Opening at rest, When the visitor goes to the last level through
  the index, Then the four levels between do not play their arrivals, and
  the last level's text is fully legible within 400 ms of rest.
- Given any level change, Then no layout shift is recorded.

**FR-09 The entrance.** On the first visit of a browsing session that lands
on the Opening, an entrance animation reveals the Opening.
1. Its final state is the Opening's own HTML and CSS: the entrance only
   reveals it. There is no layout shift, and if nothing runs, the page is
   simply there.
2. Its first frame is drawn from HTML and CSS, before any script.
3. The Opening's text is legible within 1.5 s of the first paint, and the
   entrance is over within 2.5 s.
4. Any input (pointer, touch, wheel, key) ends it by the next frame.
5. Links and controls work from the first frame: activating one acts at
   once.
6. It waits for the Opening's fonts for 300 ms at most.
7. It does not play on a link to another level, on a change of language or
   theme, on a return through Back or Forward, on a reload within the
   session, or when reduced motion is asked for (FR-10).
8. It fits NFR-02's budget for Largest Contentful Paint, which is measured
   with the entrance playing. So the Opening's largest text, the name, is
   painted early: it may move or sharpen, but an entrance that keeps it
   invisible past that budget is out.
- Given a first visit to `/`, When 1.5 s have passed since the first paint,
  Then the name, the role and the actions are at full contrast in their
  final place.
- Given the entrance running, When the visitor presses a key or touches the
  screen, Then the Opening is in its final state by the next frame.
- Given a second load of `/` in the same tab, Then the entrance does not
  play.

**FR-10 Reduced motion.** When the browser asks for reduced motion there is
no entrance, no arrival choreography and no scroll-linked effect; a level
change is immediate, or a cross-fade of 150 ms at most; a visual that
moves shows a still frame with a control to play it.
- Given `prefers-reduced-motion: reduce`, When the page is walked level by
  level, Then no element's transform changes over time.

### 4.3 Languages and themes

**FR-11 Three languages, three addresses.** Portuguese (pt-BR) at `/`,
English at `/en/`, Spanish (neutral Latin American) at `/es/`. Each is a
complete HTML document made at build time, with its own `lang`, title,
description, preview tags and fragments. Every string lives in the content
files, one module per language over one shared type: a missing or extra key
fails the type check, and a test compares the shape of the lists. No
user-facing string lives in a template or a script.
- Given the build, When a key present in the Portuguese module is removed
  from the Spanish one, Then the type check fails.
- Given `/en/`, Then the document's `lang` is `en`, and no Portuguese or
  Spanish string appears outside the language selector and FR-12's
  suggestion lines.

**FR-12 Choosing the language.** The language selector is three plain links
to the same level in each language, with the current one marked. The page
never redirects by itself. On a first visit, when the browser's preferred
languages name another supported language before the page's own, or name
none of the three (English is then offered on the other two), the frame
shows one line offering that language, written in it. The lines for the
two other languages are in each page's HTML, made at build time from the
content files and hidden until one is offered; a line and its dismiss
control are in the offered language and carry its `lang`. Choosing a
language or dismissing the line is remembered in the browser, and the line
does not come back.
- Given a browser whose first language is `en-GB`, When `/` loads for the
  first time, Then the line "This page in English" appears as a link to
  `/en/`, and the page stays in Portuguese.
- Given a browser whose first language is `pt-PT`, When `/` loads, Then no
  line appears.
- Given the visitor dismissed the line or chose a language, When any page
  loads again, Then no line appears.
- Given the fifth level at rest in Portuguese, When the visitor chooses
  Spanish, Then `/es/#trayectoria` opens with that level at rest and no
  entrance.

**FR-13 Light and dark.** Both themes are designed; neither is the other
inverted. With no choice made, the page follows the browser's
`prefers-color-scheme`, and keeps following when it changes. The selector
has three states (automatic, light, dark); the choice is kept in the
browser and applied before the first paint, so that no frame of the other
theme shows. Contrast meets NFR-04 in both.
- Given a browser set to dark and no stored choice, Then the dark theme is
  drawn from the first frame.
- Given the visitor chose light on a browser set to dark, When the page is
  reloaded, Then the first painted frame is light.
- Given the automatic state, When the system changes to dark, Then the page
  follows without a reload.

### 4.4 Content

**FR-14 The Opening answers in thirty seconds.** Without scrolling, at the
floor, the reader finds who (the name), what (role and stack), where (city
and time zone), whether he is available and for what, the CV, and a way to
write. §9's closing test checks it with a reader who has seen nothing else.
- Given 360 × 560 in each language, Then the name, the role line, the city,
  the availability line and the CV and e-mail actions are inside the
  viewport, none clipped.

**FR-15 The project levels.** Balcão and Pendulum each have a level, with
FR-01's content. A figure is true on the date shown with it, or links to
the file that proves it. Each level has one visual: a capture, a drawing or
a live miniature, chosen in the design slice. A visual never takes over
scrolling or focus: an interactive one starts only when the visitor
activates it, and gives scrolling and focus back on Escape, on a level
change, or when activated again. Balcão's level says the pharmacy is
fictional and calls the site a demo.
- Given the Pendulum level at rest on a touch device, When the visitor drags
  across the visual without having activated it, Then the level changes as
  it would anywhere else on the page.
- Given a figure on a project level, Then the content file holds its date
  and the page shows it.

**FR-16 Where the words come from.** Every factual claim links to something
a reader can open: a repository, a live site, a pull request, a document.
Every string comes from the content files, which the author supplies and
approves; sessions do not write or reword copy. Each block of text has a
character budget in the content type, and a test fails when a string goes
over its budget in any language. Dates and numbers are written per language
in the content files.
- Given a string longer than its budget in the Spanish module, Then the
  unit tests fail and name the key.
- Given the built pages, Then every external link is `https`; before
  launch, a link check run by hand finds none broken (CI does not touch the
  network).

**FR-17 Contact and colophon.** The e-mail is a plain `mailto:` link whose
address is also visible text, with a control that copies it. There is no
form. The colophon says in a line or two how the site is made and links to
this repository; the privacy note says in one paragraph what FR-23 and §7
make true; the licence line says what may be reused (OD-2).
- Given the last level, When the copy control is activated, Then the
  clipboard holds the address, and the control says so in the page's
  language, to assistive technology too.

**FR-18 The CV files.** The CV is a PDF per language, served from this site:
the Portuguese file on the Portuguese page, the English one on the English
page. The Spanish page offers the English file and says in which language
it is (OD-5). A file's name starts with the author's name as shown on the
page (OD-3) and ends with the language; files are replaced in place and
their addresses never change. They obey §7's rule on personal data.
- Given `/en/`, Then the CV action points to the English PDF under `/cv/`,
  and the answer is a PDF.

### 4.5 Sharing and finding

**FR-19 Link previews.** Each language's root carries Open Graph and Twitter
Card tags: title, description, address, locale, and an image of 1200 × 630
made for sharing, with that language's text. Nothing is shared before its
preview has been seen with a pasted link.
- Given `/es/`, Then `og:locale` is Spanish, `og:url` is the canonical
  address, and `og:image` is an absolute `https` address that answers with
  an image of 1200 × 630.

**FR-20 To be found.** Per language: `title`, a meta description, a
canonical link, `hreflang` alternates for the three languages and
`x-default` (the English page), and one JSON-LD `Person` block (name, role,
address of the site, the same-as links, languages, city and country; its
codes and addresses are constants beside the content files, not copy).
`sitemap.xml` lists the three roots with their alternates; `robots.txt`
allows everything and names the sitemap. Prototype pages and the preview
(§9), while they exist, carry `noindex` and stay out of the sitemap.
- Given the three roots, Then each lists the same four alternates and its
  own canonical address.

**FR-21 The page that is not there.** `/404.html`, which the host serves for
any unknown path, is one static page in the three languages at once: a line
in each, with a link to that language's root. It is styled like the site,
in both themes, and needs no script.

**FR-22 On paper.** Printed, the page is a plain document: the six levels in
order, dark on white, without the frame, with each link's address after its
text.
- Given print media, Then the frame is not displayed and every level's text
  is visible.

### 4.6 Measuring

**FR-23 Counting visits.** The site counts visits in aggregate, without
cookies and without storing anything that identifies a visitor, through one
call made after the page is usable. The privacy note says so and names the
service (OD-1). Links that the author spreads carry `?ref=<tag>` (`cv`,
`li`, `gh` and so on): the tag is counted as the source, then removed from
the address shown. When the browser sends Global Privacy Control or Do Not
Track, no call is made. If the counter needs a script, this site serves it.
A failed or blocked call changes nothing the visitor sees.
- Given `/en/?ref=cv#balcao`, When the page has loaded, Then one count is
  sent with the source `cv`, and the address shows `/en/#balcao`.
- Given a browser with Global Privacy Control on, Then no request leaves
  the site's own origin.
- Given the counter's host unreachable, Then the page shows no error and
  every journey passes.

### 4.7 The first deploy

**FR-24 The sober page first.** The first deploy publishes a plain page, so
that the domain answers from the first day: the name, the role line, one
sentence, the city and time zone, links to the two live projects, GitHub,
LinkedIn and the e-mail address. It comes in the three languages at their
final addresses, with links between them, follows the browser's theme with
system colours, and carries FR-19's and FR-20's tags with a plain preview
image. It has no script, no animation and no web font. The designed page
replaces it whole at launch (M5, decision 8); until then the designed page
is published only at the preview address (§9).
- Given the first deploy, Then `/`, `/en/` and `/es/` each answer in their
  language, and a pasted link shows a title and a description.

---

## 5. Non-functional requirements

**NFR-01 Weight.** Measured over the built files, compressed with gzip, by a
test that reads the build output:

| What | Budget |
|---|---|
| The HTML of one language | 20 kB |
| All CSS | 30 kB |
| All JavaScript, the counter's script included | 30 kB |
| The fonts the Opening needs | 120 kB |
| The first view in all (HTML, CSS, JavaScript, the Opening's fonts; the Opening uses no image) | 200 kB |
| Everything one language can load, with every level visited | 600 kB |

Images below the Opening load as their level approaches. A budget is
raised only by an entry in `decisions.md`.

**NFR-02 Speed.** Lighthouse with mobile emulation on the published site,
run by hand at the hardening and launch milestones and after any change of
fonts, images or scripts, with the numbers written into `decisions.md`:
Performance at least 95; Accessibility, Best Practices and SEO at 100;
Largest Contentful Paint at most 1.8 s; Cumulative Layout Shift at most
0.02; Total Blocking Time at most 50 ms. How smooth the motion is gets
judged on the owner's own devices, and no frame-rate figure is claimed
anywhere.

**NFR-03 Browsers and devices.** Every journey of §3 runs in CI in Chromium,
Firefox and WebKit. The base experience (levels, snap, themes, languages)
uses only features that the three engines have had for two years or more;
newer ones (§6.4) come in behind a feature query, as enhancement. By hand,
at the motion prototype and at hardening, on the owner's laptop and phone:
the phone's own browser, and the browsers inside the LinkedIn app, an
e-mail app and Telegram. The other phone platform is covered by its engine
in CI and, when it differs, by the outside person's phone at the second
closing test (§9). Viewports from the floor to 2560 × 1440; pointer, touch
and keyboard.

**NFR-04 Accessibility.** WCAG 2.2 at level AA. In CI: axe reports no
violation for each language at 360 and 1280 px wide in both themes; a
keyboard test walks every control; a unit test computes the contrast of
every pair of text or interface colour and its ground in the tokens (4.5:1
for text, 3:1 for large text and interface parts). By hand at hardening: a
screen-reader pass in one language, 200 % zoom, reduced motion. Targets
are at least 24 × 24 CSS pixels; focus is always visible; the index, the
selectors and the copy control carry names and states for assistive
technology. A level change moves the focus only when the visitor asked for
that level (the index, a link).

**NFR-05 Nothing borrowed at run time.** `package.json` has no
`dependencies`. The page makes no request to another origin, except FR-23's
call and, if the design slice chooses a live project visual, that
project's own site, by an entry in `decisions.md`. A browser test records
every request of a full walk and fails on any other host. Fonts, images
and the counter's script are served from this site.

**NFR-06 Keeping it true.** A change of text touches only the content
files, and a new figure brings its date. The build is one command and
gives the same output for the same input; a clone needs Node and `npm ci`,
nothing else. Each test names the requirement it checks ("FR-06 every level
fits the floor"). A decision is written into `decisions.md` in the pull
request that acts on it.

---

## 6. Structure

### 6.1 Stack

TypeScript with no UI framework; Vite for the build; Vitest for unit tests;
Playwright for the journeys in three engines; ESLint and Prettier; gitleaks
and actionlint in a pre-commit hook; GitHub Actions and GitHub Pages. These
are the tools, at the versions, of the author's Pendulum, his other static
site (decision 4). Own CSS over design tokens: no UI kit, no utility
framework.

### 6.2 Pages

The build makes the pages from templates (plain TypeScript functions that
return HTML) and the content files: `/index.html`, `/en/index.html`,
`/es/index.html` and `/404.html`. Each page carries the full text of its
six levels. One stylesheet and one deferred script bundle serve all of
them. One small inline script in the `head` sets the theme and the
entrance's flag before the first paint; the build writes its hash into the
page's Content Security Policy (§7). Links between pages and to assets are
relative, so the same build works at the root and under the preview path;
the canonical, alternate and preview-image addresses are absolute and
always name the final addresses.

### 6.3 The content model

One TypeScript type describes all the copy, and each language is a module
that satisfies it, so that parity is checked by the compiler. In outline
(names are indicative; budgets are in characters and belong to the type,
where the design slice sets their final values):

| Part | Holds |
|---|---|
| `site` | the name, the role line, the title and description for search and for previews |
| `frame` | the six index labels, the labels of the CV and e-mail actions, the names of the languages, the three theme states, the skip link, the language-suggestion line and its dismiss label, the names read by assistive technology |
| `opening` | the sentence, three facts, the city and time zone, the availability line and its date, the four actions |
| `balcao`, `pendulum` | title, sentence, what to look at, figures (value, label, date), the stack line, actions, the visual's alternative text |
| `method` | the author's sentence, four practices (name, line, link) |
| `path` | the sentence, the entries (period, heading, an optional line), the open-source title and items (line, links) |
| `contact` | the sentence, the labels of the items, languages spoken, the colophon, the privacy note, the licence line (city, time zone and availability are the Opening's strings, shown again) |
| `notFound` | a line and a link label per language |

Beside the copy, one module of constants holds what is data and not prose:
the addresses (the profiles, the repositories, the demo, the piece, the CV
files), the e-mail address, and the language codes, city and country that
the structured data needs.

### 6.4 The platform, as checked on 2026-11-18

| Feature | Used for | State | Note |
|---|---|---|---|
| CSS scroll snap, with `scroll-snap-stop` | a level change without script | in the three engines for years | the base mechanism of the first option for the level change (§10) |
| Small and dynamic viewport units (`svh`, `dvh`) | a level as tall as the visible area | in the three engines since 2022 and 2023 | which unit and which scrolling element hold FR-02 on phones is the motion prototype's first question |
| `prefers-color-scheme`, `color-scheme`, `light-dark()` | themes | `light-dark()` in the three engines since 2024 | custom properties are the fallback |
| `prefers-reduced-motion` | FR-10 | in the three engines for years | |
| Web Animations API, CSS `linear()` easing | arrival, entrance | in the three engines (`linear()` since 2023) | |
| Intersection Observer | knowing which level is at rest | in the three engines for years | |
| Scroll-driven animations (`animation-timeline`) | effects tied to the scroll position | Chromium 115, Safari 26, Firefox 159 of 27 October 2026: newly available in all three | enhancement only, behind `@supports`; two traps were reported: the `animation` shorthand resets the timeline when it comes later in a rule, and Firefox wants a duration that is not zero |
| `scrollend` and `scrollsnapchange` events | knowing a level came to rest | not checked for this document | to be confirmed in the motion prototype; Intersection Observer is the base |
| View Transitions within a document | the change of theme, perhaps of level | not checked for this document | enhancement only |

The state of scroll-driven animations comes from web.dev's roundup of
October 2026 and write-ups that cite it, not from the browsers' own release
notes; the motion prototype confirms it at the source before using it.

### 6.5 Behaviour in the browser

Small independent modules, each of which may fail without taking the page
with it: the theme (the stored choice, the selector, following the system);
the levels (which one is at rest, the address, the index's state, the
keys); the arrival; the entrance; the language suggestion; the copy
control; the counter.

---

## 7. Security and privacy

- **S-1 Storage.** No cookie. Local storage holds three things (the theme
  chosen, the language chosen, that the suggestion was dismissed) and
  session storage one (that the entrance was seen). A browser test asserts
  an empty `document.cookie` and lists the storage keys after a full walk.
- **S-2 Personal data on the page.** The name, the city, the public e-mail
  address, the public profile links, the CV files. Never a phone number, a
  street address, an identity number or a date of birth; the CV files obey
  the same rule. Whether there is a portrait is an open question (§10).
- **S-3 Content Security Policy, by meta tag,** because the host sends no
  headers of ours: `default-src 'none'`; scripts from this origin plus the
  hash of the one inline script; styles, images and fonts from this origin;
  `connect-src` the counter's origin and nothing else; `base-uri 'none'`;
  `form-action 'none'`. No inline style attribute and no `eval`. Its limit,
  said plainly: a meta policy cannot set `frame-ancestors`; the page holds
  no state and no action worth framing.
- **S-4 Other origins.** None but FR-23's call (NFR-05). Links out are
  plain links.
- **S-5 Supply chain.** No runtime dependency. Development dependencies are
  locked and installed with `npm ci`, with install scripts off. Actions are
  pinned by commit. Workflow permissions are empty by default and minimal
  per job. CI holds no secret. gitleaks scans every commit in CI and the
  staged changes before each commit.
- **S-6 The domain.** Verified for GitHub Pages at the account, which stops
  another account from claiming it. The apex and `www` only, no wildcard
  record. HTTPS enforced.
- **S-7 What the counter learns.** The path, the referrer, the `ref` tag
  and the screen size; the IP address and the user agent only in passing,
  to count one visit once, and neither is stored (OD-1 names the service
  and its own description of this). Global Privacy Control and Do Not Track
  are honoured. The host, GitHub Pages, keeps its own request logs under
  GitHub's policy. The privacy note says both things.
- **S-8 A public repository.** No private name, machine, account, path or
  working note in tracked files, commits or pull requests.

---

## 8. Operations

- **Hosting.** GitHub Pages, from this repository (the account's user
  site), published by CI's deploy job from `main` only after every check
  has passed; the job then requests the published home page.
- **Domain.** `rafasouza.dev.br` at the apex, `www` redirecting to it, and
  the `github.io` address redirecting too. Pendulum keeps a subdomain of
  its own (decision 6); a blog repository would answer under `/blog`
  (decision 1).
- **Before launch.** The root serves the sober page. The designed page is
  published under `/preview/`, marked `noindex` and outside the sitemap,
  from M3 on. Launch is one pull request: the designed page moves to the
  root and the preview goes.
- **Changing the content.** A change to the content files is a pull request
  like any other. CV files are replaced in place.
- **After a deploy that changes text or tags:** paste the link into a
  messaging app and look at the preview (FR-19).
- **Figures age.** Each has a date; a project's figures are read again at
  its source when that project closes a milestone.
- **Going back.** Revert the commit; the deploy job publishes the previous
  build.
- **Watching.** Nothing beyond CI's request after a deploy: the page has no
  server of its own.

---

## 9. Delivery plan

One pull request per slice; several slices may share a session. Hours are
the sessions' estimates, and each slice records what it actually took.

| Milestone | Delivers | Done when | Hours |
|---|---|---|---|
| **M0 Skeleton** | the toolchain, CI, Pages and the domain; the sober page (FR-24) with its preview and search tags (FR-19, FR-20) | the three addresses answer on the domain over HTTPS; CI is green and required on `main` | 3 |
| **M1 Design** | three directions drawn for the Opening and one content level; then the tokens and every level and the frame, in both themes and three languages, at 360 and 1280 px, as static pages under `docs/prototype/`; `docs/visual-identity.md` | the author has seen and accepted each level; the fit holds at the floor on the static pages | 9 |
| **M2 Motion** | a prototype of two real levels and the Opening: the level change in its two options, two or three transition grammars, two or three entrances, all within FR-08's and FR-09's budgets | the author has tried them on a laptop and a phone and chosen; the choices are in `decisions.md` | 5 |
| **M3 Build** | the six levels, the frame, navigation, addresses, languages, themes, the fallbacks (FR-01 to FR-17, FR-21, FR-22) with their tests, published at the preview address; the root keeps the sober page | every journey passes in the three engines against the preview build | 8 |
| **M4 Hardening** | on the preview: accessibility, the engines and the in-app browsers by hand, the weight and speed budgets, the final preview images, the counter (FR-23) | NFR-01 to NFR-05 hold, with their numbers recorded | 5 |
| **M5 Launch** | the final copy in the three languages, the CV files (FR-18), the two closing tests, the link check; then the designed page takes the root and the preview goes | both closing tests pass; no placeholder is left in the build; the author says go, and the root shows the designed page | 3 |

**Placeholders.** Until the author's CV files arrive, a one-page placeholder
PDF stands in for each, so that J1 can run from M3. A unit test fails the
launch pull request while a placeholder is in the build.

**The two closing tests.** (1) The thirty-second reader: a reader who has
seen nothing of the project receives only the Opening, as a picture at
360 × 560 and as text, in each language, and must say who this is, what he
does, where he is, whether he is available and for what, where the CV is
and how to write to him, quoting the page for each answer and naming what
was unclear. (2) One person from outside goes through the page alone on
their own phone and says what they understood; nobody explains anything.

---

## 10. Open decisions

**Decided by seeing.** The author looks at options built for him and then
says which; until then nothing here is chosen.

- **V1 The visual direction:** three directions drawn in M1
  (`design-brief.md`).
- **V2 The level change:** the browser's own scrolling with snap points, or
  a change that the page conducts, with a fixed duration. The prototype
  starts from the first.
- **V3 The transition between levels:** two or three grammars in the same
  prototype.
- **V4 The entrance:** two or three concepts inside FR-09's budget.
- **V5 Details:** a portrait (none, or a small one on the last level); the
  form and place of the selectors; the favicon; the preview image.

**Decided in words, still open.**

- **OD-1 The counting service.** Recommended: GoatCounter's hosted service,
  with its script served from this site; the alternative is to count
  nothing.
- **OD-2 The licence of what is not code.** The code is under MIT
  (`LICENSE`). For the texts, the CV files and the visual identity, the
  recommendation is all rights reserved, said in the licence line of the
  last level.
- **OD-3 The name as shown** on the page and in the CV files' names.
- **OD-4 The availability line:** what it says, and that it carries a date.
- **OD-5 The CV on the Spanish page:** the English file, or a Spanish one.

---

## 11. After the first version (planned, not scheduled)

- Writing: a blog under `/blog`, in its own repository (decision 1); when
  it has a first text, a line on the fifth level, or a seventh level,
  points to it.
- A mark on the Balcão level that says whether the demo is up, read from
  its health endpoint.
- The CV as a page of the site, with the PDF as its printed form.
- The same visual identity on the CV and on the profile banners.

---

## 12. Requirement index

| Id | Milestone | Checked by |
|---|---|---|
| FR-01 The six levels | M3 | browser test |
| FR-02 One level at a time | M2, M3 | browser test; by hand on phones |
| FR-03 Changing level | M2, M3 | browser test; by hand |
| FR-04 An address for each level | M3 | browser test |
| FR-05 The frame | M3 | browser test |
| FR-06 The floor | M1 (static), M3 | browser test |
| FR-07 Without JavaScript | M3 | browser test |
| FR-08 Between levels and on arrival | M2, M3 | browser test; by eye |
| FR-09 The entrance | M2, M3 | browser test; by eye |
| FR-10 Reduced motion | M3 | browser test |
| FR-11 Three languages | M0, M3 | type check; unit test |
| FR-12 Choosing the language | M3 | browser test |
| FR-13 Light and dark | M3 | browser test; unit test (contrast) |
| FR-14 The Opening in thirty seconds | M3, M5 | browser test; closing test |
| FR-15 The project levels | M3 | browser test |
| FR-16 Where the words come from | M3, M5 | unit test; link check by hand |
| FR-17 Contact and colophon | M3 | browser test |
| FR-18 The CV files | M5 | browser test |
| FR-19 Link previews | M0, M4 | unit test; by hand with a pasted link |
| FR-20 To be found | M0 | unit test |
| FR-21 The page that is not there | M3 | browser test |
| FR-22 On paper | M3 | browser test |
| FR-23 Counting visits | M4 | browser test |
| FR-24 The sober page first | M0 | browser test |
| NFR-01 Weight | M3, M4 | unit test over the build |
| NFR-02 Speed | M4, M5 | Lighthouse by hand, recorded |
| NFR-03 Browsers and devices | every milestone | CI; by hand |
| NFR-04 Accessibility | M3, M4 | axe; keyboard test; unit test; by hand |
| NFR-05 Nothing borrowed at run time | M3 | browser test; `package.json` |
| NFR-06 Keeping it true | every milestone | review |
| S-1 to S-8 | M0, M3, M4 | browser test (S-1, S-3, S-4); CI (S-5); by hand (S-6) |
