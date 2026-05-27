---
name: pdf-hd
description: "High-fidelity branded PDF creation using HTML-first design with the full web stack (CSS gradients, web fonts, SVG, paged-media CSS) rendered via Playwright (Chromium) or WeasyPrint. Deeply integrated with the client-data brand system (charter.json, tokens.css, manifest.json, hero images, guidelines.md, optional brand/fonts/). Use when asked to create branded proposals, executive briefs, brand books, policy reports, case studies, white papers, or any client-facing PDF where visual quality matters. Triggers on: 'create branded PDF', 'build proposal PDF', 'design a brief', 'brand book PDF', 'high quality PDF', 'HD PDF', 'magazine-style PDF', or any request for visually polished branded paginated output."
---

# PDF-HD: High-Fidelity Branded PDFs (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → `ReadMcpResourceTool(server="stromy-format", uri="skill://pdf-hd/SKILL.md")`

2. Discover available reference files via the manifest, then read on demand:
   → `ReadMcpResourceTool(server="stromy-format", uri="skill://pdf-hd/_manifest")`
   → `ReadMcpResourceTool(server="stromy-format", uri="skill://pdf-hd/references/<file>")`

Follow the instructions returned by the MCP resource exactly.
