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


def draw_pine_tree(draw, cx, base_y, height, width, color):
    """Draw a pine/conifer tree - triangular silhouette."""
    peak = (cx, base_y - height)
    left = (cx - width, base_y)
    right = (cx + width, base_y)
    draw.polygon([peak, left, right], fill=color)


def draw_deciduous_tree(draw, cx, base_y, trunk_h, canopy_rx, canopy_ry, foliage_color, trunk_color):
    """Draw a deciduous tree - trunk + rounded canopy."""
    # Trunk
    tw = 3
    draw.rectangle(
        [int(cx - tw), int(base_y - trunk_h), int(cx + tw), int(base_y)],
        fill=trunk_color
    )
    # Canopy - flattened ellipse above trunk
    cy = base_y - trunk_h - canopy_ry * 0.3
    x1, y1 = int(cx - canopy_rx), int(cy - canopy_ry)
    x2, y2 = int(cx + canopy_rx), int(cy + canopy_ry)
    draw.ellipse([x1, y1, x2, y2], fill=foliage_color)


def create_forest_tile(variant):
    """Forest - pine and deciduous trees with trunks, not bubbles."""
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Layered base - emerald and sage tints
    draw.rectangle([0, 0, SIZE, SIZE], fill=(75, 135, 85, 35))
    draw.rectangle([0, 0, SIZE, SIZE], fill=(95, 145, 70, 25))
    rng = random.Random(variant)
    tree_colors = [(40, 95, 50, 58), (55, 120, 45, 55), (70, 110, 55, 56), (45, 105, 65, 54)]
    trunk_color = (75, 65, 45, 50)
    positions = [
        (SIZE * 0.25, SIZE * 0.35), (SIZE * 0.7, SIZE * 0.55), (SIZE * 0.5, SIZE * 0.8),
        (SIZE * 0.15, SIZE * 0.65), (SIZE * 0.85, SIZE * 0.3),
        (SIZE * 0.05, SIZE * 0.45), (SIZE * 0.95, SIZE * 0.75), (SIZE * 0.5, SIZE * 0.1),
        (SIZE * 0.35, SIZE * 0.95), (SIZE * 0.6, SIZE * 0.25), (SIZE * 0.2, SIZE * 0.88),
    ]
    n_trees = 4 + (variant % 2)
    for i in range(n_trees):
        cx, base_y = positions[(variant + i) % len(positions)]
        cx += rng.uniform(-5, 5)
        base_y += rng.uniform(-4, 4)
        base_y = min(max(base_y, 20), SIZE - 2)
        if (variant + i) % 3 == 0:
            # Deciduous - trunk + rounded canopy
            trunk_h = 12 + rng.uniform(0, 10)
            canopy_rx = 10 + rng.uniform(0, 8)
            canopy_ry = 8 + rng.uniform(0, 6)
            draw_deciduous_tree(draw, cx, base_y, trunk_h, canopy_rx, canopy_ry,
                               tree_colors[i % len(tree_colors)], trunk_color)
        else:
            # Pine - triangular
            height = 22 + rng.uniform(0, 14)
            width = 10 + rng.uniform(0, 8)
            draw_pine_tree(draw, cx, base_y, height, width, tree_colors[i % len(tree_colors)])
    # Undergrowth - low bushes (wider than tall, not bubbles)
    for _ in range(4 + rng.randint(0, 2)):
        cx = rng.uniform(0, SIZE)
        cy = rng.uniform(0, SIZE)
        rx = 6 + rng.uniform(0, 5)
        ry = 4 + rng.uniform(0, 4)
        greens = [(65, 115, 55, 48), (85, 130, 60, 45), (50, 100, 70, 50)]
        draw_soft_ellipse(draw, cx, cy, rx, ry, greens[rng.randint(0, 2)])
    # Ferns/grass - narrow vertical shapes
    for _ in range(5):
        cx = rng.uniform(0, SIZE)
        cy = rng.uniform(0, SIZE)
        rx = 2 + rng.uniform(0, 2)
        ry = 8 + rng.uniform(0, 6)
        draw_soft_ellipse(draw, cx, cy, rx, ry, (60, 110, 65, 45))
    return img.filter(ImageFilter.GaussianBlur(1.2))


def create_bog_tile(variant):
    """Bog - swamp, reeds, water patches, richer teals and cyan."""
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Layered base - teal + cyan tints
    draw.rectangle([0, 0, SIZE, SIZE], fill=(70, 145, 135, 38))
    draw.rectangle([0, 0, SIZE, SIZE], fill=(95, 155, 160, 28))
    rng = random.Random(variant)
    # Reeds/cattails - tall narrow ellipses, varied greens
    reed_colors = [(55, 115, 95, 55), (70, 130, 100, 50), (45, 100, 85, 58)]
    for _ in range(6 + rng.randint(0, 3)):
        cx = rng.uniform(0, SIZE)
        cy = rng.uniform(0, SIZE)
        rx = 3 + rng.uniform(0, 5)
        ry = 14 + rng.uniform(0, 14)
        alpha = 50 + rng.randint(0, 22)
        color = reed_colors[rng.randint(0, 2)]
        draw_soft_ellipse(draw, cx, cy, rx, ry, (*color[:3], alpha))
    # Water patches - soft ovals, cyan/teal
    water_colors = [(90, 165, 155, 38), (110, 175, 165, 32), (75, 150, 145, 40)]
    for _ in range(3):
        cx = rng.uniform(SIZE * 0.15, SIZE * 0.85)
        cy = rng.uniform(SIZE * 0.15, SIZE * 0.85)
        rx = 18 + rng.uniform(0, 18)
        ry = 14 + rng.uniform(0, 12)
        draw_soft_ellipse(draw, cx, cy, rx, ry, water_colors[rng.randint(0, 2)])
    # Lily pads - small flat circles
    for _ in range(4):
        cx = rng.uniform(0, SIZE)
        cy = rng.uniform(0, SIZE)
        r = 6 + rng.uniform(0, 5)
        draw_soft_ellipse(draw, cx, cy, r, r * 0.6, (65, 125, 95, 48))
    return img.filter(ImageFilter.GaussianBlur(1.5))


