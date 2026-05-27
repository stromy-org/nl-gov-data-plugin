---
name: pptx-hd
description: "High-fidelity branded presentation creation for high-stakes decks (pitch, investor, executive, client-facing premium). HTML-first design with full web stack (CSS gradients, web fonts, SVG, shadows, layered depth) and enhanced HTML→PPTX conversion. Deeply integrated with client-data brand system (charter.json, tokens.css, manifest.json, hero images, boilerplate.json, anchor templates in templates/pptx/). Also supports `render-anchors` mode that materialises brand anchor templates from spec files. TRIGGER ONLY on explicit HD/premium/pitch cues — 'HD pitch deck', 'high-fidelity presentation', 'investor deck', 'branded premium deck', 'render anchor templates'. For ordinary PPTX work (most decks), the standard `pptx` skill is the default — do not trigger on bare 'create presentation' or 'make pptx'."
---

# PPTX-HD: High-Fidelity Branded Presentations (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → `ReadMcpResourceTool(server="stromy-format", uri="skill://pptx-hd/SKILL.md")`

2. Discover available reference files via the manifest, then read on demand:
   → `ReadMcpResourceTool(server="stromy-format", uri="skill://pptx-hd/_manifest")`
   → `ReadMcpResourceTool(server="stromy-format", uri="skill://pptx-hd/references/<file>")`

Follow the instructions returned by the MCP resource exactly.
