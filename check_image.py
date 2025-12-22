#!/usr/bin/env python3
"""
Simple script to check if owner image exists
"""
import os
from pathlib import Path

image_dir = Path(__file__).parent / "static" / "images"
image_files = ["owner.jpg", "owner.png", "owner.webp"]

print("=" * 50)
print("Owner Image Checker")
print("=" * 50)
print(f"\nLooking for images in: {image_dir}")
print("\nChecking for owner image...\n")

found = False
for img_file in image_files:
    img_path = image_dir / img_file
    if img_path.exists():
        size = img_path.stat().st_size
        size_kb = size / 1024
        print(f"✅ FOUND: {img_file}")
        print(f"   Size: {size_kb:.1f} KB")
        print(f"   Path: {img_path}")
        found = True
        break

if not found:
    print("❌ No owner image found!")
    print("\nTo add your image:")
    print(f"1. Save your photo as 'owner.jpg'")
    print(f"2. Place it in: {image_dir}")
    print(f"3. Refresh your browser\n")
else:
    print("\n✅ Your image is ready! Refresh your browser to see it.")

print("=" * 50)

