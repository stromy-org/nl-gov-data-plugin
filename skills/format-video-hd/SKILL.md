---
name: format-video-hd
description: "Author a premium branded explainer VIDEO — a server-rendered MP4 with animated titles, kinetic typography, animated process-flow diagrams, animated data (data-bars, KPI count-ups), image reveals, captions, and optional voiceover or music. Storyboard-first and accuracy-gated: plans a scene-by-scene shot list with per-scene citations, runs the voice cascade, then renders via the async `render_video` MCP tool behind a brand gate and a per-scene visual review. Brand-required, wired to the plugin''s overlay (`brand_context.json`, `assets.json`). USE THIS whenever someone wants a video, explainer, animated explainer, motion-graphics video, product/strategy/plan walkthrough, or a brief, plan or report turned into a branded video — even if they never say ''video''. Content is condensed and accurate, never fabricated. Siblings: an HTML-to-MP4 clip for a deck or PDF → format-motion; generative AI footage → video-production; an editable branded deck → format-pptx-hd."
client_summary: "Produce a short branded explainer video with animated titles, visuals and optional voiceover."
---
<!--
  GENERATED FILE — DO NOT EDIT.
  Owner:       scripts/sync-mcp-skill-stubs.py (via sync-on-mcp-skill-change.yml)
  Source:      MCPs/stromy-format-mcp/skills/format-video-hd/SKILL.md
  This workflow pushes DIRECT to this repo's main — a local edit here will be
  overwritten or rejected non-fast-forward. Edit the source, push, then:
    gh workflow run sync-on-mcp-skill-change.yml -R stromy-org/stromy-org
  Hand-authored skill? Set `_local: true` in frontmatter instead.
-->

# Video-HD: Branded Explainer Videos (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `stromy-format` MCP with `path="skills/format-video-hd/SKILL.md"`.

   **Read it to the end.** `fs_read` returns one page at a time. If the result's `next_offset_chars` is not null — or the returned text ends in a `<<< PARTIAL READ … >>>` block — the body is incomplete: call `fs_read` again with `offset_chars` set to that value and concatenate, repeating until it comes back null. Do **not** start work on a partial skill body. Hard rules and anti-patterns often sit in the final third, and a partial read fails silently — it looks like a complete skill.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/format-video-hd"` (and `path="skills/format-video-hd/references"`),
   → call `fs_read` with `path="skills/format-video-hd/references/<file>"`.

Follow the instructions returned by the MCP exactly.

## This MCP is the only correct path

Produce this skill's output **only** by following the live SKILL.md fetched above and calling the `stromy-format` MCP's own tools. Do **not** substitute a local or identically-named base skill from elsewhere, and do **not** invent your own output path. A locally-produced or unbranded artifact is **wrong output, not a fallback** — it bypasses the server-side brand and quality gates.
