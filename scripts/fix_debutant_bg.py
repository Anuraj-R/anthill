#!/usr/bin/env python3
"""Make light/white/grey background transparent in unit sprites."""

from pathlib import Path

from PIL import Image
import numpy as np

UNITS_DIR = Path(__file__).parent.parent / "common" / "images" / "units"


def fix_background(img_path, threshold=165):
    """Make pixels with R,G,B all > threshold transparent."""
    img = Image.open(img_path)
    img = img.convert("RGBA")
    arr = np.array(img)
    
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    light_bg = (r > threshold) & (g > threshold) & (b > threshold)
    arr[light_bg, 3] = 0
    
    img = Image.fromarray(arr)
    img.save(img_path, "PNG")
    print(f"Fixed {img_path.name}")


def main():
    # Thresholds tuned per image based on corner background colors
    fixes = [
        ("kidslinger.png", 73),
        ("spider.png", 200),
        ("grey_spider.png", 185),
        ("blackWidow.png", 218),
        ("RedTailSpider.png", 145),
        ("redspider.png", 211),
        ("bogtroll.png", 150),
    ]
    for name, thresh in fixes:
        fix_background(UNITS_DIR / name, threshold=thresh)


if __name__ == "__main__":
    main()
