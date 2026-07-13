# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Hugo static site for GVT (Games and Visuals Trójmiasto) gamedev meetups, using the PaperMod theme as a git submodule (`themes/PaperMod`). Deployed to GitHub Pages via `.github/workflows/hugo.yml` on push to `master`. A `Dockerfile` (hugo build + nginx) exists as an alternative deployment.

## Commands

- `hugo server` — local dev server (site has `buildFuture: true`, so future-dated talks render)
- `hugo --minify` — production build to `public/` (`public/` is build output; don't hand-edit it)
- `npx prettier --write <file>` — format; `.prettierrc` uses `prettier-plugin-go-template` so Hugo templates in `layouts/` format correctly
- After fresh clone: `git submodule update --init` (theme won't build without it)

There are no tests.

## Hugo version management

The pinned Hugo version lives in exactly one place: the `FROM hugomods/hugo:X.Y.Z` line in the Dockerfile. The GitHub Pages workflow parses it from there — to bump Hugo, change only that line. `config.yaml` sets `module.hugoVersion.min` as a compatibility floor (bump it only when the theme requires a newer Hugo). Local installs are managed via winget (`winget upgrade Hugo.Hugo.Extended`).

## Content model

- **Talks** live in `content/talks/YYYY-MM-DD-speaker.md`, one file per talk, with a matching cover image in `assets/images/talks/YYYY-MM-DD-speaker.{png,jpg,webp}`. Adding a talk = new md file + image. Front matter fields: `title` (format `GVT #N: Talk title`), `date`, `speaker`, `speakerInfo` (markdown), `description`, `cover.image`, and optionally `youtube` (recording link).
- Custom front matter is rendered via the theme's extension points where possible: `layouts/_partials/extend_post_content.html` (theme hook, survives theme updates) embeds the `youtube` URL as an iframe and shows `speaker`/`speakerInfo`; the footer credit and cover-hiding are plain config (`params.footer.text`, `params.cover.hiddenInSingle`). The only true template fork is `layouts/list.html` (adds a YouTube icon link on list entries — the theme has no hook there); when updating the PaperMod submodule, re-diff it against `themes/PaperMod/layouts/list.html` and re-apply the youtube-link div.
- **Redirect pages** (e.g. `content/discord/`, `content/gizmo/`): front matter `type: redirect` + `target: <url>`, rendered by `layouts/redirect/single.html` as a meta-refresh page. Use this pattern for new short links like `/discord`.
- Known prettier gotcha: `prettier-plugin-go-template` errors with "unexpected end keyword" on comments like `{{/* end main */}}` — write them as `{{- /* end main */ -}}`.
- Site config, social links, and homepage text are all in `config.yaml`.

## Announcement generator

`static/generator/` is a standalone, framework-free set of HTML pages (`meetup.html`, `speaker.html`, `pygda.html`) with plain JS in `js/` that render meetup/speaker announcement images in-browser. It is served as-is by Hugo at `/generator/…` and is independent of the Hugo templating — edit its HTML/CSS/JS directly.
