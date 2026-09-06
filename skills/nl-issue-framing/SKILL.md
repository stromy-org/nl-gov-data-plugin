---
name: nl-issue-framing
description: "Analyze how a named subject — a company, product, organisation, technology, sector, or specific policy issue — is framed in official Dutch government and parliamentary records through nl-gov-data. Use this whenever the user wants official-source reputation or issue framing for a specific entity or issue: how an organisation is portrayed, how a product or technology is treated in policy, how a contested issue is characterised, what reputational risks surface in official records. Sector domain packs (e.g. pharma/medicine — Novo Nordisk, GLP-1s, Wegovy, Ozempic, semaglutide, reimbursement, shortages, package management) supply ready keyword banks, default frames, and legal anchors. Produces narrative analysis, mention/context tables, issue maps, PA/PR implications, and DOCX-ready source appendices. Do NOT trigger for: strategy or recommendations ('what should we do about this' — out of scope, no-strategy rule); contradiction or said-vs-done hunting (→ nl-tensions); single-bill/dossier chronology or passage forecasting (→ nl-dossier-tracker); single-claim fact-checking ('is this figure true' → nl-evidence-grounding); comprehensive pledge/commitment tracking across a defined corpus (→ nl-accountability)."
client_summary: "See how your organisation, product or issue is talked about in official Dutch records."
---
<!--
  GENERATED FILE — DO NOT EDIT.
  Owner:       scripts/sync-mcp-skill-stubs.py (via sync-on-mcp-skill-change.yml)
  Source:      MCPs/nl-gov-data/skills/nl-issue-framing/SKILL.md
  This workflow pushes DIRECT to this repo's main — a local edit here will be
  overwritten or rejected non-fast-forward. Edit the source, push, then:
    gh workflow run sync-on-mcp-skill-change.yml -R stromy-org/stromy-org
  Hand-authored skill? Set `_local: true` in frontmatter instead.
-->

# Dutch Official Issue & Entity Framing (MCP-hosted skill)

This skill's full instructions are hosted on the `nl-gov-data` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `nl-gov-data` MCP with `path="skills/nl-issue-framing/SKILL.md"`.

   **Read it to the end.** `fs_read` returns one page at a time. If the result's `next_offset_chars` is not null — or the returned text ends in a `<<< PARTIAL READ … >>>` block — the body is incomplete: call `fs_read` again with `offset_chars` set to that value and concatenate, repeating until it comes back null. Do **not** start work on a partial skill body. Hard rules and anti-patterns often sit in the final third, and a partial read fails silently — it looks like a complete skill.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/nl-issue-framing"` (and `path="skills/nl-issue-framing/references"`),
   → call `fs_read` with `path="skills/nl-issue-framing/references/<file>"`.

Follow the instructions returned by the MCP exactly.

## This MCP is the only correct path

Produce this skill's output **only** by following the live SKILL.md fetched above and calling the `nl-gov-data` MCP's own tools. Do **not** substitute a local or identically-named base skill from elsewhere, and do **not** invent your own output path. A locally-produced or unbranded artifact is **wrong output, not a fallback** — it bypasses the server-side brand and quality gates.
