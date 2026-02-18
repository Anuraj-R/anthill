#!/usr/bin/env python3
"""
Generate light, translucent terrain tiles for all terrain types.
- Light/translucent so units remain visible
- Fill entire square
- Easily identifiable
- Tileable - adjacent tiles blend together
"""

from pathlib import Path
import random

from PIL import Image, ImageDraw, ImageFilter

SIZE = 128
TERRAINS_DIR = Path(__file__).parent.parent / "common" / "images" / "terrains"


def draw_soft_ellipse(draw, cx, cy, rx, ry, color):
    """Draw a soft ellipse with translucent fill."""
    x1, y1 = int(cx - rx), int(cy - ry)
    x2, y2 = int(cx + rx), int(cy + ry)
    draw.ellipse([x1, y1, x2, y2], fill=color)


def create_forest_tile(variant):
    """Forest - trees and foliage."""
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, 0, SIZE, SIZE], fill=(90, 130, 70, 38))
    rng = random.Random(variant)
    positions = [
        (SIZE * 0.25, SIZE * 0.3), (SIZE * 0.7, SIZE * 0.5), (SIZE * 0.5, SIZE * 0.75),
        (SIZE * 0.15, SIZE * 0.6), (SIZE * 0.85, SIZE * 0.25),
        (SIZE * 0.05, SIZE * 0.4), (SIZE * 0.95, SIZE * 0.7), (SIZE * 0.5, SIZE * 0.05),
        (SIZE * 0.3, SIZE * 0.95),
    ]
    n_trees = 3 + (variant % 2)
    for i in range(n_trees):
        cx, cy = positions[(variant + i) % len(positions)]
        cx += rng.uniform(-8, 8)
        cy += rng.uniform(-8, 8)
        radius = 12 + rng.uniform(0, 8)
        alpha = 55 + rng.randint(0, 20)
        draw_soft_ellipse(draw, cx, cy, radius, radius * 1.2, (50, 100, 45, alpha))
    return img.filter(ImageFilter.GaussianBlur(1.5))


def create_bog_tile(variant):
    """Bog - swamp, reeds, water patches."""
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Light blue-green swamp base
    draw.rectangle([0, 0, SIZE, SIZE], fill=(90, 140, 130, 40))
    rng = random.Random(variant)
    # Reeds/cattails - tall narrow ellipses
    for _ in range(4 + rng.randint(0, 2)):
        cx = rng.uniform(0, SIZE)
        cy = rng.uniform(0, SIZE)
        rx = 3 + rng.uniform(0, 4)
        ry = 15 + rng.uniform(0, 12)
        alpha = 50 + rng.randint(0, 25)
        draw_soft_ellipse(draw, cx, cy, rx, ry, (60, 110, 90, alpha))
    # Water patches - soft oval shapes
    for _ in range(2):
        cx = rng.uniform(SIZE * 0.2, SIZE * 0.8)
        cy = rng.uniform(SIZE * 0.2, SIZE * 0.8)
        rx = 20 + rng.uniform(0, 15)
        ry = 15 + rng.uniform(0, 10)
        alpha = 35 + rng.randint(0, 15)
        draw_soft_ellipse(draw, cx, cy, rx, ry, (100, 160, 150, alpha))
    return img.filter(ImageFilter.GaussianBlur(1.5))


def create_heights_tile(variant):
    """Heights - mountains, rocky peaks."""
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Light blue-grey mountain base
    draw.rectangle([0, 0, SIZE, SIZE], fill=(120, 120, 140, 35))
    rng = random.Random(variant)
    # Mountain peaks - triangular shapes via polygons
    for _ in range(2 + rng.randint(0, 1)):
        base_y = SIZE * (0.5 + rng.uniform(0, 0.4))
        peak_x = SIZE * (0.3 + rng.uniform(0, 0.4))
        peak_y = base_y - 25 - rng.uniform(0, 20)
        left_x = peak_x - 20 - rng.uniform(0, 15)
        right_x = peak_x + 20 + rng.uniform(0, 15)
        alpha = 55 + rng.randint(0, 25)
        draw.polygon(
            [(peak_x, peak_y), (left_x, base_y), (right_x, base_y)],
            fill=(90, 95, 110, alpha)
        )
    # Rocky outcrops - small ellipses
    for _ in range(3):
        cx = rng.uniform(0, SIZE)
        cy = rng.uniform(SIZE * 0.3, SIZE)
        rx = 8 + rng.uniform(0, 8)
        ry = 5 + rng.uniform(0, 5)
        alpha = 45 + rng.randint(0, 20)
        draw_soft_ellipse(draw, cx, cy, rx, ry, (100, 105, 120, alpha))
    return img.filter(ImageFilter.GaussianBlur(1.5))


def create_plains_tile(variant):
    """Plains - grass, subtle dots/patches."""
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Light grass green base
    draw.rectangle([0, 0, SIZE, SIZE], fill=(100, 130, 80, 30))
    rng = random.Random(variant)
    # Grass dots/patches - small scattered circles
    for _ in range(8 + rng.randint(0, 6)):
        cx = rng.uniform(0, SIZE)
        cy = rng.uniform(0, SIZE)
        r = 4 + rng.uniform(0, 6)
        alpha = 40 + rng.randint(0, 25)
        draw_soft_ellipse(draw, cx, cy, r, r, (80, 115, 65, alpha))
    # Slightly darker patches
    for _ in range(3):
        cx = rng.uniform(0, SIZE)
        cy = rng.uniform(0, SIZE)
        r = 10 + rng.uniform(0, 8)
        alpha = 25 + rng.randint(0, 15)
        draw_soft_ellipse(draw, cx, cy, r, r, (70, 100, 55, alpha))
    return img.filter(ImageFilter.GaussianBlur(1.5))


def main():
    # Forest (woods)
    for i in range(1, 5):
        img = create_forest_tile(i)
        path = TERRAINS_DIR / "woods" / f"trees_{i:03d}.png"
        path.parent.mkdir(parents=True, exist_ok=True)
        img.save(path, "PNG")
        print(f"Created {path}")

    # Bog
    for i in range(1, 11):
        img = create_bog_tile(i)
        path = TERRAINS_DIR / "bog" / f"bog_{i:03d}.png"
        path.parent.mkdir(parents=True, exist_ok=True)
        img.save(path, "PNG")
        print(f"Created {path}")

    # Heights (mountains)
    for i in range(1, 4):
        img = create_heights_tile(i)
        path = TERRAINS_DIR / "heights" / f"mountain_{i:03d}.png"
        path.parent.mkdir(parents=True, exist_ok=True)
        img.save(path, "PNG")
        print(f"Created {path}")

    # Plains
    for i in range(1, 12):
        img = create_plains_tile(i)
        path = TERRAINS_DIR / "plains" / f"dots_{i:03d}.png"
        path.parent.mkdir(parents=True, exist_ok=True)
        img.save(path, "PNG")
        print(f"Created {path}")
    for i in range(1, 3):
        img = create_plains_tile(20 + i)
        path = TERRAINS_DIR / "plains" / f"plains_{i:02d}.png"
        img.save(path, "PNG")
        print(f"Created {path}")


if __name__ == "__main__":
    main()
