---
name: chart
description: "Render brand-aware data-visualisation charts using Plotly.js. The LLM authors any Plotly figure JSON (30+ chart types — waterfall, sankey, sunburst, treemap, funnel, parallel coords, calendar heatmap, candlestick, gauge, radar, themeRiver, marimekko-via-stacked, etc.) and this skill applies the client's brand theme from charter.plotly + tokens.css, then renders to PNG/SVG for embedding in PPTX/DOCX/PDF. Use whenever the user asks for a chart, data visualisation, plot, graph, KPI viz, or asks to add a quantitative visual to a deliverable. Defers to the `diagram` skill for structural visuals (process flows, org charts, stakeholder maps) — `chart` is purely numerical data-viz."
---

# Chart — branded data visualisation (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → `ReadMcpResourceTool(server="stromy-format", uri="skill://chart/SKILL.md")`

2. Discover available reference files via the manifest, then read on demand:
   → `ReadMcpResourceTool(server="stromy-format", uri="skill://chart/_manifest")`
   → `ReadMcpResourceTool(server="stromy-format", uri="skill://chart/references/<file>")`

Follow the instructions returned by the MCP resource exactly.
