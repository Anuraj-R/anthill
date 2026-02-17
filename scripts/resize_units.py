#!/usr/bin/env python3
"""Resize unit sprites to game-appropriate size (64x64) and optimize."""

from pathlib import Path

from PIL import Image

UNITS_DIR = Path(__file__).parent.parent / "common" / "images" / "units"
SIZE = 64


def main():
    for png in sorted(UNITS_DIR.glob("*.png")):
        img = Image.open(png)
        if img.mode != "RGBA":
            img = img.convert("RGBA")
        img = img.resize((SIZE, SIZE), Image.Resampling.LANCZOS)
        img.save(png, "PNG", optimize=True)
        print(f"  {png.name} -> {SIZE}x{SIZE}")


if __name__ == "__main__":
    print(f"Resizing unit images to {SIZE}x{SIZE}...")
    main()
    print("Done.")
