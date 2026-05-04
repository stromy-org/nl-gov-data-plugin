---
name: pptx
description: "Presentation creation, editing, and analysis. When Claude needs to work with presentations (.pptx files) for: (1) Creating new presentations, (2) Modifying or editing content, (3) Working with layouts, (4) Adding comments or speaker notes, or any other presentation tasks"
license: Proprietary. LICENSE.txt has complete terms
---

# PPTX creation, editing, and analysis

## Overview

A user may ask you to create, edit, or analyze the contents of a .pptx file. A .pptx file is essentially a ZIP archive containing XML files and other resources that you can read or edit. You have different tools and workflows available for different tasks.

> **Logo & Image Sizing**: Never hardcode both width and height. Use `src/image-utils.js` (Node) or `src/image_utils.py` (Python) to compute aspect-ratio-preserving dimensions from the charter bounding box.

## Brand Data Integration

This plugin serves the **Ministerie van Economische Zaken en Klimaat (EZK)** under the Dutch government Rijkshuisstijl. All branded deliverables use `companies/nl-ez/charter.json`.

### EZK brand specification

| Property | Value |
|----------|-------|
| **Primary** (Rijksblauw) | `#154273` — slide backgrounds, headers, accent bars |
| **Secondary** (interactive blue) | `#01689b` — links, CTAs, subtle accents |
| **Accent** (Dutch gold / amber) | `#ffb612` — highlights, call-outs, progress markers |
| **Text** | `#1D1D1B` headings · `#333333` body · `#535353` captions |
| **Background** | `#FFFFFF` · surface `#f3f3f3` |
| **Heading font** | RO Sans Bold (woff2 in `companies/nl-ez/fonts/`) · fallback: Calibri, Arial |
| **Body font** | RO Sans Regular (woff2 in `companies/nl-ez/fonts/`) · fallback: Calibri, Arial |
| **Serif (formal docs)** | RO Serif (woff2 in `companies/nl-ez/fonts/`) · fallback: Georgia |
| **Logo** | `logos/logo-wordmark.svg` for headers/title slides · `logos/logo.svg` general use |
| **Slide margin** | 40pt · title margin 60pt · content margin 40pt |
| **Aspect ratio** | 16:9 |

**Important — local font files**: RO Sans and RO Serif are proprietary Dutch government fonts. They are **not** on Google Fonts. Load them via `@font-face` from the plugin's `fonts/` directory. Use the CSS variables from `companies/nl-ez/tokens.css` (`--font-heading`, `--font-body`, `--font-serif`).

```css
/* Load in slide HTML <style> block */
@font-face { font-family: 'RO Sans'; font-weight: 400; src: url('<abs-path>/companies/nl-ez/fonts/RO-SansWebText-Regular.woff2'); }
@font-face { font-family: 'RO Sans'; font-weight: 700; src: url('<abs-path>/companies/nl-ez/fonts/RO-SansWebText-Bold.woff2'); }
@font-face { font-family: 'RO Serif'; font-weight: 400; src: url('<abs-path>/companies/nl-ez/fonts/RO-SerifWeb-Regular.woff2'); }
```

Replace `<abs-path>` with the absolute path resolved from the build script using `path.resolve(__dirname, '../../companies/nl-ez')`.

### CSS variables (from tokens.css)

Always use these — never hardcode hex values:

| Variable | Value |
|----------|-------|
| `var(--color-primary)` | `#154273` |
| `var(--color-secondary)` | `#01689b` |
| `var(--color-accent)` | `#ffb612` |
| `var(--color-text)` | `#1D1D1B` |
| `var(--color-text-body)` | `#333333` |
| `var(--color-text-on-dark)` | `#FFFFFF` |
| `var(--color-background)` | `#FFFFFF` |
| `var(--color-surface)` | `#f3f3f3` |
| `var(--font-heading)` | `'RO Sans', Calibri, Arial, Verdana, sans-serif` |
| `var(--font-body)` | `'RO Sans', Calibri, Arial, Verdana, sans-serif` |
| `var(--font-serif)` | `'RO Serif', Georgia, 'Times New Roman', serif` |
| `var(--slide-margin)` | `40pt` |
| `var(--title-margin)` | `60pt` |
| `var(--content-margin)` | `40pt` |

