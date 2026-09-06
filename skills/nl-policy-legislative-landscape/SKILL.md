---
name: nl-policy-legislative-landscape
description: "Build deep Dutch official-source policy and legislative landscape analyses from the nl-gov-data MCP. Use this whenever the user asks for a policy landscape, legislative scan, dossier map, official activity timeline, regulatory baseline, PA/PR policy baseline, or consulting-style report on a Dutch public-policy topic. The skill is strongest for connecting Tweede Kamer, KOOP, BWB, Wetgevingskalender, Rijksoverheid, ministries, committees, and official bodies into a client-ready landscape with sources, dates, links, implications, and priority reading. Do NOT use once the request narrows to a single named entity or product (→ nl-issue-framing), asks who matters or who moves a decision (→ nl-parliamentary-positioning), asks about said-vs-done or a specific contradiction (→ nl-tensions for ad hoc angles, nl-accountability for a frozen commitment-corpus tracker), or asks to verify one specific figure or claim (→ nl-evidence-grounding)."
client_summary: "Get the full picture of Dutch policy and legislation on a topic, in one report."
---
<!--
  GENERATED FILE — DO NOT EDIT.
  Owner:       scripts/sync-mcp-skill-stubs.py (via sync-on-mcp-skill-change.yml)
  Source:      MCPs/nl-gov-data/skills/nl-policy-legislative-landscape/SKILL.md
  This workflow pushes DIRECT to this repo's main — a local edit here will be
  overwritten or rejected non-fast-forward. Edit the source, push, then:
    gh workflow run sync-on-mcp-skill-change.yml -R stromy-org/stromy-org
  Hand-authored skill? Set `_local: true` in frontmatter instead.
-->

# Dutch Policy And Legislative Landscape (MCP-hosted skill)

This skill's full instructions are hosted on the `nl-gov-data` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `nl-gov-data` MCP with `path="skills/nl-policy-legislative-landscape/SKILL.md"`.

   **Read it to the end.** `fs_read` returns one page at a time. If the result's `next_offset_chars` is not null — or the returned text ends in a `<<< PARTIAL READ … >>>` block — the body is incomplete: call `fs_read` again with `offset_chars` set to that value and concatenate, repeating until it comes back null. Do **not** start work on a partial skill body. Hard rules and anti-patterns often sit in the final third, and a partial read fails silently — it looks like a complete skill.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/nl-policy-legislative-landscape"` (and `path="skills/nl-policy-legislative-landscape/references"`),
   → call `fs_read` with `path="skills/nl-policy-legislative-landscape/references/<file>"`.

Follow the instructions returned by the MCP exactly.

## This MCP is the only correct path

Produce this skill's output **only** by following the live SKILL.md fetched above and calling the `nl-gov-data` MCP's own tools. Do **not** substitute a local or identically-named base skill from elsewhere, and do **not** invent your own output path. A locally-produced or unbranded artifact is **wrong output, not a fallback** — it bypasses the server-side brand and quality gates.
