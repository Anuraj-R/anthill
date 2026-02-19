#!/usr/bin/env python3
"""
Generate 6 different forest template designs for comparison.
"""

from pathlib import Path
import random

from PIL import Image, ImageDraw, ImageFilter

SIZE = 128
OUT_DIR = Path(__file__).parent.parent / "common" / "images" / "terrains" / "woods"
OUT_DIR.mkdir(parents=True, exist_ok=True)


def draw_ellipse(draw, cx, cy, rx, ry, color):
    x1, y1 = int(cx - rx), int(cy - ry)
    x2, y2 = int(cx + rx), int(cy + ry)
    draw.ellipse([x1, y1, x2, y2], fill=color)


def draw_pine(draw, cx, base_y, height, width, color):
    draw.polygon([(cx, base_y - height), (cx - width, base_y), (cx + width, base_y)], fill=color)


def draw_deciduous(draw, cx, base_y, trunk_h, canopy_rx, canopy_ry, foliage, trunk):
    draw.rectangle([int(cx - 3), int(base_y - trunk_h), int(cx + 3), int(base_y)], fill=trunk)
    cy = base_y - trunk_h - canopy_ry * 0.3
    draw.ellipse([int(cx - canopy_rx), int(cy - canopy_ry), int(cx + canopy_rx), int(cy + canopy_ry)], fill=foliage)


# Template 1: Dense pine forest - many small triangular pines
def template_1_dense_pines():
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, 0, SIZE, SIZE], fill=(80, 130, 75, 35))
    rng = random.Random(1)
    for _ in range(12):
        cx = rng.uniform(5, SIZE - 5)
        base_y = rng.uniform(40, SIZE - 5)
        h = 14 + rng.uniform(0, 12)
        w = 6 + rng.uniform(0, 5)
        draw_pine(draw, cx, base_y, h, w, (45, 100, 55, 55))
    return img.filter(ImageFilter.GaussianBlur(1.0))


# Template 2: Sparse deciduous - few large trees with clear trunk + canopy
def template_2_sparse_deciduous():
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, 0, SIZE, SIZE], fill=(95, 140, 80, 32))
    trunk = (80, 70, 50, 48)
    positions = [(35, 100), (95, 85), (60, 115), (20, 90)]
    colors = [(50, 115, 55, 56), (65, 125, 50, 54), (55, 110, 60, 55)]
    for i, (cx, base_y) in enumerate(positions):
        draw_deciduous(draw, cx, base_y, 18, 14, 10, colors[i % 3], trunk)
    return img.filter(ImageFilter.GaussianBlur(1.2))


# Template 3: Mixed forest - pines and deciduous together
def template_3_mixed():
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, 0, SIZE, SIZE], fill=(85, 135, 78, 35))
    trunk = (75, 65, 48, 50)
    # Pines
    for cx, by in [(25, 95), (85, 100), (50, 110)]:
        draw_pine(draw, cx, by, 20, 9, (42, 98, 52, 56))
    # Deciduous
    draw_deciduous(draw, 70, 90, 14, 12, 9, (58, 118, 55, 54), trunk)
    draw_deciduous(draw, 40, 105, 12, 10, 8, (65, 122, 52, 52), trunk)
    return img.filter(ImageFilter.GaussianBlur(1.1))


# Template 4: Stylized silhouettes - bold tree shapes, minimal
def template_4_stylized():
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, 0, SIZE, SIZE], fill=(90, 138, 72, 38))
    # 3 bold triangular pines, slightly overlapping
    draw_pine(draw, 40, 115, 35, 18, (38, 92, 48, 58))
    draw_pine(draw, 75, 120, 28, 14, (48, 105, 52, 55))
    draw_pine(draw, 95, 110, 25, 12, (42, 98, 50, 56))
    return img.filter(ImageFilter.GaussianBlur(0.8))


# Template 5: Layered canopy - overlapping rounded shapes (but tree-like with trunks)
def template_5_layered_canopy():
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, 0, SIZE, SIZE], fill=(88, 132, 76, 36))
    trunk = (78, 68, 52, 48)
    # Trees with multiple canopy layers (2 ellipses per tree for fuller look)
    for cx, by in [(30, 100), (65, 95), (95, 105)]:
        draw.rectangle([int(cx - 2), int(by - 12), int(cx + 2), int(by)], fill=trunk)
        cy = by - 14
        draw_ellipse(draw, cx, cy, 12, 8, (52, 112, 58, 54))
        draw_ellipse(draw, cx, cy - 4, 8, 6, (58, 120, 55, 50))
    return img.filter(ImageFilter.GaussianBlur(1.2))


# Template 6: Edge-to-edge forest - trees at tile boundaries for seamless tiling
def template_6_seamless():
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, 0, SIZE, SIZE], fill=(82, 128, 74, 36))
    # Trees positioned to extend to edges - left, right, top, bottom
    draw_pine(draw, 8, 70, 22, 10, (44, 102, 52, 55))
    draw_pine(draw, SIZE - 10, 90, 20, 9, (48, 108, 50, 54))
    draw_pine(draw, 50, 15, 18, 8, (46, 105, 54, 53))
    draw_pine(draw, 90, SIZE - 8, 16, 7, (50, 110, 52, 52))
    draw_pine(draw, 35, 95, 19, 9, (42, 98, 56, 56))
    draw_pine(draw, 75, 60, 17, 8, (46, 112, 48, 54))
    return img.filter(ImageFilter.GaussianBlur(1.1))


def main():
    templates = [
        ("template_1_dense_pines", template_1_dense_pines),
        ("template_2_sparse_deciduous", template_2_sparse_deciduous),
        ("template_3_mixed", template_3_mixed),
        ("template_4_stylized", template_4_stylized),
        ("template_5_layered_canopy", template_5_layered_canopy),
        ("template_6_seamless", template_6_seamless),
    ]
    for name, fn in templates:
        img = fn()
        path = OUT_DIR / f"{name}.png"
        img.save(path, "PNG")
        print(f"Created {path}")


if __name__ == "__main__":
    main()