### Using brand data in the freeform HTML workflow
Copy `build-branded.js` as your build scaffold:

```bash
mkdir -p workspace/my-deck
cp skills/pptx/scripts/build-branded.js workspace/my-deck/build.js
```

Set `BRAND_DIR` to the nl-ez directory:
```javascript
const BRAND_DIR = path.resolve(__dirname, '../../companies/nl-ez');
```

This gives you:
- **`brandedSlide(html)`** helper — wraps your freeform HTML with brand CSS variables automatically injected
- **CSS variables** usable in your HTML: `var(--color-primary)`, `var(--color-secondary)`, `var(--color-text)`, `var(--color-background)`, `var(--font-heading)`, `var(--font-body)`, etc.
- **`logoPath`** — resolved absolute path to the company logo
- **`charter`** — the full charter object for reading any value directly
- **`renderGradientPng()`** — pre-render gradient backgrounds as PNG (CSS gradients not supported)

You still write freeform HTML (full creative control over layout), but the brand colors, fonts, and logo are pre-loaded and consistent.

### Image Sizing Rule — Preserve Aspect Ratio

**All images and logos must preserve their natural aspect ratio.** Never set both width and height to arbitrary values — this causes visible stretching/squashing.

The charter's `logo.maxWidth` / `logo.maxHeight` define a **bounding box**, not a target size. Fit the image within the box while keeping its proportions:

- **HTML workflow** (safe by default): Set only one CSS dimension (e.g. `height: 40pt`) and let the browser compute the other via `width: auto`. The `build-branded.js` scaffold already does this correctly.
- **PptxGenJS direct API**: Always read actual image dimensions and compute the other from the aspect ratio (see `html2pptx.md` "Adding Images" section).
- **OOXML editing**: Always derive `cy` from `cx` (or vice versa) using the source image's aspect ratio. Include `<a:picLocks noChangeAspect="1"/>` to prevent UI-level distortion (see `ooxml.md` "Images" section).

This rule applies to **all images**, not just logos — cover photos, charts, diagrams, etc.

### EZK brand photography

EZK has **2 cover images** and **4 section images** (pre-composited overlays in `pptx-assets/overlays/`). Use these roles:

| Role | Images | Use for |
|------|--------|---------|
| `"cover"` | `photo-cover-01.jpg`, `photo-cover-02.jpg` | Title slide — renewable energy / ministry hero |
| `"section"` | `photo-section-01.png` through `photo-section-04.jpg` | Section dividers — policy, industrial, editorial, human |

**Always use pre-rendered overlays** (Rijksblauw `#154273` at 55% already baked in — no Sharp compositing needed):

```javascript
// Example: cover slide
const overlay = 'companies/nl-ez/pptx-assets/overlays/photo-cover-01-overlay.jpg';
// Use directly as background-image — overlay is pre-composited
```

**Pre-rendered gradients** for non-photo slides:
- `pptx-assets/gradient-dark.png` — dark Rijksblauw gradient (title / closing backgrounds)
- `pptx-assets/gradient-accent.png` — accent amber gradient
- `pptx-assets/gradient-light.png` — light surface gradient

**Mood matching**: prefer `"bold"` cover images for authoritative slides; match `"policy"`, `"industrial"`, `"editorial"`, `"human"` section images to slide topic.

**Logo on image slides**: `charter.images.logoVariantOnImage` is `"primary"` — use `logos/logo.svg` (white-on-blue coat of arms SVG, already legible on dark overlays).

### Diagram Integration

When a slide would benefit from a process flow, architecture diagram, org chart, timeline, or other structural visual, use the `diagram` skill to generate a branded PNG. The diagram skill reads the same charter and produces images that match brand colors and typography. Embed the resulting PNG using the same image embedding pattern as logos and brand photography.

### CSS variable discipline

**Always use CSS variables from `_base.css` instead of hardcoded hex values** when writing slide HTML. This ensures slides update automatically if the charter changes.

| Instead of | Use |
|-----------|-----|
| `#FF7F66` | `var(--color-primary)` |
| `#DFDFE0` | `var(--color-secondary)` |
| `#807F83` | `var(--color-text)` |
| `#FFFFFF` | `var(--color-background)` |
| `#F5F5F5` | `var(--color-background-alt)` |
| `Tahoma, Arial, sans-serif` | `var(--font-heading)` |
| `Verdana, Arial, sans-serif` | `var(--font-body)` |

