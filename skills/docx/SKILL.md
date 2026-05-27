---
name: docx
description: "Create, read, edit, and manipulate Word documents (.docx files). Triggers on any mention of 'Word doc', 'word document', '.docx', or requests to produce documents with formatting like tables of contents, headings, page numbers, headers/footers, or letterheads. Also use when extracting or reorganizing content from .docx files, inserting or replacing images, performing find-and-replace, working with tracked changes or comments, or converting content into a polished Word document. If the user asks for a 'report', 'memo', 'letter', 'brief', or 'template' as a Word file, use this skill. Reads brand data from `client-data/clients/<name>/charter.json` when a company is specified. Do NOT use for PDFs (use the `pdf` skill), spreadsheets (use `xlsx`), Google Docs, or coding tasks unrelated to document generation."
---

# DOCX creation, editing, and analysis (MCP-hosted skill)

This skill's full instructions are hosted on the `stromy-format` MCP server. Do not hardcode workflow logic locally — always fetch the live version from the MCP.

## Loading instructions

1. Read the main skill instructions:
   → `ReadMcpResourceTool(server="stromy-format", uri="skill://docx/SKILL.md")`

2. Discover available reference files via the manifest, then read on demand:
   → `ReadMcpResourceTool(server="stromy-format", uri="skill://docx/_manifest")`
   → `ReadMcpResourceTool(server="stromy-format", uri="skill://docx/references/<file>")`

Follow the instructions returned by the MCP resource exactly.
