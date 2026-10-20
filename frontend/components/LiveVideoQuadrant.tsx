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
  Layers,
  Shield,
  Circle
} from "lucide-react";
import { playTacticalClick, playAlertChime } from "./SoundFx";

interface CameraChannel {
  id: string;
  name: string;
  location: string;
  persons: number;
  oci: number;
  alert: string | null;
}

export const LiveVideoQuadrant: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedCam, setSelectedCam] = useState<string>("CAM-01");
  const [showOverlays, setShowOverlays] = useState<boolean>(true);
  const [showBlur, setShowBlur] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const cameras: CameraChannel[] = [
    { id: "CAM-01", name: "Stitching Bay Alpha", location: "Garment Lab", persons: 16, oci: 88.8, alert: "Ghost candidate station #04" },
    { id: "CAM-02", name: "CNC Precision Lathe", location: "Machining Bay", persons: 2, oci: 50.0, alert: "Maintenance hold bed 02" },
    { id: "CAM-03", name: "SMT Soldering Line", location: "Electronics Lab", persons: 6, oci: 100.0, alert: null },
    { id: "CAM-04", name: "Biometric Ingress Bay", location: "Access Gate", persons: 0, oci: 95.0, alert: null },
  ];

  const currentCam = cameras.find((c) => c.id === selectedCam) || cameras[0];

  // Canvas Simulation Engine - Minimalist Executive Edition
  useEffect(() => {
    let animId: number;
    let t = 0;

    const render = () => {
      if (!isPlaying) return;
      t += 0.02;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      // 1. Deep Obsidian Architectural Floor
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#0c1322");
      grad.addColorStop(1, "#070b14");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Clean, elegant perspective floor grid (soft slate lines)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      for (let y = h * 0.38; y < h; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      for (let x = 0; x < w; x += 55) {
        ctx.beginPath();
        ctx.moveTo(x, h * 0.38);
        ctx.lineTo((x - w * 0.5) * 1.6 + w * 0.5, h);
        ctx.stroke();
      }

      // Overhead soft architectural illumination
      const lightGrad = ctx.createLinearGradient(w * 0.2, 0, w * 0.8, 0);
      lightGrad.addColorStop(0, "transparent");
      lightGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.05)");
      lightGrad.addColorStop(1, "transparent");
      ctx.fillStyle = lightGrad;
      ctx.fillRect(w * 0.2, 0, w * 0.6, h * 0.2);

      // 2. Workbenches (Sleek minimalist industrial aesthetic)
      // Bench 1 (Left)
      ctx.fillStyle = "#111827";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      roundRect(ctx, w * 0.14, h * 0.44, w * 0.24, h * 0.38, 8);
      ctx.fill();
      ctx.stroke();

      // JUKI Rig machine
      ctx.fillStyle = "#1e293b";
      roundRect(ctx, w * 0.2, h * 0.48, w * 0.11, h * 0.16, 6);
      ctx.fill();

      // Bench 2 (Center)
      ctx.fillStyle = "#111827";
      roundRect(ctx, w * 0.44, h * 0.44, w * 0.24, h * 0.38, 8);
      ctx.fill();
      ctx.stroke();

      // Bench 3 (Right) - Bench 04 Ghost Bench
      ctx.fillStyle = "#131b2c";
      roundRect(ctx, w * 0.74, h * 0.44, w * 0.2, h * 0.38, 8);
      ctx.fill();
      ctx.stroke();

      // 3. Trainees (Understated, realistic posture silhouettes)
      const sway1 = Math.sin(t * 1.8) * 2;
      // Trainee 1 Torso
      ctx.fillStyle = "#2d3748";
      ctx.beginPath();
      ctx.ellipse(w * 0.27 + sway1, h * 0.5, 20, 36, 0, 0, Math.PI * 2);
      ctx.fill();
      // Head
      ctx.fillStyle = "#d2b48c";
      ctx.beginPath();
      ctx.arc(w * 0.27 + sway1, h * 0.39, 13, 0, Math.PI * 2);
      ctx.fill();

      // Trainee 2
      const sway2 = Math.cos(t * 1.4) * 2;
      ctx.fillStyle = "#263238";
      ctx.beginPath();
      ctx.ellipse(w * 0.57 + sway2, h * 0.52, 19, 34, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#cbb296";
      ctx.beginPath();
      ctx.arc(w * 0.57 + sway2, h * 0.41, 13, 0, Math.PI * 2);
      ctx.fill();

      // 4. Privacy Gaussian Blur Masking (DPDP Act 2023)
      if (showBlur) {
        // Face 1
        const b1x = w * 0.27 + sway1 - 18;
        const b1y = h * 0.39 - 18;
        ctx.save();
        ctx.fillStyle = "rgba(15, 23, 42, 0.94)";
        ctx.filter = "blur(7px)";
        roundRect(ctx, b1x, b1y, 36, 36, 18);
        ctx.fill();
        ctx.restore();

        // Minimalist Privacy Tag
        ctx.fillStyle = "rgba(56, 189, 248, 0.9)";
        ctx.font = "500 8.5px 'Inter', sans-serif";
        ctx.fillText("DPDP Act Anonymized", b1x - 14, b1y - 6);

        // Face 2
        const b2x = w * 0.57 + sway2 - 16;
        const b2y = h * 0.41 - 16;
        ctx.save();
        ctx.fillStyle = "rgba(15, 23, 42, 0.94)";
        ctx.filter = "blur(7px)";
        roundRect(ctx, b2x, b2y, 32, 32, 16);
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = "rgba(56, 189, 248, 0.9)";
        ctx.fillText("DPDP Act Anonymized", b2x - 14, b2y - 6);
      }

      // 5. Minimalist Elegant Bounding Boxes (Ultra-clean hairlines)
      if (showOverlays) {
        // Trainee 1 Bounding Box
        const t1X = w * 0.27 + sway1 - 30;
        const t1Y = h * 0.35;
        const t1W = 60;
        const t1H = 110;

        ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
        ctx.lineWidth = 1;
        roundRect(ctx, t1X, t1Y, t1W, t1H, 6);
        ctx.stroke();

        // Minimalist Floating Tag
        ctx.fillStyle = "rgba(8, 12, 20, 0.85)";
        roundRect(ctx, t1X, t1Y + t1H + 4, 125, 20, 4);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.stroke();

        ctx.fillStyle = "#f8fafc";
        ctx.font = "500 9px 'Inter', sans-serif";
        ctx.fillText("Trainee 08", t1X + 8, t1Y + t1H + 17);
        ctx.fillStyle = "#38bdf8";
        ctx.font = "500 8.5px 'JetBrains Mono', monospace";
        ctx.fillText("IoU 0.94", t1X + 75, t1Y + t1H + 17);

        // Trainee 2 Bounding Box
        const t2X = w * 0.57 + sway2 - 28;
        const t2Y = h * 0.37;
        const t2W = 56;
        const t2H = 105;

        ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
        roundRect(ctx, t2X, t2Y, t2W, t2H, 6);
        ctx.stroke();

        ctx.fillStyle = "rgba(8, 12, 20, 0.85)";
        roundRect(ctx, t2X, t2Y + t2H + 4, 125, 20, 4);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.stroke();

        ctx.fillStyle = "#f8fafc";
        ctx.font = "500 9px 'Inter', sans-serif";
        ctx.fillText("Trainee 12", t2X + 8, t2Y + t2H + 17);
        ctx.fillStyle = "#38bdf8";
        ctx.font = "500 8.5px 'JetBrains Mono', monospace";
        ctx.fillText("IoU 0.91", t2X + 75, t2Y + t2H + 17);

        // Machine Box (JUKI Sewing Rig)
        ctx.strokeStyle = "rgba(16, 185, 129, 0.5)";
        ctx.setLineDash([3, 3]);
        roundRect(ctx, w * 0.16, h * 0.52, w * 0.2, h * 0.22, 6);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "rgba(8, 12, 20, 0.85)";
        roundRect(ctx, w * 0.16, h * 0.52 - 18, 130, 16, 4);
        ctx.fill();
        ctx.fillStyle = "#10b981";
        ctx.font = "500 8.5px 'JetBrains Mono', monospace";
        ctx.fillText("JUKI DDL-8700 • Active 84Hz", w * 0.16 + 6, h * 0.52 - 6);

        // Bench #04 Ghost Discrepancy Indicator (Muted Champagne Amber)
        ctx.strokeStyle = "rgba(245, 158, 11, 0.6)";
        ctx.lineWidth = 1;
        roundRect(ctx, w * 0.74, h * 0.44, w * 0.2, h * 0.38, 8);
        ctx.stroke();

        ctx.fillStyle = "rgba(8, 12, 20, 0.9)";
        roundRect(ctx, w * 0.74, h * 0.44 - 24, w * 0.2, 22, 4);
        ctx.fill();
        ctx.strokeStyle = "rgba(245, 158, 11, 0.3)";
        ctx.stroke();

        ctx.fillStyle = "#f59e0b";
        ctx.font = "600 9px 'Inter', sans-serif";
        ctx.fillText("Ghost Station 04", w * 0.74 + 8, h * 0.44 - 10);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "500 8px 'JetBrains Mono', monospace";
        ctx.fillText("Idle 42m", w * 0.74 + w * 0.2 - 45, h * 0.44 - 10);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, showBlur, showOverlays, selectedCam]);

  function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    radius: number
  ) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  const handleCaptureSnapshot = useCallback(() => {
    playAlertChime();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/webp", 0.9);
    const link = document.createElement("a");
    link.download = `msde_audit_proof_${selectedCam}_${Date.now()}.webp`;
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

  return (
    <div className="luxury-card p-5 space-y-4" ref={containerRef}>
      {/* Top Feed Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-sm text-white tracking-tight">
              {currentCam.name}
            </span>
          </div>
          <span className="text-xs text-slate-400 font-normal">
            • {currentCam.location}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="font-mono text-[11px] bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.06]">
            YOLOv8 INT8 • 42 FPS
          </span>
          <span className="font-mono text-[11px] bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.06]">
            34.2 kbps
          </span>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="relative w-full aspect-video bg-[#070b14] rounded-xl overflow-hidden border border-white/[0.08] shadow-inner group">
        <canvas
          ref={canvasRef}
          width={880}
          height={495}
          className="w-full h-full object-cover"
        />

        {/* Top-Right Minimalist Floating Controls */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#080c14]/75 backdrop-blur-xl border border-white/[0.1] p-1 rounded-full shadow-lg">
          {/* DPDP Blur Toggle */}
          <button
            onClick={() => {
              playTacticalClick();
              setShowBlur((prev) => !prev);
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
              showBlur ? "bg-white/[0.12] text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
            title="Toggle DPDP Act 2023 Gaussian Blur"
          >
            {showBlur ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>Privacy Blur</span>
          </button>

          {/* Overlays Toggle */}
          <button
            onClick={() => {
              playTacticalClick();
              setShowOverlays((prev) => !prev);
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
              showOverlays ? "bg-white/[0.12] text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
            title="Toggle Detection Bounding Boxes"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>HUD Tags</span>
          </button>

          {/* Pause / Play */}
          <button
            onClick={() => {
              playTacticalClick();
              setIsPlaying((prev) => !prev);
            }}
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            title={isPlaying ? "Pause Feed" : "Resume Feed"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Snapshot */}
          <button
            onClick={handleCaptureSnapshot}
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            title="Capture Audit Proof (WebP)"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Bottom Left Minimalist Location Tag */}
        <div className="absolute bottom-3 left-3 text-[11px] text-slate-400 bg-[#080c14]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/[0.08]">
          Centre: TC-UP-VNS-0492 • Feed {selectedCam} • 25.31° N, 82.97° E
        </div>
      </div>

      {/* Camera Selector Strip (Minimalist Glass Pills) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {cameras.map((cam) => {
          const isSelected = selectedCam === cam.id;
          return (
            <button
              key={cam.id}
              onClick={() => {
                playTacticalClick();
                setSelectedCam(cam.id);
              }}
              className={`p-3 rounded-xl text-left border transition-all duration-200 ${
                isSelected
                  ? "bg-white/[0.08] border-white/[0.18] shadow-sm"
                  : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1]"
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className={`font-medium ${isSelected ? "text-white" : "text-slate-400"}`}>
                  {cam.id}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full ${cam.alert ? "bg-amber-400" : "bg-emerald-400"}`}></span>
              </div>
              <div className="text-xs font-medium text-slate-200 truncate">
                {cam.name}
              </div>
              <div className="text-[11px] text-slate-500 truncate mt-0.5">
                {cam.location} • {cam.persons} Active
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
