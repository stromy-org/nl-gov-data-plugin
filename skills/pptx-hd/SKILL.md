---
name: pptx-hd
description: "High-fidelity branded presentation creation using HTML-first design with full web stack (CSS gradients, web fonts, SVG, animations) and enhanced HTML→PPTX conversion via dom-to-pptx. Integrated with the Dutch government brand system (charter.json, tokens.css, manifest.json, hero images from companies/nl-ez/). Use when asked to create presentations, slide decks, pitch decks, or any branded .pptx output where visual quality matters. Triggers on: 'create presentation', 'build slide deck', 'make pptx', 'branded slides', 'pitch deck', 'HD slides', 'high quality presentation', or any request for visually polished branded presentations."
---

# PPTX-HD: High-Fidelity Branded Presentations

HTML-first slide design with full web rendering quality, converted to editable native PowerPoint via enhanced DOM-to-PPTX pipeline. Integrated with the Dutch government brand system at `companies/nl-ez/`.

## Why This Skill Exists

The standard `pptx` skill uses a basic html2pptx pipeline that drops CSS gradients, limits to web-safe fonts, and can't handle SVG or shadows. This skill takes a different approach:

1. **Design in HTML/CSS** with full creative freedom (gradients, brand fonts, SVG motifs, shadows)
2. **Render via Playwright** for pixel-perfect layout measurement
3. **Convert to editable PPTX** using enhanced DOM-to-PPTX that preserves gradients (as vector fills), shadows, rounded corners, and precise typography
4. **Fallback safety**: elements that can't convert natively get rasterized as high-res PNG per-element (not full-slide screenshots)

The result: presentations that approach Claude Design quality while remaining fully editable in PowerPoint.

## Brand Data Integration (Required)

This is a **Dutch government data plugin** — load all brand artifacts from `companies/nl-ez/`. If no charter exists, fall back to the standard `pptx` skill for unbranded output.

### Brand artifact inventory

Load all artifacts from `companies/nl-ez/`:

| Artifact | Path | Available |
|----------|------|-----------|
| **Charter** | `charter.json` | ✓ Colors, fonts, logos, presentation config, image catalog, pptxAssets |
| **Design tokens** | `tokens.css` | ✓ Full CSS custom property system |
| **Logo variants** | `logos/` | ✓ `logo.svg` (coat of arms on Rijksblauw), `logo-wordmark.svg`, `logo-mark-alt.svg` |
| **Font files** | `fonts/` | ✓ RO Sans (Regular/Bold/Italic) + RO Serif (Regular/Italic) as woff2 |
| **Image manifest** | `images/manifest.json` | ✓ Per-image roles, mood, orientation metadata |
| **Images** | `images/` | ✓ 2 cover + 4 section landscape photos |
| **Pre-rendered overlays** | `pptx-assets/overlays/` | ✓ Rijksblauw 55% overlay already composited on all 6 photos |
| **Pre-rendered gradients** | `pptx-assets/` | ✓ `gradient-dark.png`, `gradient-accent.png`, `gradient-light.png` |

### Loading order

```
1. Read charter.json → extract colors, fonts, logo paths, image catalog, overlay config
2. Read tokens.css → inject as <style> in every slide HTML
3. Read images/manifest.json → get extended image metadata (overlayPolicy, textSafeZone, crops)
4. Read guidelines.md → absorb brand rules before designing
5. Resolve logo paths → use charter.logo.primary for light backgrounds, charter.images.logoVariantOnImage for dark/image backgrounds
```

### Color system (EZK / Rijkshuisstijl)

Use CSS custom properties from `companies/nl-ez/tokens.css`, never hardcoded hex values:

