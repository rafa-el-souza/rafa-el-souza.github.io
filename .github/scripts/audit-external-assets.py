#!/usr/bin/env python3
"""Fail if the built site would load anything from another host.

The rule this enforces: a visitor's browser must not make a single request
outside this site. Linking out is fine - a link is a request the reader chooses
to make. Loading a font, a script, a stylesheet or an image from elsewhere is
not, because it happens without asking and tells a third party who is reading.

That distinction is why this parses the HTML instead of grepping it: `<a href>`
is content and must pass, `<script src>` is an asset and must not.

Usage:  python3 .github/scripts/audit-external-assets.py [public_dir]
Exits non-zero and lists every offender.
"""

import pathlib
import re
import sys
from html.parser import HTMLParser
from urllib.parse import urlparse

# Attributes the browser fetches without being asked.
ASSET_ATTRS = {
    "script": ["src"],
    "img": ["src", "srcset"],
    "image": ["href"],
    "iframe": ["src"],
    "embed": ["src"],
    "object": ["data"],
    "source": ["src", "srcset"],
    "video": ["src", "poster"],
    "audio": ["src"],
    "track": ["src"],
    "input": ["src"],
}

# <link> only fetches for certain relations; rel="alternate" and rel="canonical"
# are metadata, not requests.
FETCHING_RELS = {
    "stylesheet",
    "icon",
    "shortcut",
    "apple-touch-icon",
    "apple-touch-icon-precomposed",
    "manifest",
    "preload",
    "prefetch",
    "preconnect",
    "dns-prefetch",
    "modulepreload",
    "mask-icon",
}

CSS_URL = re.compile(r"""url\(\s*['"]?([^'")]+)""", re.I)
CSS_IMPORT = re.compile(r"""@import\s+(?:url\()?\s*['"]?([^'");]+)""", re.I)


class AssetCollector(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.found = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)

        for attr in ASSET_ATTRS.get(tag, []):
            if a.get(attr):
                for url in self._split(attr, a[attr]):
                    self.found.append((f"<{tag} {attr}>", url))

        if tag == "link":
            rels = {r.lower() for r in (a.get("rel") or "").split()}
            if rels & FETCHING_RELS and a.get("href"):
                self.found.append((f'<link rel="{" ".join(sorted(rels))}">', a["href"]))

        if a.get("style"):
            for m in CSS_URL.finditer(a["style"]):
                self.found.append((f"<{tag} style>", m.group(1)))

    def handle_data(self, data):
        # Inline <style> blocks arrive here; cheap enough to scan everything.
        if "url(" in data or "@import" in data:
            for pattern in (CSS_URL, CSS_IMPORT):
                for m in pattern.finditer(data):
                    self.found.append(("inline style", m.group(1)))

    @staticmethod
    def _split(attr, value):
        if attr == "srcset":
            return [p.strip().split()[0] for p in value.split(",") if p.strip()]
        return [value]


def is_external(url: str, allowed: set) -> bool:
    url = url.strip()
    if not url or url.startswith(("data:", "#", "mailto:", "tel:")):
        return False
    parsed = urlparse(url)
    if not parsed.netloc:  # relative or root-relative: same site by definition
        return False
    return parsed.netloc.lower() not in allowed


def allowed_hosts(root: pathlib.Path) -> set:
    """The site's own host, taken from the committed baseURL."""
    config = root.parent / "config" / "_default" / "hugo.toml"
    text = config.read_text(encoding="utf-8") if config.exists() else ""
    m = re.search(r"""baseURL\s*=\s*['"]([^'"]+)""", text)
    if not m:
        sys.exit(f"could not read baseURL from {config}")
    host = urlparse(m.group(1)).netloc.lower()
    return {host}


def main() -> int:
    root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "public").resolve()
    if not root.is_dir():
        sys.exit(f"not a directory: {root}")

    allowed = allowed_hosts(root)
    offenders = []

    for path in sorted(root.rglob("*.html")):
        parser = AssetCollector()
        parser.feed(path.read_text(encoding="utf-8", errors="replace"))
        for where, url in parser.found:
            if is_external(url, allowed):
                offenders.append((path.relative_to(root), where, url))

    for path in sorted(root.rglob("*.css")):
        text = path.read_text(encoding="utf-8", errors="replace")
        for pattern, label in ((CSS_URL, "url()"), (CSS_IMPORT, "@import")):
            for m in pattern.finditer(text):
                if is_external(m.group(1), allowed):
                    offenders.append((path.relative_to(root), label, m.group(1)))

    if offenders:
        print(f"External asset references found ({len(offenders)}):\n")
        for path, where, url in offenders:
            print(f"  {path}\n    {where} -> {url}")
        print(
            "\nEvery asset must be served by this site. Vendor the file into "
            "assets/ or static/ and reference it locally."
        )
        return 1

    print(f"No external asset references. Allowed host: {', '.join(sorted(allowed))}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