def create_heights_tile(variant):
    """Heights - mountains, rocky peaks, lavender and slate tones."""
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Layered base - lavender + slate
    draw.rectangle([0, 0, SIZE, SIZE], fill=(125, 115, 145, 33))
    draw.rectangle([0, 0, SIZE, SIZE], fill=(110, 120, 135, 28))
    rng = random.Random(variant)
    # Mountain peaks - varied slate, purple-grey, with snow cap hint
    peak_colors = [(85, 90, 115, 58), (95, 100, 125, 55), (75, 85, 105, 60), (105, 95, 130, 52)]
    for _ in range(3 + rng.randint(0, 1)):
        base_y = SIZE * (0.45 + rng.uniform(0, 0.45))
        peak_x = SIZE * (0.25 + rng.uniform(0, 0.5))
        peak_y = base_y - 22 - rng.uniform(0, 22)
        left_x = peak_x - 18 - rng.uniform(0, 18)
        right_x = peak_x + 18 + rng.uniform(0, 18)
        color = peak_colors[rng.randint(0, 3)]
        draw.polygon(
            [(peak_x, peak_y), (left_x, base_y), (right_x, base_y)],
            fill=color
        )
    # Snow/light cap on tallest peak
    if variant % 2 == 0:
        base_y = SIZE * 0.7
        peak_x = SIZE * 0.5
        draw.polygon(
            [(peak_x, base_y - 35), (peak_x - 8, base_y - 15), (peak_x + 8, base_y - 15)],
            fill=(160, 165, 180, 45)
        )
    # Rocky outcrops - varied greys and purples
    rock_colors = [(100, 105, 125, 48), (115, 110, 135, 45), (90, 95, 115, 50)]
    for _ in range(4):
        cx = rng.uniform(0, SIZE)
        cy = rng.uniform(SIZE * 0.25, SIZE)
        rx = 7 + rng.uniform(0, 10)
        ry = 5 + rng.uniform(0, 6)
        draw_soft_ellipse(draw, cx, cy, rx, ry, rock_colors[rng.randint(0, 2)])
    # Scree/small rocks
    for _ in range(6):
        cx = rng.uniform(0, SIZE)
        cy = rng.uniform(SIZE * 0.4, SIZE)
        r = 3 + rng.uniform(0, 4)
        draw_soft_ellipse(draw, cx, cy, r, r, (105, 100, 120, 42))
    return img.filter(ImageFilter.GaussianBlur(1.5))


def create_plains_tile(variant):
    """Plains - grass, subtle dots, golden hints, wildflower accents."""
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Layered base - grass green + warm golden tint
    draw.rectangle([0, 0, SIZE, SIZE], fill=(95, 135, 85, 28))
    draw.rectangle([0, 0, SIZE, SIZE], fill=(115, 130, 75, 22))
    rng = random.Random(variant)
    # Grass dots - varied greens
    grass_colors = [(75, 120, 70, 45), (90, 130, 75, 42), (65, 110, 65, 48), (100, 140, 80, 40)]
    for _ in range(10 + rng.randint(0, 5)):
        cx = rng.uniform(0, SIZE)
        cy = rng.uniform(0, SIZE)
        r = 4 + rng.uniform(0, 6)
        draw_soft_ellipse(draw, cx, cy, r, r, grass_colors[rng.randint(0, 3)])
    # Grass patches - slightly darker
    for _ in range(4):
        cx = rng.uniform(0, SIZE)
        cy = rng.uniform(0, SIZE)
        r = 9 + rng.uniform(0, 9)
        alpha = 28 + rng.randint(0, 15)
        draw_soft_ellipse(draw, cx, cy, r, r, (70, 105, 60, alpha))
    # Wildflower accents - tiny colored dots (yellow, white, pale pink)
    flower_colors = [(200, 195, 100, 38), (220, 220, 210, 35), (210, 175, 185, 36)]
    for _ in range(4 + rng.randint(0, 2)):
        cx = rng.uniform(0, SIZE)
        cy = rng.uniform(0, SIZE)
        r = 2 + rng.uniform(0, 3)
        draw_soft_ellipse(draw, cx, cy, r, r, flower_colors[rng.randint(0, 2)])
    # Golden straw patches
    for _ in range(2):
        cx = rng.uniform(0, SIZE)
        cy = rng.uniform(0, SIZE)
        r = 8 + rng.uniform(0, 6)
        draw_soft_ellipse(draw, cx, cy, r, r, (150, 140, 90, 32))
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
