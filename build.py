#!/usr/bin/env python3
"""Assemble the ReVanced placeholder mirror from partials/ and src/pages/.

Usage:  python build.py
The output is written next to this file (index.html, joinus.html, ...).
"""
import pathlib
import re
import sys
import urllib.parse

ROOT = pathlib.Path(__file__).resolve().parent
DEFAULT_TITLE = "海口实验中学科技社 | HKEMS-STMO"
PAGES = {
    "index":        {"out": "index.html",        "css": ["base.css", "home.css"],        "title": "海口实验中学科技社 | HKEMS-STMO"},
    "joinus":       {"out": "joinus.html",       "css": ["base.css", "joinus.css"],     "title": "加入海口实验中学科技社 | HKEMS-STMO"},
    "aboutus":      {"out": "aboutus.html",      "css": ["base.css", "aboutus.css"],    "title": "关于海口实验中学科技社 | HKEMS-STMO"},
    "donate":       {"out": "donate.html",       "css": ["base.css", "donate.css"],     "title": "赞助海口实验中学科技社 | HKEMS-STMO"},
    "announcements":{"out": "announcements.html","css": ["base.css", "announcements.css"], "title": "海口实验中学科技社的活动 | HKEMS-STMO"},
    "bd7qbg": {"out": "pages/bd7qbg.html", "css": ["base.css", "announcements.css"]},
    "2027": {"out": "pages/2027.html", "css": ["base.css", "announcements.css"]},
    "article": {"out": "pages/article.html", "css": ["base.css", "announcements.css"]},
    "culture-creative-2023": {"out": "pages/culture-creative-2023.html", "css": ["base.css", "announcements.css"]},
    "use-scheduling": {"out": "pages/use-scheduling.html", "css": ["base.css", "announcements.css"]},
}
EXAMPLE_URL = "https://example.com/"
ANNOUNCEMENT_PAGES = {"bd7qbg", "2027", "article", "culture-creative-2023", "use-scheduling"}
PAGE_LINKS = {"index.html", "joinus.html", "aboutus.html", "donate.html", "announcements.html"}
PAGE_LINKS |= {"pages/" + k + ".html" for k in ANNOUNCEMENT_PAGES}

EXTERNAL_LINKS = {
    "https://github.com/kaguya810",
    "https://github.com/BG7ZDQ",
    "https://github.com/HKEMS-STMO-Webmasters",
    "https://www.deepseek.com/harness/",
    "https://weibo.com/u/7810333559",
    "https://hkems-stmo.top/",
    "https://github.com/HKEMS-STMO",
    "https://qm.qq.com/q/dMBOmzmfGo&personal_qrcode_source=1001",
    "https://ti.qq.com/open_qq/index2.html?url=mqqapi%3a%2f%2fuserprofile%2ffriend_profile_card%3fsrc_type%3dweb%26version%3d1.0%26source%3d2%26uin%3d3478298786",
}
DEPLOY_LINKS = {
    "https://vercel.com/new/clone?repository-url=https://github.com/HKEMS-STMO/New-official-website",
    "https://app.netlify.com/start/deploy?repository=https://github.com/HKEMS-STMO/New-official-website",
}

INIT_SCRIPT = """<script>
(function () {
  var t = null;
  try { t = localStorage.getItem("theme"); } catch (e) {}
  if (t !== "light" && t !== "dark") {
    t = (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) ? "light" : "dark";
  }
  document.documentElement.setAttribute("data-theme", t);
})();
</script>"""

LAYOUT = """<!DOCTYPE html>
<html lang="zh-CN" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>@@TITLE@@</title>
<meta name="description" content="Text">
<meta name="color-scheme" content="dark light">
<link rel="icon" type="image/x-icon" href="assets/img/favicon.ico">
<script>
(function () {
  var t = null;
  try { t = localStorage.getItem("theme"); } catch (e) {}
  if (t !== "light" && t !== "dark") {
    t = (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) ? "light" : "dark";
  }
  document.documentElement.setAttribute("data-theme", t);
})();
</script>
@@STYLES@@
</head>
<body>
@@HEADER@@

@@CONTENT@@

@@FOOTER@@
<script src="assets/js/main.js" defer></script>
</body>
</html>
"""


SVELTE_TOKEN = re.compile(r"svelte-[A-Za-z0-9_-]+")


def strip_svelte_html(text):
    """Drop the framework's scoping classes from every class="" attribute."""

    def clean(match):
        value = SVELTE_TOKEN.sub("", match.group(1))
        return 'class="%s"' % re.sub(r"\s+", " ", value).strip()

    return re.sub(r'class="([^"]*)"', clean, text)


