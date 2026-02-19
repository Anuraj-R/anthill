#!/usr/bin/env python3
"""
Generate mountain terrain as smaller bitmap illustrations with mostly transparent background.
Vector map element style: hand-drawn look, clear outlines, solid color fills.
"""

from pathlib import Path
import random

from PIL import Image, ImageDraw

SIZE = 128
OUT_DIR = Path(__file__).parent.parent / "common" / "images" / "terrains" / "heights"
OUT_DIR.mkdir(parents=True, exist_ok=True)


def draw_mountain(draw, variant):
    """Draw a mountain illustration - smaller, centered, mostly transparent bg."""
    rng = random.Random(variant)
    
    # Mountain occupies lower ~60% of tile, centered
    base_y = SIZE - 8
    peak_y = SIZE * 0.35 + rng.uniform(-5, 5)
    center_x = SIZE / 2 + rng.uniform(-8, 8)
    
    # Rock colors - grey/brown tones (semi-transparent so units show through)
    rock_fill = (130, 125, 140, 140)
    rock_dark = (95, 90, 110, 150)
    outline = (75, 70, 90, 180)
    
    # Main peak - jagged polygon
    width = 45 + rng.uniform(0, 15)
    points = [
        (center_x, peak_y),
        (center_x - width * 0.4, base_y),
        (center_x - width * 0.15, base_y - 15),
        (center_x, peak_y + 15),
        (center_x + width * 0.15, base_y - 12),
        (center_x + width * 0.45, base_y),
    ]
    draw.polygon(points, fill=rock_fill, outline=outline)
    
    # Secondary peak (smaller, behind)
    peak2_x = center_x + rng.uniform(-20, 20)
    peak2_y = peak_y + rng.uniform(5, 20)
    w2 = 25 + rng.uniform(0, 10)
    points2 = [
        (peak2_x, peak2_y),
        (peak2_x - w2 * 0.5, base_y),
        (peak2_x + w2 * 0.5, base_y),
    ]
    draw.polygon(points2, fill=rock_dark, outline=outline)
    
    # Green foliage at base
    foliage = (85, 115, 80, 150)
    for _ in range(3):
        bx = center_x + rng.uniform(-35, 35)
        by = base_y - rng.uniform(2, 12)
        r = 6 + rng.uniform(0, 6)
        draw.ellipse([bx - r, by - r * 0.6, bx + r, by + r * 0.6], fill=foliage, outline=(60, 90, 55, 180))
    
    # Snow cap on main peak (optional)
    if variant % 2 == 0:
        snow_points = [
            (center_x, peak_y + 3),
            (center_x - 8, peak_y + 12),
            (center_x + 8, peak_y + 12),
        ]
        draw.polygon(snow_points, fill=(195, 200, 210, 120), outline=(175, 180, 190, 160))


def create_mountain_tile(variant):
    """Create one mountain tile - small illustration, mostly transparent."""
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw_mountain(draw, variant)
    return img


def main():
    for i in range(1, 4):
        img = create_mountain_tile(i)
        path = OUT_DIR / f"mountain_{i:03d}.png"
        img.save(path, "PNG")
        print(f"Created {path}")


if __name__ == "__main__":
    main()
