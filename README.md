# NL Gov Data Plugin

Claude Code plugin for NL Gov Data branded deliverables

## Installation

```bash
claude plugin add stromy-org/nl-gov-data-plugin
```

Or for local development:

```bash
git clone https://github.com/stromy-org/nl-gov-data-plugin.git
cd nl-gov-data-plugin
claude --plugin-dir .
```

Dependencies are automatically installed on first session start via the `hooks/hooks.json` SessionStart hook.

## What's Included

### Skills

| Skill | Description |
|-------|-------------|
| `example` | Example skill — replace with actual skills |

### MCP Servers

| Server | Transport | Description |
|--------|-----------|-------------|
| `` | http | Connected data source |

### Company Data

Brand and company data for NL Gov Data lives in `companies/nl-ez/`.

## License

UNLICENSED — See [LICENSE](LICENSE) for terms.
