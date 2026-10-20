"use client";

import React, { useRef, useEffect } from "react";

export interface CameraVisualProfile {
  id: string;
  cameraModel: string;
  tradeType:
    | "sewing"
    | "robotics"
    | "heavy_cnc"
    | "smt_soldering"
    | "automotive"
    | "cad_tailoring"
    | "agro_sorting"
    | "solar_grid"
    | "civil_masonry"
    | "leather_press"
    | "drone_avionics"
    | "chemical_lab";
  filterStyle: string; // CSS color grading filter
  hudColor: string;
  ptzCoords: { pan: number; tilt: number; zoom: number };
  lensWatermark: string;
  metricReadout: { label: string; value: string; unit?: string };
  boundingBoxes: Array<{
    label: string;
    type: "person" | "tool" | "hazard" | "alert" | "workpiece";
    x: number; // 0 to 1
    y: number; // 0 to 1
    w: number;
    h: number;
  }>;
}

interface CameraFeedCanvasProps {
  videoSrc: string;
  profile: CameraVisualProfile;
  showPrivacyBlur?: boolean;
  isPlaying?: boolean;
  className?: string;
  onSnapshot?: (dataUrl: string) => void;
}

export const CameraFeedCanvas: React.FC<CameraFeedCanvasProps> = ({
  videoSrc,
  profile,
  showPrivacyBlur = true,
  isPlaying = true,
  className = "",
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = videoSrc;
    video.load();
    if (isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [videoSrc, isPlaying]);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;

    let frameCount = 0;

    const render = () => {
      const cw = canvas.clientWidth || 480;
      const ch = canvas.clientHeight || 270;
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }

      frameCount++;

      // 1. Draw base video frame if ready, or procedural dark room if loading
      if (video.readyState >= 2) {
        ctx.save();
        // Apply specialized camera lens / optical filter
        if (profile.filterStyle) {
          ctx.filter = profile.filterStyle;
        }
        ctx.drawImage(video, 0, 0, cw, ch);
        ctx.restore();
      } else {
        // Fallback procedural industrial feed background
        ctx.fillStyle = "#090d16";
        ctx.fillRect(0, 0, cw, ch);

        // Subtle camera sensor grain
        ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
        for (let i = 0; i < 20; i++) {
          const rx = Math.random() * cw;
          const ry = Math.random() * ch;
          ctx.fillRect(rx, ry, 2, 2);
        }
      }

      // 2. Specialized Optical Grid / Scanline Reticle
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 0.5;

      // Center crosshair
      const cx = cw / 2;
      const cy = ch / 2;
      ctx.beginPath();
      ctx.moveTo(cx - 15, cy);
      ctx.lineTo(cx + 15, cy);
      ctx.moveTo(cx, cy - 15);
      ctx.lineTo(cx, cy + 15);
      ctx.stroke();

      // Corner target brackets
      const bracketSize = 12;
      ctx.strokeStyle = profile.hudColor || "rgba(56, 189, 248, 0.7)";
      ctx.lineWidth = 1.5;

      // Top-Left bracket
      ctx.beginPath();
      ctx.moveTo(12, 12 + bracketSize);
      ctx.lineTo(12, 12);
      ctx.lineTo(12 + bracketSize, 12);
      ctx.stroke();

      // Top-Right bracket
      ctx.beginPath();
      ctx.moveTo(cw - 12 - bracketSize, 12);
      ctx.lineTo(cw - 12, 12);
      ctx.lineTo(cw - 12, 12 + bracketSize);
      ctx.stroke();

      // Bottom-Left bracket
      ctx.beginPath();
      ctx.moveTo(12, ch - 12 - bracketSize);
      ctx.lineTo(12, ch - 12);
      ctx.lineTo(12 + bracketSize, ch - 12);
      ctx.stroke();

      // Bottom-Right bracket
      ctx.beginPath();
      ctx.moveTo(cw - 12 - bracketSize, ch - 12);
      ctx.lineTo(cw - 12, ch - 12);
      ctx.lineTo(cw - 12, ch - 12 - bracketSize);
      ctx.stroke();

      // 3. Trade-Specific Unique Dynamic Visual Elements
      const t = frameCount * 0.04;

      if (profile.tradeType === "robotics") {
        // Cyan robotic arm envelope wireframe
        ctx.strokeStyle = "rgba(34, 211, 238, 0.6)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        const rw = cw * 0.38;
        const rh = ch * 0.42;
        const rx = cw * 0.3 + Math.sin(t * 0.5) * 6;
        const ry = ch * 0.25;
        ctx.strokeRect(rx, ry, rw, rh);
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(34, 211, 238, 0.8)";
        ctx.font = "9px monospace";
        ctx.fillText("SAFETY PERIMETER: ROBOTIC WORK ENVELOPE", rx + 4, ry - 4);
      } else if (profile.tradeType === "heavy_cnc") {
        // Hazardous spindle rotation warning zone
        ctx.strokeStyle = "rgba(244, 63, 94, 0.7)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const r = 24 + Math.sin(t * 2) * 2;
        ctx.arc(cw * 0.52, ch * 0.48, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "rgba(244, 63, 94, 0.9)";
        ctx.font = "8px monospace";
        ctx.fillText("CHUCK ROTATION ZONE", cw * 0.52 - 40, ch * 0.48 + r + 10);
      } else if (profile.tradeType === "smt_soldering") {
        // High-precision microscope reticle
        ctx.strokeStyle = "rgba(16, 185, 129, 0.6)";
        ctx.beginPath();
        ctx.arc(cw * 0.48, ch * 0.52, 28, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cw * 0.48, ch * 0.52, 14, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "rgba(16, 185, 129, 0.85)";
        ctx.font = "8px monospace";
        ctx.fillText("SMT PAD FOCUS #2", cw * 0.48 - 32, ch * 0.52 - 32);
      } else if (profile.tradeType === "solar_grid") {
        // Solar rooftop grid irradiance ray vectors
        ctx.strokeStyle = "rgba(245, 158, 11, 0.5)";
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(cw * 0.1, ch * 0.7);
        ctx.lineTo(cw * 0.9, ch * 0.55);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(245, 158, 11, 0.9)";
        ctx.font = "8px monospace";
        ctx.fillText("STRING INVERTER BUS 1: 680V DC", cw * 0.12, ch * 0.68);
      } else if (profile.tradeType === "cad_tailoring") {
        // Laser guide cutline
        ctx.strokeStyle = "rgba(239, 68, 68, 0.8)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cw * 0.2, ch * 0.4 + Math.sin(t) * 10);
        ctx.lineTo(cw * 0.8, ch * 0.4 + Math.sin(t) * 10);
        ctx.stroke();
        ctx.fillStyle = "rgba(239, 68, 68, 0.9)";
        ctx.font = "8px monospace";
        ctx.fillText("CAD LASER GUIDE 01", cw * 0.2, ch * 0.38 + Math.sin(t) * 10);
      } else if (profile.tradeType === "drone_avionics") {
        // Drone HUD artificial horizon
        ctx.strokeStyle = "rgba(96, 165, 250, 0.7)";
        ctx.beginPath();
        ctx.moveTo(cw * 0.35, ch * 0.5);
        ctx.lineTo(cw * 0.65, ch * 0.5);
        ctx.stroke();
        ctx.fillStyle = "rgba(96, 165, 250, 0.9)";
        ctx.font = "8px monospace";
        ctx.fillText("GYRO BAL: OK", cw * 0.44, ch * 0.48);
      } else if (profile.tradeType === "chemical_lab") {
        // Fume hood boundary & titration meniscus target
        ctx.strokeStyle = "rgba(45, 212, 191, 0.7)";
        ctx.strokeRect(cw * 0.38, ch * 0.3, cw * 0.24, ch * 0.45);
        ctx.fillStyle = "rgba(45, 212, 191, 0.9)";
        ctx.font = "8px monospace";
        ctx.fillText("FUME HOOD EXHAUST: 0.52 m/s", cw * 0.39, ch * 0.28);
      } else if (profile.tradeType === "civil_masonry") {
        // Level horizontal datum
        ctx.strokeStyle = "rgba(34, 197, 94, 0.8)";
        ctx.beginPath();
        ctx.moveTo(cw * 0.15, ch * 0.6);
        ctx.lineTo(cw * 0.85, ch * 0.6);
        ctx.stroke();
        ctx.fillStyle = "rgba(34, 197, 94, 0.9)";
        ctx.font = "8px monospace";
        ctx.fillText("DATUM LEVEL: 0.00m ±1.2mm", cw * 0.16, ch * 0.58);
      } else if (profile.tradeType === "agro_sorting") {
        // Conveyor belt optical sorting lane
        ctx.strokeStyle = "rgba(132, 204, 22, 0.7)";
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(cw * 0.2, ch * 0.45, cw * 0.6, ch * 0.35);
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(132, 204, 22, 0.9)";
        ctx.font = "8px monospace";
        ctx.fillText("SORTING OPTICAL APERTURE", cw * 0.22, ch * 0.43);
      } else if (profile.tradeType === "leather_press") {
        // Hydraulic press light curtain beam
        ctx.strokeStyle = "rgba(234, 179, 8, 0.8)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cw * 0.25, ch * 0.35);
        ctx.lineTo(cw * 0.25, ch * 0.75);
        ctx.stroke();
        ctx.fillStyle = "rgba(234, 179, 8, 0.9)";
        ctx.font = "8px monospace";
        ctx.fillText("LIGHT CURTAIN ACTIVE", cw * 0.26, ch * 0.37);
      } else if (profile.tradeType === "automotive") {
        // Engine mount torque reticle
        ctx.strokeStyle = "rgba(249, 115, 22, 0.8)";
        ctx.strokeRect(cw * 0.36, ch * 0.32, cw * 0.28, ch * 0.38);
        ctx.fillStyle = "rgba(249, 115, 22, 0.9)";
        ctx.font = "8px monospace";
        ctx.fillText("POWERTRAIN JIG #1", cw * 0.37, ch * 0.3);
      } else {
        // Default Sewing / Textile: Stitch tracking box
        ctx.strokeStyle = "rgba(56, 189, 248, 0.8)";
        ctx.strokeRect(cw * 0.22, ch * 0.34, cw * 0.35, ch * 0.36);
        ctx.fillStyle = "rgba(56, 189, 248, 0.9)";
        ctx.font = "8px monospace";
        ctx.fillText("JUKI NEEDLE CARRIAGE: 3,200 SPM", cw * 0.23, ch * 0.32);
      }

      // 4. Unique Bounding Boxes per Profile
      profile.boundingBoxes.forEach((box, bIdx) => {
        const bx = box.x * cw;
        const by = box.y * ch;
        const bw = box.w * (cw / 480);
        const bh = box.h * (ch / 270);

        // Bounding box frame
        ctx.lineWidth = 1.2;
        if (box.type === "alert") {
          ctx.strokeStyle = "rgba(239, 68, 68, 0.9)";
          ctx.fillStyle = "rgba(239, 68, 68, 0.15)";
        } else if (box.type === "hazard") {
          ctx.strokeStyle = "rgba(245, 158, 11, 0.9)";
          ctx.fillStyle = "rgba(245, 158, 11, 0.15)";
        } else {
          ctx.strokeStyle = profile.hudColor || "rgba(56, 189, 248, 0.85)";
          ctx.fillStyle = "rgba(56, 189, 248, 0.08)";
        }

        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeRect(bx, by, bw, bh);

        // Label pill
        ctx.fillStyle = box.type === "alert" ? "#ef4444" : "#0f172a";
        ctx.fillRect(bx, by - 12, bw, 12);
        ctx.fillStyle = "#ffffff";
        ctx.font = "8px sans-serif";
        ctx.fillText(box.label, bx + 3, by - 3);

        // 5. DPDP Act Facial Anonymization: Soft Mosaic Blur on Candidate Faces
        if (showPrivacyBlur && (box.type === "person" || box.label.toLowerCase().includes("candidate"))) {
          const faceSize = Math.min(bw * 0.5, 22);
          const fx = bx + bw / 2;
          const fy = by + faceSize * 0.8;

          ctx.save();
          ctx.beginPath();
          ctx.arc(fx, fy, faceSize / 2, 0, Math.PI * 2);
          ctx.clip();

          // Mosaic privacy filter
          ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
          ctx.fillRect(fx - faceSize, fy - faceSize, faceSize * 2, faceSize * 2);

          // Subtle Privacy Disc Pattern
          ctx.fillStyle = "rgba(56, 189, 248, 0.5)";
          ctx.font = "7px monospace";
          ctx.fillText("DPDP", fx - 9, fy + 2);
          ctx.restore();
        }
      });

      // 6. Camera Real-time Watermark & Live Millisecond Timestamp
      const now = new Date();
      const timeStr = `${now.toISOString().replace("T", " ").substring(0, 19)}.${String(now.getMilliseconds()).padStart(3, "0")}`;

      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.fillRect(8, ch - 22, cw - 16, 16);

      ctx.fillStyle = "#f8fafc";
      ctx.font = "8.5px monospace";
      ctx.fillText(`${profile.id} • ${profile.lensWatermark}`, 12, ch - 10);

      ctx.textAlign = "right";
      ctx.fillText(timeStr, cw - 12, ch - 10);
      ctx.textAlign = "left";

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [profile, showPrivacyBlur]);

  return (
    <div className={`relative w-full h-full overflow-hidden select-none bg-slate-950 ${className}`}>
      {/* Hidden Base HTML5 Video used as source for canvas */}
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        className="hidden"
      />

      {/* Render Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover block"
      />
    </div>
  );
};
