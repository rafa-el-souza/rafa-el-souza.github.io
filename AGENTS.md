# Project agent memory

This file is the project's committed home for project-intrinsic agent knowledge: build, test, release, architecture, and sharp-edge notes that should travel with the code.

- Add durable project-specific notes here as they are discovered through real work.

## Build

This is a Hugo + Congo static site. Toolchain is Hugo alone, pinned version, no npm, no
Tailwind rebuild, no Go modules.

Building in the pinned container image requires redirecting the Hugo cache dir, since
the image's default cache dir lives on a read-only rootfs and Congo processes assets
(SCSS, images):

```
hugo --minify --gc
```

Set `HUGO_CACHEDIR` to a writable path (for example `$PWD/.hugo-cache`) when building in
that container. GitHub Actions runs on the runner instead, where the cache dir is
already writable, and does not need this.

Never edit `themes/congo/` - it is a pinned submodule. Customise only via `layouts/`,
own partials, and `assets/css/` (v2).

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
