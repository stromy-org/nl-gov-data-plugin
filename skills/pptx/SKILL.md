---
name: pptx
description: "DEFAULT PPTX skill — presentation creation, editing, analysis. Use for any .pptx work that isn't an explicit high-stakes/premium/HD pitch deck (which goes to `pptx-hd`). Handles: (1) creating new presentations, (2) modifying/editing content, (3) working with layouts, (4) adding comments/speaker notes, (5) analysing existing decks. Consumes brand data from charter.json + tokens.css + boilerplate.json + templates/pptx/ HTML shells when present. Also supports `render-anchors` mode (materialises brand anchor templates from spec files)."
---

# PPTX creation, editing, and analysis (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → `ReadMcpResourceTool(server="stromy-format", uri="skill://pptx/SKILL.md")`

2. Discover available reference files via the manifest, then read on demand:
   → `ReadMcpResourceTool(server="stromy-format", uri="skill://pptx/_manifest")`
   → `ReadMcpResourceTool(server="stromy-format", uri="skill://pptx/references/<file>")`

Follow the instructions returned by the MCP resource exactly.