**Spacing variables** (from charter `presentation` section):
- `var(--slide-margin)` — outer slide margin (default `40pt`)
- `var(--title-margin)` — margin around title elements (default `30pt`)
- `var(--content-margin)` — margin around body content (default `20pt`)

**Exceptions** — these values can be hardcoded:
- `white`, `black`, `transparent` — structural/universal colors
- Specific pixel/pt values for margins, padding, font sizes, positioning
- One-off accent colors not in the charter (rare — prefer charter colors)

### Company identity data
Check for `profile.json` at `companies/nl-ez/profile.json`. If present, use company identity fields for presentation slides:

- **`company.name`** — title slides, headers, footers
- **`company.tagline`** — subtitle text on title/cover slides
- **`company.website`** and **`company.email`** — closing/contact slides

Load only the `company` block — other profile fields are not relevant for presentations.

### Author & contact metadata
Check for `people.json` at `companies/nl-ez/people.json`. If present, use it for author metadata in footers, contact slides, and file properties. Filter by `roles` containing `"author"` — if one person has `"default": true`, auto-select them.

### Applying formatting rules
If the charter has a `formatting` section, apply these rules:

- **`headingThreshold`** (default 24): Apply the heading font to any text element >= this pt size. Text below the threshold uses the body font.
- **`accentCycleColors`** (e.g. `["accent", "secondary", "primary"]`): Cycle through these charter color keys when coloring accent shapes, divider lines, or multi-item highlights.
- **`autoContrastText`**: When `true`, automatically pick white or dark text based on the background luminance of the shape or slide behind it.

### When there is no brand charter
If no charter exists for the company (or no company is specified), skip this section entirely and use the generic color palettes and workflow below.

## Output Location

**Default**: `<projectRoot>/output/<deliverable>/` — auto-detected from build script location using `src/workspace.js`.
**Override**: If the prompt specifies a target output directory, pass it as `{ outputDir: '<path>' }`.
**Discovery**: Before creating new output, check the project's `output/` folder for existing deliverables. Briefly mention what you find, then proceed with the current task. Do NOT modify existing files unless explicitly asked.
**Iteration**: When asked to edit/rework an existing file, work on it in place (overwrite).

### Build script output setup

```javascript
const { ensureOutputDir } = require('../../../../src/workspace');
const outputDir = ensureOutputDir(__dirname);
// → workspace/<client>/output/<deliverable>/
```

## Reading and analyzing content

### Text extraction
If you just need to read the text contents of a presentation, you should convert the document to markdown:

```bash
# Convert document to markdown
python -m markitdown path-to-file.pptx
```

### Raw XML access
You need raw XML access for: comments, speaker notes, slide layouts, animations, design elements, and complex formatting. For any of these features, you'll need to unpack a presentation and read its raw XML contents.

#### Unpacking a file
`python skills/pptx/ooxml/scripts/unpack.py <office_file> <output_dir>`

**Note**: The unpack.py script is located at `skills/pptx/ooxml/scripts/unpack.py` relative to the project root. If the script doesn't exist at this path, use `find . -name "unpack.py"` to locate it.

#### Key file structures
* `ppt/presentation.xml` - Main presentation metadata and slide references
* `ppt/slides/slide{N}.xml` - Individual slide contents (slide1.xml, slide2.xml, etc.)
* `ppt/notesSlides/notesSlide{N}.xml` - Speaker notes for each slide
* `ppt/comments/modernComment_*.xml` - Comments for specific slides
* `ppt/slideLayouts/` - Layout templates for slides
* `ppt/slideMasters/` - Master slide templates
* `ppt/theme/` - Theme and styling information
* `ppt/media/` - Images and other media files

#### Typography and color extraction
**When given an example design to emulate**: Always analyze the presentation's typography and colors first using the methods below:
1. **Read theme file**: Check `ppt/theme/theme1.xml` for colors (`<a:clrScheme>`) and fonts (`<a:fontScheme>`)
2. **Sample slide content**: Examine `ppt/slides/slide1.xml` for actual font usage (`<a:rPr>`) and colors
3. **Search for patterns**: Use grep to find color (`<a:solidFill>`, `<a:srgbClr>`) and font references across all XML files

---

