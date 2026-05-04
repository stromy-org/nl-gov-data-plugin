#!/usr/bin/env node
/**
 * render-diagram.js — Excalidraw JSON → PNG/SVG export
 *
 * HTML-first approach: converts Excalidraw elements to styled HTML/CSS,
 * renders via Playwright for pixel-perfect output with web fonts, shadows,
 * and brand tokens. Falls back to basic SVG for environments without Playwright.
 *
 * Usage:
 *   node render-diagram.js <input.excalidraw> <output.png|svg> [options]
 *
 * Options:
 *   --format png|svg       Output format (auto-detected from extension)
 *   --scale N              Render scale (default: 2, for retina)
 *   --client <slug>        Client slug for brand theming (reads charter.json + tokens.css)
 *   --repo-root <path>     Repository root (default: cwd, for finding client-data/)
 *   --fallback-svg          Force basic SVG renderer (no Playwright)
 *
 * Dependencies: playwright (for HTML rendering), @resvg/resvg-js (SVG fallback)
 */

const fs = require("fs");
const path = require("path");
const {
  excalidrawToHtml,
  loadBrandTheme,
  deriveTheme,
  normalizeMermaidElements,
} = require("./diagram-to-html");

// ── CLI Argument Parsing ──

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error(
    "Usage: render-diagram.js <input.excalidraw> <output.png|svg> [--format png|svg] [--scale N] [--client <slug>] [--repo-root <path>] [--fallback-svg]"
  );
  process.exit(1);
}

const inputPath = path.resolve(args[0]);
const outputPath = path.resolve(args[1]);

let format = "png";
let scale = 2;
let clientSlug = null;
let repoRoot = null;
let forceFallback = false;

for (let i = 2; i < args.length; i++) {
  if (args[i] === "--format" && args[i + 1]) {
    format = args[++i];
  } else if (args[i] === "--scale" && args[i + 1]) {
    scale = parseInt(args[++i], 10);
  } else if (args[i] === "--client" && args[i + 1]) {
    clientSlug = args[++i];
  } else if (args[i] === "--repo-root" && args[i + 1]) {
    repoRoot = args[++i];
  } else if (args[i] === "--fallback-svg") {
    forceFallback = true;
  }
}

if (outputPath.endsWith(".svg")) format = "svg";
if (outputPath.endsWith(".png")) format = "png";

// ── Main ──

