#!/usr/bin/env python3
"""
Generate light, translucent forest terrain tiles.
- Light/translucent so units remain visible
- Fill entire square
- Easily identifiable as forest
- Tileable - adjacent tiles blend into one spread-out forest
"""

from pathlib import Path
import random

from PIL import Image, ImageDraw, ImageFilter

SIZE = 128
OUT_DIR = Path(__file__).parent.parent / "common" / "images" / "terrains" / "woods"

# Light green tint - very translucent so units show through
BASE_COLOR = (90, 130, 70, 40)
# Tree silhouette - slightly darker, still translucent
TREE_COLOR = (50, 100, 45, 65)


def draw_soft_tree(draw, cx, cy, radius, color):
    """Draw a soft tree shape (ellipse) with translucent fill."""
    x1, y1 = int(cx - radius), int(cy - radius * 1.2)
    x2, y2 = int(cx + radius), int(cy + radius * 1.2)
    draw.ellipse([x1, y1, x2, y2], fill=color)


def create_forest_tile(variant):
    """Create one forest tile - light, translucent, with tree silhouettes."""
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Light green base wash - very subtle, fills tile
    draw.rectangle([0, 0, SIZE, SIZE], fill=(90, 130, 70, 38))

    # Tree positions - some near edges so adjacent tiles blend into one forest
    rng = random.Random(variant)
    positions = [
        (SIZE * 0.25, SIZE * 0.3),
        (SIZE * 0.7, SIZE * 0.5),
        (SIZE * 0.5, SIZE * 0.75),
        (SIZE * 0.15, SIZE * 0.6),
        (SIZE * 0.85, SIZE * 0.25),
        (SIZE * 0.05, SIZE * 0.4),   # near left edge
        (SIZE * 0.95, SIZE * 0.7),   # near right edge
        (SIZE * 0.5, SIZE * 0.05),   # near top
        (SIZE * 0.3, SIZE * 0.95),   # near bottom
    ]
    # Pick 3-4 trees per tile for forest feel
    n_trees = 3 + (variant % 2)
    for i in range(n_trees):
        cx, cy = positions[(variant + i) % len(positions)]
        cx += rng.uniform(-8, 8)
        cy += rng.uniform(-8, 8)
        radius = 12 + rng.uniform(0, 8)
        alpha = 55 + rng.randint(0, 20)
        draw_soft_tree(draw, cx, cy, radius, (*TREE_COLOR[:3], alpha))

    # Slight blur to soften edges - helps adjacent tiles blend
    img = img.filter(ImageFilter.GaussianBlur(1.5))
    return img


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for i in range(1, 5):
        img = create_forest_tile(i)
        path = OUT_DIR / f"trees_{i:03d}.png"
        img.save(path, "PNG")
        print(f"Created {path}")


if __name__ == "__main__":
    main()
