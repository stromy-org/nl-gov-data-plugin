---
name: format-pptx-hd
description: "TRIGGER on **net-new branded deck creation** (a client charter exists) — pitch/investor/executive **and** ordinary branded new decks — plus explicit HD cues and `render-anchors`. Server-renders via `render_pptx` in the brand fonts with a brand gate, web-openable by default (no local build-script path). HTML-first design with full web stack. Deeply integrated with the invoking plugin's brand overlay (`charter.json`, `tokens.css`, `assets.json`, hero images, boilerplate.json, anchor templates in `templates/pptx/`). **Editing or analyzing an existing deck (branded or not) stays on `format-pptx`** — `pptx-hd` regenerates from HTML and cannot edit in place. Unbranded quick decks also go to `format-pptx`."
client_summary: "Create a new on-brand PowerPoint deck from scratch, in your own fonts and colours."
---
<!--
  GENERATED FILE — DO NOT EDIT.
  Owner:       scripts/sync-mcp-skill-stubs.py (via sync-on-mcp-skill-change.yml)
  Source:      MCPs/stromy-format-mcp/skills/format-pptx-hd/SKILL.md
  This workflow pushes DIRECT to this repo's main — a local edit here will be
  overwritten or rejected non-fast-forward. Edit the source, push, then:
    gh workflow run sync-on-mcp-skill-change.yml -R stromy-org/stromy-org
  Hand-authored skill? Set `_local: true` in frontmatter instead.
-->

# PPTX-HD: High-Fidelity Branded Presentations (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `stromy-format` MCP with `path="skills/format-pptx-hd/SKILL.md"`.

   **Read it to the end.** `fs_read` returns one page at a time. If the result's `next_offset_chars` is not null — or the returned text ends in a `<<< PARTIAL READ … >>>` block — the body is incomplete: call `fs_read` again with `offset_chars` set to that value and concatenate, repeating until it comes back null. Do **not** start work on a partial skill body. Hard rules and anti-patterns often sit in the final third, and a partial read fails silently — it looks like a complete skill.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/format-pptx-hd"` (and `path="skills/format-pptx-hd/references"`),
   → call `fs_read` with `path="skills/format-pptx-hd/references/<file>"`.

Follow the instructions returned by the MCP exactly.

## This MCP is the only correct path

Produce this skill's output **only** by following the live SKILL.md fetched above and calling the `stromy-format` MCP's own tools. Do **not** substitute a local or identically-named base skill from elsewhere, and do **not** invent your own output path. A locally-produced or unbranded artifact is **wrong output, not a fallback** — it bypasses the server-side brand and quality gates.