## Creating a new PowerPoint presentation

When creating a new PowerPoint presentation from scratch, use the **html2pptx** workflow to convert HTML slides to PowerPoint with accurate positioning.

### Design Approach

**Before writing any code**, read [references/design-guide.md](references/design-guide.md) for color palettes, visual element options, and layout guidance. When a brand charter exists, skip the design guide and use charter colors/fonts directly.

The skill aims for **ambitious, creative, and professional** slide designs. Avoid generic or safe defaults — match the visual approach to the subject matter, audience, and tone.

**Requirements**:
- ✅ State your content-informed design approach BEFORE writing code
- ✅ Use web-safe fonts only: Arial, Helvetica, Times New Roman, Georgia, Courier New, Verdana, Tahoma, Trebuchet MS, Impact
- ✅ Create clear visual hierarchy through size, weight, and color
- ✅ Ensure readability: strong contrast, appropriately sized text, clean alignment
- ✅ Be consistent: repeat patterns, spacing, and visual language across slides
- ✅ Use real data from `companies/nl-ez/profile.json`, `people.json`, and MCP-fetched government data — never placeholder text when real content exists
- ✅ Mix imagery treatments — never apply the same photo overlay uniformly to all slides
- ✅ Pre-render ALL gradients, SVG motifs, and decorative elements as PNG via Sharp before use in HTML

### Workflow
1. **MANDATORY - READ ENTIRE FILE**: Read [`html2pptx.md`](html2pptx.md) completely from start to finish. **NEVER set any range limits when reading this file.** Read the full file content for detailed syntax, critical formatting rules, and best practices before proceeding with presentation creation.
1b. **(If branded)** When a brand charter exists, copy `build-branded.js` as your build scaffold:
    ```bash
    mkdir -p workspace/my-deck
    cp skills/pptx/scripts/build-branded.js workspace/my-deck/build.js
    ```
    Then set `BRAND_DIR` in the copied `build.js` to the company brand directory. Use the `brandedSlide()` helper to wrap each slide's HTML — it automatically injects brand CSS variables (`var(--color-primary)`, `var(--font-heading)`, etc.) so your freeform HTML stays on-brand. Skip to step 3 for the build script structure; steps 2-3 below are for the unbranded path.
2. Create an HTML file for each slide with proper dimensions (e.g., 720pt × 405pt for 16:9)
   - Use `<p>`, `<h1>`-`<h6>`, `<ul>`, `<ol>` for all text content
   - Use `class="placeholder"` for areas where charts/tables will be added (render with gray background for visibility)
   - **CRITICAL**: Rasterize gradients and icons as PNG images FIRST using Sharp, then reference in HTML
   - **LAYOUT**: For slides with charts/tables/images, use either full-slide layout or two-column layout for better readability
3. Create and run a JavaScript file using the [`html2pptx.js`](scripts/html2pptx.js) library to convert HTML slides to PowerPoint and save the presentation
   - Use the `html2pptx()` function to process each HTML file
   - Add charts and tables to placeholder areas using PptxGenJS API
   - Save the presentation using `pptx.writeFile()`
4. **Visual validation**: Generate thumbnails and inspect for layout issues
   - Create thumbnail grid: `python skills/pptx/scripts/thumbnail.py workspace/<project>/output/output.pptx workspace/<project>/output/thumbnails --cols 4`
   - Read and carefully examine the thumbnail image for:
     - **Text cutoff**: Text being cut off by header bars, shapes, or slide edges
     - **Text overlap**: Text overlapping with other text or shapes
     - **Positioning issues**: Content too close to slide boundaries or other elements
     - **Contrast issues**: Insufficient contrast between text and backgrounds
   - If issues found, adjust HTML margins/spacing/colors and regenerate the presentation
   - Repeat until all slides are visually correct

## Editing an existing PowerPoint presentation

When editing slides in an existing PowerPoint presentation, you need to work with the raw Office Open XML (OOXML) format. This involves unpacking the .pptx file, editing the XML content, and repacking it.

### Iterating on a workspace deliverable

When the user asks to edit a PPTX that was previously generated in a workspace project:

1. Look in `workspace/<client>/output/<deliverable>/` for the `.pptx` file (fall back to `workspace/<project>/output/` for legacy projects)
2. Unpack it to `workspace/<client>/build/<deliverable>/unpacked/`
3. Apply edits using the OOXML workflow below
4. Repack to the same file path in `output/`

