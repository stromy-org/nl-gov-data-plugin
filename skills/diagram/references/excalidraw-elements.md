# Excalidraw Element API Reference

All elements share a base set of properties. Type-specific properties are listed per element type.

## Common Properties (all elements)

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | yes | Unique identifier (e.g., `"elem_1"`) |
| `type` | string | yes | Element type (see below) |
| `x` | number | yes | X position (pixels from origin) |
| `y` | number | yes | Y position (pixels from origin) |
| `width` | number | yes | Element width |
| `height` | number | yes | Element height |
| `strokeColor` | string | no | Outline color (hex, e.g., `"#1D342B"`) |
| `backgroundColor` | string | no | Fill color (hex or `"transparent"`) |
| `fillStyle` | string | no | `"solid"`, `"hachure"`, `"cross-hatch"` |
| `strokeWidth` | number | no | Line thickness (1, 2, 4) |
| `roughness` | number | no | 0=architect, 1=artist, 2=cartoonist |
| `opacity` | number | no | 0–100 |
| `groupIds` | string[] | no | Group membership for linked movement |
| `boundElements` | array | no | Elements bound to this one (arrows, text) |
| `angle` | number | no | Rotation in radians |
| `isDeleted` | boolean | no | Soft-delete flag |

## Element Types

### `rectangle`

Standard box shape. Use for process steps, containers, cards.

```json
{
  "id": "rect_1",
  "type": "rectangle",
  "x": 100, "y": 100,
  "width": 200, "height": 80,
  "strokeColor": "#1D342B",
  "backgroundColor": "#ECE6DA",
  "fillStyle": "solid",
  "strokeWidth": 2,
  "roughness": 0,
  "roundness": { "type": 3 }
}
```

`roundness`: `null` for sharp corners, `{ "type": 3 }` for rounded corners.

### `ellipse`

Circle or oval. Use for stakeholder nodes, decision points.

```json
{
  "id": "ellipse_1",
  "type": "ellipse",
  "x": 100, "y": 100,
  "width": 120, "height": 120,
  "strokeColor": "#1D342B",
  "backgroundColor": "#B96034",
  "fillStyle": "solid"
}
```

### `diamond`

Diamond/rhombus shape. Use for decision nodes in flowcharts.

```json
{
  "id": "diamond_1",
  "type": "diamond",
  "x": 100, "y": 100,
  "width": 120, "height": 120,
  "strokeColor": "#1D342B",
  "backgroundColor": "#47685B",
  "fillStyle": "solid"
}
```

### `text`

Standalone text element. Also used as bound text inside shapes.

```json
{
  "id": "text_1",
  "type": "text",
  "x": 110, "y": 120,
  "width": 180, "height": 40,
  "text": "Process Step",
  "fontSize": 16,
  "fontFamily": 2,
  "textAlign": "center",
  "verticalAlign": "middle",
  "strokeColor": "#171611",
  "backgroundColor": "transparent",
  "containerId": "rect_1"
}
```

| Property | Values | Description |
|----------|--------|-------------|
| `text` | string | The text content (supports `\n` for line breaks) |
| `fontSize` | number | Font size in px |
| `fontFamily` | 1\|2\|3\|4 | 1=Virgil, 2=Helvetica, 3=Cascadia, 4=custom |
| `textAlign` | `"left"` \| `"center"` \| `"right"` | Horizontal alignment |
| `verticalAlign` | `"top"` \| `"middle"` | Vertical alignment |
| `containerId` | string\|null | ID of parent shape (for bound text) |

**Bound text**: When text is inside a shape, set `containerId` to the shape's ID and add a `boundElements` entry on the shape:

```json
// On the rectangle:
"boundElements": [{ "id": "text_1", "type": "text" }]

// On the text:
"containerId": "rect_1"
```

### `arrow`

Directed connector between elements. Use for flows, relationships, dependencies.

```json
{
  "id": "arrow_1",
  "type": "arrow",
  "x": 300, "y": 140,
  "width": 100, "height": 0,
  "points": [[0, 0], [100, 0]],
  "strokeColor": "#6D665C",
  "strokeWidth": 2,
  "roughness": 0,
  "startBinding": {
    "elementId": "rect_1",
    "focus": 0,
    "gap": 5
  },
  "endBinding": {
    "elementId": "rect_2",
    "focus": 0,
    "gap": 5
  },
  "startArrowhead": null,
  "endArrowhead": "arrow"
}
```

| Property | Description |
|----------|-------------|
| `points` | Array of `[x, y]` pairs relative to element origin. Minimum 2 points. |
| `startBinding` | Binds start to a shape. `elementId` = target shape, `focus` = -1 to 1 (attachment point), `gap` = space from shape edge. |
| `endBinding` | Binds end to a shape. Same structure as `startBinding`. |
| `startArrowhead` | `null`, `"arrow"`, `"bar"`, `"dot"`, `"triangle"` |
| `endArrowhead` | Same options as `startArrowhead` |

**Binding**: When binding arrows, also add `boundElements` entries on the connected shapes:

```json
// On rect_1:
"boundElements": [{ "id": "arrow_1", "type": "arrow" }]

// On rect_2:
"boundElements": [{ "id": "arrow_1", "type": "arrow" }]
```

### `line`

Non-directed line. Use for dividers, borders, axes.

Same as `arrow` but `type: "line"` and no arrowheads.

### `frame`

Container frame that visually groups elements. Use for swimlanes, system boundaries.

```json
{
  "id": "frame_1",
  "type": "frame",
  "x": 50, "y": 50,
  "width": 500, "height": 300,
  "name": "Backend Services"
}
```

Elements inside a frame should have matching coordinates (within the frame bounds).

## ID Generation

Use a simple counter pattern:

```javascript
let idCounter = 0;
const nextId = () => `elem_${++idCounter}`;
```

## Coordinate System

- Origin (0, 0) is top-left
- X increases rightward
- Y increases downward
- All coordinates in pixels
- Recommended spacing between elements: 40–60px gap

## Tips for Valid JSON

- Every element must have `id`, `type`, `x`, `y`, `width`, `height`
- Text elements also need `text`, `fontSize`, `fontFamily`
- Arrow `points` are relative to the arrow's `x`, `y` position
- Set `fillStyle: "solid"` when using `backgroundColor` (otherwise default hachure pattern)
- Use `roughness: 0` for clean, corporate diagrams
