#!/usr/bin/env node
/**
 * diagram-to-html.js — Excalidraw JSON → styled HTML for Playwright rendering
 *
 * Converts Excalidraw element arrays into positioned HTML/CSS divs with:
 * - CSS custom properties from tokens.css (when available)
 * - Google Fonts via @import (from charter.json font stack)
 * - Consulting-quality styling: border-radius, box-shadow, gradients
 * - SVG arrows with proper markers
 *
 * Used by render-diagram.js as the intermediate step before Playwright screenshot.
 */

const fs = require("fs");
const path = require("path");

/**
 * Load brand theme from charter.json, with tokens.css injection.
 * @param {string} clientSlug - Client directory name under client-data/clients/
 * @param {string} [repoRoot] - Repository root path
 * @returns {{ theme: object, tokensCss: string|null, fontImport: string }}
 */
function loadBrandTheme(clientSlug, repoRoot) {
  const clientDir = path.join(
    repoRoot || process.cwd(),
    "companies",
    clientSlug
  );

  let charter = null;
  const charterPath = path.join(clientDir, "charter.json");
  if (fs.existsSync(charterPath)) {
    charter = JSON.parse(fs.readFileSync(charterPath, "utf-8"));
  }

  let tokensCss = null;
  const tokensPath = path.join(clientDir, "tokens.css");
  if (fs.existsSync(tokensPath)) {
    tokensCss = fs.readFileSync(tokensPath, "utf-8");
  }

  const theme = deriveTheme(charter);
  const fontImport = buildFontImport(charter);

  return { theme, tokensCss, fontImport, charter };
}

/**
 * Derive diagram theme from charter.json.
 * Prefers charter.excalidraw section, falls back to colors/fonts.
 */
function deriveTheme(charter) {
  const defaults = {
    strokeColor: "#1e293b",
    backgroundColor: "#ffffff",
    fillColors: ["#3b82f6", "#f59e0b", "#10b981", "#6366f1", "#f97316"],
    textColor: "#1f2937",
    arrowColor: "#6b7280",
    headingFont: "'Plus Jakarta Sans', sans-serif",
    bodyFont: "'Plus Jakarta Sans', sans-serif",
    fontSize: 16,
    strokeWidth: 2,
    roughness: 1,
    labelFontSize: 14,
  };

  if (!charter) return defaults;

  if (charter.excalidraw) {
    return { ...defaults, ...charter.excalidraw };
  }

  const c = charter.colors || {};
  const f = charter.fonts || {};

  return {
    strokeColor: c.primary || defaults.strokeColor,
    backgroundColor: c.background || defaults.backgroundColor,
    fillColors: [
      c.primary || defaults.fillColors[0],
      c.accent || defaults.fillColors[1],
      c.success || defaults.fillColors[2],
      c.secondary || defaults.fillColors[3],
      c.warning || defaults.fillColors[4],
    ].filter(Boolean),
    textColor: c.text || defaults.textColor,
    arrowColor: c.textLight || defaults.arrowColor,
    headingFont: f.heading
      ? `'${f.heading.family}', ${f.heading.fallback || "sans-serif"}`
      : defaults.headingFont,
    bodyFont: f.body
      ? `'${f.body.family}', ${f.body.fallback || "sans-serif"}`
      : defaults.bodyFont,
    fontSize: defaults.fontSize,
    strokeWidth: defaults.strokeWidth,
    roughness: defaults.roughness,
    labelFontSize: defaults.labelFontSize,
  };
}

/** Build Google Fonts @import URL from charter fonts. */
function buildFontImport(charter) {
  if (!charter || !charter.fonts) return "";

  const families = new Set();
  for (const role of ["heading", "body", "mono"]) {
    const font = charter.fonts[role];
    if (font && font.family) {
      const weights = role === "heading" ? "400;500;700" : "400;500";
      families.add(
        `family=${encodeURIComponent(font.family)}:wght@${weights}`
      );
    }
  }

  if (families.size === 0) return "";
  return `@import url('https://fonts.googleapis.com/css2?${[...families].join("&")}&display=swap');`;
}