| Semantic use | CSS variable | Value |
|-------------|-------------|-------|
| Primary (Rijksblauw) | `var(--color-primary)` | `#154273` |
| Secondary (interactive) | `var(--color-secondary)` | `#01689b` |
| Accent (Dutch gold) | `var(--color-accent)` | `#ffb612` |
| Text headings | `var(--color-text)` | `#1D1D1B` |
| Text body | `var(--color-text-body)` | `#333333` |
| Text on dark | `var(--color-text-on-dark)` | `#FFFFFF` |
| Background | `var(--color-background)` | `#FFFFFF` |
| Surface / panel | `var(--color-surface)` | `#f3f3f3` |
| Border | `var(--color-border)` | `#e6e6e6` |

### Typography system (EZK)

| Use | CSS variable | Value |
|-----|-------------|-------|
| Heading / UI | `var(--font-heading)` | `'RO Sans', Calibri, Arial, Verdana, sans-serif` |
| Body text | `var(--font-body)` | `'RO Sans', Calibri, Arial, Verdana, sans-serif` |
| Formal / long-form | `var(--font-serif)` | `'RO Serif', Georgia, 'Times New Roman', serif` |

**Font loading — local woff2 files, NOT Google Fonts**: RO Sans and RO Serif are proprietary Rijksoverheid fonts. Load them in every slide's `<style>` block via `@font-face` using the plugin's bundled files:

```css
@font-face { font-family: 'RO Sans'; font-weight: 400; font-style: normal; src: url('<abs-path>/companies/nl-ez/fonts/RO-SansWebText-Regular.woff2') format('woff2'); }
@font-face { font-family: 'RO Sans'; font-weight: 700; font-style: normal; src: url('<abs-path>/companies/nl-ez/fonts/RO-SansWebText-Bold.woff2') format('woff2'); }
@font-face { font-family: 'RO Sans'; font-weight: 400; font-style: italic; src: url('<abs-path>/companies/nl-ez/fonts/RO-SansWebText-Italic.woff2') format('woff2'); }
@font-face { font-family: 'RO Serif'; font-weight: 400; font-style: normal; src: url('<abs-path>/companies/nl-ez/fonts/RO-SerifWeb-Regular.woff2') format('woff2'); }
@font-face { font-family: 'RO Serif'; font-weight: 400; font-style: italic; src: url('<abs-path>/companies/nl-ez/fonts/RO-SerifWeb-Italic.woff2') format('woff2'); }
```

Resolve `<abs-path>` at build time: `path.resolve(__dirname, '../../companies/nl-ez')` (from `workspace/my-deck/build.js`).

### EZK image system

EZK has **2 cover images** and **4 section images**. Use `pptx-assets/overlays/` — overlays are pre-composited (Rijksblauw `#154273` at 55% opacity already applied). **Never apply a runtime overlay to EZK images.**

| Role | Files | Mood |
|------|-------|------|
| `"cover"` | `photo-cover-01.jpg` (sustainable energy), `photo-cover-02.jpg` (solar panels) | bold |
| `"section"` | `photo-section-01.png` (EU policy), `photo-section-02.jpg` (Maasvlakte industrial), `photo-section-03.jpg` (editorial), `photo-section-04.jpg` (consumer energy) | policy / industrial / editorial / human |

**Use pre-composited overlays directly:**
```javascript
// Cover slide — pick by role, use pre-composited overlay
const coverOverlay = `${companiesDir}/nl-ez/pptx-assets/overlays/photo-cover-01-overlay.jpg`;
// Use as CSS background-image directly — no CSS gradient overlay needed
```

**Gradient slides** (no photography): use pre-rendered gradient PNGs for background variety:
- `pptx-assets/gradient-dark.png` — Rijksblauw dark (title/closing)
- `pptx-assets/gradient-accent.png` — amber accent (call-to-action dividers)
- `pptx-assets/gradient-light.png` — light surface (data/content slides)

**Mood matching**: match section images to slide topic — `"policy"` for legislation/EU content, `"industrial"` for energy infrastructure, `"human"` for citizen impact.

**Logo on image slides**: `charter.images.logoVariantOnImage` is `"primary"` — use `logos/logo.svg` (the coat-of-arms SVG has a Rijksblauw background baked in, so it remains legible on all EZK photo overlays).

