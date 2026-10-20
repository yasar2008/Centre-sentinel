"""Generates authentic, high-fidelity vocational training CCTV video loops in WebM format.

These video loops provide realistic visual environments for MSDE Problem ID 26245:
1. CAM-01: Apparel & Garment Stitching Lab (PMKVY Batch AMH/Q0102)
2. CAM-02: CNC Lathe & Precision Machining Bay (PMKVY Batch ASC/Q1001)
3. CAM-03: Electronics Assembly & Soldering Line (PMKVY Batch ELE/Q3104)
4. CAM-04: IT-ITeS Computer Training Classroom (PMKVY Batch SSC/Q0508)
"""

import os
import cv2
import numpy as np
import math
import time

OUTPUT_DIR = "frontend/public/videos"
os.makedirs(OUTPUT_DIR, exist_ok=True)

WIDTH, HEIGHT = 720, 405
FPS = 25
DURATION_SEC = 6
TOTAL_FRAMES = FPS * DURATION_SEC

def add_cctv_artifacts(frame, cam_name, cam_code, trade_code, frame_idx):
    """Applies realistic CCTV camera noise, lens vignette, and on-screen display (OSD)."""
    h, w = frame.shape[:2]
    
    # 1. Subtle camera vignette (darkened corners)
    X = np.linspace(-1, 1, w)
    Y = np.linspace(-1, 1, h)
    X, Y = np.meshgrid(X, Y)
    vignette = 1.0 - 0.28 * (X**2 + Y**2)
    vignette = np.clip(vignette, 0.4, 1.0)
    frame = (frame * vignette[:, :, np.newaxis]).astype(np.uint8)
    
    # 2. Subtle CCTV sensor grain
    noise = np.random.normal(0, 3.5, frame.shape).astype(np.int16)
    frame = np.clip(frame.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    
    # 3. OSD Header Overlay
    t_sec = frame_idx / FPS
    cctv_time = time.strftime("2026-10-20 %H:%M:%S", time.localtime(1792508400 + int(t_sec)))
    millis = int((t_sec % 1.0) * 1000)
    time_str = f"{cctv_time}.{millis:03d} IST"
    
    # Top HUD Bar
    cv2.rectangle(frame, (0, 0), (w, 24), (10, 14, 20), -1)
    cv2.putText(frame, f"[LIVE] {cam_name} | {cam_code} | {trade_code}", (12, 16), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (200, 220, 240), 1, cv2.LINE_AA)
    cv2.putText(frame, time_str, (w - 235, 16), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (240, 240, 240), 1, cv2.LINE_AA)
    
    # Bottom HUD Status
    cv2.rectangle(frame, (0, h - 20), (w, h), (10, 14, 20), -1)
    cv2.putText(frame, "CAM: CP-PLUS PRO 4MP | STREAM: 2.4 Mbps H.264 | FPS: 25.0 | REC: CONTINUOUS", (12, h - 6), cv2.FONT_HERSHEY_SIMPLEX, 0.36, (140, 160, 180), 1, cv2.LINE_AA)
    cv2.putText(frame, "MSDE-NSDC COMPLIANT", (w - 170, h - 6), cv2.FONT_HERSHEY_SIMPLEX, 0.36, (56, 189, 248), 1, cv2.LINE_AA)
    
    # Blinking Recording Dot
    if (frame_idx // 12) % 2 == 0:
        cv2.circle(frame, (w - 182, h - 10), 3, (0, 0, 255), -1)
        
    return frame


def generate_sewing_lab():
    """Generates realistic Garment & Sewing Machine Operator Lab footage."""
    print("Generating CAM-01: Apparel & Sewing Lab...")
    filepath = os.path.join(OUTPUT_DIR, "cam01_sewing.webm")
    fourcc = cv2.VideoWriter_fourcc(*'VP80')
    out = cv2.VideoWriter(filepath, fourcc, FPS, (WIDTH, HEIGHT))
    
    for f in range(TOTAL_FRAMES):
        frame = np.zeros((HEIGHT, WIDTH, 3), dtype=np.uint8)
        t = f / FPS
        
        # Workshop Wall & Floor (Perspective)
        # Wall: Warm institutional beige/grey
        frame[0:int(HEIGHT*0.42), :] = (175, 180, 185)
        # Wall base skirting board
        frame[int(HEIGHT*0.40):int(HEIGHT*0.42), :] = (80, 85, 90)
        
        # Floor: Polished industrial workshop epoxy floor (pale grey-green)
        for y in range(int(HEIGHT*0.42), HEIGHT):
            ratio = (y - HEIGHT*0.42) / (HEIGHT*0.58)
            col_b = int(140 - ratio * 40)
            col_g = int(155 - ratio * 35)
            col_r = int(145 - ratio * 40)
            frame[y, :] = (col_b, col_g, col_r)
            
        # Floor perspective lines
        for x in range(0, WIDTH, 90):
            cv2.line(frame, (x, int(HEIGHT*0.42)), (int((x - WIDTH/2)*1.8 + WIDTH/2), HEIGHT), (110, 125, 115), 1)
            
        # Overhead Fluorescent Tube Lights
        for lx in [WIDTH*0.25, WIDTH*0.75]:
            cv2.rectangle(frame, (int(lx - 50), 28), (int(lx + 50), 34), (245, 250, 255), -1)
            # Soft glare
            cv2.line(frame, (int(lx - 45), 36), (int(lx + 45), 36), (220, 235, 245), 1)

        # Poster on Wall: "PRADHAN MANTRI KAUSHAL VIKAS YOJANA (PMKVY 4.0)"
        cv2.rectangle(frame, (WIDTH//2 - 90, 48), (WIDTH//2 + 90, 110), (230, 240, 245), -1)
        cv2.rectangle(frame, (WIDTH//2 - 90, 48), (WIDTH//2 + 90, 110), (100, 120, 140), 1)
        cv2.putText(frame, "PMKVY 4.0 APPAREL SEWING LAB", (WIDTH//2 - 82, 66), cv2.FONT_HERSHEY_SIMPLEX, 0.34, (20, 60, 120), 1, cv2.LINE_AA)
        cv2.putText(frame, "QUALIFICATION PACK: AMH/Q0102", (WIDTH//2 - 78, 82), cv2.FONT_HERSHEY_SIMPLEX, 0.30, (50, 50, 50), 1, cv2.LINE_AA)
        cv2.putText(frame, "DIRECTORATE GENERAL OF TRAINING", (WIDTH//2 - 80, 98), cv2.FONT_HERSHEY_SIMPLEX, 0.28, (80, 80, 80), 1, cv2.LINE_AA)

        # 3 Rows of Industrial Sewing Workstations (Juki DDL-8700 style)
        stations = [
            {"x": int(WIDTH*0.18), "has_person": True, "person_seed": 1.2, "name": "Trainee 08 (Pooja V.)"},
            {"x": int(WIDTH*0.50), "has_person": True, "person_seed": 1.7, "name": "Trainee 12 (Aarav S.)"},
            {"x": int(WIDTH*0.82), "has_person": False, "person_seed": 0.0, "name": "Ghost Station #04"},  # Discrepant station!
        ]

        for st in stations:
            sx = st["x"]
            # Table Top (Wood/Melamine industrial work surface)
            cv2.rectangle(frame, (sx - 75, int(HEIGHT*0.52)), (sx + 75, int(HEIGHT*0.78)), (70, 90, 110), -1)
            cv2.rectangle(frame, (sx - 75, int(HEIGHT*0.52)), (sx + 75, int(HEIGHT*0.55)), (190, 175, 145), -1) # Table edge
            # Steel Table Legs
            cv2.line(frame, (sx - 65, int(HEIGHT*0.78)), (sx - 65, int(HEIGHT*0.94)), (50, 55, 60), 4)
            cv2.line(frame, (sx + 65, int(HEIGHT*0.78)), (sx + 65, int(HEIGHT*0.94)), (50, 55, 60), 4)
            # Treadle foot pedal
            cv2.rectangle(frame, (sx - 35, int(HEIGHT*0.91)), (sx + 35, int(HEIGHT*0.94)), (30, 35, 40), -1)

            # JUKI Sewing Machine Head (White industrial body with needle bar)
            cv2.rectangle(frame, (sx - 30, int(HEIGHT*0.48)), (sx + 15, int(HEIGHT*0.53)), (230, 230, 235), -1)
            cv2.rectangle(frame, (sx - 30, int(HEIGHT*0.44)), (sx - 10, int(HEIGHT*0.48)), (230, 230, 235), -1)
            # Needle & presser foot
            cv2.line(frame, (sx + 8, int(HEIGHT*0.49)), (sx + 8, int(HEIGHT*0.53)), (150, 150, 160), 2)
            # Thread spool stand
            cv2.line(frame, (sx - 25, int(HEIGHT*0.40)), (sx - 25, int(HEIGHT*0.45)), (180, 180, 190), 2)
            cv2.circle(frame, (sx - 25, int(HEIGHT*0.40)), 4, (40, 140, 220), -1) # Blue spool

            # Fabric Roll on Table (Moving under needle if person active)
            fabric_shift = int(math.sin(t * 3.0 + st["person_seed"]) * 3) if st["has_person"] else 0
            cv2.rectangle(frame, (sx - 15 + fabric_shift, int(HEIGHT*0.52)), (sx + 35 + fabric_shift, int(HEIGHT*0.55)), (40, 80, 160), -1) # Denim fabric

            # Trainee Person Seated at Station
            if st["has_person"]:
                ps = st["person_seed"]
                # Slight natural body sway & hand movement
                body_sway = int(math.sin(t * 2.2 + ps) * 2)
                hand_motion = int(math.cos(t * 4.0 + ps) * 3)

                # Trainee Torso (Blue institutional training apron / kurta)
                torso_center = (sx + body_sway, int(HEIGHT*0.56))
                cv2.ellipse(frame, torso_center, (24, 38), 0, 0, 360, (120, 75, 45), -1) # Navy blue apron
                # Collar / Neck
                cv2.rectangle(frame, (sx - 8 + body_sway, int(HEIGHT*0.44)), (sx + 8 + body_sway, int(HEIGHT*0.48)), (190, 150, 130), -1)

                # Head & Hair
                head_y = int(HEIGHT*0.40)
                # Head Skin
                cv2.circle(frame, (sx + body_sway, head_y), 16, (185, 145, 125), -1)
                # Hair (Dark brown/black)
                cv2.ellipse(frame, (sx + body_sway, head_y - 4), (16, 12), 0, 180, 360, (25, 20, 20), -1)

                # Arms extending to sewing needle
                cv2.line(frame, (sx - 18 + body_sway, int(HEIGHT*0.52)), (sx + hand_motion, int(HEIGHT*0.53)), (120, 75, 45), 7)
                cv2.circle(frame, (sx + hand_motion, int(HEIGHT*0.53)), 6, (185, 145, 125), -1) # Hand

            else:
                # Empty Station: Unoccupied Stool
                cv2.ellipse(frame, (sx, int(HEIGHT*0.62)), (18, 9), 0, 0, 360, (45, 45, 50), -1)
                cv2.line(frame, (sx, int(HEIGHT*0.62)), (sx, int(HEIGHT*0.75)), (30, 30, 35), 3)

        frame = add_cctv_artifacts(frame, "VARANASI PMKK - APPAREL BAY 01", "CAM-01", "AMH/Q0102 SEWING OPERATOR", f)
        out.write(frame)
        
    out.release()
    print(f"CAM-01 complete: {os.path.getsize(filepath)} bytes")


def generate_cnc_lathe():
    """Generates realistic CNC Lathe and Machining Bay CCTV video."""
    print("Generating CAM-02: CNC Precision Lathe Bay...")
    filepath = os.path.join(OUTPUT_DIR, "cam02_cnc.webm")
    fourcc = cv2.VideoWriter_fourcc(*'VP80')
    out = cv2.VideoWriter(filepath, fourcc, FPS, (WIDTH, HEIGHT))
    
    for f in range(TOTAL_FRAMES):
        frame = np.zeros((HEIGHT, WIDTH, 3), dtype=np.uint8)
        t = f / FPS
        
        # Workshop Wall: Concrete block grey with safety green accent
        frame[0:int(HEIGHT*0.38), :] = (130, 135, 140)
        cv2.rectangle(frame, (0, int(HEIGHT*0.35)), (WIDTH, int(HEIGHT*0.38)), (50, 120, 50), -1)
        
        # Heavy Workshop Floor: Dark concrete with yellow safety zones
        frame[int(HEIGHT*0.38):, :] = (90, 95, 100)
        
        # Yellow-Black Safety Warning Hatching around machine
        hatch_x1, hatch_x2 = int(WIDTH*0.2), int(WIDTH*0.8)
        hatch_y = int(HEIGHT*0.86)
        cv2.rectangle(frame, (hatch_x1, hatch_y), (hatch_x2, hatch_y + 16), (20, 20, 20), -1)
        for hx in range(hatch_x1, hatch_x2, 24):
            pts = np.array([[hx, hatch_y + 16], [hx + 12, hatch_y], [hx + 20, hatch_y], [hx + 8, hatch_y + 16]], np.int32)
            cv2.fillPoly(frame, [pts], (40, 200, 240)) # Yellow stripes

        # Industrial CNC Lathe Machine (Centre stage)
        mc_x, mc_y = int(WIDTH*0.48), int(HEIGHT*0.54)
        # Main steel enclosure (Industrial teal/blue-grey)
        cv2.rectangle(frame, (mc_x - 140, mc_y - 60), (mc_x + 140, mc_y + 90), (120, 100, 70), -1)
        cv2.rectangle(frame, (mc_x - 140, mc_y - 60), (mc_x + 140, mc_y + 90), (60, 50, 35), 2)
        
        # Viewing Window (Tempered Polycarbonate)
        cv2.rectangle(frame, (mc_x - 90, mc_y - 45), (mc_x + 30, mc_y + 20), (35, 40, 45), -1)
        cv2.rectangle(frame, (mc_x - 90, mc_y - 45), (mc_x + 30, mc_y + 20), (160, 180, 200), 2)
        
        # Rotating Spindle inside window (spinning animation)
        spindle_angle = (f * 35) % 360
        sp_rad = math.radians(spindle_angle)
        cx, cy = mc_x - 30, mc_y - 12
        cv2.circle(frame, (cx, cy), 18, (160, 165, 170), -1)
        cv2.line(frame, (cx, cy), (int(cx + 16*math.cos(sp_rad)), int(cy + 16*math.sin(sp_rad))), (50, 50, 55), 2)
        # Coolant splash / machining glow
        if f % 4 in [0, 1]:
            cv2.circle(frame, (cx + 10, cy + 5), 3, (240, 245, 255), -1)

        # CNC Control Panel & Digital Readout
        cv2.rectangle(frame, (mc_x + 50, mc_y - 45), (mc_x + 125, mc_y + 35), (30, 35, 40), -1)
        cv2.rectangle(frame, (mc_x + 55, mc_y - 38), (mc_x + 120, mc_y - 10), (10, 40, 10), -1) # Green CRT screen
        cv2.putText(frame, "G01 X+12.4", (mc_x + 58, mc_y - 25), cv2.FONT_HERSHEY_SIMPLEX, 0.22, (50, 240, 50), 1)
        cv2.putText(frame, "FEED: 250", (mc_x + 58, mc_y - 15), cv2.FONT_HERSHEY_SIMPLEX, 0.22, (50, 240, 50), 1)
        # Emergency Stop Button (Bright Red)
        cv2.circle(frame, (mc_x + 88, mc_y + 12), 7, (20, 20, 220), -1)

        # Technician / Trainee Operating CNC Console
        tech_x = int(WIDTH*0.32) + int(math.sin(t * 1.5) * 3)
        tech_y = int(HEIGHT*0.58)
        # Yellow Safety Helmet
        cv2.ellipse(frame, (tech_x, tech_y - 54), (16, 12), 0, 180, 360, (20, 210, 245), -1) # Hardhat
        # Face & Safety Goggles
        cv2.circle(frame, (tech_x, tech_y - 42), 14, (185, 145, 125), -1)
        cv2.rectangle(frame, (tech_x - 10, tech_y - 45), (tech_x + 10, tech_y - 39), (40, 40, 40), -1) # Goggles
        # Boiler Suit / Overalls (Industrial Grey)
        cv2.ellipse(frame, (tech_x, tech_y), (22, 38), 0, 0, 360, (70, 75, 80), -1)
        # Arms reaching toward panel
        cv2.line(frame, (tech_x + 12, tech_y - 10), (mc_x + 60, mc_y + 5), (70, 75, 80), 6)

        frame = add_cctv_artifacts(frame, "PUNE INDUSTRIAL PMKK - CNC BAY", "CAM-02", "ASC/Q1001 CNC OPERATOR", f)
        out.write(frame)
        
    out.release()
    print(f"CAM-02 complete: {os.path.getsize(filepath)} bytes")


def generate_electronics_lab():
    """Generates realistic SMT Soldering & Electronics Assembly Line."""
    print("Generating CAM-03: Electronics Assembly Lab...")
    filepath = os.path.join(OUTPUT_DIR, "cam03_electronics.webm")
    fourcc = cv2.VideoWriter_fourcc(*'VP80')
    out = cv2.VideoWriter(filepath, fourcc, FPS, (WIDTH, HEIGHT))
    
    for f in range(TOTAL_FRAMES):
        frame = np.zeros((HEIGHT, WIDTH, 3), dtype=np.uint8)
        t = f / FPS
        
        # Cleanroom White/Blue Wall
        frame[0:int(HEIGHT*0.45), :] = (210, 215, 220)
        cv2.line(frame, (0, int(HEIGHT*0.45)), (WIDTH, int(HEIGHT*0.45)), (180, 120, 40), 2) # Blue ESD line
        
        # Anti-Static Blue ESD Floor
        frame[int(HEIGHT*0.45):, :] = (150, 110, 70)
        
        # Long Electronics Workbench across room
        wb_y = int(HEIGHT*0.50)
        cv2.rectangle(frame, (40, wb_y), (WIDTH - 40, int(HEIGHT*0.75)), (60, 65, 70), -1) # Dark bench
        cv2.rectangle(frame, (40, wb_y), (WIDTH - 40, wb_y + 12), (180, 140, 90), -1) # Blue ESD Mat

        # Oscilloscope with Active Sine Wave Trace
        osc_x = int(WIDTH*0.38)
        cv2.rectangle(frame, (osc_x - 35, wb_y - 40), (osc_x + 35, wb_y), (40, 45, 50), -1)
        cv2.rectangle(frame, (osc_x - 30, wb_y - 35), (osc_x + 15, wb_y - 5), (10, 25, 10), -1) # Green phosphor
        # Waveform points
        wave_pts = []
        for wx in range(osc_x - 28, osc_x + 13):
            wy = int(wb_y - 20 + math.sin((wx * 0.4) + t * 6.0) * 8)
            wave_pts.append((wx, wy))
        for i in range(len(wave_pts) - 1):
            cv2.line(frame, wave_pts[i], wave_pts[i+1], (40, 250, 80), 1)

        # Soldering Station with Temperature Display (Hakko 936 style)
        sol_x = int(WIDTH*0.62)
        cv2.rectangle(frame, (sol_x - 25, wb_y - 30), (sol_x + 25, wb_y), (30, 80, 140), -1)
        cv2.putText(frame, "350 C", (sol_x - 20, wb_y - 12), cv2.FONT_HERSHEY_SIMPLEX, 0.32, (30, 220, 255), 1)
        # Soldering Iron Cable & Stand
        cv2.line(frame, (sol_x + 15, wb_y - 10), (sol_x + 40, wb_y + 5), (20, 20, 20), 2)

        # 2 Trainees Active at Workbench
        trainees = [
            {"x": int(WIDTH*0.25), "color": (140, 90, 50), "hair": (20, 20, 25)},
            {"x": int(WIDTH*0.75), "color": (120, 80, 55), "hair": (30, 25, 20)},
        ]

        for tr in trainees:
            tx = tr["x"] + int(math.sin(t * 1.8 + tr["x"]) * 2)
            ty = int(HEIGHT*0.54)
            # ESD Cleanroom White Lab Coat / Smock
            cv2.ellipse(frame, (tx, ty), (22, 34), 0, 0, 360, (230, 235, 240), -1)
            # Blue ESD Wrist Strap
            cv2.circle(frame, (tx + 14, ty + 12), 4, (200, 100, 30), -1)
            # Head & Face
            cv2.circle(frame, (tx, ty - 32), 14, (185, 145, 125), -1)
            # Cleanroom Cap / Hair
            cv2.ellipse(frame, (tx, ty - 38), (15, 10), 0, 180, 360, (220, 225, 230), -1)
            # Hands holding PCB
            cv2.rectangle(frame, (tx - 12, wb_y + 3), (tx + 12, wb_y + 10), (30, 120, 40), -1) # Green PCB board

        frame = add_cctv_artifacts(frame, "ALWAR PMKK - SMT ELECTRONICS LINE", "CAM-03", "ELE/Q3104 FIELD TECHNICIAN", f)
        out.write(frame)
        
    out.release()
    print(f"CAM-03 complete: {os.path.getsize(filepath)} bytes")


def generate_it_classroom():
    """Generates realistic IT-ITeS Computer Classroom CCTV video."""
    print("Generating CAM-04: IT Computer Classroom...")
    filepath = os.path.join(OUTPUT_DIR, "cam04_classroom.webm")
    fourcc = cv2.VideoWriter_fourcc(*'VP80')
    out = cv2.VideoWriter(filepath, fourcc, FPS, (WIDTH, HEIGHT))
    
    for f in range(TOTAL_FRAMES):
        frame = np.zeros((HEIGHT, WIDTH, 3), dtype=np.uint8)
        t = f / FPS
        
        # Classroom Neutral Walls
        frame[0:int(HEIGHT*0.40), :] = (195, 195, 200)
        
        # Whiteboard on Wall with Lecture Notes
        cv2.rectangle(frame, (WIDTH//2 - 120, 35), (WIDTH//2 + 120, int(HEIGHT*0.36)), (245, 250, 255), -1)
        cv2.rectangle(frame, (WIDTH//2 - 120, 35), (WIDTH//2 + 120, int(HEIGHT*0.36)), (120, 125, 130), 2)
        cv2.putText(frame, "PYTHON & DATABASE ARCHITECTURE", (WIDTH//2 - 105, 56), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (180, 40, 20), 1, cv2.LINE_AA)
        cv2.putText(frame, "SELECT candidate_id, attendance_status", (WIDTH//2 - 105, 78), cv2.FONT_HERSHEY_SIMPLEX, 0.30, (30, 30, 30), 1, cv2.LINE_AA)
        cv2.putText(frame, "FROM pmkvy_aebas_log WHERE verified=TRUE;", (WIDTH//2 - 105, 96), cv2.FONT_HERSHEY_SIMPLEX, 0.28, (40, 80, 140), 1, cv2.LINE_AA)
        
        # Floor: Tiled Classroom Flooring
        for y in range(int(HEIGHT*0.40), HEIGHT):
            ratio = (y - HEIGHT*0.40) / (HEIGHT*0.60)
            col = int(170 - ratio * 45)
            frame[y, :] = (col, col, col + 5)

        # Computer Desks in 2 Rows
        desk_y = int(HEIGHT*0.54)
        for dx in [int(WIDTH*0.22), int(WIDTH*0.50), int(WIDTH*0.78)]:
            # Computer Table
            cv2.rectangle(frame, (dx - 55, desk_y), (dx + 55, int(HEIGHT*0.82)), (60, 65, 70), -1)
            # LCD Monitor Screen
            cv2.rectangle(frame, (dx - 22, desk_y - 36), (dx + 22, desk_y - 4), (20, 22, 25), -1)
            # Screen glow (code editor)
            cv2.rectangle(frame, (dx - 19, desk_y - 33), (dx + 19, desk_y - 7), (45, 30, 20), -1)
            cv2.line(frame, (dx - 15, desk_y - 25), (dx + 10, desk_y - 25), (120, 180, 240), 1)
            cv2.line(frame, (dx - 15, desk_y - 18), (dx + 5, desk_y - 18), (80, 200, 120), 1)
            # Monitor Stand
            cv2.line(frame, (dx, desk_y - 4), (dx, desk_y), (100, 100, 100), 2)
            # Keyboard on Desk
            cv2.rectangle(frame, (dx - 18, desk_y + 4), (dx + 18, desk_y + 12), (30, 30, 35), -1)

            # Candidates seated at first 2 desks
            if dx != int(WIDTH*0.78):
                cx = dx + int(math.sin(t * 1.6 + dx) * 2)
                # Torso
                cv2.ellipse(frame, (cx, desk_y + 35), (20, 30), 0, 0, 360, (50, 80, 130), -1)
                # Head
                cv2.circle(frame, (cx, desk_y - 2), 14, (185, 145, 125), -1)
                # Hair
                cv2.ellipse(frame, (cx, desk_y - 6), (14, 10), 0, 180, 360, (20, 20, 20), -1)
                # Hands typing
                cv2.circle(frame, (cx - 8, desk_y + 8), 4, (185, 145, 125), -1)
                cv2.circle(frame, (cx + 8, desk_y + 8), 4, (185, 145, 125), -1)
            else:
                # 3rd desk empty (absent student discrepancy)
                cv2.circle(frame, (dx, desk_y + 25), 12, (40, 45, 50), -1) # Empty swivel chair

        frame = add_cctv_artifacts(frame, "PATNA REGIONAL PMKK - IT LAB", "CAM-04", "SSC/Q0508 IT-ITES TRAINEE", f)
        out.write(frame)
        
    out.release()
    print(f"CAM-04 complete: {os.path.getsize(filepath)} bytes")


if __name__ == "__main__":
    print(f"Generating realistic CCTV training center feeds in {OUTPUT_DIR}...")
    generate_sewing_lab()
    generate_cnc_lathe()
    generate_electronics_lab()
    generate_it_classroom()
    print("All 4 realistic CCTV video feeds generated successfully!")
