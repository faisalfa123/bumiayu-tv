import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

assets_dir = r"C:\Users\user\.gemini\antigravity\scratch\xiaomi-tv-debloat\tv-hub\assets"
os.makedirs(assets_dir, exist_ok=True)

# Typography fonts
FONT_BOLD_PATH = r"C:\Windows\Fonts\segoeuib.ttf"
FONT_REG_PATH = r"C:\Windows\Fonts\segoeui.ttf"

def get_fonts():
    try:
        font_large = ImageFont.truetype(FONT_BOLD_PATH, 36)
        font_mid = ImageFont.truetype(FONT_BOLD_PATH, 22)
        font_sub = ImageFont.truetype(FONT_REG_PATH, 16)
        font_tag = ImageFont.truetype(FONT_BOLD_PATH, 13)
        return font_large, font_mid, font_sub, font_tag
    except Exception:
        d = ImageFont.load_default()
        return d, d, d, d

font_large, font_mid, font_sub, font_tag = get_fonts()

# 480x270 for crisp 16:9 on 1080p/720p TV
W, H = 480, 270

channels = [
    # Main National Channels (Must NOT be broken)
    {"id": "trans7", "name": "TRANS 7", "tag": "ENTERTAINMENT", "theme": (245, 158, 11), "bg": (15, 23, 42), "icon": "7"},
    {"id": "transtv", "name": "TRANS TV", "tag": "CINEMA & LIFESTYLE", "theme": (168, 85, 247), "bg": (24, 18, 42), "icon": "T"},
    {"id": "metrotv", "name": "METRO TV", "tag": "NEWS NETWORK", "theme": (59, 130, 246), "bg": (10, 25, 47), "icon": "M"},
    {"id": "tvri", "name": "TVRI NASIONAL", "tag": "SALURAN PEMERSATU", "theme": (14, 165, 233), "bg": (8, 28, 42), "icon": "TVRI"},
    {"id": "tvri_bali", "name": "TVRI BALI", "tag": "WARTA DEWATA", "theme": (249, 115, 22), "bg": (28, 20, 16), "icon": "BALI"},
    {"id": "tvri_sumut", "name": "TVRI SUMUT", "tag": "WARTA SUMATERA", "theme": (34, 197, 94), "bg": (12, 32, 22), "icon": "SUMUT"},
    {"id": "tvri_kalsel", "name": "TVRI KALSEL", "tag": "WARTA BORNEO", "theme": (16, 185, 129), "bg": (10, 30, 24), "icon": "BORNEO"},
    {"id": "tvri_jateng", "name": "TVRI JATENG", "tag": "BUDAYA NUSANTARA", "theme": (56, 189, 248), "bg": (10, 28, 44), "icon": "JATENG"},
    {"id": "tvri_jabar", "name": "TVRI JABAR", "tag": "PARAHYANGAN", "theme": (34, 197, 94), "bg": (12, 32, 22), "icon": "JABAR"},
    {"id": "tvri_jatim", "name": "TVRI JATIM", "tag": "WARTA JATIM", "theme": (234, 179, 8), "bg": (24, 24, 14), "icon": "JATIM"},
    {"id": "tvri_jogja", "name": "TVRI JOGJA", "tag": "ISTIMEWA", "theme": (217, 119, 6), "bg": (28, 22, 12), "icon": "DIY"},
    {"id": "tvri_kaltim", "name": "TVRI KALTIM", "tag": "IKN & BORNEO", "theme": (14, 165, 233), "bg": (10, 28, 42), "icon": "KALTIM"},
    {"id": "tvri_sulsel", "name": "TVRI SULSEL", "tag": "ANGING MAMMIRI", "theme": (249, 115, 22), "bg": (28, 18, 14), "icon": "SULSEL"},
    {"id": "tvri_papua", "name": "TVRI PAPUA", "tag": "BUMI CENDERAWASIH", "theme": (234, 179, 8), "bg": (26, 22, 12), "icon": "PAPUA"},
    {"id": "tvri_aceh", "name": "TVRI ACEH", "tag": "SERAMBI MEKKAH", "theme": (34, 197, 94), "bg": (10, 30, 20), "icon": "ACEH"},
    {"id": "tvri_sumbar", "name": "TVRI SUMBAR", "tag": "RANAH MINANG", "theme": (239, 68, 68), "bg": (28, 14, 16), "icon": "MINANG"},
    {"id": "tvri_riau", "name": "TVRI RIAU", "tag": "BUMI LANCANG KUNING", "theme": (245, 158, 11), "bg": (26, 20, 12), "icon": "RIAU"},
    {"id": "nhkworld", "name": "NHK WORLD", "tag": "JAPAN LIVE", "theme": (244, 63, 94), "bg": (22, 18, 30), "icon": "NHK"},
    {"id": "dw", "name": "DW ENGLISH", "tag": "GLOBAL NEWS", "theme": (96, 165, 250), "bg": (16, 24, 40), "icon": "DW"},
    {"id": "ahsantv", "name": "AHSAN TV", "tag": "ISLAMIC CHANNEL", "theme": (34, 197, 94), "bg": (10, 30, 20), "icon": "ATV"},
    {"id": "ugtv", "name": "UGTV", "tag": "GUNADARMA EDU", "theme": (192, 132, 252), "bg": (26, 16, 42), "icon": "UG"},
    {"id": "aktv", "name": "AKTV", "tag": "INSPIRASI JAWA BARAT", "theme": (14, 165, 233), "bg": (14, 25, 42), "icon": "AK"},
    {"id": "ammedia", "name": "AM MEDIA", "tag": "RELIGI & WARTA", "theme": (56, 189, 248), "bg": (14, 22, 38), "icon": "AM"},
    {"id": "muxtest", "name": "BIG BUCK BUNNY", "tag": "1080P 60FPS TEST", "theme": (234, 179, 8), "bg": (20, 20, 20), "icon": "60FPS"},
    
    # Additional National Channels
    {"id": "kompastv", "name": "KOMPAS TV", "tag": "BERITA INVESTIGASI", "theme": (239, 68, 68), "bg": (18, 22, 36), "icon": "K"},
    {"id": "tvone", "name": "TV ONE", "tag": "MEMANG BEDA", "theme": (220, 38, 38), "bg": (32, 12, 14), "icon": "1"},
    {"id": "nettv", "name": "NET TV", "tag": "TELEVISI MASA KINI", "theme": (45, 212, 191), "bg": (8, 30, 36), "icon": "NET"},
    {"id": "indosiar", "name": "INDOSIAR", "tag": "MEGA SERIES & LIGA", "theme": (249, 115, 22), "bg": (30, 20, 14), "icon": "IDS"},
    {"id": "sctv", "name": "SCTV", "tag": "SATU UNTUK SEMUA", "theme": (34, 197, 94), "bg": (12, 32, 20), "icon": "SCTV"},
    {"id": "rcti", "name": "RCTI", "tag": "KEBANGGAAN BERSAMA", "theme": (59, 130, 246), "bg": (14, 22, 48), "icon": "RCTI"},
    {"id": "inews", "name": "iNEWS", "tag": "INSPIRASI & OLAHRAGA", "theme": (236, 72, 153), "bg": (28, 12, 28), "icon": "iN"},
    {"id": "cnnid", "name": "CNN INDONESIA", "tag": "POLITIK & EKONOMI", "theme": (239, 68, 68), "bg": (35, 8, 10), "icon": "CNN"},
    {"id": "cnbcid", "name": "CNBC INDONESIA", "tag": "PASAR MODAL BISNIS", "theme": (56, 189, 248), "bg": (8, 22, 48), "icon": "CNBC"},
    {"id": "france24", "name": "FRANCE 24", "tag": "INTERNATIONAL NEWS", "theme": (59, 130, 246), "bg": (16, 20, 40), "icon": "F24"},
    {"id": "aljazeera", "name": "AL JAZEERA", "tag": "MIDDLE EAST & WORLD", "theme": (245, 158, 11), "bg": (32, 22, 12), "icon": "AJE"},
    
    # Hub Apps
    {"id": "tizentube", "name": "TIZENTUBE", "tag": "COBALT ENGINE 60FPS", "theme": (168, 85, 247), "bg": (22, 12, 36), "icon": "TT"},
    {"id": "youtube_tv", "name": "SMARTTUBE", "tag": "AD-FREE LEANBACK", "theme": (239, 68, 68), "bg": (32, 12, 14), "icon": "ST"},
    {"id": "vault_adult", "name": "VAULT 18+", "tag": "PRIVATE STREAM", "theme": (225, 29, 72), "bg": (28, 10, 18), "icon": "18+"},
    {"id": "vault_lock", "name": "PIN PROTECT", "tag": "SECURITY LOCK", "theme": (56, 189, 248), "bg": (12, 18, 30), "icon": "LOCK"}
]

