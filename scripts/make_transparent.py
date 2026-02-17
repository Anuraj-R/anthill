#!/usr/bin/env python3
"""Make solid background transparent in PNG sprite images."""

import os
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Installing Pillow...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image


def color_distance(c1, c2):
    """Euclidean distance between two RGB tuples."""
    return sum((a - b) ** 2 for a, b in zip(c1[:3], c2[:3])) ** 0.5


def get_background_color(img):
    """Sample corners to determine background color. Returns most common corner color."""
    w, h = img.size
    corners = [
        img.getpixel((0, 0)),
        img.getpixel((w - 1, 0)),
        img.getpixel((0, h - 1)),
        img.getpixel((w - 1, h - 1)),
    ]
    # Handle RGBA
    corners = [c[:3] if len(c) >= 3 else c for c in corners]
    return max(set(corners), key=corners.count)


def make_background_transparent(img_path, tolerance=35, output_path=None):
    """
    Make pixels matching the background color transparent.
    tolerance: max color distance for a pixel to be considered background (0-442)
    """
    img = Image.open(img_path)
    img = img.convert("RGBA")
    
    bg_color = get_background_color(img)
    import numpy as np
    arr = np.array(img)
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    dist = np.sqrt((r.astype(float) - bg_color[0])**2 + (g.astype(float) - bg_color[1])**2 + (b.astype(float) - bg_color[2])**2)
    mask = dist <= tolerance
    arr[mask, 3] = 0
    img = Image.fromarray(arr)
    out = output_path or img_path
    img.save(out, "PNG")
    print(f"  {img_path.name} -> transparent background (bg color: {bg_color})")


def main():
    script_dir = Path(__file__).parent
    units_dir = script_dir.parent / "common" / "images" / "units"
    
    if not units_dir.exists():
        print(f"Units directory not found: {units_dir}")
        sys.exit(1)
    
    png_files = sorted(units_dir.glob("*.png"))
    if not png_files:
        print(f"No PNG files in {units_dir}")
        sys.exit(1)
    
    print(f"Processing {len(png_files)} images in {units_dir}")
    for png in png_files:
        make_background_transparent(png)
    print("Done.")


if __name__ == "__main__":
    main()
