"""Image sizing utilities for aspect-ratio-preserving bounding-box fits.

Used by format skills (docx, pptx, pdf) to prevent logo/image squashing.
"""

from __future__ import annotations

import re
from pathlib import Path

from PIL import Image


def fit_image_in_box(
    image_path: str | Path, max_width: float, max_height: float
) -> dict[str, float]:
    """Fit an image within a bounding box while preserving aspect ratio.

    Args:
        image_path: Path to the image file.
        max_width: Maximum width (unitless — caller decides units).
        max_height: Maximum height (unitless).

    Returns:
        Dict with keys: width, height, natural_width, natural_height.
    """
    with Image.open(image_path) as img:
        natural_width, natural_height = img.size

    aspect_ratio = natural_width / natural_height

    w = max_width
    h = w / aspect_ratio
    if h > max_height:
        h = max_height
        w = h * aspect_ratio

    return {
        "width": round(w, 2),
        "height": round(h, 2),
        "natural_width": natural_width,
        "natural_height": natural_height,
    }


def parse_dimension(s: str) -> tuple[float, str]:
    """Parse a charter dimension string like '120pt' into (value, unit)."""
    match = re.match(r"^([\d.]+)\s*([a-z]+)$", s, re.IGNORECASE)
    if not match:
        raise ValueError(f'Cannot parse dimension: "{s}"')
    return float(match.group(1)), match.group(2)


def fit_logo_from_charter(
    image_path: str | Path, logo_config: dict[str, str]
) -> dict[str, float | str]:
    """Fit a logo within the bounding box defined by a charter's logo config.

    Args:
        image_path: Path to the logo image file.
        logo_config: Charter logo object with maxWidth, maxHeight, sizing.

    Returns:
        Dict with keys: width, height, unit, natural_width, natural_height.
    """
    max_w, unit_w = parse_dimension(logo_config["maxWidth"])
    max_h, unit_h = parse_dimension(logo_config["maxHeight"])

    if unit_w != unit_h:
        raise ValueError(
            f'Mismatched units: maxWidth="{logo_config["maxWidth"]}", '
            f'maxHeight="{logo_config["maxHeight"]}"'
        )

    result = fit_image_in_box(image_path, max_w, max_h)
    return {
        "width": result["width"],
        "height": result["height"],
        "unit": unit_w,
        "natural_width": result["natural_width"],
        "natural_height": result["natural_height"],
    }
