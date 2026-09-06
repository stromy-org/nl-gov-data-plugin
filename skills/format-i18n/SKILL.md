---
name: format-i18n
description: "Maintain a deliverable that exists in several languages without the versions drifting apart. Reports exactly which translation units are missing, stale, current or obsolete for a target locale; returns only the units that must be translated; validates a translated batch against the source's protected tokens, placeholders, URLs, figures and terminology; and hands back a replacement target state for the caller to persist. Use when asked to translate a deliverable, add a language version, check whether a translation is up to date, find out what changed since the last translation, or work out why an English copy still has source-language text in it. Triggers on \"translate this\", \"add an English version\", \"is the translation current\", \"what changed since we translated it\", \"the translation is out of date\", \"half of it is still in Dutch\", \"keep the language versions in sync\"."
client_summary: "Keep a deliverable's language versions in step — translate only what changed, and never silently overwrite someone's correction."
---
<!--
  GENERATED FILE — DO NOT EDIT.
  Owner:       scripts/sync-mcp-skill-stubs.py (via sync-on-mcp-skill-change.yml)
  Source:      MCPs/stromy-format-mcp/skills/format-i18n/SKILL.md
  This workflow pushes DIRECT to this repo's main — a local edit here will be
  overwritten or rejected non-fast-forward. Edit the source, push, then:
    gh workflow run sync-on-mcp-skill-change.yml -R stromy-org/stromy-org
  Hand-authored skill? Set `_local: true` in frontmatter instead.
-->

# Keeping language versions in step (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `stromy-format` MCP with `path="skills/format-i18n/SKILL.md"`.

   **Read it to the end.** `fs_read` returns one page at a time. If the result's `next_offset_chars` is not null — or the returned text ends in a `<<< PARTIAL READ … >>>` block — the body is incomplete: call `fs_read` again with `offset_chars` set to that value and concatenate, repeating until it comes back null. Do **not** start work on a partial skill body. Hard rules and anti-patterns often sit in the final third, and a partial read fails silently — it looks like a complete skill.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/format-i18n"` (and `path="skills/format-i18n/references"`),
   → call `fs_read` with `path="skills/format-i18n/references/<file>"`.

Follow the instructions returned by the MCP exactly.

## This MCP is the only correct path

Produce this skill's output **only** by following the live SKILL.md fetched above and calling the `stromy-format` MCP's own tools. Do **not** substitute a local or identically-named base skill from elsewhere, and do **not** invent your own output path. A locally-produced or unbranded artifact is **wrong output, not a fallback** — it bypasses the server-side brand and quality gates.
