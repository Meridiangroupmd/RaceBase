"""Resize and compress RaceBase marketing PNGs to store requirements."""
from pathlib import Path

from PIL import Image

ASSETS = Path(r"C:\Users\Mihaela\.cursor\projects\c-Users-Mihaela-Desktop-RaceBase\assets")
OUT = Path(r"c:\Users\Mihaela\Desktop\RaceBase\baseapp\public\marketing")
OUT.mkdir(parents=True, exist_ok=True)


def save_png_under_mb(img: Image.Image, path: Path, max_bytes: int) -> int:
    """Save PNG; if too large, reduce colors (quantize) until under max_bytes."""
    img = img.convert("RGBA")
    for colors in (None, 256, 128, 64, 32):
        work = img
        if colors is not None:
            # RGBA requires FASTOCTREE (or libimagequant); flatten on black for cleaner palette
            base = Image.new("RGB", img.size, (0, 0, 0))
            base.paste(img, mask=img.split()[3])
            work = base.quantize(colors=colors, method=Image.Quantize.MEDIANCUT).convert("RGBA")
        buf = Path(path).with_suffix(".tmp.png")
        work.save(
            buf,
            "PNG",
            optimize=True,
            compress_level=9,
        )
        size = buf.stat().st_size
        if size <= max_bytes:
            buf.replace(path)
            return size
    # last resort: save anyway
    buf.replace(path)
    return path.stat().st_size


def save_png_screenshot(img: Image.Image, path: Path, max_bytes: int) -> int:
    """Keep exact pixel dimensions; reduce palette if needed to stay under max_bytes."""
    img = img.convert("RGBA")
    for colors in (None, 256, 192, 128, 96, 64):
        work = img
        if colors is not None:
            base = Image.new("RGB", img.size, (10, 10, 18))
            base.paste(img, mask=img.split()[3])
            work = base.quantize(colors=colors, method=Image.Quantize.MEDIANCUT).convert("RGBA")
        tmp = path.with_suffix(".tmp.png")
        work.save(tmp, "PNG", optimize=True, compress_level=9)
        sz = tmp.stat().st_size
        if sz <= max_bytes:
            tmp.replace(path)
            return sz
    tmp.replace(path)
    return path.stat().st_size


def main() -> None:
    # App icon 1024x1024, < 1MB
    icon_src = ASSETS / "racebase-icon.png"
    icon = Image.open(icon_src).convert("RGBA")
    icon = icon.resize((1024, 1024), Image.Resampling.LANCZOS)
    icon_path = OUT / "racebase-app-icon-1024.png"
    sz = save_png_under_mb(icon, icon_path, 1_000_000)
    print(f"Icon: {icon_path} ({sz / 1024:.1f} KB)")

    # Banner 1200x628, < 1MB
    ban_src = ASSETS / "racebase-banner.png"
    ban = Image.open(ban_src).convert("RGBA")
    ban = ban.resize((1200, 628), Image.Resampling.LANCZOS)
    ban_path = OUT / "racebase-banner-1200x628.png"
    sz = save_png_under_mb(ban, ban_path, 1_000_000)
    print(f"Banner: {ban_path} ({sz / 1024:.1f} KB)")

    # Screenshot 1284x2778, < 5MB
    scr_src = ASSETS / "racebase-screen.png"
    scr = Image.open(scr_src).convert("RGBA")
    scr = scr.resize((1284, 2778), Image.Resampling.LANCZOS)
    scr_path = OUT / "racebase-screenshot-1284x2778.png"
    sz = save_png_screenshot(scr, scr_path, 5_000_000)
    print(f"Screenshot: {scr_path} ({sz / 1024:.1f} KB, {scr.width}x{scr.height})")

    # Verify dimensions
    assert Image.open(icon_path).size == (1024, 1024)
    assert Image.open(ban_path).size == (1200, 628)
    shot = Image.open(scr_path)
    assert shot.size == (1284, 2778), shot.size
    print(f"Screenshot verified: {shot.size}")


if __name__ == "__main__":
    main()
