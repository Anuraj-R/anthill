#!/usr/bin/env python3
"""
Fix forest tiles: crop white/beige areas from trees_003, replace trees_004.
"""

from pathlib import Path
import numpy as np
from PIL import Image

SIZE = 128
WOODS_DIR = Path(__file__).parent.parent / "common" / "images" / "terrains" / "woods"


def crop_white_and_process(src_path, dst_path, light_threshold=200, opacity=0.42):
    """Find bounding box of non-white content, crop, resize to square, apply opacity."""
    img = Image.open(src_path)
    img = img.convert("RGBA")
    arr = np.array(img)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    
    # Pixels that are NOT light background
    dark_mask = ~((r > light_threshold) & (g > light_threshold) & (b > light_threshold))
    rows = np.any(dark_mask, axis=1)
    cols = np.any(dark_mask, axis=0)
    if not np.any(rows) or not np.any(cols):
        return
    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]
    
    # Crop with small padding
    pad = 2
    rmin = max(0, rmin - pad)
    rmax = min(arr.shape[0], rmax + pad + 1)
    cmin = max(0, cmin - pad)
    cmax = min(arr.shape[1], cmax + pad + 1)
    
    img = img.crop((cmin, rmin, cmax, rmax))
    img = img.resize((SIZE, SIZE), Image.Resampling.LANCZOS)
    arr = np.array(img)
    
    # Make white/light transparent
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    light = (r > 210) & (g > 210) & (b > 210)
    arr[light, 3] = 0
    light_soft = (r > 195) & (g > 195) & (b > 195)
    arr[light_soft, 3] = np.minimum(arr[light_soft, 3], 25)
    
    # Low opacity
    arr[:, :, 3] = (arr[:, :, 3].astype(float) * opacity).astype(np.uint8)
    
    Image.fromarray(arr).save(dst_path, "PNG")
    print(f"Fixed {dst_path.name}")


def main():
    # Fix trees_003 - crop white/beige
    crop_white_and_process(
        WOODS_DIR / "trees_003.png",
        WOODS_DIR / "trees_003.png",
        light_threshold=195,
        opacity=0.42
    )


if __name__ == "__main__":
    main()
