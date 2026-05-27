---
name: pdf
description: "Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms. When Claude needs to fill in a PDF form or programmatically process, generate, or analyze PDF documents at scale."
---

# PDF Processing Guide (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → `ReadMcpResourceTool(server="stromy-format", uri="skill://pdf/SKILL.md")`

2. Discover available reference files via the manifest, then read on demand:
   → `ReadMcpResourceTool(server="stromy-format", uri="skill://pdf/_manifest")`
   → `ReadMcpResourceTool(server="stromy-format", uri="skill://pdf/references/<file>")`

Follow the instructions returned by the MCP resource exactly.
