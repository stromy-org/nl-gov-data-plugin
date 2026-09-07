# NL Gov Data Plugin

Claude Code plugin exposing **Dutch government data intelligence** skills via the
`nl-gov-data` MCP. Intel tooling only — no document formatting, no client brand data.

## Installation

```bash
claude plugin add stromy-org/nl-gov-data-plugin
```

Or for local development:

```bash
git clone https://github.com/stromy-org/nl-ez-plugin.git
cd nl-ez-plugin
claude --plugin-dir .
```

## What's Included

### Skills

All skills are thin routing stubs — their full instructions and reference files
are hosted server-side on the `nl-gov-data` MCP and fetched live via the MCP's
`fs_read` / `fs_list` tools.

| Skill | Description |
|-------|-------------|
| `nl-gov-data` | Track Dutch public-affairs signals across Tweede Kamer, Rijksoverheid, KOOP, BWB, Wetgevingskalender, ROO, Rechtspraak, CBS, and data.overheid.nl; deep-read documents |
| `nl-policy-legislative-landscape` | Build deep official-source policy and legislative landscape analyses |
| `nl-parliamentary-positioning` | Map parliamentary positioning and official political posture |
| `nl-official-issue-framing` | Analyse how an entity or issue is framed in official records |
| `tensions` | Detect contradictions, said-vs-did gaps, and non-obvious tensions |
| `nl-gov-shared` | References hub for the nl-gov-data skill family (not invoked directly) |

### MCP Servers

| Server | Transport | Description |
|--------|-----------|-------------|
| `nl-gov-data` | http | Dutch government open-data MCP — legislation, parliamentary records, Rijksoverheid documents (per-user OAuth via Microsoft Entra ID) |

## License

UNLICENSED — See [LICENSE](LICENSE) for terms.
