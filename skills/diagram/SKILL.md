---
name: diagram
description: "Generate branded, editable Excalidraw diagrams (process flows, architecture views, stakeholder maps, org charts, timelines, funnels, matrices, mind maps) and export as PNG/SVG for embedding in deliverables. Accepts native Excalidraw JSON or Mermaid syntax (via bridge). Reads charter.json + tokens.css for brand theming. Use when asked to create a diagram, draw a process flow, make an architecture diagram, visualize a workflow, create a stakeholder map, org chart, funnel diagram, timeline, or any structural visual."
---

# Diagram Skill — Branded Consulting-Quality Diagrams (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → `ReadMcpResourceTool(server="stromy-format", uri="skill://diagram/SKILL.md")`

2. Discover available reference files via the manifest, then read on demand:
   → `ReadMcpResourceTool(server="stromy-format", uri="skill://diagram/_manifest")`
   → `ReadMcpResourceTool(server="stromy-format", uri="skill://diagram/references/<file>")`

Follow the instructions returned by the MCP resource exactly.
