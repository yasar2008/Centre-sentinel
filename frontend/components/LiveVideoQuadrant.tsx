"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Camera,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Download,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Cpu
} from "lucide-react";
import { playTacticalClick, playAlertChime } from "./SoundFx";

interface CameraChannel {
  id: string;
  name: string;
  description: string;
  active: boolean;
  type: string;
  persons_detected: number;
  operability_score: number;
  alert: string | null;
}

interface LiveVideoQuadrantProps {
  onCameraChange?: (camId: string) => void;
}

export const LiveVideoQuadrant: React.FC<LiveVideoQuadrantProps> = ({ onCameraChange }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedCam, setSelectedCam] = useState<string>("CAM-01");
  const [showOverlays, setShowOverlays] = useState<boolean>(true);
  const [showBlur, setShowBlur] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(15.2);
  const [bitrate, setBitrate] = useState<number>(34.2);

  const cameras: CameraChannel[] = [
    {
      id: "CAM-01",
      name: "Stitching Bay Alpha",
      description: "Garment Construction & JUKI Rigs",
      active: true,
      type: "Garment Lab",
      persons_detected: 16,
      operability_score: 88.8,
      alert: "GHOST CANDIDATE ON BENCH #04",
    },
    {
      id: "CAM-02",
      name: "CNC Precision Lathe",
      description: "Lathe Bed 01 & Milling Machine",
      active: true,
      type: "Machining Bay",
      persons_detected: 2,
      operability_score: 50.0,
      alert: "MAINTENANCE HOLD ON BED 02",
    },
    {
      id: "CAM-03",
      name: "SMT Soldering Line",
      description: "Micro-soldering & Thermal Stations",
      active: true,
      type: "Electronics Lab",
      persons_detected: 6,
      operability_score: 100.0,
      alert: null,
    },
    {
      id: "CAM-04",
      name: "Biometric Ingress Bay",
      description: "Aadhaar AEBAS Terminal Gate",
      active: true,
      type: "Access Control",
      persons_detected: 0,
      operability_score: 95.0,
      alert: "PROXY LOG CONFLICT",
    },
  ];

  const currentCam = cameras.find((c) => c.id === selectedCam) || cameras[0];

  // Canvas Synthetic CCTV Simulation Engine
  useEffect(() => {
    let animId: number;
    let t = 0;

    const render = () => {
      if (!isPlaying) return;
      t += 0.03;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      // 1. Draw Lab Background / Industrial Floor
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#09101d");
      grad.addColorStop(1, "#050811");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Perspective Workstation Floor Grid
      ctx.strokeStyle = "rgba(14, 165, 233, 0.08)";
      ctx.lineWidth = 1;
      for (let y = h * 0.35; y < h; y += 24) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, h * 0.35);
        ctx.lineTo((x - w * 0.5) * 1.8 + w * 0.5, h);
        ctx.stroke();
      }

      // Overhead Fixtures / Lighting Bars
      ctx.fillStyle = "rgba(137, 206, 255, 0.04)";
      ctx.fillRect(w * 0.15, h * 0.05, w * 0.7, 12);
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.fillRect(w * 0.2, h * 0.06, w * 0.6, 2);

      // 2. Draw Simulated Workbenches & Machinery
      // Bench 1 (Left) - JUKI Sewing Rig Alpha
      ctx.fillStyle = "#162032";
      ctx.strokeStyle = "rgba(62, 72, 80, 0.8)";
      ctx.fillRect(w * 0.15, h * 0.45, w * 0.24, h * 0.35);
      ctx.strokeRect(w * 0.15, h * 0.45, w * 0.24, h * 0.35);

      // Sewing machine head
      ctx.fillStyle = "#25344d";
      ctx.fillRect(w * 0.22, h * 0.48, w * 0.1, h * 0.14);

      // Bench 2 (Center) - JUKI Sewing Rig Beta
      ctx.fillStyle = "#162032";
      ctx.fillRect(w * 0.45, h * 0.45, w * 0.24, h * 0.35);
      ctx.strokeRect(w * 0.45, h * 0.45, w * 0.24, h * 0.35);

      // Bench 3 (Right) - Ghost Bench #04 (EMPTY)
      ctx.fillStyle = "#181f2c";
      ctx.fillRect(w * 0.73, h * 0.45, w * 0.2, h * 0.35);
      ctx.strokeRect(w * 0.73, h * 0.45, w * 0.2, h * 0.35);

      // 3. Trainee 1 (Working on Bench 1)
      const sway1 = Math.sin(t * 2) * 3;
      // Body
      ctx.fillStyle = "#2c405e";
      ctx.beginPath();
      ctx.ellipse(w * 0.28 + sway1, h * 0.48, 22, 38, 0, 0, Math.PI * 2);
      ctx.fill();
      // Head
      ctx.fillStyle = "#c59b7a";
      ctx.beginPath();
      ctx.arc(w * 0.28 + sway1, h * 0.38, 14, 0, Math.PI * 2);
      ctx.fill();

      // 4. Trainee 2 (Working on Bench 2)
      const sway2 = Math.cos(t * 1.5) * 2;
      ctx.fillStyle = "#234b5c";
      ctx.beginPath();
      ctx.ellipse(w * 0.58 + sway2, h * 0.5, 20, 36, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#b48c69";
      ctx.beginPath();
      ctx.arc(w * 0.58 + sway2, h * 0.4, 13, 0, Math.PI * 2);
      ctx.fill();

      // 5. Draw Gaussian Face Blur Mask if enabled (DPDP Act 2023)
      if (showBlur) {
        // Blur Face 1
        const b1x = w * 0.28 + sway1 - 18;
        const b1y = h * 0.38 - 18;
        ctx.save();
        ctx.fillStyle = "rgba(14, 20, 29, 0.95)";
        ctx.filter = "blur(8px)";
        ctx.fillRect(b1x, b1y, 36, 36);
        ctx.restore();

        // Privacy tag 1
        ctx.fillStyle = "#0ea5e9";
        ctx.font = "bold 9px 'JetBrains Mono', monospace";
        ctx.fillText("PRIVACY BLUR (k=51)", b1x - 10, b1y - 4);

        // Blur Face 2
        const b2x = w * 0.58 + sway2 - 16;
        const b2y = h * 0.4 - 16;
        ctx.save();
        ctx.fillStyle = "rgba(14, 20, 29, 0.95)";
        ctx.filter = "blur(8px)";
        ctx.fillRect(b2x, b2y, 32, 32);
        ctx.restore();

        ctx.fillStyle = "#0ea5e9";
        ctx.fillText("PRIVACY BLUR (k=51)", b2x - 10, b2y - 4);
      }

      // 6. Draw HUD Bounding Boxes & Targeting Brackets
      if (showOverlays) {
        // Box 1: Trainee TR-08
        const t1X = w * 0.28 + sway1 - 32;
        const t1Y = h * 0.34;
        const t1W = 64;
        const t1H = 110;

        ctx.strokeStyle = "#0ea5e9";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(t1X, t1Y, t1W, t1H);

        // Corner Ticks
        ctx.lineWidth = 2.5;
        drawCornerTicks(ctx, t1X, t1Y, t1W, t1H, "#0ea5e9");

        // Label Tag
        ctx.fillStyle = "rgba(9, 14, 23, 0.92)";
        ctx.fillRect(t1X, t1Y + t1H + 3, 145, 18);
        ctx.strokeStyle = "#0ea5e9";
        ctx.strokeRect(t1X, t1Y + t1H + 3, 145, 18);
        ctx.fillStyle = "#89ceff";
        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.fillText("TR-08 [SEWING] IoU: 0.94", t1X + 4, t1Y + t1H + 15);

        // Box 2: Trainee TR-12
        const t2X = w * 0.58 + sway2 - 30;
        const t2Y = h * 0.36;
        const t2W = 60;
        const t2H = 105;

        ctx.strokeStyle = "#0ea5e9";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(t2X, t2Y, t2W, t2H);
        drawCornerTicks(ctx, t2X, t2Y, t2W, t2H, "#0ea5e9");

        ctx.fillStyle = "rgba(9, 14, 23, 0.92)";
        ctx.fillRect(t2X, t2Y + t2H + 3, 145, 18);
        ctx.strokeStyle = "#0ea5e9";
        ctx.strokeRect(t2X, t2Y + t2H + 3, 145, 18);
        ctx.fillStyle = "#89ceff";
        ctx.fillText("TR-12 [CUTTING] IoU: 0.91", t2X + 4, t2Y + t2H + 15);

        // Box 3: Machine Rig (JUKI DDL-8700)
        ctx.strokeStyle = "#10b981";
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(w * 0.16, h * 0.52, w * 0.22, h * 0.24);
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(9, 14, 23, 0.9)";
        ctx.fillRect(w * 0.16, h * 0.52, 160, 16);
        ctx.fillStyle = "#4edea3";
        ctx.font = "9px 'JetBrains Mono', monospace";
        ctx.fillText("JUKI DDL-8700 [ACTIVE: 84Hz VIB]", w * 0.16 + 4, h * 0.52 + 12);

        // Box 4: GHOST CANDIDATE ON BENCH 04 (Flashing Amber)
        const isAmberBlink = Math.floor(t * 3) % 2 === 0;
        const amberColor = isAmberBlink ? "#ff9933" : "#d7790d";
        ctx.strokeStyle = amberColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(w * 0.72, h * 0.38, w * 0.22, h * 0.42);
        drawCornerTicks(ctx, w * 0.72, h * 0.38, w * 0.22, h * 0.42, amberColor);

        ctx.fillStyle = "rgba(9, 14, 23, 0.95)";
        ctx.fillRect(w * 0.72, h * 0.38 - 32, w * 0.22, 30);
        ctx.strokeStyle = amberColor;
        ctx.strokeRect(w * 0.72, h * 0.38 - 32, w * 0.22, 30);

        ctx.fillStyle = amberColor;
        ctx.font = "bold 9px 'JetBrains Mono', monospace";
        ctx.fillText("⚠ GHOST DETECTED (BENCH #04)", w * 0.72 + 6, h * 0.38 - 18);
        ctx.fillStyle = "#dee2f0";
        ctx.font = "8px 'JetBrains Mono', monospace";
        ctx.fillText("IDLE 42m • CLAIMED: AEBAS 09:12", w * 0.72 + 6, h * 0.38 - 6);
      }

      // 7. Tactical HUD Corner Reticles on full viewport
      drawReticleCorners(ctx, w, h);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, showBlur, showOverlays, selectedCam]);

  function drawCornerTicks(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string
  ) {
    const len = 8;
    ctx.strokeStyle = color;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(x, y + len);
    ctx.lineTo(x, y);
    ctx.lineTo(x + len, y);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(x + w - len, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + len);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(x, y + h - len);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x + len, y + h);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(x + w - len, y + h);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x + w, y + h - len);
    ctx.stroke();
  }

  function drawReticleCorners(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.strokeStyle = "rgba(14, 165, 233, 0.4)";
    ctx.lineWidth = 1;
    const len = 15;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(10, 10 + len);
    ctx.lineTo(10, 10);
    ctx.lineTo(10 + len, 10);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(w - 10 - len, 10);
    ctx.lineTo(w - 10, 10);
    ctx.lineTo(w - 10, 10 + len);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(10, h - 10 - len);
    ctx.lineTo(10, h - 10);
    ctx.lineTo(10 + len, h - 10);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(w - 10 - len, h - 10);
    ctx.lineTo(w - 10, h - 10);
    ctx.lineTo(w - 10, h - 10 - len);
    ctx.stroke();
  }

  const handleCaptureSnapshot = useCallback(() => {
    playAlertChime();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/webp", 0.85);
    const link = document.createElement("a");
    link.download = `msde_audit_${selectedCam}_${Date.now()}.webp`;
    link.href = dataUrl;
    link.click();
  }, [selectedCam]);

  const toggleFullscreen = () => {
    playTacticalClick();
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const handleSelectCamera = async (camId: string) => {
    playTacticalClick();
    setSelectedCam(camId);
    if (onCameraChange) onCameraChange(camId);

    // Sync with Edge Agent backend camera selector
    try {
      await fetch("http://localhost:8000/api/v1/cameras/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ camera_id: camId }),
      });
    } catch (_err) {
      // Ignored if local gateway proxy handles it
    }
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant p-3 relative hud-bracket" ref={containerRef}>
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between pb-2 mb-2 border-b border-outline-variant gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-error rounded-none animate-ping"></span>
          <span className="font-bold text-sm text-on-surface uppercase tracking-wide">
            FEED {selectedCam} // {currentCam.name.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-on-surface-variant">
          <span className="px-1.5 py-0.5 bg-surface-container-highest border border-outline-variant">
            YOLOv8-GhostNet INT8
          </span>
          <span className="px-1.5 py-0.5 bg-surface-container-highest border border-outline-variant text-tertiary">
            {bitrate} kbps
          </span>
          <span className="text-outline">{fps} FPS</span>
        </div>
      </div>

      {/* Main Video Viewport Canvas */}
      <div className="relative w-full aspect-video bg-surface-container-lowest border border-outline-variant/80 overflow-hidden hud-scanline select-none">
        <canvas
          ref={canvasRef}
          width={840}
          height={472}
          className="w-full h-full object-cover"
        />

        {/* Top-Left Telemetry Coordinates */}
        <div className="absolute top-2.5 left-2.5 font-mono text-[10px] text-primary/90 bg-surface-container-lowest/90 px-2 py-0.5 border border-primary/30 flex items-center gap-2">
          <span>CAM_ID: NODE_26245_{selectedCam}</span>
          <span className="text-outline">LAT: 25.3176° N • LON: 82.9739° E</span>
        </div>

        {/* Top-Right Active Controls Overlay */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-surface-container-lowest/90 border border-outline-variant px-1.5 py-1">
          {/* Toggle Blur */}
          <button
            onClick={() => {
              playTacticalClick();
              setShowBlur((prev) => !prev);
            }}
            className={`p-1 text-[10px] font-mono flex items-center gap-1 border transition-colors ${
              showBlur ? "border-primary bg-primary/20 text-primary" : "border-outline-variant text-outline"
            }`}
            title="DPDP Act 2023 Gaussian Blur (k=51)"
          >
            {showBlur ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">DPDP Blur</span>
          </button>

          {/* Toggle Overlays */}
          <button
            onClick={() => {
              playTacticalClick();
              setShowOverlays((prev) => !prev);
            }}
            className={`p-1 text-[10px] font-mono flex items-center gap-1 border transition-colors ${
              showOverlays ? "border-tertiary bg-tertiary/20 text-tertiary" : "border-outline-variant text-outline"
            }`}
            title="Toggle YOLOv8 Bounding Boxes & IoU"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">HUD Boxes</span>
          </button>

          {/* Pause / Play */}
          <button
            onClick={() => {
              playTacticalClick();
              setIsPlaying((prev) => !prev);
            }}
            className="p-1 border border-outline-variant hover:border-primary text-on-surface"
            title={isPlaying ? "Pause Feed" : "Resume Feed"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Snapshot */}
          <button
            onClick={handleCaptureSnapshot}
            className="p-1 border border-outline-variant hover:border-tertiary text-on-surface"
            title="Capture Audit Proof Frame (WebP)"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1 border border-outline-variant hover:border-primary text-on-surface"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Bottom-Right Stream Certification Seal */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2 bg-surface-container-lowest/90 border border-outline-variant px-2 py-1">
          <span className="font-mono text-[9px] text-tertiary flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-tertiary inline-block animate-pulse"></span>
            ENCRYPTED JETSON ORIN INT8 STREAM
          </span>
          <span className="font-mono text-[9px] text-outline">CH-HASH: 8f7e2..a91</span>
        </div>

        {/* Bottom-Left Watermark Directive */}
        <div className="absolute bottom-2.5 left-2.5 opacity-60 pointer-events-none select-none font-mono text-[9px] text-outline uppercase tracking-widest">
          MSDE DIGITAL SURVEILLANCE DIRECTIVE // RECORDING CERTIFIED
        </div>
      </div>

      {/* 4-Channel Camera Switcher Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 mt-2">
        {cameras.map((cam) => {
          const isSelected = selectedCam === cam.id;
          return (
            <button
              key={cam.id}
              onClick={() => handleSelectCamera(cam.id)}
              className={`p-1.5 text-left transition-all border ${
                isSelected
                  ? "bg-surface-container-high border-2 border-primary"
                  : "bg-surface-container border-outline-variant hover:border-outline"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className={isSelected ? "text-primary font-bold" : "text-outline"}>
                  {cam.id} {isSelected ? "[ACTIVE]" : ""}
                </span>
                <span
                  className={`w-1.5 h-1.5 inline-block ${
                    cam.alert ? "bg-secondary animate-ping" : "bg-tertiary"
                  }`}
                ></span>
              </div>
              <div className="font-mono text-[10px] text-on-surface truncate">
                {cam.name}
              </div>
              <div className="font-mono text-[8px] text-outline truncate">
                OCI: {cam.operability_score}% • {cam.persons_detected} Detected
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
