import os
from PIL import Image, ImageDraw, ImageFont

assets_dir = r"C:\Users\user\.gemini\antigravity\scratch\xiaomi-tv-debloat\tv-hub\assets"
os.makedirs(assets_dir, exist_ok=True)

channels = [
    {"id": "kompastv", "name": "Kompas TV", "sub": "Berita & Investigasi", "bg": (15, 23, 42), "accent": (239, 68, 68)},
    {"id": "metrotv", "name": "Metro TV", "sub": "News & Talkshow", "bg": (10, 25, 47), "accent": (59, 130, 246)},
    {"id": "tvone", "name": "TV One", "sub": "Memang Beda", "bg": (35, 10, 10), "accent": (220, 38, 38)},
    {"id": "trans7", "name": "Trans7", "sub": "Hiburan & Edukasi", "bg": (15, 23, 42), "accent": (234, 179, 8)},
    {"id": "transtv", "name": "Trans TV", "sub": "Bioskop & Lifestyle", "bg": (20, 20, 35), "accent": (168, 85, 247)},
    {"id": "nettv", "name": "Net TV", "sub": "Televisi Masa Kini", "bg": (8, 28, 36), "accent": (45, 212, 191)},
    {"id": "indosiar", "name": "Indosiar", "sub": "Mega Series & Liga 1", "bg": (25, 20, 15), "accent": (249, 115, 22)},
    {"id": "sctv", "name": "SCTV", "sub": "Satu Untuk Semua", "bg": (10, 30, 20), "accent": (34, 197, 94)},
    {"id": "rcti", "name": "RCTI", "sub": "Kebanggaan Bersama", "bg": (15, 20, 45), "accent": (59, 130, 246)},
    {"id": "cnnid", "name": "CNN Indonesia", "sub": "Berita Finansial & Politik", "bg": (35, 8, 8), "accent": (239, 68, 68)},
    {"id": "cnbcid", "name": "CNBC Indonesia", "sub": "Pasar Modal & Investasi", "bg": (8, 20, 45), "accent": (56, 189, 248)},
    {"id": "inews", "name": "iNews", "sub": "Inspirasi & Olahraga", "bg": (25, 10, 25), "accent": (236, 72, 153)},
    {"id": "tvri", "name": "TVRI", "sub": "Saluran Pemersatu Bangsa", "bg": (10, 25, 35), "accent": (14, 165, 233)},
    {"id": "nhkworld", "name": "NHK World", "sub": "News & Culture Japan", "bg": (18, 18, 28), "accent": (244, 63, 94)},
    {"id": "dw", "name": "DW English", "sub": "Global Perspectives", "bg": (15, 25, 40), "accent": (96, 165, 250)},
    {"id": "france24", "name": "France 24", "sub": "International Live News", "bg": (20, 20, 35), "accent": (59, 130, 246)},
    {"id": "aljazeera", "name": "Al Jazeera", "sub": "World News & Live Reports", "bg": (30, 20, 10), "accent": (245, 158, 11)},
    {"id": "tizentube", "name": "TizenTube", "sub": "Samsung Tizen 60fps Ad-Free", "bg": (18, 10, 30), "accent": (192, 132, 252)}
]

def create_card(ch):
    W, H = 320, 180
    im = Image.new("RGBA", (W, H), ch["bg"] + (255,))
    draw = ImageDraw.Draw(im)
    
    # Top decorative colored bar
    draw.rectangle([0, 0, W, 4], fill=ch["accent"] + (255,))
    
    # Live Badge pill in top right
    draw.rounded_rectangle([W - 68, 12, W - 14, 30], radius=4, fill=(220, 38, 38, 240))
    draw.text((W - 58, 14), "LIVE", fill=(255, 255, 255, 255))
    
    # Channel Initial / Monogram circle
    initial = ch["name"][:2].upper()
    draw.rounded_rectangle([20, 26, 68, 74], radius=10, fill=ch["accent"] + (70,), outline=ch["accent"] + (200,), width=2)
    draw.text((32, 38), initial, fill=(255, 255, 255, 255))
    
    # Channel Name & Subtitle
    draw.text((20, 96), ch["name"], fill=(255, 255, 255, 255))
    draw.text((20, 124), ch["sub"], fill=(148, 163, 184, 255))
    
    # Subtle bottom border
    draw.rectangle([0, H - 2, W, H], fill=(255, 255, 255, 30))
    
    out_path = os.path.join(assets_dir, f"{ch['id']}.png")
    im.save(out_path, "PNG", optimize=True)
    print(f"Created {out_path}")

for c in channels:
    create_card(c)
print("All channel posters generated successfully.")
