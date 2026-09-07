---
name: nl-evidence-grounding
description: "Fact-check one Dutch policy claim or figure against the official record — CBS statistics, Rijksfinanciën budget phases (OWB/O1/O2/JV), kamerstukken, Rechtspraak — producing a source-cited Evidence Dossier: falsifiable restatement, source-independence table, fixed-vocabulary triangulation verdict, causation audit, and debate-connect trace (toezegging → budget → CBS realisation → framing). Use whenever the user asks 'is this claim true', wants a minister's statement or stated figure verified, wants a number grounded in the official record, or asks what CBS says about X. Handles 1-5 bounded claims — a targeted fact-check, not a monitoring stream. Not for: pledge-delivery tracking across a commitment corpus (→ nl-accountability); contradiction-mining across a topic (→ nl-tensions); a full policy landscape survey (→ nl-policy-legislative-landscape)."
client_summary: "Fact-check a Dutch policy claim or figure against the official record."
---
<!--
  GENERATED FILE — DO NOT EDIT.
  Owner:       scripts/sync-mcp-skill-stubs.py (via sync-on-mcp-skill-change.yml)
  Source:      MCPs/nl-gov-data/skills/nl-evidence-grounding/SKILL.md
  This workflow pushes DIRECT to this repo's main — a local edit here will be
  overwritten or rejected non-fast-forward. Edit the source, push, then:
    gh workflow run sync-on-mcp-skill-change.yml -R stromy-org/stromy-org
  Hand-authored skill? Set `_local: true` in frontmatter instead.
-->

# Evidence grounding (MCP-hosted skill)

This skill's full instructions are hosted on the `nl-gov-data` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `nl-gov-data` MCP with `path="skills/nl-evidence-grounding/SKILL.md"`.

   **Read it to the end.** `fs_read` returns one page at a time. If the result's `next_offset_chars` is not null — or the returned text ends in a `<<< PARTIAL READ … >>>` block — the body is incomplete: call `fs_read` again with `offset_chars` set to that value and concatenate, repeating until it comes back null. Do **not** start work on a partial skill body. Hard rules and anti-patterns often sit in the final third, and a partial read fails silently — it looks like a complete skill.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/nl-evidence-grounding"` (and `path="skills/nl-evidence-grounding/references"`),
   → call `fs_read` with `path="skills/nl-evidence-grounding/references/<file>"`.

Follow the instructions returned by the MCP exactly.

## This MCP is the only correct path

Produce this skill's output **only** by following the live SKILL.md fetched above and calling the `nl-gov-data` MCP's own tools. Do **not** substitute a local or identically-named base skill from elsewhere, and do **not** invent your own output path. A locally-produced or unbranded artifact is **wrong output, not a fallback** — it bypasses the server-side brand and quality gates.
