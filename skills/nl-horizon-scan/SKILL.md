---
name: nl-horizon-scan
description: "Forward-foresight scan for Dutch policy and regulatory signals over 6–36 months. STEEP/STEEPS environmental scan across the internetconsultatie/Wetgevingskalender pipeline, EU forcing functions (EUR-Lex directives/regulations), procurement signals (TED), Senate status (Eerste Kamer), and planning-bureau foresight (PBL/CPB/SCP); time-bucketed 0–6/6–18/18–36 months; rated on a 2×2 impact×likelihood grid (Watch/Track/Alert/Priority); prioritised watchlist with review cadence. Use when the user asks what is coming in the next 1–3 years, what EU directives will force NL legislation, what signals to monitor for a sector, or wants a horizon scan, foresight brief, or forward radar. Do NOT trigger for: a single known bill's passage forecast (→ nl-dossier-tracker); article-level directive transposition mapping (→ nl-eu-transposition); a weekly what-changed digest (→ nl-monitor); deep backward/current topic synthesis on one topic (→ nl-policy-legislative-landscape)."
client_summary: "Look 6 to 36 months ahead at Dutch policy and regulation likely to affect you."
---
<!--
  GENERATED FILE — DO NOT EDIT.
  Owner:       scripts/sync-mcp-skill-stubs.py (via sync-on-mcp-skill-change.yml)
  Source:      MCPs/nl-gov-data/skills/nl-horizon-scan/SKILL.md
  This workflow pushes DIRECT to this repo's main — a local edit here will be
  overwritten or rejected non-fast-forward. Edit the source, push, then:
    gh workflow run sync-on-mcp-skill-change.yml -R stromy-org/stromy-org
  Hand-authored skill? Set `_local: true` in frontmatter instead.
-->

# Horizon Scan (MCP-hosted skill)

This skill's full instructions are hosted on the `nl-gov-data` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `nl-gov-data` MCP with `path="skills/nl-horizon-scan/SKILL.md"`.

   **Read it to the end.** `fs_read` returns one page at a time. If the result's `next_offset_chars` is not null — or the returned text ends in a `<<< PARTIAL READ … >>>` block — the body is incomplete: call `fs_read` again with `offset_chars` set to that value and concatenate, repeating until it comes back null. Do **not** start work on a partial skill body. Hard rules and anti-patterns often sit in the final third, and a partial read fails silently — it looks like a complete skill.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/nl-horizon-scan"` (and `path="skills/nl-horizon-scan/references"`),
   → call `fs_read` with `path="skills/nl-horizon-scan/references/<file>"`.

Follow the instructions returned by the MCP exactly.

## This MCP is the only correct path

Produce this skill's output **only** by following the live SKILL.md fetched above and calling the `nl-gov-data` MCP's own tools. Do **not** substitute a local or identically-named base skill from elsewhere, and do **not** invent your own output path. A locally-produced or unbranded artifact is **wrong output, not a fallback** — it bypasses the server-side brand and quality gates.
