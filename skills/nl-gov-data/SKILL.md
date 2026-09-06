---
name: nl-gov-data
description: "Track Dutch public affairs signals across Tweede Kamer, OpenOverheid (active disclosure), KOOP publications (incl. CVDR + local gmb/prb/wsb/bgr), BWB legislation, Wetgevingskalender, ROO organizations, Rechtspraak (caselaw), CBS (statistics), and data.overheid.nl (discovery) using the `nl-gov-data` MCP. Supports sixteen workflows: topic monitoring, dossier tracking, actor briefs, committee watch, legislative scan, ministry narrative, parliamentary landscape snapshot, legislation lookup, legislative calendar watch, law-to-dossier brief, organization lookup, caselaw watch, quantitative grounding (CBS), discovery (data.overheid.nl), EU↔NL legal-act linkage, and exploratory MCP testing. Now also supports content deep-reading: fetching and quoting actual document text (motions, bills, letters, debate transcripts, law articles, attachments). Produces structured JSON shaped for downstream Stromy workflows with `workflow_type`, `query_params`, `results`, and `metadata`. Use this skill whenever the user asks about Dutch parliament activity, Tweede Kamer dossiers, Dutch government policy signals, kamerstukken, dossier numbers, Dutch MPs, faction composition, ministry narrative, Dutch laws, legislation, wetgeving, wetgevingskalender, government organizations, OR wants to read/quote/summarize a specific Dutch government document, transcript, law article, or attachment."
client_summary: "Ask open questions of the Dutch government record when no other research skill quite fits."
---
<!--
  GENERATED FILE — DO NOT EDIT.
  Owner:       scripts/sync-mcp-skill-stubs.py (via sync-on-mcp-skill-change.yml)
  Source:      MCPs/nl-gov-data/skills/nl-gov-data/SKILL.md
  This workflow pushes DIRECT to this repo's main — a local edit here will be
  overwritten or rejected non-fast-forward. Edit the source, push, then:
    gh workflow run sync-on-mcp-skill-change.yml -R stromy-org/stromy-org
  Hand-authored skill? Set `_local: true` in frontmatter instead.
-->

# Dutch Government Data (MCP-hosted skill)

This skill's full instructions are hosted on the `nl-gov-data` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `nl-gov-data` MCP with `path="skills/nl-gov-data/SKILL.md"`.

   **Read it to the end.** `fs_read` returns one page at a time. If the result's `next_offset_chars` is not null — or the returned text ends in a `<<< PARTIAL READ … >>>` block — the body is incomplete: call `fs_read` again with `offset_chars` set to that value and concatenate, repeating until it comes back null. Do **not** start work on a partial skill body. Hard rules and anti-patterns often sit in the final third, and a partial read fails silently — it looks like a complete skill.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/nl-gov-data"` (and `path="skills/nl-gov-data/references"`),
   → call `fs_read` with `path="skills/nl-gov-data/references/<file>"`.

Follow the instructions returned by the MCP exactly.

## This MCP is the only correct path

Produce this skill's output **only** by following the live SKILL.md fetched above and calling the `nl-gov-data` MCP's own tools. Do **not** substitute a local or identically-named base skill from elsewhere, and do **not** invent your own output path. A locally-produced or unbranded artifact is **wrong output, not a fallback** — it bypasses the server-side brand and quality gates.
