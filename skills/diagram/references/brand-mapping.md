# Charter → Diagram Brand Mapping

When a charter has an `excalidraw` section, use it directly. When it doesn't, derive diagram styling from the charter's `colors` and `fonts` sections. When `tokens.css` is available, inject it into the HTML renderer for full design-token coverage.

## Brand Data Precedence

1. `charter.excalidraw` section → direct Excalidraw theming (highest priority)
2. `tokens.css` → injected as `<style>` in diagram HTML (full token system)
3. `charter.colors` + `charter.fonts` → derive CSS variables and theme values

## Fallback Mapping Table

| Diagram property | Charter fallback | Default (no charter) |
|------------------|-----------------|----------------------|
| `strokeColor` | `colors.primary` | `#1e293b` |
| `backgroundColor` | `colors.background` | `#ffffff` |
| `fillColors[0]` | `colors.primary` | `#3b82f6` |
| `fillColors[1]` | `colors.accent` | `#f59e0b` |
| `fillColors[2]` | `colors.success` | `#10b981` |
| `fillColors[3]` | `colors.secondary` | `#6366f1` |
| `fillColors[4]` | `colors.warning` | `#f97316` |
| `textColor` | `colors.text` | `#1f2937` |
| `arrowColor` | `colors.textLight` | `#6b7280` |
| `headingFont` | `fonts.heading.family` + fallback | `'Plus Jakarta Sans', sans-serif` |
| `bodyFont` | `fonts.body.family` + fallback | `'Plus Jakarta Sans', sans-serif` |
| `fontSize` | 16 | 16 |
| `strokeWidth` | 2 | 2 |
| `roughness` | 0 (clean) | 0 |
| `labelFontSize` | 14 | 14 |

## tokens.css Integration

When the client has a `tokens.css` file (Tier 1 brands), the HTML renderer injects it as a `<style>` block. This provides the full design-token system including:

- Color scales (e.g., `--stromy-green-900` through `--stromy-green-50`)
- Typography tokens (`--font-display`, `--font-body`, `--font-mono`)
- Spacing scale (`--space-1` through `--space-32`)
- Border radii (`--radius-sm` through `--radius-full`)
- Shadows (`--shadow-sm` through `--shadow-xl`)
- Motif family tokens

Build scripts can reference these tokens in inline styles when generating HTML for the renderer.

## Google Fonts Loading

The renderer generates an `@import url()` for Google Fonts based on `charter.fonts`:

- Heading font: weights 400, 500, 700
- Body font: weights 400, 500
- Mono font: weights 400, 500

Fonts are loaded via `document.fonts.ready` before screenshot.

## Color Role Assignments

When generating multi-shape diagrams, assign fill colors by semantic role:

| Shape role | Color source | Rationale |
|-----------|-------------|-----------|
| Primary/main shapes | `fillColors[0]` (primary) | Most prominent elements |
| Secondary shapes | `fillColors[1]` (accent) | Supporting elements, call-outs |
| Positive/success states | `fillColors[2]` (success) | Approval, completion, positive flow |
| Neutral/background shapes | `fillColors[3]` (secondary) | Context, containers, grouping |
| Warning/attention shapes | `fillColors[4]` (warning) | Decision points, risks |
| Connectors/arrows | `arrowColor` | Lower visual weight than shapes |
| Labels on shapes | Auto-contrast | White on dark fills, textColor on light |
| Canvas background | `backgroundColor` | Clean backdrop |

## Consulting Design Principles

These principles apply to all diagram output — keep output McKinsey/BCG-quality:

- **Max 3-4 colors per diagram** — primary, accent, neutral, text. Avoid rainbow effects.
- **Heading font for titles**, body font for box labels and descriptions.
- **Ample whitespace** — padding 16-24px inside boxes, 40-60px gap between elements.
- **Clean lines** — `roughness: 0` always for consulting output. No sketch effect.
- **Subtle shadows** — `box-shadow: 0 2px 8px rgba(0,0,0,0.08)` on shapes.
- **Rounded corners** — `border-radius: 8px` on rectangles.
- **Grid alignment** — elements snap to consistent spacing increments.
- **Auto-contrast text** — white text on dark fills, dark text on light fills.

## Auto-Contrast for Text on Fills

When placing text on a colored fill, ensure contrast. Use white text (`#ffffff`) on dark fills (luminance < 0.5) and the charter `textColor` on light fills.

```javascript
const { textColorOnFill } = require('./diagram-to-html');
const color = textColorOnFill(fillHex, theme);
```

## Derivation Code Pattern

```javascript
const { loadBrandTheme, deriveTheme } = require('skills/diagram/scripts/diagram-to-html');

// With client data
const { theme, tokensCss, fontImport } = loadBrandTheme('stromy', repoRoot);

// Without client data (neutral defaults)
const theme = deriveTheme(null);
```
