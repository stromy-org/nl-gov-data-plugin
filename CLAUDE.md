# CLAUDE.md

Instructions for Claude Code when working in this plugin repo.

## Overview

nl-gov-data-plugin is a Claude Code plugin for NL Gov Data. It is a **distribution artifact** — skills are authored in Cowork and cherry-picked here for client deployment.

## Repository Structure

```
nl-gov-data-plugin/
├── .claude-plugin/
│   └── plugin.json              # Plugin manifest
├── skills/
│   ├── nl-gov-data/          # Dutch government MCP orchestration
│   ├── pptx/                    # PowerPoint creation & editing
│   ├── pptx-hd/                 # High-fidelity branded PPTX
│   ├── docx/                    # Word document creation & editing
│   ├── pdf/                     # PDF processing
│   ├── xlsx/                    # Spreadsheet creation & editing
│   ├── diagram/                 # Branded Excalidraw diagrams
│   └── mermaid/                 # Mermaid diagrams for Markdown
├── companies/nl-ez/        # EZK brand data — charter.json, tokens.css, logos/, fonts/, images/, pptx-assets/
├── src/                         # Shared utilities (workspace.js/py, image-utils.js/py)
├── package.json                 # Node.js dependencies
├── pyproject.toml               # Python dependencies
├── hooks/hooks.json             # SessionStart dependency install
├── .mcp.json                    # MCP server config (nl-gov-data hosted endpoint)
├── CLAUDE.md                    # Plugin instructions
└── README.md
```

## Commands

```bash
# Test locally
claude --plugin-dir .

# Validate skill manifests
for d in skills/*/; do [ -f "$d/SKILL.md" ] && echo "OK: $d" || echo "MISSING: $d"; done
```

## Updating Skills

Skills are maintained in Cowork and cherry-picked into this plugin:

1. Update the skill in `Cowork/.claude/skills/<skill-name>/`
2. Copy updated files to `skills/<skill-name>/`
3. Re-apply portability transforms:
   - `client-data/clients/<name>/` → `companies/nl-ez/`
   - `.claude/skills/<skill>/` → `skills/<skill>/`
   - `--client stromy` → `--client nl-ez` in diagram script calls
   - MCP runtime section: remove local stdio fallback
4. Bump version in plugin.json

## Key Rules

- Never reference `.claude/companies/` or `.claude/skills/` — use `companies/` and `skills/` directly
- Company/brand data lives at `companies/nl-ez/` (charter.json, logos/, tokens.css etc.)
- The `nl-gov-data` MCP is the primary data source — use it via the hosted endpoint in `.mcp.json`
- Use `${CLAUDE_PLUGIN_ROOT}` to reference plugin paths in hooks and scripts
- Dependencies are auto-installed on session start via `hooks/hooks.json` into `${CLAUDE_PLUGIN_DATA}`