### Brand motifs

`companies/nl-ez/tokens.css` may define motif components as decorative elements. Read the tokens.css file to discover available motif classes. Use motifs sparingly on divider and content slides.

Use motifs sparingly on divider and content slides. Match images to their `motifAffinity` metadata.

### Diagram Integration

When a slide would benefit from a process flow, architecture diagram, org chart, timeline, or other structural visual, use the `diagram` skill to generate a branded PNG. The diagram skill reads the same charter and produces images that match brand colors and typography. Embed the resulting PNG using the same image embedding pattern as logos and brand photography.

## Slide Architecture

### Default branded deck structure

| # | Slide type | Content | Image role | Design approach |
|---|-----------|---------|------------|-----------------|
| 1 | **Cover** | Title + tagline + logo + date | `"cover"` | Full-bleed hero image, dark overlay, white text in textSafeZone, logo white variant |
| 2-N | **Content** | Analysis, data, text | none | Solid brand backgrounds, CSS grid layouts, charter typography |
| — | **Divider** | Section title + optional subtitle | `"divider"` | Full-bleed image with overlay, section number, motif element |
| — | **Data** | Charts, tables, matrices | none | Light background, brand palette for data viz, mono font for numbers |
| last | **Closing** | Thank you / contact / CTA | `"closing"` | Full-bleed hero image, logo centered, contact info |

### Slide dimensions

From `charter.presentation`:
- **Aspect ratio**: `16:9` (default)
- **HTML canvas**: `1280px × 720px` (HD resolution, not the standard 720pt × 405pt)
- **Slide margin**: `charter.presentation.slideMargin` (default `40pt`)

### Layout patterns

Use CSS Grid and Flexbox freely — the DOM-to-PPTX conversion measures computed positions:

- **Full-bleed image** — `background-size: cover; background-position: center`
- **Split layout** — 40/60 or 50/50 grid columns
- **Card grid** — 2×2 or 3-column card layouts with brand borders
- **Data dashboard** — top metric strip + chart area + footnotes
- **Quote slide** — large serif pull-quote with attribution
- **Timeline** — horizontal or vertical with brand accent markers

## Workflow

### Phase 1: Brand Discovery

1. Identify the client slug from the user's request
2. Read all brand artifacts (charter.json, tokens.css, manifest.json, guidelines.md)
3. Inventory available images by role — count covers, dividers, backgrounds, closings
4. Note the logo variants available
5. State your design approach: color scheme, typography choices, image theme preference, motif usage

### Phase 2: Content Planning

1. Analyze the content to present — what are the key messages, sections, data?
2. Plan the slide sequence — map content to slide types (cover → content → divider → content → closing)
3. Assign images to image slides — select from the catalog by role and thematic relevance
4. Plan data visualizations — what charts/tables are needed?

### Phase 3: HTML Slide Generation

For each slide, generate a self-contained HTML file:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    /* Inject tokens.css content here */
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

    body {
      margin: 0;
      width: 1280px;
      height: 720px;
      overflow: hidden;
      /* tokens.css variables are available */
    }
  </style>
</head>
<body>
  <!-- Slide content with full CSS freedom -->
