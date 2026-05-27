---
name: mermaid
description: "Creates Mermaid diagrams for Markdown-based documentation (GitHub, GitLab, wikis, blogs) and visual explanations. Supports 25+ diagram types including flowcharts, sequence/class/state diagrams, ERDs, Gantt charts, mindmaps, timelines, architecture views, Kanban boards, Sankey diagrams, and newer types (Wardley maps, Venn, Ishikawa). When the `mermaid` MCP is available, uses live browser preview and PNG/SVG/PDF export. Use this skill when users ask for Mermaid syntax, Markdown-renderable diagrams, visual architecture, or quick text-to-diagram output."
---

# Mermaid Diagrams (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → `ReadMcpResourceTool(server="stromy-format", uri="skill://mermaid/SKILL.md")`

2. Discover available reference files via the manifest, then read on demand:
   → `ReadMcpResourceTool(server="stromy-format", uri="skill://mermaid/_manifest")`
   → `ReadMcpResourceTool(server="stromy-format", uri="skill://mermaid/references/<file>")`

Follow the instructions returned by the MCP resource exactly.
