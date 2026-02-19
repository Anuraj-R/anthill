#!/usr/bin/env python3
"""
Process forest tiles: remove white areas, make borderless, square, low opacity.
"""

from pathlib import Path
import numpy as np
from PIL import Image

SIZE = 128
WOODS_DIR = Path(__file__).parent.parent / "common" / "images" / "terrains" / "woods"


def process_tile(src_path, dst_path, opacity=0.4, white_threshold=215):
    """Remove white areas, ensure square, low opacity, borderless."""
    img = Image.open(src_path)
    img = img.convert("RGBA")
    
    # Ensure square - resize/crop to SIZE x SIZE
    w, h = img.size
    if w != h:
        # Crop to square from center
        min_dim = min(w, h)
        left = (w - min_dim) // 2
        top = (h - min_dim) // 2
        img = img.crop((left, top, left + min_dim, top + min_dim))
    if img.size[0] != SIZE:
        img = img.resize((SIZE, SIZE), Image.Resampling.LANCZOS)
    
    arr = np.array(img)
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    
    # Make white/light areas transparent (avoid white)
    light_mask = (r > white_threshold) & (g > white_threshold) & (b > white_threshold)
    arr[light_mask, 3] = 0
    
    # Also fade very light areas (soft transition)
    light_soft = (r > 200) & (g > 200) & (b > 200)
    arr[light_soft, 3] = np.minimum(arr[light_soft, 3], 30)
    
    # Reduce overall opacity
    arr[:, :, 3] = (arr[:, :, 3].astype(float) * opacity).astype(np.uint8)
    
    # Soften edges for borderless (fade last 4px)
    for i in range(4):
        fade = 1.0 - (i / 4) * 0.5
        arr[i, :, 3] = (arr[i, :, 3].astype(float) * fade).astype(np.uint8)
        arr[-1-i, :, 3] = (arr[-1-i, :, 3].astype(float) * fade).astype(np.uint8)
        arr[:, i, 3] = (arr[:, i, 3].astype(float) * fade).astype(np.uint8)
        arr[:, -1-i, 3] = (arr[:, -1-i, 3].astype(float) * fade).astype(np.uint8)
    
    Image.fromarray(arr).save(dst_path, "PNG")
    print(f"Processed {dst_path.name}")


def main():
    for i in range(1, 5):
        src = WOODS_DIR / f"trees_{i:03d}.png"
        dst = WOODS_DIR / f"trees_{i:03d}.png"
        if src.exists():
            process_tile(src, dst, opacity=0.42, white_threshold=210)


if __name__ == "__main__":
    main()
