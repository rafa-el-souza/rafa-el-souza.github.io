# rafasouza.dev.br — visual brief

**Status:** v1, 2026-11-18. For the design session (M1) and the motion
prototype (M2). The session starts from this file and the documents it
points to; nothing else is assumed. `docs/visual-identity.md` replaces it
when M1 closes.

## 1. What you are designing

Six full-screen levels, the frame that stays over them, the way one level
gives way to the next, and the entrance of a first visit, in two themes
and three languages. Content and order are fixed in `design.md` (FR-01,
FR-05); the rules for motion are FR-08 to FR-10; the fit is FR-06.

You draw static pages first, in plain HTML and CSS, with the real copy.
You do not choose what a level contains. If a level cannot work with its
content, say so and propose the change; `design.md` is edited first, then
the level.

## 2. Who looks, and for how long

- Someone recruiting: thirty seconds, often on a phone, often inside
  another app's browser. Sees one screen. Decides whether to open the CV.
- The engineer who decides the hire: three minutes, on a desktop. Goes
  down the levels looking for evidence of judgement.
- A peer: a minute or two. Wants to know who this is and where the code is.

The first screen is for the first reader and has to work as if it were the
whole site. Everything below is for the second.

## 3. Whose page it is

A backend developer who was a pharmacist first: three years of software for
public health, then projects of his own built with unusual care for
evidence: requirements written down, decisions recorded, behaviour
measured. What the page has to say without words: this person is rigorous,
and has taste. It should feel made to measure, for him, and not chosen
from a shelf.

Each of his projects has an identity of its own: Balcão borrows from a
pharmacy's printed matter, Pendulum is light drawn on a dark ground. This
page is neither. It needs an identity for the person, one that can hold
both projects without wearing either.

## 4. Three directions to draw first

Starting points, to be seen side by side; the author may take one, mix two,
or ask for a fourth.

- **A. The edition.** The language of a well-made printed page: a masthead,
  folio numbers for the levels, hairline rules, a serif with character for
  titles and a plainer face for data. Paper and ink in light; a soft, warm
  dark in dark. One accent, used where it means "this one".
- **B. The glass box.** The page as an instrument that shows how it is made:
  a visible grid, annotations, monospaced figures, and readouts measured in
  the visitor's own browser (how much the page weighed, how long it took to
  be ready). Honest numbers as ornament.
- **C. The worlds.** A quiet, neutral frame, and each project level opening
  into the world of its project: the printed matter of a pharmacy for
  Balcão, light on a dark ground for Pendulum. Changing level is changing
  world; the frame is what stays.

## 5. Decided already (do not reopen)

- Six levels in the order of FR-01; the frame's content (FR-05).
- Two themes, both designed from the first sketch. Neither is the other
  inverted.
- Three languages everywhere. Portuguese and Spanish run up to 30 % longer
  than English: design for the longest.
- The floor: every level fits 360 × 560 CSS pixels with the frame, with no
  scrolling inside a level (FR-06). The copy has character budgets; you may
  ask for a shorter text, never cut one.
- No portrait on the Opening. Whether a small one sits on the last level is
  for the author to decide by seeing it.
- Own CSS over design tokens. No UI kit, no utility framework, no runtime
  dependency (NFR-05).
- Fonts: at most two families, open-licensed, served from the site, within
  NFR-01's 120 kB for what the Opening needs.
- Animation uses opacity and transform only; nothing moves at rest (FR-08).

## 6. What to decide in the sessions, with starting points

**Typography.** Two families. One with character, for the name and the
titles; one for reading and for data, with tabular figures. Reject Inter,
Roboto, Arial and `system-ui` as the first face. A small scale, five or six
sizes, named in the tokens.

**Colour.** Tokens by role, for both themes: ground, raised ground, ink,
secondary ink, rule, accent, and the few meaning colours the page needs.
No hue that is foreign to the page; colour appears where it means
something. Contrast at AA for all text and 3:1 for interface parts,
computed by a test from the tokens (NFR-04).

**Rhythm.** The first level breathes; levels with evidence may be denser,
never cramped. One baseline, named spacings.

**Motion** (M2). The author's words for it: quick, smooth, refined. As
starting numbers: durations between 120 and 450 ms; one family of easing,
a decisive ease-out, with a spring only where it does not overshoot text;
stagger of 40 ms at most; text travels 24 px at most, and only a level
change moves further; nothing loops. With reduced motion, none of it
(FR-10).

**The level change** (M2, the first question). Build the browser's own
scrolling with snap points first, on a real phone and a real laptop: does
one gesture move one level, does a level fill the screen while the
browser's bars come and go, does it feel quick? Then the conducted
alternative, for comparison. The author chooses with both in his hands.

**The entrance** (M2). Two or three concepts inside FR-09's budget, each
tied to the direction chosen: for example the page being composed, rule by
rule and line by line; the instrument switching on, its readouts settling
on their values; the light coming up on the first world. It has to mean
something about him or about the page. It reveals the final layout and
does not play in front of it.

**The frame.** The hardest component: the name, six index entries, two
actions and two selectors, at 360 px wide, never over the text. Draw it at
the floor first.

**Components, in order of importance:** the frame; the Opening's block of
name, line, facts and actions; a figure with its label and date; a project
level's visual and its actions; a practice with its evidence link; an entry
of the path; the contact items and the copy control; the selectors; the
language-suggestion line; the 404 page.

## 7. The banned list

If any of these appears, the design has drifted into the default look of
generated front ends, or of portfolio templates. Treat it as a bug:

purple or blue gradients; Inter, Roboto or `system-ui` as the text face;
rounded cards floating on grey; a hero with three feature cards and icons;
"Hi, I'm …" with a waving hand; a typed-text effect cycling through roles;
skill bars and percentages; a cloud of technology logos; a timeline of
dots as the default for a career; glassmorphism and blur panels; drifting
gradient blobs; particle fields and star fields; a custom cursor or cursor
trails; cards that tilt in 3D; marquee tickers; parallax for its own sake;
emoji in headings or as bullets; sparkle icons; drop shadows on
everything; a dark theme that is the light one inverted; stock
illustration; scrolling that fights the finger.

## 8. Deliverables and rhythm

1. **Three directions**, each as the Opening and one content level, in both
   themes, at 1280 and 360 px wide, in Portuguese. The author looks and
   says.
2. **Tokens, then every level and the frame** in the chosen direction, in
   both themes and the three languages, at 360 × 560 and 1280 × 720, as
   static pages under `docs/prototype/` that open from the file system with
   no build step. Reviewed level by level with the author; one round of
   changes per level. This is the cheap moment: he looks hard here, because
   after it every change costs real work.
3. **`docs/visual-identity.md`**: the concept in a paragraph, the two
   faces, the palette by role with its contrast ratios, the motion
   principles, the banned list, three pictures. It replaces this brief.
4. **Drafts of the favicon and of the preview image** (1200 × 630), for
   the author to see.
5. **In M2, the motion prototype**: two real levels and the Opening, with
   the options switchable from the keyboard and from the address, on an
   address a phone can open; pages marked `noindex`.

Before calling a level done: three languages; 360 × 560 and 1280 × 720;
both themes; keyboard focus visible; contrast checked; 200 % zoom falls
back to plain scrolling; nothing from the banned list; real copy, never
placeholder text.