def strip_svelte_css(text):
    """Drop the scoping class suffixes from CSS selectors."""
    text = re.sub(r":(?:where|is)\(\s*\.svelte-[A-Za-z0-9_-]+\s*\)", "", text)
    text = re.sub(r"\.svelte-[A-Za-z0-9_-]+", "", text)
    return re.sub(r"svelte-[A-Za-z0-9]+-", "", text)


REL_LINK = re.compile(r'((?:href|src)=")(?!(?:[a-z]+:)|//|#|data:)([^"]+)"')


def relativize(page):
    """Prefix local links with ../ so pages inside sub folders resolve against the site root."""
    return REL_LINK.sub(lambda m: m.group(1) + "../" + m.group(2) + '"', page)


def activate_nav(header, key):
    pattern = re.compile(r'(<a\b[^>]*\bdata-nav="%s"[^>]*)>' % re.escape(key))

    def repl(match):
        tag = match.group(1)
        tag = re.sub(r'class="([^"]*)"', lambda m: 'class="%s active"' % m.group(1), tag, count=1)
        return tag + ' aria-current="page">'

    header = pattern.sub(repl, header)
    return re.sub(r'\s+data-nav="[^"]*"', "", header)


def validate(path, body, allow_external=False):
    errors = []
    hrefs = re.findall(r'href="([^"]+)"', body)
    for href in hrefs:
        norm = href[3:] if href.startswith("../") else href
        if (norm in PAGE_LINKS or href in PAGE_LINKS or norm in EXTERNAL_LINKS
            or href in EXTERNAL_LINKS or href in DEPLOY_LINKS or href.startswith("#")):
            continue
        if (not re.match(r"^[a-z][a-z0-9+.-]*:", href)
                and not href.startswith(("//", "#", "data:"))
                and (path.parent / urllib.parse.unquote(href)).resolve().exists()):
            continue
        if allow_external and not norm.startswith("javascript:"):
            continue
        if href != EXAMPLE_URL:
            errors.append("unexpected href: " + href)
    for src in re.findall(r'src="([^"]+)"', body):
        if src.startswith("data:"):
            continue
        if allow_external and src.startswith(("https://", "http://")):
            continue
        if src.startswith(("http:", "https:", "//", "/")):
            errors.append("non-relative src: " + src)
        elif not (path.parent / urllib.parse.unquote(src)).resolve().exists():
            errors.append("missing asset: " + src)
    text = path.read_text(encoding="utf-8")
    if "revanced.app" in text or "github.com/revanced" in text:
        errors.append("original URL leaked into output")
    return errors


def main():
    header = (ROOT / "partials" / "header.html").read_text(encoding="utf-8")
    footer = (ROOT / "partials" / "footer.html").read_text(encoding="utf-8")
    header = strip_svelte_html(header)
    footer = strip_svelte_html(footer)

    for css in (ROOT / "assets" / "css").glob("*.css"):
        source = css.read_text(encoding="utf-8")
        cleaned = strip_svelte_css(source)
        if cleaned != source:
            css.write_text(cleaned, encoding="utf-8")

    problems = 0
    for key, cfg in PAGES.items():
        content = (ROOT / "src" / "pages" / (key + ".html")).read_text(encoding="utf-8")
        content = strip_svelte_html(content)
        styles = "\n".join(
            '<link rel="stylesheet" href="assets/css/%s">' % name for name in cfg["css"]
        )
        styles += '\n<link rel="stylesheet" href="assets/css/theme.css">'
        page = (LAYOUT
                .replace("@@TITLE@@", cfg.get("title", DEFAULT_TITLE))
                .replace("@@STYLES@@", styles)
                .replace("@@HEADER@@", activate_nav(header, "announcements" if key in ANNOUNCEMENT_PAGES else key))
                .replace("@@CONTENT@@", content)
                .replace("@@FOOTER@@", footer))
        out = ROOT / cfg["out"]
        out.parent.mkdir(parents=True, exist_ok=True)
        if out.parent != ROOT:
            page = relativize(page)
        out.write_text(page, encoding="utf-8")

        body = page.split("<body", 1)[1]
        errors = validate(out, body, allow_external=key in ANNOUNCEMENT_PAGES)
        status = "ok" if not errors else "%d problem(s)" % len(errors)
        print("  %-18s %6d bytes  %s" % (cfg["out"], len(page.encode("utf-8")), status))
        for err in errors:
            problems += 1
            print("      -", err)

    if problems:
        print("validation failed:", problems)
        return 1
    # sitemap for the mirrored pages (used as a reference for the site search)
    urls = "".join(
        "  <url><loc>https://example.com/%s</loc><changefreq>weekly</changefreq></url>\n" % cfg["out"]
        for cfg in PAGES.values()
    )
    (ROOT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + urls + "</urlset>\n", encoding="utf-8")
    print("all pages assembled and validated")
    return 0


if __name__ == "__main__":
    sys.exit(main())
