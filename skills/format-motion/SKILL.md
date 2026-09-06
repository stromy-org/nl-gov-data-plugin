---
name: format-motion
description: "Author tasteful, brand-aware motion across Stromy's HTML surfaces — a substrate-agnostic library of motion primitives (staggered reveal, line-draw, count-up, motion-path, scroll-reveal, element morph) plus the restraint doctrine that keeps motion meaningful and never excessive. Two modes: embed-live (inline a primitive into a deck or website you are hand-authoring — used by format-html-hd, format-html-reveal, and Astro sites in their own idiom) and bake (author a self-contained HTML animation and turn it into an MP4/GIF/PNG-frame sequence via the render_motion MCP tool, for dropping into PowerPoint or a PDF). USE THIS whenever someone wants animation, a motion effect, an animated reveal/transition, a line that draws itself, a counting KPI, an animated explainer, a baked video clip from web animation, or asks to make a deck/site feel alive without it becoming gimmicky. Brand-optional: reads the brand's motion grammar from companies/<slug>/brand_context.json when present, else falls back to neutral doctrine defaults. Siblings: numeric data-viz → format-chart; structural diagrams → format-diagram; full branded explainer video → format-video-hd."
client_summary: "Add restrained, on-brand animation to a deck or web page so movement adds meaning, not noise."
---
<!--
  GENERATED FILE — DO NOT EDIT.
  Owner:       scripts/sync-mcp-skill-stubs.py (via sync-on-mcp-skill-change.yml)
  Source:      MCPs/stromy-format-mcp/skills/format-motion/SKILL.md
  This workflow pushes DIRECT to this repo's main — a local edit here will be
  overwritten or rejected non-fast-forward. Edit the source, push, then:
    gh workflow run sync-on-mcp-skill-change.yml -R stromy-org/stromy-org
  Hand-authored skill? Set `_local: true` in frontmatter instead.
-->

# format-motion — substrate-agnostic motion primitives + restraint doctrine (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `stromy-format` MCP with `path="skills/format-motion/SKILL.md"`.

   **Read it to the end.** `fs_read` returns one page at a time. If the result's `next_offset_chars` is not null — or the returned text ends in a `<<< PARTIAL READ … >>>` block — the body is incomplete: call `fs_read` again with `offset_chars` set to that value and concatenate, repeating until it comes back null. Do **not** start work on a partial skill body. Hard rules and anti-patterns often sit in the final third, and a partial read fails silently — it looks like a complete skill.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/format-motion"` (and `path="skills/format-motion/references"`),
   → call `fs_read` with `path="skills/format-motion/references/<file>"`.

Follow the instructions returned by the MCP exactly.

## This MCP is the only correct path

Produce this skill's output **only** by following the live SKILL.md fetched above and calling the `stromy-format` MCP's own tools. Do **not** substitute a local or identically-named base skill from elsewhere, and do **not** invent your own output path. A locally-produced or unbranded artifact is **wrong output, not a fallback** — it bypasses the server-side brand and quality gates.
