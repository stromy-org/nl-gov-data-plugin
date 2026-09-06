---
name: format-chart
description: "Render brand-aware data-visualisation charts using Plotly.js. The LLM authors any Plotly figure JSON (30+ chart types — waterfall, sankey, sunburst, treemap, funnel, parallel coords, calendar heatmap, candlestick, gauge, radar, themeRiver, marimekko-via-stacked, etc.) and this skill applies the client's brand theme from charter.plotly + tokens.css, then renders to PNG/SVG for embedding in PPTX/DOCX/PDF. Use whenever the user asks for a chart, data visualisation, plot, graph, KPI viz, or asks to add a quantitative visual to a deliverable. Defers to the `format-diagram` skill for structural visuals (process flows, org charts, stakeholder maps) — `chart` is purely numerical data-viz."
client_summary: "Turn your numbers into a clean, on-brand chart you can drop into any deliverable."
---
<!--
  GENERATED FILE — DO NOT EDIT.
  Owner:       scripts/sync-mcp-skill-stubs.py (via sync-on-mcp-skill-change.yml)
  Source:      MCPs/stromy-format-mcp/skills/format-chart/SKILL.md
  This workflow pushes DIRECT to this repo's main — a local edit here will be
  overwritten or rejected non-fast-forward. Edit the source, push, then:
    gh workflow run sync-on-mcp-skill-change.yml -R stromy-org/stromy-org
  Hand-authored skill? Set `_local: true` in frontmatter instead.
-->

# Chart — branded data visualisation (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → call the `fs_read` tool on the `stromy-format` MCP with `path="skills/format-chart/SKILL.md"`.

   **Read it to the end.** `fs_read` returns one page at a time. If the result's `next_offset_chars` is not null — or the returned text ends in a `<<< PARTIAL READ … >>>` block — the body is incomplete: call `fs_read` again with `offset_chars` set to that value and concatenate, repeating until it comes back null. Do **not** start work on a partial skill body. Hard rules and anti-patterns often sit in the final third, and a partial read fails silently — it looks like a complete skill.

2. Discover reference files (and any other skill assets), then read on demand:
   → call `fs_list` with `path="skills/format-chart"` (and `path="skills/format-chart/references"`),
   → call `fs_read` with `path="skills/format-chart/references/<file>"`.

Follow the instructions returned by the MCP exactly.

## This MCP is the only correct path

Produce this skill's output **only** by following the live SKILL.md fetched above and calling the `stromy-format` MCP's own tools. Do **not** substitute a local or identically-named base skill from elsewhere, and do **not** invent your own output path. A locally-produced or unbranded artifact is **wrong output, not a fallback** — it bypasses the server-side brand and quality gates.