def render_poster(ch):
    # 1. Base gradient canvas
    im = Image.new("RGB", (W, H), ch["bg"])
    draw = ImageDraw.Draw(im)

    # 2. Cinematic radial glow from center-right
    cx, cy = int(W * 0.75), int(H * 0.45)
    max_radius = int(W * 0.7)
    tr, tg, tb = ch["theme"]
    br, bg, bb = ch["bg"]

    for r in range(max_radius, 0, -12):
        factor = (1.0 - (r / max_radius)) ** 1.8
        glow_r = int(br + (tr - br) * factor * 0.55)
        glow_g = int(bg + (tg - bg) * factor * 0.55)
        glow_b = int(bb + (tb - bb) * factor * 0.55)
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(glow_r, glow_g, glow_b))

    # 3. Soft horizontal vignette on bottom
    for y in range(int(H * 0.4), H):
        alpha = ((y - (H * 0.4)) / (H * 0.6)) ** 1.4
        curr_r = int(im.getpixel((10, y))[0] * (1 - alpha) + 8 * alpha)
        curr_g = int(im.getpixel((10, y))[1] * (1 - alpha) + 11 * alpha)
        curr_b = int(im.getpixel((10, y))[2] * (1 - alpha) + 16 * alpha)
        # Apply dark bottom overlay
        draw.line([(0, y), (W, y)], fill=(curr_r, curr_g, curr_b))

    # 4. Clean minimal brand typography (Apple TV / Google TV style)
    # Tagline in letter-spaced theme accent
    draw.text((36, 142), ch["tag"], font=font_tag, fill=ch["theme"])
    
    # Large Channel Title
    draw.text((36, 168), ch["name"], font=font_large, fill=(248, 250, 252))

    # 5. Elegant subtle brand accent bar at the bottom
    draw.rectangle([0, H - 3, W, H], fill=ch["theme"])

    # 6. Save optimized PNG
    out_path = os.path.join(assets_dir, f"{ch['id']}.png")
    im.save(out_path, "PNG", optimize=True)
    return out_path

for c in channels:
    p = render_poster(c)
    print(f"Generated: {os.path.basename(p)}")

print("All cinematic posters generated cleanly.")
