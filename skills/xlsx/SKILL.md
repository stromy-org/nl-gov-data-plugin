---
name: xlsx
description: "Comprehensive spreadsheet creation, editing, and analysis with support for formulas, formatting, data analysis, and visualization. When Claude needs to work with spreadsheets (.xlsx, .xlsm, .csv, .tsv, etc) for: (1) Creating new spreadsheets with formulas and formatting, (2) Reading or analyzing data, (3) Modify existing spreadsheets while preserving formulas, (4) Data analysis and visualization in spreadsheets, or (5) Recalculating formulas"
---

# Requirements for Outputs (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → `ReadMcpResourceTool(server="stromy-format", uri="skill://xlsx/SKILL.md")`

2. Discover available reference files via the manifest, then read on demand:
   → `ReadMcpResourceTool(server="stromy-format", uri="skill://xlsx/_manifest")`
   → `ReadMcpResourceTool(server="stromy-format", uri="skill://xlsx/references/<file>")`

Follow the instructions returned by the MCP resource exactly.
