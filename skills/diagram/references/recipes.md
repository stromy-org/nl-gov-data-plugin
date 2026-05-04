# Diagram Type Recipes

Each recipe describes how to generate Excalidraw elements for a specific diagram type. All recipes use the brand theme from the charter (see [brand-mapping.md](brand-mapping.md)) and produce consulting-quality output.

## Consulting Style Defaults

All recipes share these baseline properties:

| Property | Value | Rationale |
|----------|-------|-----------|
| `roughness` | 0 | Clean, professional lines |
| `roundness` | `{ type: 3 }` | Rounded corners on rectangles (8px) |
| `fillStyle` | `"solid"` | No hachure patterns |
| `strokeWidth` | 2 | Visible but not heavy |
| Box padding | 16-24px | Ample breathing room |
| Gap between elements | 40-60px | Clean separation |
| Shadow (HTML renderer) | `0 2px 8px rgba(0,0,0,0.08)` | Subtle depth |
| Font weight | 500 (medium) | Readable at diagram scale |

---

## Process Flow

**Use case**: Methodology phases, approval workflows, step-by-step procedures.

**Consulting style**: Rounded rectangles with subtle shadow, thin connecting arrows, optional step numbers in accent-colored circles.

**Layout**: Horizontal (default) or vertical chain connected by arrows.

**Element generation**:

```
For each step i:
  rect_i at x = i * (boxWidth + gap), y = 0
    - width: 200, height: 80
    - backgroundColor: fillColors[i % n]
    - roundness: { type: 3 }
    - strokeColor: theme.strokeColor
  text_i bound to rect_i (centered, auto-contrast color)
  arrow_i from rect_(i-1) to rect_i (skip for first)
    - strokeWidth: 1.5
    - strokeColor: theme.arrowColor
    - endArrowhead: "arrow"
```

**Defaults**:
- Box size: 200x80
- Gap between boxes: 60
- Arrow style: single-headed, clean stroke
- Fill: cycle `fillColors` per step
- Layout direction: horizontal for <=6 steps, vertical or wrap for more

**Variations**:
- **Decision branch**: Diamond shape at decision point, fork into two arrows
- **Parallel paths**: Stack parallel rows with vertical arrows at join/split
- **Swim lanes**: Wrap rows in frames, one per actor/department
- **Step numbers**: Small accent-colored circle (30x30 ellipse) at top-left of each box

---

## Architecture Diagram

**Use case**: System components, tech stack layers, microservice topology.

**Consulting style**: Layered cards with depth via shadow, grouped in labeled frames with border-left accent color. Clean connectors between layers.

**Layout**: Layered boxes (top=presentation/sources, middle=logic, bottom=data/consumers).

**Element generation**:

```
For each layer:
  frame at y = layer * (layerHeight + layerGap)
    - name: layer label (uppercase, 12px)
  For each component in layer:
    rect at x offset within frame
      - roundness: { type: 3 }
      - backgroundColor: fillColors[layerIndex % n]
    text bound to rect (centered)
  Arrows between components (cross-layer, strokeWidth: 1.5)
```

**Defaults**:
- Layer height: 150
- Component box: 160x60
- Gap between components: 40, between layers: 40
- Frames: `frame` type for layer grouping
- Colors: one `fillColor` per layer (cycle the palette)

**Variations**:
- **Cloud boundary**: Large frame around cloud-hosted components
- **External services**: Dashed-stroke (`strokeStyle: "dashed"`) for third-party
- **Data flow arrows**: Labeled arrows showing data direction
- **Value callouts**: Right-side annotation boxes with lighter fill (e.g., amber background)

---

## Stakeholder Map

**Use case**: Influence/interest grid, relationship networks, power mapping.

**Consulting style**: Clean quadrant with axis labels, positioned circles with size proportional to importance. Subtle quadrant fills at 10% opacity.

**Layout**: 2D grid (influence x interest) or free-form network.

**Element generation — grid variant**:

```
Background: 2x2 quadrant using lines and axis labels
  - Axis lines: 2px stroke, theme.strokeColor
  - Axis labels: bodyFont, fontSize+4, at axis ends
For each stakeholder:
  ellipse at (interest_score * scale, influence_score * scale)
    - width/height: 80-160 (scaled by importance)
    - backgroundColor: fillColors[group % n]
  text bound to ellipse (name, auto-contrast)
```

**Element generation — network variant**:

```
For each stakeholder:
  ellipse at computed position
For each relationship:
  arrow/line between stakeholders
  Label on arrow (relationship type)
```

**Defaults**:
- Circle size: 80-160 diameter (scaled by importance)
- Fill: cycle `fillColors` by stakeholder group/category
- Quadrant labels: fontSize+4, semi-transparent

---

## Org Chart

**Use case**: Team structure, reporting lines, department hierarchy.

**Consulting style**: Clean cards with consistent sizing, right-angle connectors, color-coded by level.

**Layout**: Top-down tree with hierarchical connectors.

**Element generation**:

```
BFS from root:
  For each node at depth d:
    rect at x = horizontal_center(siblings), y = d * (boxHeight + verticalGap)
      - width: 180, height: 70
      - backgroundColor: fillColors[d % n]
      - roundness: { type: 3 }
    text bound to rect (name + title on separate lines)
    arrow from parent to this node
      - right-angle path (3+ points)
      - strokeWidth: 1.5
```

**Defaults**:
- Box size: 180x70
- Vertical gap: 80
- Horizontal spacing: calculated to center children under parent (min 40px sibling gap)
- Root node: `fillColors[0]`, L1: `fillColors[1]`, etc.
- Connectors: right-angle arrows using intermediate points

---

## Timeline

**Use case**: Project phases, milestones, historical progression.

**Consulting style**: Horizontal track with milestone dots, phase bars above in accent colors, dates below in caption font.

**Layout**: Horizontal line with event markers above/below.

**Element generation**:

```
Main axis: line from (0, centerY) to (totalWidth, centerY)
  - strokeWidth: 2, strokeColor: theme.arrowColor
For each event i:
  marker: small ellipse (16x16) at x = i * spacing, y = centerY
    - backgroundColor: fillColors[i % n]
  label: text above (even i) or below (odd i)
    - fontSize: labelFontSize
    - offset: 30px from axis
  Optional: rect for phase spans between markers
    - light fill (10% opacity of fillColor)
    - height: 30px, positioned above axis
```

**Defaults**:
- Axis: 2px stroke, `arrowColor`
- Markers: 16x16 ellipses, `fillColors[i % n]`
- Labels: `labelFontSize`, alternating above/below for readability
- Phase spans: light-fill rectangles between start/end markers

---

## Funnel

**Use case**: Campaign conversion, sales pipeline, process filtering.

**Consulting style**: Gradient-filled stages narrowing smoothly, metric annotations on right side in caption font.

**Layout**: Stacked trapezoids narrowing from top to bottom.

**Element generation**:

```
For each stage i (top=widest):
  width = maxWidth - (i * shrinkPerStage)
  x = (maxWidth - width) / 2  // centered
  y = i * stageHeight
  rect with width narrowing per stage
    - backgroundColor: fillColors[i % n]
    - roundness: { type: 3 }
  text bound to center of shape
  Optional: metric text on the right side
    - fontSize: labelFontSize
    - color: theme.arrowColor (secondary emphasis)
```

**Defaults**:
- Max width: 400, min width: 150
- Stage height: 60, gap: 4px between stages
- Fill: cycle `fillColors` per stage
- Shrink: linear from max to min width
- Metric annotations: right-aligned, 40px gap from funnel edge

---

## Matrix / Grid

**Use case**: 2x2 analysis (e.g., Eisenhower matrix), prioritization grids, BCG matrix.

**Consulting style**: Clean 2x2 with quadrant fills at 10% opacity, axis labels in body font, items as small rounded rectangles positioned within quadrants.

**Layout**: Quadrant with labeled axes and items placed in cells.

**Element generation**:

```
Axes: two lines forming a cross at center
  - strokeWidth: 2, strokeColor: theme.strokeColor
Axis labels: text at each end (4 labels total)
  - fontSize: theme.fontSize, fontWeight: 500
Quadrant labels: text in center of each quadrant
  - fontSize: theme.fontSize, semi-transparent (opacity: 40)
Items: small rectangles positioned within quadrants
  - width: 120, height: 50
  - backgroundColor: fillColors by quadrant
  - roundness: { type: 3 }
```

**Defaults**:
- Grid size: 600x600
- Axis lines: 2px, `strokeColor`
- Quadrant labels: `fontSize`, centered, 40% opacity
- Items: 120x50 rectangles with `fillColors` by quadrant

---

## Mind Map

**Use case**: Idea exploration, topic breakdown, brainstorming.

**Consulting style**: Central node in primary color, L1 branches in accent, L2 in neutral. Clean curved connections (no arrowheads). Generous radial spacing.

**Layout**: Central node with radial branches at multiple levels.

**Element generation**:

```
Central node: large ellipse at center
  - width: 160, height: 80
  - backgroundColor: fillColors[0]
For each L1 branch at angle theta = i * (2pi / numBranches):
  rect at (cos(theta) * radius1, sin(theta) * radius1)
    - width: 160, height: 60
    - backgroundColor: fillColors[(i % (n-1)) + 1]
    - roundness: { type: 3 }
  line from center to this node (no arrowhead)
    - strokeWidth: 1.5
  For each L2 child:
    smaller rect at (cos(theta +/- offset) * radius2, ...)
      - width: 140, height: 50
      - backgroundColor: lighter shade or neutral
    line from L1 parent to this child
```

**Defaults**:
- Center node: 160x80 ellipse, `fillColors[0]`
- L1 radius: 250px, L2 radius: 450px
- L1 nodes: 160x60, cycle `fillColors[1:]`
- L2 nodes: 140x50, neutral fill
- Lines: no arrowhead, 1.5px stroke
- Radial spacing: even distribution with min 40px gap between nodes
