from PIL import Image, ImageDraw, ImageFont

def generate_kaushal_flowchart(out_path="kaushal_flowchart.png"):
    # Exactly match 1024 x 559 dimensions
    W, H = 1024, 559
    img = Image.new("RGBA", (W, H), (255, 255, 255, 255))
    draw = ImageDraw.Draw(img)

    # Fonts
    try:
        f_title = ImageFont.truetype("arialbd.ttf", 17)
        f_title_sm = ImageFont.truetype("arialbd.ttf", 15)
        f_bold = ImageFont.truetype("arialbd.ttf", 12)
        f_norm = ImageFont.truetype("arial.ttf", 12)
        f_norm_sm = ImageFont.truetype("arial.ttf", 11)
        f_badge = ImageFont.truetype("arialbd.ttf", 14)
    except:
        f_title = ImageFont.load_default()
        f_title_sm = f_title
        f_bold = f_title
        f_norm = f_title
        f_norm_sm = f_title
        f_badge = f_title

    # Palette
    c_bg_card = (240, 247, 255, 255)       # Soft blue-white
    c_border = (186, 215, 248, 255)        # Border
    c_arrow = (14, 165, 233, 255)          # Cyan
    c_badge_bg = (0, 190, 230, 255)        # Cyan circle
    c_badge_fg = (255, 255, 255, 255)
    c_dark = (15, 23, 42, 255)
    c_muted = (71, 85, 105, 255)
    c_blue = (2, 132, 199, 255)
    c_green = (16, 185, 129, 255)
    c_amber = (245, 158, 11, 255)
    c_red = (239, 68, 68, 255)

    def draw_card(x, y, w, h, radius=14, fill=c_bg_card, border=c_border, border_w=2):
        # Shadow
        draw.rounded_rectangle([x + 2, y + 3, x + w + 2, y + h + 3], radius=radius, fill=(215, 230, 250, 100))
        draw.rounded_rectangle([x, y, x + w, y + h], radius=radius, fill=fill, outline=border, width=border_w)

    def draw_badge(num_str, x, y, r=16):
        draw.ellipse([x - r, y - r, x + r, y + r], fill=c_badge_bg)
        bbox = f_badge.getbbox(num_str)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        draw.text((x - tw / 2, y - th / 2 - 1), num_str, fill=c_badge_fg, font=f_badge)

    def draw_arrow_h(x1, y1, x2, y2, color=c_arrow, width=3):
        draw.line([x1, y1, x2, y2], fill=color, width=width)
        draw.polygon([(x2, y2), (x2 - 10, y2 - 6), (x2 - 10, y2 + 6)], fill=color)

    def draw_elbow(x1, y1, x_mid, y2, x2, color=c_arrow, width=3):
        draw.line([x1, y1, x_mid, y1], fill=color, width=width)
        draw.line([x_mid, y1, x_mid, y2], fill=color, width=width)
        draw.line([x_mid, y2, x2, y2], fill=color, width=width)
        draw.polygon([(x2, y2), (x2 - 10, y2 - 6), (x2 - 10, y2 + 6)], fill=color)

    # ------------------ TOP ROW ------------------
    # 1. LIVE RTSP FEED
    x1, y1, w1, h1 = 30, 80, 165, 175
    draw_card(x1, y1, w1, h1)
    draw_badge("1", x1 + 5, y1 + 5)
    # Camera icon
    draw.rounded_rectangle([x1 + 60, y1 + 35, x1 + 105, y1 + 75], radius=6, fill=(186, 230, 253, 255), outline=c_arrow, width=2)
    draw.ellipse([x1 + 72, y1 + 44, x1 + 93, y1 + 65], fill=c_badge_fg, outline=c_arrow, width=2)
    draw.polygon([(x1 + 105, y1 + 48), (x1 + 120, y1 + 38), (x1 + 120, y1 + 72), (x1 + 105, y1 + 62)], fill=c_arrow)
    draw.text((x1 + 22, y1 + 95), "CCTV / RTSP", fill=c_dark, font=f_title_sm)
    draw.text((x1 + 32, y1 + 118), "1080p Stream", fill=c_muted, font=f_norm)
    draw.text((x1 + 22, y1 + 140), "PMKK / KVK Centre", fill=c_blue, font=f_bold)

    # Arrow 1 -> 2
    draw_arrow_h(x1 + w1, y1 + h1 / 2, x1 + w1 + 35, y1 + h1 / 2)

    # 2. RING BUFFER
    x2, y2, w2, h2 = x1 + w1 + 35, 80, 165, 175
    draw_card(x2, y2, w2, h2)
    draw_badge("2", x2 + 5, y2 + 5)
    # Circle buffer icon
    draw.ellipse([x2 + 58, y2 + 30, x2 + 108, y2 + 80], outline=c_arrow, width=4)
    draw.arc([x2 + 63, y2 + 35, x2 + 103, y2 + 75], start=20, end=260, fill=(2, 132, 199, 255), width=3)
    draw.text((x2 + 25, y2 + 95), "RING BUFFER", fill=c_dark, font=f_title_sm)
    draw.text((x2 + 22, y2 + 118), "OpenCV Ingestion", fill=c_muted, font=f_norm)
    draw.text((x2 + 20, y2 + 140), "15-Frame Sliding Win", fill=c_blue, font=f_bold)

    # Arrow 2 -> 3
    draw_arrow_h(x2 + w2, y2 + h2 / 2, x2 + w2 + 35, y2 + h2 / 2)

    # 3. PARALLEL ANALYSIS
    x3, y3, w3, h3 = x2 + w2 + 35, 80, 165, 175
    draw_card(x3, y3, w3, h3)
    draw_badge("3", x3 + 5, y3 + 5)
    # Neural net icon
    draw.ellipse([x3 + 75, y3 + 32, x3 + 90, y3 + 47], fill=c_badge_bg)
    draw.ellipse([x3 + 60, y3 + 60, x3 + 75, y3 + 75], fill=c_badge_bg)
    draw.ellipse([x3 + 90, y3 + 60, x3 + 105, y3 + 75], fill=c_badge_bg)
    draw.line([x3 + 82, y3 + 40, x3 + 67, y3 + 67], fill=c_arrow, width=2)
    draw.line([x3 + 82, y3 + 40, x3 + 97, y3 + 67], fill=c_arrow, width=2)
    draw.line([x3 + 67, y3 + 67, x3 + 97, y3 + 67], fill=c_arrow, width=2)
    draw.text((x3 + 15, y3 + 95), "PARALLEL EDGE", fill=c_dark, font=f_title_sm)
    draw.text((x3 + 38, y3 + 118), "ANALYSIS", fill=c_dark, font=f_title_sm)
    draw.text((x3 + 18, y3 + 140), "YOLOv8 + Blur + IoU", fill=c_blue, font=f_bold)

    # 3 Branches: 3A, 3B, 3C
    xb = x3 + w3 + 45
    wb = 370
    hb = 52

    # 3A
    y3a = 78
    draw_card(xb, y3a, wb, hb, radius=10)
    draw_badge("3A", xb + 5, y3a + 5, r=12)
    draw.text((xb + 45, y3a + 8), "Wav2Vec / Ultralytics YOLOv8n", fill=c_dark, font=f_bold)
    draw.text((xb + 45, y3a + 28), "Trainee Headcount & Sanctioned Tool Inventory", fill=c_muted, font=f_norm_sm)

    # 3B
    y3b = 142
    draw_card(xb, y3b, wb, hb, radius=10)
    draw_badge("3B", xb + 5, y3b + 5, r=12)
    draw.text((xb + 45, y3b + 8), "In-RAM Dynamic Gaussian Anonymizer", fill=c_dark, font=f_bold)
    draw.text((xb + 45, y3b + 28), "k=51x51, sigma=30 on top 30% head region (Zero Biometrics)", fill=c_muted, font=f_norm_sm)

    # 3C
    y3c = 206
    draw_card(xb, y3c, wb, hb, radius=10)
    draw_badge("3C", xb + 5, y3c + 5, r=12)
    draw.text((xb + 45, y3c + 8), "Spatial IoU & Operability Index (OCI)", fill=c_dark, font=f_bold)
    draw.text((xb + 45, y3c + 28), "Human-Machine IoU >= 0.08 + Centroid Tracking Stability", fill=c_muted, font=f_norm_sm)

    # Arrow from 3 to branches
    mid_fork_x = x3 + w3 + 22
    draw.line([x3 + w3, y3 + h3 / 2, mid_fork_x, y3 + h3 / 2], fill=c_arrow, width=3)
    draw.line([mid_fork_x, y3a + hb / 2, mid_fork_x, y3c + hb / 2], fill=c_arrow, width=3)
    draw_arrow_h(mid_fork_x, y3a + hb / 2, xb, y3a + hb / 2)
    draw_arrow_h(mid_fork_x, y3b + hb / 2, xb, y3b + hb / 2)
    draw_arrow_h(mid_fork_x, y3c + hb / 2, xb, y3c + hb / 2)

    # ------------------ BOTTOM ROW ------------------
    # Connect from 3 down to 4
    x4, y4, w4, h4 = 30, 310, 255, 215
    draw_card(x4, y4, w4, h4)
    draw_badge("4", x4 + 5, y4 + 5)
    # Shuffle / comparison icon
    draw.text((x4 + 40, y4 + 20), "DISCREPANCY ENGINE", fill=c_dark, font=f_title_sm)
    draw.text((x4 + 20, y4 + 50), "AEBAS Portal vs AI Headcount", fill=c_blue, font=f_bold)
    draw.text((x4 + 15, y4 + 78), "50% Headcount Variance (>15% Drift)", fill=c_dark, font=f_bold)
    draw.text((x4 + 15, y4 + 102), "30% Machinery Inoperability (<80%)", fill=c_dark, font=f_bold)
    draw.text((x4 + 15, y4 + 126), "20% Instructor Absence Anomaly", fill=c_dark, font=f_bold)
    draw.text((x4 + 15, y4 + 155), "• 3-Consecutive Frame Anomaly Filter", fill=c_muted, font=f_norm_sm)
    draw.text((x4 + 15, y4 + 175), "• Eliminates Transient False Alarms", fill=c_muted, font=f_norm_sm)

    # Connect from 3 bottom to 4 top
    draw_elbow(x3 + w3 / 2, y3 + h3, x3 + w3 / 2, y4 - 20, x4 + w4 / 2)
    draw.polygon([(x4 + w4 / 2, y4), (x4 + w4 / 2 - 6, y4 - 10), (x4 + w4 / 2 + 6, y4 - 10)], fill=c_arrow)

    # Arrow 4 -> 5
    # 5. TELEMETRY ENGINE
    x5, y5, w5, h5 = x4 + w4 + 30, 355, 175, 170
    draw_card(x5, y5, w5, h5)
    draw_badge("5", x5 + 5, y5 + 5)
    # Speedometer / gauge icon
    draw.arc([x5 + 60, y5 + 20, x5 + 115, y5 + 75], start=180, end=0, fill=c_blue, width=4)
    draw.line([x5 + 87, y5 + 47, x5 + 105, y5 + 30], fill=c_arrow, width=3)
    draw.text((x5 + 18, y5 + 68), "TELEMETRY", fill=c_dark, font=f_title_sm)
    draw.text((x5 + 20, y5 + 92), "<64 kbps Rural Mode", fill=c_blue, font=f_bold)
    draw.text((x5 + 12, y5 + 116), "• 2.0 KB Compact JSON", fill=c_muted, font=f_norm_sm)
    draw.text((x5 + 12, y5 + 134), "• 99.98% Bandwidth Cut", fill=c_muted, font=f_norm_sm)

    draw_arrow_h(x4 + w4, y4 + h4 / 2 + 20, x5, y4 + h4 / 2 + 20)

    # 6. SMU MISSION CONTROL
    x6, y6, w6, h6 = x5 + w5 + 30, 355, 230, 170
    draw_card(x6, y6, w6, h6)
    draw_badge("6", x6 + 5, y6 + 5)
    # Shield icon
    draw.text((x6 + 32, y6 + 20), "SMU MISSION CONTROL", fill=c_dark, font=f_title_sm)
    draw.text((x6 + 40, y6 + 48), "Central Cloud Cockpit", fill=c_blue, font=f_bold)
    # Verdict pill
    draw.ellipse([x6 + 25, y6 + 82, x6 + 37, y6 + 94], fill=c_green)
    draw.text((x6 + 42, y6 + 81), "COMPLIANT", fill=c_green, font=f_bold)
    draw.ellipse([x6 + 125, y6 + 82, x6 + 137, y6 + 94], fill=c_amber)
    draw.text((x6 + 142, y6 + 81), "FLAGGED", fill=c_amber, font=f_bold)
    draw.ellipse([x6 + 75, y6 + 105, x6 + 87, y6 + 117], fill=c_red)
    draw.text((x6 + 92, y6 + 104), "BREACH / FRAUD", fill=c_red, font=f_bold)
    draw.text((x6 + 18, y6 + 135), "WebP Evidence Frame (<18 KB)", fill=c_muted, font=f_norm_sm)

    draw_arrow_h(x5 + w5, y5 + h5 / 2, x6, y5 + h5 / 2)

    # REAL-TIME INTERVENTION (SECTION 12-A)
    x7, y7, w7, h7 = x6 + w6 + 25, 355, 185, 170
    draw_card(x7, y7, w7, h7, fill=(254, 242, 242, 255), border=(252, 165, 165, 255))
    # Siren / warning badge
    draw.ellipse([x7 + 78, y7 + 15, x7 + 108, y7 + 45], fill=(239, 68, 68, 255))
    draw.text((x7 + 90, y7 + 20), "!", fill=(255, 255, 255, 255), font=f_bold)
    draw.text((x7 + 22, y7 + 55), "SECTION 12-A PFMS", fill=c_red, font=f_title_sm)
    draw.text((x7 + 24, y7 + 78), "Automated DBT Freeze", fill=c_dark, font=f_bold)
    draw.text((x7 + 15, y7 + 105), "• Instant Grant Withholding", fill=c_muted, font=f_norm_sm)
    draw.text((x7 + 15, y7 + 123), "• Show-Cause Dossier Dispatch", fill=c_muted, font=f_norm_sm)
    draw.text((x7 + 15, y7 + 141), "• SHA-256 Proof Logged", fill=c_muted, font=f_norm_sm)

    draw_arrow_h(x6 + w6, y6 + h6 / 2, x7, y6 + h6 / 2, color=c_red)

    img.save(out_path, "PNG")
    print(f"Flowchart successfully generated at {out_path} ({W}x{H})")

if __name__ == "__main__":
    generate_kaushal_flowchart()
