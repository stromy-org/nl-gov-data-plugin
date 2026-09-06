---
name: nl-tensions
description: "Detect contradictions, said-vs-did gaps, and non-obvious tensions in Dutch public policy using the nl-gov-data MCP. Produces structured, source-cited tension reports for public-affairs consultants — dormant dossiers, expired motions, taxonomy absences, coalition flips, ministerial commitments not kept, claim-vs-structure mismatches. Use this skill whenever the user asks about tensions, contradictions, gaps, what's not adding up, said-vs-spent, where a policy is stuck, why something hasn't moved, or angles for a roundtable on a Dutch policy topic. Do NOT trigger for: monitoring ('what's happening on X' → nl-gov-data); strategy ('what should we recommend' — out of scope); comprehensive commitment tracking of a defined corpus, said-vs-done, promised-vs-delivered, or toezeggingen delivery status (→ nl-accountability); single-claim fact-checking ('is this figure true' → nl-evidence-grounding); entity or issue reputation framing (→ nl-issue-framing). Output is evidence-and-structure only; never recommendations."
client_summary: "Find contradictions and said-versus-did gaps in Dutch policy that others have missed."
---
<!--
  GENERATED FILE — DO NOT EDIT.
  Owner:       scripts/sync-mcp-skill-stubs.py (via sync-on-mcp-skill-change.yml)
  Source:      MCPs/nl-gov-data/skills/nl-tensions/SKILL.md
  This workflow pushes DIRECT to this repo's main — a local edit here will be
  overwritten or rejected non-fast-forward. Edit the source, push, then:
    gh workflow run sync-on-mcp-skill-change.yml -R stromy-org/stromy-org
  Hand-authored skill? Set `_local: true` in frontmatter instead.
-->

# Tensions (MCP-hosted skill)

This skill's full instructions are hosted on the `nl-gov-data` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `nl-gov-data` MCP with `path="skills/nl-tensions/SKILL.md"`.

   **Read it to the end.** `fs_read` returns one page at a time. If the result's `next_offset_chars` is not null — or the returned text ends in a `<<< PARTIAL READ … >>>` block — the body is incomplete: call `fs_read` again with `offset_chars` set to that value and concatenate, repeating until it comes back null. Do **not** start work on a partial skill body. Hard rules and anti-patterns often sit in the final third, and a partial read fails silently — it looks like a complete skill.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/nl-tensions"` (and `path="skills/nl-tensions/references"`),
   → call `fs_read` with `path="skills/nl-tensions/references/<file>"`.

Follow the instructions returned by the MCP exactly.

## This MCP is the only correct path

Produce this skill's output **only** by following the live SKILL.md fetched above and calling the `nl-gov-data` MCP's own tools. Do **not** substitute a local or identically-named base skill from elsewhere, and do **not** invent your own output path. A locally-produced or unbranded artifact is **wrong output, not a fallback** — it bypasses the server-side brand and quality gates.
