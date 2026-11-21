# Static site mirror

A fully static, offline site whose layout is based on the core pages of
<https://revanced.app/>, adapted for 海口实验中学科技社 (HKEMS-STMO): local
assets only, relative paths, a day/night theme switch, and announcement pages
built from the club's own documents.

## Pages

| File | Source page |
| --- | --- |
| `index.html` | `/` |
| `joinus.html` | `/download` |
| `aboutus.html` | `/contributors` |
| `donate.html` | `/donate` |
| `announcements.html` | `/announcements` (list) |
| `pages/bd7qbg.html` | announcement: 新型无线电简语 “QBG”与其释义 |
| `pages/2027.html` | announcement: 2027届新生加群验证 |
| `pages/article.html` | announcement: 公告标准模板 |
| `pages/culture-creative-2023.html` | announcement: 2023年实验文创预售 |
| `pages/use-scheduling.html` | announcement: 科技教室使用安排 |

## Structure

```
.
├── index.html / joinus.html / aboutus.html / donate.html / announcements.html
├── pages/                     # the five announcement detail pages (assets referenced via ../)
├── partials/
│   ├── header.html            # skip link + sticky navigation + drawer overlay
│   └── footer.html            # wavy divider + footer + deploy badges
├── src/pages/                 # <main> content only (one file per page)
├── assets/
│   ├── css/base.css           # original global + button styles
│   ├── css/home.css           # page specific styles
│   ├── css/joinus.css
│   ├── css/aboutus.css
│   ├── css/donate.css
│   ├── css/announcements.css
│   ├── css/theme.css          # light palette, theme toggle, media blocks
│   ├── js/main.js             # theme switch, drawer, wave, archive/search, repo accordion
│   ├── fonts/                 # Manrope variable fonts (relative paths only)
│   └── img/                   # screenshots, badges, icons, contributors, upload/
├── sitemap.xml                # ten URLs
├── build.py                   # re-assembles every page from partials + src + css
└── README.md
```

## Rebuild

```
python build.py
```

The script assembles every page from `partials/` and `src/pages/`, copies the
per-page CSS, validates that all local links and assets resolve, and rewrites
`sitemap.xml`.

## Notes

- No build step is required to view the site: open `index.html` directly.
- All paths are relative, so the folder can be dropped anywhere.
- No external requests are made by the pages themselves, except the embedded
  bilibili player on `pages/bd7qbg.html` and the announcement document links.
- Theme choice is stored in `localStorage` under `theme`.