This avoids regenerating from scratch — the build script creates the first draft, and the edit workflow refines it.

### Workflow
1. **MANDATORY - READ ENTIRE FILE**: Read [`ooxml.md`](ooxml.md) (~500 lines) completely from start to finish.  **NEVER set any range limits when reading this file.**  Read the full file content for detailed guidance on OOXML structure and editing workflows before any presentation editing.
2. Unpack the presentation: `python skills/pptx/ooxml/scripts/unpack.py <office_file> <output_dir>`
3. Edit the XML files (primarily `ppt/slides/slide{N}.xml` and related files)
4. **CRITICAL**: Validate immediately after each edit and fix any validation errors before proceeding: `python skills/pptx/ooxml/scripts/validate.py <dir> --original <file>`
5. Pack the final presentation: `python skills/pptx/ooxml/scripts/pack.py <input_directory> <office_file>`

## Creating Thumbnail Grids

To create visual thumbnail grids of PowerPoint slides for quick analysis and reference:

```bash
python skills/pptx/scripts/thumbnail.py template.pptx [output_prefix]
```

**Features**:
- Creates: `thumbnails.jpg` (or `thumbnails-1.jpg`, `thumbnails-2.jpg`, etc. for large decks)
- Default: 5 columns, max 30 slides per grid (5×6)
- Custom prefix: `python skills/pptx/scripts/thumbnail.py template.pptx my-grid`
  - Note: The output prefix should include the path if you want output in a specific directory (e.g., `workspace/my-grid`)
- Adjust columns: `--cols 4` (range: 3-6, affects slides per grid)
- Grid limits: 3 cols = 12 slides/grid, 4 cols = 20, 5 cols = 30, 6 cols = 42
- Slides are zero-indexed (Slide 0, Slide 1, etc.)

**Use cases**:
- Template analysis: Quickly understand slide layouts and design patterns
- Content review: Visual overview of entire presentation
- Navigation reference: Find specific slides by their visual appearance
- Quality check: Verify all slides are properly formatted

**Examples**:
```bash
# Basic usage
python skills/pptx/scripts/thumbnail.py presentation.pptx

# Combine options: custom name, columns
python skills/pptx/scripts/thumbnail.py template.pptx analysis --cols 4
```

## Converting Slides to Images

To visually analyze PowerPoint slides, convert them to images using a two-step process:

1. **Convert PPTX to PDF**:
   ```bash
   soffice --headless --convert-to pdf template.pptx
   ```

2. **Convert PDF pages to JPEG images**:
   ```bash
   pdftoppm -jpeg -r 150 template.pdf slide
   ```
   This creates files like `slide-1.jpg`, `slide-2.jpg`, etc.

Options:
- `-r 150`: Sets resolution to 150 DPI (adjust for quality/size balance)
- `-jpeg`: Output JPEG format (use `-png` for PNG if preferred)
- `-f N`: First page to convert (e.g., `-f 2` starts from page 2)
- `-l N`: Last page to convert (e.g., `-l 5` stops at page 5)
- `slide`: Prefix for output files

Example for specific range:
```bash
pdftoppm -jpeg -r 150 -f 2 -l 5 template.pdf slide  # Converts only pages 2-5
```

## Code Style Guidelines
**IMPORTANT**: When generating code for PPTX operations:
- Write concise code
- Avoid verbose variable names and redundant operations
- Avoid unnecessary print statements

## Dependencies

Required dependencies (should already be installed):

- **markitdown**: `pip install "markitdown[pptx]"` (for text extraction from presentations)
- **pptxgenjs**: pre-installed in root `node_modules` (for creating presentations via html2pptx)
- **playwright**: pre-installed in root `node_modules` (for HTML rendering in html2pptx)
- **react-icons**: pre-installed in root `node_modules` with react and react-dom (for icons)
- **sharp**: pre-installed in root `node_modules` (for SVG rasterization and image processing)
- **LibreOffice**: `sudo apt-get install libreoffice` (for PDF conversion)
- **Poppler**: `sudo apt-get install poppler-utils` (for pdftoppm to convert PDF to images)
- **defusedxml**: `pip install defusedxml` (for secure XML parsing)