</body>
</html>
```

**Design rules:**
- Use `var(--...)` for all colors, fonts, spacing — never hardcode
- Use CSS gradients freely — they convert to vector gradient fills in PPTX
- Use SVG for icons and decorative elements — they convert to EMF/PNG in PPTX
- Use `box-shadow` for depth — converts to PowerPoint shadow properties
- Use `border-radius` — converts to rounded corners in PPTX
- Use CSS `backdrop-filter: blur(...)` sparingly — rasterized as fallback
- Text MUST be in semantic HTML elements (`<h1>`-`<h6>`, `<p>`, `<ul>`, `<ol>`)

### Phase 4: Build Script

Create a Node.js build script that:

1. Launches Playwright with a 1280×720 viewport
2. Loads each HTML slide
3. Waits for fonts to load (`document.fonts.ready`)
4. Uses the DOM-to-PPTX conversion pipeline to extract elements and generate native PPTX objects
5. For elements that can't convert natively (complex CSS effects), rasterizes individual elements as high-res PNG and places them as images
6. Saves the final `.pptx`

```javascript
// Build script structure
const { chromium } = require('playwright');
const PptxGenJS = require('pptxgenjs');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 1. Load brand data
const charter = JSON.parse(fs.readFileSync('companies/nl-ez/charter.json'));
const manifest = JSON.parse(fs.readFileSync('companies/nl-ez/images/manifest.json'));

// 2. Generate HTML slides (inline or from files)
// 3. Launch browser, render each slide
// 4. Extract DOM positions + styles → map to PptxGenJS objects
// 5. Handle gradients: parse CSS gradient → PptxGenJS gradient fill
// 6. Handle shadows: CSS box-shadow → PptxGenJS shadow props
// 7. Handle complex elements: screenshot individual element → embed as image
// 8. Save PPTX
```

### Phase 5: Visual QA

1. Generate thumbnail grid: `python skills/pptx/scripts/thumbnail.py <output.pptx> thumbnails --cols 4`
2. Read and inspect the thumbnail image for:
   - Text cutoff or overlap
   - Image positioning issues
   - Color contrast problems
   - Brand consistency (correct logo variant, correct colors)
   - Image repetition (same photo on consecutive image slides)
3. Fix issues and regenerate
4. Repeat until all slides pass visual inspection

## Key Differences from Standard PPTX Skill

| Feature | Standard `pptx` | `pptx-hd` |
|---------|-----------------|-----------|
| Canvas size | 720pt × 405pt | 1280px × 720px (HD) |
| Fonts | Web-safe only (Arial, Georgia) | Brand fonts via Google Fonts import |
| CSS gradients | Must pre-render as PNG | Convert to native PPTX gradient fills |
| SVG | Must rasterize to PNG | Convert to EMF or high-res PNG per-element |
| Shadows | Not supported | CSS → PPTX shadow property conversion |
| Border radius | Not supported | Preserved in PPTX shapes |
| Brand images | Manual overlay via Sharp | CSS overlay compositing, manifest-driven selection |
| Image metadata | Basic roles from charter | Full manifest: overlayPolicy, textSafeZone, motifAffinity, crops |
| Brand motifs | Not supported | CSS motif components from tokens.css |
| Typography | Limited to threshold rule | Full type scale with display/body/mono hierarchy |
| Unbranded decks | Supported | Not supported — use standard `pptx` skill |

## Anti-Patterns

Borrowed from the upstream Anthropic skill + our experience:

- **NEVER** use accent lines under titles (AI-generated hallmark)
- **NEVER** create text-only slides — every slide needs a visual element
- **NEVER** center body text on content slides (left-align for readability)
- **NEVER** default to blue when a brand palette exists
- **NEVER** hardcode hex values — use CSS variables from tokens.css
- **NEVER** use the same image on consecutive image slides
- **NEVER** set both width AND height on images — preserve aspect ratio
- **NEVER** place text outside the image's `textSafeZone`
- **NEVER** skip the overlay on image slides — raw photos are too bright for text legibility

## Dependencies

- **PptxGenJS**: `npm install pptxgenjs` — PPTX generation
- **Playwright**: `npm install playwright` — HTML rendering and DOM measurement
- **Sharp**: `npm install sharp` — image processing for fallback rasterization
- **Standard pptx skill tools**: Reuses `skills/pptx/ooxml/scripts/`, `skills/pptx/scripts/thumbnail.py` from the sibling `pptx` skill

## Output Location

Same convention as standard pptx skill:
- Default: `<projectRoot>/output/<deliverable>/`
- Override: user-specified path
- Iteration: overwrite in place when asked to rework