async function renderHtml() {
  const excalidrawData = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

  // Normalize Mermaid bridge label objects
  if (excalidrawData.elements) {
    excalidrawData.elements = normalizeMermaidElements(
      excalidrawData.elements
    );
  }

  // Load brand theme
  let theme, tokensCss, fontImport;
  if (clientSlug) {
    const brand = loadBrandTheme(clientSlug, repoRoot || findRepoRoot());
    theme = brand.theme;
    tokensCss = brand.tokensCss;
    fontImport = brand.fontImport;
  } else {
    theme = deriveTheme(null);
    tokensCss = null;
    fontImport = "";
  }

  // Convert to HTML
  const { html, width, height } = excalidrawToHtml(excalidrawData, {
    theme,
    tokensCss,
    fontImport,
    scale,
  });

  // Render with Playwright
  const { chromium } = require("playwright");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewportSize({
    width: Math.ceil(width),
    height: Math.ceil(height),
  });

  await page.setContent(html, { waitUntil: "networkidle" });

  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);

  if (format === "png") {
    await page.screenshot({
      path: outputPath,
      type: "png",
      scale: "device",
      omitBackground: false,
    });
    // Set device scale for retina output
    if (scale > 1) {
      await page.close();
      const page2 = await browser.newPage();
      await page2.setViewportSize({
        width: Math.ceil(width),
        height: Math.ceil(height),
      });
      // Use CDP to set device scale factor
      const cdpSession = await page2.context().newCDPSession(page2);
      await cdpSession.send("Emulation.setDeviceMetricsOverride", {
        width: Math.ceil(width),
        height: Math.ceil(height),
        deviceScaleFactor: scale,
        mobile: false,
      });
      await page2.setContent(html, { waitUntil: "networkidle" });
      await page2.evaluate(() => document.fonts.ready);
      await page2.screenshot({
        path: outputPath,
        type: "png",
        omitBackground: false,
      });
      await page2.close();
    }
    console.log(
      `PNG saved to ${outputPath} (${scale}x, ${width}x${height})`
    );
  } else {
    // SVG: extract the rendered body innerHTML as SVG
    // Use a foreignObject SVG wrapper for full CSS fidelity
    const bodyHtml = await page.evaluate(() => document.body.outerHTML);
    const styles = await page.evaluate(() => {
      const styleSheets = [...document.querySelectorAll("style")];
      return styleSheets.map((s) => s.textContent).join("\n");
    });

    const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <foreignObject width="${width}" height="${height}">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head><style>${styles}</style></head>
    ${bodyHtml}
    </html>
  </foreignObject>
</svg>`;

    fs.writeFileSync(outputPath, svgString, "utf-8");
    console.log(
      `SVG saved to ${outputPath} (${width}x${height})`
    );
  }

  await browser.close();
}

// ── SVG Fallback Renderer ──

function renderFallbackSvg() {
  const excalidrawData = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

  if (excalidrawData.elements) {
    excalidrawData.elements = normalizeMermaidElements(
      excalidrawData.elements
    );
  }

  const elements = (excalidrawData.elements || []).filter((e) => !e.isDeleted);
  const appState = excalidrawData.appState || {};

  if (elements.length === 0) {
    console.error("No elements found in Excalidraw file");
    process.exit(1);
  }

  // Calculate bounding box
  const padding = 40;
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

  for (const el of elements) {
    if (el.type === "frame" && el.name) minY = Math.min(minY, el.y - 20);
  }

  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;
  const bgColor = appState.viewBackgroundColor || "#ffffff";

  function escapeXml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function hexToRgba(hex, opacity) {
    if (!hex || hex === "transparent") return "none";
    const h = hex.replace("#", "");
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    const a = (opacity ?? 100) / 100;
    return `rgba(${r},${g},${b},${a})`;
  }

  function renderElement(el) {
    const fill =
      el.backgroundColor && el.backgroundColor !== "transparent"
        ? hexToRgba(el.backgroundColor, el.opacity)
        : "none";
    const stroke = hexToRgba(el.strokeColor || "#000000", el.opacity);
    const sw = el.strokeWidth || 1;
    const rx = el.roundness?.type === 3 ? 8 : 0;

    switch (el.type) {
      case "rectangle":
        return `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" />`;
      case "ellipse":
        return `<ellipse cx="${el.x + el.width / 2}" cy="${el.y + el.height / 2}" rx="${el.width / 2}" ry="${el.height / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" />`;
      case "diamond": {
        const cx = el.x + el.width / 2;
        const cy = el.y + el.height / 2;
        const hw = el.width / 2;
        const hh = el.height / 2;
        return `<polygon points="${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh} ${cx - hw},${cy}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" />`;
      }
      case "text": {
        const fontSize = el.fontSize || 16;
        const color = hexToRgba(el.strokeColor || "#000000", el.opacity);
        const align = el.textAlign || "left";
        const lines = (el.text || "").split("\n");
        const lineHeight = fontSize * 1.3;
        let anchorX = el.x;
        let textAnchor = "start";
        if (align === "center") {
          anchorX = el.x + (el.width || 0) / 2;
          textAnchor = "middle";
        } else if (align === "right") {
          anchorX = el.x + (el.width || 0);
          textAnchor = "end";
        }
        let startY = el.y + fontSize;
        if (el.verticalAlign === "middle") {
          const totalTextHeight = lines.length * lineHeight;
          startY =
            el.y +
            (el.height || totalTextHeight) / 2 -
            totalTextHeight / 2 +
            fontSize * 0.85;
        }
        const tspans = lines
          .map(
            (line, i) =>
              `<tspan x="${anchorX}" dy="${i === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`
          )
          .join("");
        return `<text x="${anchorX}" y="${startY}" font-family="Helvetica, Arial, sans-serif" font-size="${fontSize}" fill="${color}" text-anchor="${textAnchor}">${tspans}</text>`;
      }
      case "arrow":
      case "line": {
        if (!el.points || el.points.length < 2) return "";
        const points = el.points.map(([px, py]) => [el.x + px, el.y + py]);
        const d = points
          .map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`)
          .join(" ");
        let arrowHead = "";
        if (el.type === "arrow" && el.endArrowhead !== null) {
          const last = points[points.length - 1];
          const prev = points[points.length - 2];
          const angle = Math.atan2(
            last[1] - prev[1],
            last[0] - prev[0]
          );
          const aLen = 12;
          const aWidth = 6;
          const left = [
            last[0] -
              aLen * Math.cos(angle) +
              aWidth * Math.sin(angle),
            last[1] -
              aLen * Math.sin(angle) -
              aWidth * Math.cos(angle),
          ];
          const right = [
            last[0] -
              aLen * Math.cos(angle) -
              aWidth * Math.sin(angle),
            last[1] -
              aLen * Math.sin(angle) +
              aWidth * Math.cos(angle),
          ];
          arrowHead = `<polygon points="${last[0]},${last[1]} ${left[0]},${left[1]} ${right[0]},${right[1]}" fill="${stroke}" />`;
        }
        return `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${sw}" />${arrowHead}`;
      }
      case "frame": {
        const labelY = el.y - 6;
        const name = el.name || "";
        return (
          `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" fill="none" stroke="#94a3b8" stroke-width="1" stroke-dasharray="6,3" rx="4" />` +
          (name
            ? `<text x="${el.x + 8}" y="${labelY}" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="#64748b">${escapeXml(name)}</text>`
            : "")
        );
      }
      default:
        return "";
    }
  }

  const frames = elements.filter((e) => e.type === "frame");
  const shapes = elements.filter((e) =>
    ["rectangle", "ellipse", "diamond"].includes(e.type)
  );
  const connectors = elements.filter((e) =>
    ["arrow", "line"].includes(e.type)
  );
  const texts = elements.filter((e) => e.type === "text");

  const ordered = [...frames, ...shapes, ...connectors, ...texts];
  const svgParts = ordered.map(renderElement).filter(Boolean);

  const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX - padding} ${minY - padding} ${width} ${height}" width="${width}" height="${height}">
  <rect x="${minX - padding}" y="${minY - padding}" width="${width}" height="${height}" fill="${bgColor}" />
  ${svgParts.join("\n  ")}
</svg>`;

  if (format === "svg") {
    fs.writeFileSync(outputPath, svgString, "utf-8");
    console.log(
      `SVG saved to ${outputPath} (${elements.length} elements, fallback renderer)`
    );
  } else {
    const { Resvg } = require("@resvg/resvg-js");
    const resvg = new Resvg(svgString, {
      fitTo: { mode: "zoom", value: scale },
    });
    const pngData = resvg.render();
    fs.writeFileSync(outputPath, pngData.asPng());
    console.log(
      `PNG saved to ${outputPath} (${scale}x, ${elements.length} elements, fallback renderer)`
    );
  }
}

/** Walk up to find the repo root (directory containing package.json). */
function findRepoRoot() {
  let dir = __dirname;
  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(dir, "package.json"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return process.cwd();
}

// ── Entry Point ──

if (forceFallback) {
  renderFallbackSvg();
} else {
  renderHtml().catch((err) => {
    console.warn(
      `Playwright rendering failed (${err.message}), falling back to SVG renderer`
    );
    renderFallbackSvg();
  });
}