/** Calculate luminance for auto-contrast text on fills. */
function luminance(hex) {
  if (!hex || hex === "transparent") return 1;
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function textColorOnFill(fillHex, theme) {
  return luminance(fillHex) < 0.5 ? "#ffffff" : theme.textColor;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Convert Excalidraw elements to an HTML page string.
 * @param {object} excalidrawData - Full .excalidraw JSON (with elements, appState)
 * @param {object} options
 * @param {object} options.theme - Brand theme object
 * @param {string|null} options.tokensCss - Raw tokens.css content
 * @param {string} options.fontImport - Google Fonts @import
 * @param {number} [options.scale=2] - Render scale
 * @returns {{ html: string, width: number, height: number }}
 */
function excalidrawToHtml(excalidrawData, options) {
  const { theme, tokensCss, fontImport, scale = 2 } = options;
  const elements = (excalidrawData.elements || []).filter((e) => !e.isDeleted);
  const appState = excalidrawData.appState || {};
  const bgColor = appState.viewBackgroundColor || theme.backgroundColor;

  if (elements.length === 0) {
    throw new Error("No elements found in Excalidraw data");
  }

  // Calculate bounding box
  const padding = 60;
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  for (const el of elements) {
    if (el.type === "arrow" || el.type === "line") {
      for (const [px, py] of el.points || []) {
        minX = Math.min(minX, el.x + px);
        minY = Math.min(minY, el.y + py);
        maxX = Math.max(maxX, el.x + px);
        maxY = Math.max(maxY, el.y + py);
      }
    } else {
      minX = Math.min(minX, el.x);
      minY = Math.min(minY, el.y);
      maxX = Math.max(maxX, el.x + (el.width || 0));
      maxY = Math.max(maxY, el.y + (el.height || 0));
    }
  }

  // Account for frame labels
  for (const el of elements) {
    if (el.type === "frame" && el.name) {
      minY = Math.min(minY, el.y - 24);
    }
  }

  const width = Math.ceil(maxX - minX + padding * 2);
  const height = Math.ceil(maxY - minY + padding * 2);
  const offsetX = -minX + padding;
  const offsetY = -minY + padding;

  // Build element index for lookups
  const elById = new Map(elements.map((e) => [e.id, e]));

  // Separate element types for render ordering
  const frames = elements.filter((e) => e.type === "frame");
  const shapes = elements.filter((e) =>
    ["rectangle", "ellipse", "diamond"].includes(e.type)
  );
  const connectors = elements.filter((e) =>
    ["arrow", "line"].includes(e.type)
  );
  // Only render text that is NOT bound to a container (bound text is rendered inside shapes)
  const freeTexts = elements.filter(
    (e) => e.type === "text" && !e.containerId
  );

  // Generate HTML for each element type
  const frameDivs = frames.map((el) => renderFrame(el, offsetX, offsetY, theme)).join("\n");
  const shapeDivs = shapes.map((el) => renderShape(el, offsetX, offsetY, theme, elById)).join("\n");
  const arrowSvg = renderArrowsSvg(connectors, offsetX, offsetY, width, height, theme, elById);
  const textDivs = freeTexts.map((el) => renderFreeText(el, offsetX, offsetY, theme)).join("\n");

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
${fontImport}
${tokensCss || ""}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  width: ${width}px;
  height: ${height}px;
  background: ${bgColor};
  position: relative;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.diagram-frame {
  position: absolute;
  border: 1.5px dashed #94a3b8;
  border-radius: 6px;
  pointer-events: none;
}

.diagram-frame-label {
  position: absolute;
  top: -20px;
  left: 8px;
  font-family: ${theme.bodyFont};
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.diagram-shape {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  transition: none;
}

.diagram-shape-rect {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.diagram-shape-ellipse {
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.diagram-shape-diamond {
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.diagram-text {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.diagram-text-inner {
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.35;
  padding: 4px 8px;
}

.arrow-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
</head>
<body>
${frameDivs}
${shapeDivs}
${arrowSvg}
${textDivs}
</body>
</html>`;

  return { html, width, height };
}

function renderFrame(el, offsetX, offsetY, theme) {
  const x = el.x + offsetX;
  const y = el.y + offsetY;
  const label = el.name
    ? `<span class="diagram-frame-label">${escapeHtml(el.name)}</span>`
    : "";

  return `<div class="diagram-frame" style="left:${x}px;top:${y}px;width:${el.width}px;height:${el.height}px;">
  ${label}
</div>`;
}

function renderShape(el, offsetX, offsetY, theme, elById) {
  const x = el.x + offsetX;
  const y = el.y + offsetY;
  const fill =
    el.backgroundColor && el.backgroundColor !== "transparent"
      ? el.backgroundColor
      : "transparent";
  const stroke = el.strokeColor || theme.strokeColor;
  const sw = el.strokeWidth || theme.strokeWidth;

  // Find bound text
  let textHtml = "";
  const boundTextEntry = (el.boundElements || []).find(
    (b) => b.type === "text"
  );
  if (boundTextEntry) {
    const textEl = elById.get(boundTextEntry.id);
    if (textEl) {
      const fontSize = textEl.fontSize || theme.fontSize;
      const fontFamily =
        textEl.fontFamily === 1
          ? "'Virgil', cursive"
          : textEl.fontFamily === 3
            ? "'Cascadia Code', monospace"
            : theme.bodyFont;
      const color =
        textEl.strokeColor && textEl.strokeColor !== "transparent"
          ? textEl.strokeColor
          : textColorOnFill(fill, theme);
      const lines = (textEl.text || "").split("\n").map(escapeHtml).join("<br>");

      textHtml = `<span class="diagram-text-inner" style="font-family:${fontFamily};font-size:${fontSize}px;color:${color};font-weight:500;">${lines}</span>`;
    }
  }

  let shapeClass = "diagram-shape diagram-shape-rect";
  let extraStyle = "";

  if (el.type === "ellipse") {
    shapeClass = "diagram-shape diagram-shape-ellipse";
  } else if (el.type === "diamond") {
    shapeClass = "diagram-shape diagram-shape-diamond";
    extraStyle = `clip-path:polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);`;
  }

  // Rounded corners from Excalidraw roundness
  let borderRadius = "";
  if (el.type === "rectangle") {
    if (el.roundness && el.roundness.type === 3) {
      borderRadius = "border-radius:8px;";
    } else if (!el.roundness) {
      borderRadius = "border-radius:4px;";
    }
  }

  return `<div class="${shapeClass}" style="left:${x}px;top:${y}px;width:${el.width}px;height:${el.height}px;background:${fill};border:${sw}px solid ${stroke};${borderRadius}${extraStyle}">
  ${textHtml}
</div>`;
}

function renderArrowsSvg(
  connectors,
  offsetX,
  offsetY,
  width,
  height,
  theme,
  elById
) {
  if (connectors.length === 0) return "";

  const paths = connectors
    .map((el) => {
      if (!el.points || el.points.length < 2) return "";

      const points = el.points.map(([px, py]) => [
        el.x + px + offsetX,
        el.y + py + offsetY,
      ]);
      const stroke = el.strokeColor || theme.arrowColor;
      const sw = el.strokeWidth || 2;

      // Build smooth path using quadratic curves for 3+ points
      let d;
      if (points.length === 2) {
        d = `M${points[0][0]},${points[0][1]} L${points[1][0]},${points[1][1]}`;
      } else {
        d = `M${points[0][0]},${points[0][1]}`;
        for (let i = 1; i < points.length - 1; i++) {
          const midX = (points[i][0] + points[i + 1][0]) / 2;
          const midY = (points[i][1] + points[i + 1][1]) / 2;
          d += ` Q${points[i][0]},${points[i][1]} ${midX},${midY}`;
        }
        const last = points[points.length - 1];
        const prev = points[points.length - 2];
        d += ` Q${prev[0]},${prev[1]} ${last[0]},${last[1]}`;
      }

      const markerId =
        el.type === "arrow" && el.endArrowhead !== null
          ? `arrow-marker-${el.id}`
          : null;

      let marker = "";
      if (markerId) {
        marker = `<defs><marker id="${markerId}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/></marker></defs>`;
      }

      const markerEnd = markerId ? ` marker-end="url(#${markerId})"` : "";

      // Arrow label text
      let labelSvg = "";
      const boundLabel = (el.boundElements || []).find(
        (b) => b.type === "text"
      );
      if (boundLabel) {
        const labelEl = elById.get(boundLabel.id);
        if (labelEl) {
          const lx = labelEl.x + offsetX + (labelEl.width || 0) / 2;
          const ly = labelEl.y + offsetY + (labelEl.height || 0) / 2;
          labelSvg = `<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="central" font-family="${theme.bodyFont}" font-size="${theme.labelFontSize}px" fill="${theme.arrowColor}">${escapeHtml(labelEl.text || "")}</text>`;
        }
      }

      return `${marker}<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${markerEnd}/>${labelSvg}`;
    })
    .filter(Boolean)
    .join("\n  ");

  return `<svg class="arrow-layer" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  ${paths}
</svg>`;
}

function renderFreeText(el, offsetX, offsetY, theme) {
  const x = el.x + offsetX;
  const y = el.y + offsetY;
  const fontSize = el.fontSize || theme.fontSize;
  const fontFamily =
    el.fontFamily === 1
      ? "'Virgil', cursive"
      : el.fontFamily === 3
        ? "'Cascadia Code', monospace"
        : theme.bodyFont;
  const color = el.strokeColor || theme.textColor;
  const align = el.textAlign || "left";

  const lines = (el.text || "").split("\n").map(escapeHtml).join("<br>");

  // Use heading font for larger text (titles)
  const effectiveFont = fontSize >= 20 ? theme.headingFont : fontFamily;
  const fontWeight = fontSize >= 20 ? "500" : "400";

  return `<div class="diagram-text" style="left:${x}px;top:${y}px;width:${el.width || "auto"}px;height:${el.height || "auto"}px;text-align:${align};justify-content:${align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start"};">
  <span class="diagram-text-inner" style="font-family:${effectiveFont};font-size:${fontSize}px;color:${color};font-weight:${fontWeight};">${lines}</span>
</div>`;
}

/**
 * Normalize Mermaid bridge output: convert embedded label objects
 * into proper separate text elements with containerId/boundElements.
 */
function normalizeMermaidElements(elements) {
  const newElements = [];
  let labelCounter = 0;

  for (const el of elements) {
    if (el.label && typeof el.label === "object") {
      // Extract label into a proper text element
      const textId = `mermaid_label_${++labelCounter}`;
      const label = el.label;

      const textEl = {
        id: textId,
        type: "text",
        x: el.x + 10,
        y: el.y + 10,
        width: (el.width || 100) - 20,
        height: (el.height || 40) - 20,
        text: label.text || "",
        fontSize: label.fontSize || 14,
        fontFamily: label.fontFamily || 2,
        textAlign: label.textAlign || "center",
        verticalAlign: label.verticalAlign || "middle",
        strokeColor: label.strokeColor || "#1e293b",
        backgroundColor: "transparent",
        containerId: el.id,
        opacity: 100,
      };

      // Update the shape to have boundElements
      const boundElements = el.boundElements || [];
      boundElements.push({ id: textId, type: "text" });

      const shapeCopy = { ...el, boundElements };
      delete shapeCopy.label;

      newElements.push(shapeCopy);
      newElements.push(textEl);
    } else {
      newElements.push(el);
    }
  }

  return newElements;
}

module.exports = {
  excalidrawToHtml,
  loadBrandTheme,
  deriveTheme,
  normalizeMermaidElements,
  textColorOnFill,
  luminance,
};
