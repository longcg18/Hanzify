import os
import sys
import re
import zipfile
import shutil
import io
import urllib.request
import urllib.parse
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"D:\Code\Github\Hanzify\DẠY THEO FORMAT MỚI"
PUBLIC_PPT_DIR = r"D:\Code\Github\Hanzify\public\materials\ppt"

os.makedirs(os.path.join(PUBLIC_PPT_DIR, "quyen-1"), exist_ok=True)
os.makedirs(os.path.join(PUBLIC_PPT_DIR, "quyen-2"), exist_ok=True)
os.makedirs(os.path.join(PUBLIC_PPT_DIR, "quyen-3"), exist_ok=True)

def optimize_pptx(src_path, dst_path, compress_images=False):
    """Strips heavy embedded fonts and optionally compresses huge png images."""
    with zipfile.ZipFile(src_path, 'r') as zin, zipfile.ZipFile(dst_path, 'w', compression=zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            # Skip embedded fonts
            if item.filename.startswith('ppt/fonts/'):
                continue
            
            data = zin.read(item.filename)
            
            # Clean font references from presentation.xml
            if item.filename == 'ppt/presentation.xml':
                text = data.decode('utf-8', errors='ignore')
                text = re.sub(r'<p:embeddedFontLst>.*?</p:embeddedFontLst>', '', text, flags=re.DOTALL)
                data = text.encode('utf-8')
            
            # Compress heavy PNG images if requested
            elif compress_images and item.filename.startswith('ppt/media/') and item.filename.lower().endswith('.png') and item.file_size > 1.5 * 1024 * 1024:
                try:
                    img = Image.open(io.BytesIO(data))
                    if img.mode in ('RGBA', 'LA'):
                        # Keep alpha but resize or quantize
                        buf = io.BytesIO()
                        img.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
                        img.save(buf, format='PNG', optimize=True)
                        compressed = buf.getvalue()
                        if len(compressed) < len(data):
                            data = compressed
                    elif img.mode == 'RGB':
                        buf = io.BytesIO()
                        img.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
                        img.save(buf, format='JPEG', quality=85)
                        # We keep png name so relations don't break
                        compressed = buf.getvalue()
                        if len(compressed) < len(data):
                            data = compressed
                except Exception as e:
                    pass
            
            zout.writestr(item, data)

print("Starting optimization...")
# Test optimizing Bai 16
src_16 = os.path.join(BASE_DIR, "QUYỂN 2", "16 第16课-你常去图书馆吗new.pptx")
dst_16 = os.path.join(PUBLIC_PPT_DIR, "quyen-2", "bai-16.pptx")
optimize_pptx(src_16, dst_16)
print(f"Bai 16: {os.path.getsize(src_16)/(1024*1024):.1f}MB -> {os.path.getsize(dst_16)/(1024*1024):.1f}MB")

# Optimize Bai 1, 6, 7, 8, 9, 10
src_q3 = os.path.join(BASE_DIR, "QUYỂN 3")
for fname in os.listdir(src_q3):
    if not fname.endswith('.pptx'):
        continue
    fpath = os.path.join(src_q3, fname)
    size_mb = os.path.getsize(fpath) / (1024 * 1024)
    if size_mb > 49:
        out_name = "opt_" + fname
        out_path = os.path.join(src_q3, out_name)
        optimize_pptx(fpath, out_path, compress_images=True)
        opt_size = os.path.getsize(out_path) / (1024 * 1024)
        print(f"{fname[:30]}: {size_mb:.1f}MB -> {opt_size:.1f}MB")
        if opt_size < 50:
            # Replace with optimized
            os.replace(out_path, fpath)
            print(f"  ✓ Replaced with optimized version ({opt_size:.1f}MB < 50MB)!")
        else:
            if os.path.exists(out_path):
                os.remove(out_path)

# Also replace Bai 16
if os.path.getsize(dst_16) / (1024 * 1024) < 50:
    os.replace(dst_16, src_16)
    print("  ✓ Replaced Bai 16 in Quyen 2 with optimized version!")

print("Optimization complete!")

