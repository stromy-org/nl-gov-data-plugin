---
name: nl-gov-data
description: "Track Dutch public affairs signals across Tweede Kamer, Rijksoverheid, KOOP publications (incl. CVDR + local gmb/prb/wsb/bgr), BWB legislation, Wetgevingskalender, ROO organizations, Rechtspraak (caselaw), CBS (statistics), and data.overheid.nl (discovery) using the `nl-gov-data-http` MCP. Supports fifteen workflows: topic monitoring, dossier tracking, actor briefs, committee watch, legislative scan, ministry narrative, parliamentary landscape snapshot, legislation lookup, legislative calendar watch, law-to-dossier brief, organization lookup, caselaw watch, quantitative grounding (CBS), discovery (data.overheid.nl), and exploratory MCP testing. Now also supports content deep-reading: fetching and quoting actual document text (motions, bills, letters, debate transcripts, law articles, attachments). Produces structured JSON shaped for downstream Stromy workflows with `workflow_type`, `query_params`, `results`, and `metadata`. Use this skill whenever the user asks about Dutch parliament activity, Tweede Kamer dossiers, Dutch government policy signals, kamerstukken, dossier numbers, Dutch MPs, faction composition, ministry narrative, Dutch laws, legislation, wetgeving, wetgevingskalender, government organizations, OR wants to read/quote/summarize a specific Dutch government document, transcript, law article, or attachment."
---

# Nl Gov Data (MCP-hosted skill)

This skill's full instructions are hosted on the `nl-gov-data-http` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → `ReadMcpResourceTool(server="nl-gov-data-http", uri="skill://nl-gov-data/SKILL.md")`

2. Read reference files on demand:
   - `skill://nl-gov-data/references/workflow-templates.md`

3. Optionally read the manifest to discover all available files and their sizes:
   → `ReadMcpResourceTool(server="nl-gov-data-http", uri="skill://nl-gov-data/_manifest")`

Follow the instructions returned by the MCP resource exactly.
