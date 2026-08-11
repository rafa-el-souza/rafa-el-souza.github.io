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
