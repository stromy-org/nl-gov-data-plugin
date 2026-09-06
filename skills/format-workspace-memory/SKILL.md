---
name: format-workspace-memory
description: "Load and maintain the project record in a client's SharePoint workspace — the shared, client-readable account of what a project is, what was decided, what is open, and what has been delivered. Use at the START of work on an existing project (so you continue instead of re-briefing), and again whenever a meaningful milestone, decision, client correction, risk, or delivery happens. Triggers on \"what's the status of this project\", \"pick up where we left off\", \"continue the campaign\", \"record that we agreed X\", \"log this decision\", \"update the project record\", or any request to resume or capture the state of ongoing client work."
client_summary: "Keep a shared record of a project so work picks up where it left off instead of re-briefing."
---
<!--
  GENERATED FILE — DO NOT EDIT.
  Owner:       scripts/sync-mcp-skill-stubs.py (via sync-on-mcp-skill-change.yml)
  Source:      MCPs/stromy-format-mcp/skills/format-workspace-memory/SKILL.md
  This workflow pushes DIRECT to this repo's main — a local edit here will be
  overwritten or rejected non-fast-forward. Edit the source, push, then:
    gh workflow run sync-on-mcp-skill-change.yml -R stromy-org/stromy-org
  Hand-authored skill? Set `_local: true` in frontmatter instead.
-->

# Workspace memory — the shared project record (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `stromy-format` MCP with `path="skills/format-workspace-memory/SKILL.md"`.

   **Read it to the end.** `fs_read` returns one page at a time. If the result's `next_offset_chars` is not null — or the returned text ends in a `<<< PARTIAL READ … >>>` block — the body is incomplete: call `fs_read` again with `offset_chars` set to that value and concatenate, repeating until it comes back null. Do **not** start work on a partial skill body. Hard rules and anti-patterns often sit in the final third, and a partial read fails silently — it looks like a complete skill.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/format-workspace-memory"` (and `path="skills/format-workspace-memory/references"`),
   → call `fs_read` with `path="skills/format-workspace-memory/references/<file>"`.

Follow the instructions returned by the MCP exactly.

## This MCP is the only correct path

Produce this skill's output **only** by following the live SKILL.md fetched above and calling the `stromy-format` MCP's own tools. Do **not** substitute a local or identically-named base skill from elsewhere, and do **not** invent your own output path. A locally-produced or unbranded artifact is **wrong output, not a fallback** — it bypasses the server-side brand and quality gates.
