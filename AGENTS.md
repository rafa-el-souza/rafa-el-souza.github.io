# Project agent memory

This file is the project's committed home for project-intrinsic agent knowledge: build, test, release, architecture, and sharp-edge notes that should travel with the code.

- Add durable project-specific notes here as they are discovered through real work.

## Build

This is a Hugo + Congo static site. Hugo is the whole toolchain: no npm, no Tailwind
rebuild, no Go modules, no other build step.

### Requirements

Hugo **0.164.0 or newer, extended edition**. Extended is not optional - Congo compiles
SCSS, so a standard Hugo build fails on the stylesheets. Check with `hugo version`; the
output must contain `+extended`.

The requirement is not just prose: `config/_default/module.toml` declares it as Hugo's
own `[hugoVersion]` constraint, so an unsupported Hugo is detected rather than left to
produce a subtly broken site.

Measured on Hugo 0.164.0: an unsatisfied `[hugoVersion]` is only a `WARN` and the build
still exits 0. `--panicOnWarning` is what turns it into a real failure -
`ERROR failed to load config: Module "project" is not compatible with this Hugo
version` - which is why the build command below carries that flag. Treat warnings as
errors here: the site is small and its Hugo and theme are both pinned, so a warning is
a regression, not noise.

### Getting the theme

The theme is a pinned git submodule (`themes/congo`, see `.gitmodules`), not a
vendored copy, so a plain `git clone` leaves it empty and the build fails with a
missing-theme error. Clone with:

```
git clone --recurse-submodules https://github.com/rafa-el-souza/rafa-el-souza.github.io.git
```

In a clone that already exists, `git submodule update --init` fetches it.

### Building and previewing

Build the site into `public/`:

```
hugo --minify --gc --panicOnWarning
```

Preview locally with live reload, served on <http://localhost:1313>:

```
hugo server
```

### Content requirements

Every page with a file under `content/` must declare `title`, `date` and
`summary` in its frontmatter. This is enforced, not advisory:
`layouts/_partials/validate-frontmatter.html` calls `errorf` on a page that is
missing any of them, which fails the build and names the file and the fields.
Pages Hugo generates on its own - section lists with no `_index.md`, taxonomy
and term pages - have no frontmatter and are not checked.

The partial is wired in through `layouts/_partials/extend-head.html`, Congo's
own extension point, so the theme stays untouched. Note the leading underscore:
Congo 2.14 uses Hugo's current template layout, where partials live in
`layouts/_partials/`, not `layouts/partials/`.

### Two languages, one tree shape

English (`en`, default) and Portuguese (`pt`) are separate content trees, wired
by `contentDir` in `config/_default/languages.<lang>.toml`. Without that setting
Hugo reads `content/` as a single tree and silently turns `en/` and `pt/` into
sections of the default language - the build still succeeds, so check the
per-language page counts rather than the exit code.

**Paths are identical in both languages**; only labels are translated. A page
lives at `/en/lab/egress/` and `/pt/lab/egress/`, and the Portuguese title is
what differs. Translating URL segments is a later decision, not an oversight.

Every content file needs a **`translationKey`** in its frontmatter. That is what
pairs a page with its counterpart, and without it the language switcher lands on
the home page and `hreflang` has nothing to point at. Both files in a pair carry
the same key.

`locale` in the language config is what reaches `<html lang>`; the language key
(the file name, `languages.pt.toml`) is what reaches URLs and `hreflang`. They
are deliberately different for Portuguese: `pt` in the URL, `pt-BR` in the tag.

Portuguese theme strings come from `i18n/pt.yaml` in this repository. Congo
ships `pt-BR` and `pt-PT` but no plain `pt`, and Hugo looks translations up by
the language key, so the file has to live here.

### Search

Client-side, over a JSON index Hugo emits for each language's home page
(`[outputs] home` in `hugo.toml`, `enableSearch` in `params.toml`). Fuse.js
ships inside the theme and is bundled into the site's own JavaScript, so the
search box reaches no third party.

It is an overlay opened from the menu entry with `action = "search"`, not a
page, so there is no `search.md` to write.

### Share previews and the 404

The theme emits every Open Graph and Twitter tag except the image, so
`layouts/_partials/extend-head.html` adds `og:image` and `twitter:image`,
picking `static/og-default-<lang>.png` by language. Both images are
placeholders. There is deliberately no `twitter:site` or `twitter:creator`:
those name an account, and there is none.

`static/404.html` is a standalone bilingual page, not a copy of the themed one.
Hugo generates a 404 inside each language, but GitHub Pages only ever serves
`/404.html`, and nothing generates that while the languages live in
subdirectories. At the root no language has been chosen, so offering both is
the honest answer - and a page that depends on no theme cannot drift from one.

### Checks

`.github/workflows/pr.yml` runs on every pull request, whatever it targets: the
build command above, then `lychee --offline` over the generated `public/`, which
resolves internal links without making a single network request. Congo emits
root-relative links, so lychee needs `--root-dir` pointing at `public/` or it
reports every page as broken.

`.github/workflows/pages.yml` builds and deploys to GitHub Pages, and currently
runs **only when started by hand**. The site is not published while its content
is placeholder, so merging to `main` changes nothing a visitor can see. The
workflow's own comment carries the two steps that turn publishing back on; both
are needed, neither is enough alone.

Both install Hugo through `.github/actions/setup-hugo`, which downloads the
pinned release and verifies it against its published SHA-256 before installing.
That composite action is the single place the Hugo version and its checksum are
declared - change them there, together, taking the checksum from the release's
own `hugo_<version>_checksums.txt`. Third-party actions are pinned to commit
SHAs rather than tags, since a tag can be repointed after review; the comment
above each one records the version that SHA corresponds to.

### Customising Congo

Never edit `themes/congo/`. It is a pinned submodule, so edits there are untracked by
this repository and lost on the next theme update. Customise from this repository
instead:

- `assets/css/custom.css` - extra CSS, loaded by the theme after its own stylesheet.
- `assets/css/schemes/<name>.css` - a colour scheme, selected by `params.colorScheme`
  in `config/_default/hugo.toml`.
- `layouts/` - own partials and templates, which override the theme's file for file.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
